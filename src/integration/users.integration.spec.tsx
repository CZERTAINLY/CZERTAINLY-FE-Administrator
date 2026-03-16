import React from 'react';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import {
    AddUserRequestDto,
    CertificateDto,
    CertificateType,
    ComplianceStatus,
    PlatformSettingsDto,
    Resource,
    RoleDto,
    UserDetailDto,
    UserDto,
    UserProfileDetailDto,
} from 'types/openapi';

const adminRole: RoleDto = {
    uuid: 'role-admin',
    name: 'Admin',
    description: 'Administrative role',
    systemRole: false,
};

const usersDb: UserDetailDto[] = [];
const createRequests: AddUserRequestDto[] = [];
const rolePatchRequests: string[][] = [];

const profileResponse: UserProfileDetailDto = {
    uuid: 'current-user',
    username: 'test-admin',
    firstName: 'Test',
    lastName: 'Admin',
    email: 'admin@example.test',
    description: 'Integration test profile',
    groups: [],
    enabled: true,
    systemUser: false,
    roles: [adminRole],
    customAttributes: [],
    permissions: {
        allowedListings: ['Users' as Resource],
    },
};

const settingsResponse: PlatformSettingsDto = {};

const testCertificate: CertificateDto = {
    uuid: 'cert-1',
    commonName: 'Test Cert',
    serialNumber: '123456789',
    subjectDn: 'CN=Test Cert',
    issuerDn: 'CN=Test CA',
    publicKeyAlgorithm: 'RSA',
    keySize: 2048,
    state: 'issued' as any,
    validationStatus: 'valid' as any,
    hybridCertificate: false,
    fingerprint: 'abed',
    certificateType: CertificateType.X509,
    complianceStatus: ComplianceStatus.NotChecked,
    privateKeyAvailability: false,
};

const server = setupServer(
    // App startup calls.
    http.get('/api/v1/auth/profile', () => HttpResponse.json(profileResponse)),
    http.get('/api/v1/settings/platform', () => HttpResponse.json(settingsResponse)),
    http.get('/api/v1/enums', () => HttpResponse.json({})),
    http.get('/api/v1/notifications', () =>
        HttpResponse.json({
            itemsPerPage: 10,
            pageNumber: 1,
            totalPages: 0,
            totalItems: 0,
            items: [],
        }),
    ),

    // User pages dependencies.
    http.get('/api/v1/users', () => HttpResponse.json(usersDb.map(toUserDto))),
    http.get('/api/v1/users/:userUuid', ({ params }) => {
        const user = usersDb.find((item) => item.uuid === params.userUuid);
        if (!user) {
            return HttpResponse.json({ message: 'User not found' }, { status: 404 });
        }
        return HttpResponse.json(user);
    }),
    http.get('/api/v1/users/:userUuid/roles', ({ params }) => {
        const user = usersDb.find((item) => item.uuid === params.userUuid);
        return HttpResponse.json(user?.roles ?? []);
    }),
    http.post('/api/v1/users', async ({ request }) => {
        const body = (await request.json()) as AddUserRequestDto;
        createRequests.push(body);

        const createdUser: UserDetailDto = {
            uuid: `user-${body.username}`,
            username: body.username,
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            description: body.description,
            groups: [],
            enabled: body.enabled ?? true,
            systemUser: false,
            roles: [],
            customAttributes: [],
        };

        usersDb.push(createdUser);
        return HttpResponse.json(createdUser, { status: 201 });
    }),
    http.patch('/api/v1/users/:userUuid/roles', async ({ params, request }) => {
        const user = usersDb.find((item) => item.uuid === params.userUuid);
        if (!user) {
            return HttpResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const roleUuids = (await request.json()) as string[];
        rolePatchRequests.push(roleUuids);

        user.roles = roleUuids.map((roleUuid) => {
            if (roleUuid === adminRole.uuid) {
                return adminRole;
            }
            return {
                uuid: roleUuid,
                name: roleUuid,
                systemRole: false,
            };
        });

        return HttpResponse.json(user);
    }),
    http.delete('/api/v1/users/:userUuid', ({ params }) => {
        const index = usersDb.findIndex((item) => item.uuid === params.userUuid);
        if (index < 0) {
            return HttpResponse.json({ message: 'User not found' }, { status: 404 });
        }
        usersDb.splice(index, 1);
        return new HttpResponse(null, { status: 204 });
    }),

    // User form dependencies.
    http.get('/api/v1/roles', () => HttpResponse.json([adminRole])),
    http.get('/api/v1/groups', () => HttpResponse.json([])),
    http.get('/api/v1/attributes/custom/resources/:resource', () => HttpResponse.json([])),
    http.post('/api/v1/certificates', () =>
        HttpResponse.json({
            totalItems: 1,
            certificates: [testCertificate],
        }),
    ),
    http.get('/api/v1/certificates/:uuid', () => HttpResponse.json(testCertificate)),
    http.get('/api/v1/attributes/custom/resources/Users/objects/:uuid', () => HttpResponse.json([])),
);

describe('users pages integration (list, detail, create, delete)', () => {
    beforeAll(() => {
        server.listen({ onUnhandledRequest: 'error' });
    });

    beforeEach(() => {
        usersDb.splice(0, usersDb.length);
        usersDb.push({
            uuid: 'user-alice',
            username: 'alice',
            firstName: 'Alice',
            lastName: 'Admin',
            email: 'alice@example.test',
            description: 'Seed user',
            groups: [],
            enabled: true,
            systemUser: false,
            roles: [adminRole],
            customAttributes: [],
        });

        createRequests.splice(0, createRequests.length);
        rolePatchRequests.splice(0, rolePatchRequests.length);

        window.location.hash = '#/users';
    });

    afterEach(() => {
        cleanup();
        server.resetHandlers();
    });

    afterAll(() => {
        server.close();
    });

    it('list users', async () => {
        const { default: App } = await import('../App');
        render(<App />);

        await screen.findByText('List of Users');
        await screen.findByText('alice');
    });

    it('create and delete user', async () => {
        const { default: App } = await import('../App');
        render(<App />);

        await screen.findByText('List of Users');

        fireEvent.click(screen.getByTestId('create-user-button'));

        await screen.findByText('Create User');

        fireEvent.change(screen.getByLabelText('Username *'), { target: { value: 'bob' } });
        fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'Bob' } });
        fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Builder' } });

        await screen.findByText('Test Cert (123456789)');
        fireEvent.change(screen.getByText('Test Cert (123456789)').closest('select')!, { target: { value: 'cert-1' } });

        fireEvent.click(screen.getByRole('button', { name: 'Create' }));

        await screen.findByText('User Details');
        await screen.findByRole('heading', { name: 'bob' });

        expect(createRequests).toHaveLength(1);
        expect(createRequests[0].username).toBe('bob');
        expect(rolePatchRequests).toEqual([[]]);

        fireEvent.click(screen.getByTestId('delete-user-button'));
        await screen.findByText('Delete User');
        fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

        await waitFor(() => {
            expect(window.location.hash.endsWith('/users')).toBe(true);
        });

        await waitFor(() => {
            expect(screen.queryByText('bob')).toBeNull();
        });

        expect(usersDb.map((user) => user.username)).toEqual(['alice']);
    });
});

const toUserDto = (user: UserDetailDto): UserDto => ({
    uuid: user.uuid,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    description: user.description,
    groups: user.groups,
    enabled: user.enabled,
    systemUser: user.systemUser,
});
