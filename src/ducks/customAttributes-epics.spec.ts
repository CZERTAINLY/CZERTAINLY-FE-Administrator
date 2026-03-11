import { describe, expect, test, vi } from 'vitest';
import type { UnknownAction } from '@reduxjs/toolkit';
import { firstValueFrom, of, throwError } from 'rxjs';
import { take, toArray } from 'rxjs/operators';

import { slice } from './customAttributes';
import { actions as appRedirectActions } from './app-redirect';
import { actions as userInterfaceActions } from './user-interface';
import { actions as vaultActions } from './vaults';
import { actions as vaultProfileActions } from './vault-profiles';
import { actions as alertActions } from './alerts';
import { LockWidgetNameEnum } from 'types/user-interface';
import { AttributeVersion, Resource } from 'types/openapi';

vi.mock('../App', async () => ({ store: (await import('./epics-test-mocks')).getEpicMocks().appStore }));
vi.mock('./alerts', async () => ({ actions: (await import('./epics-test-mocks')).getEpicMocks().alertActions }));

enum CustomAttributesEpicIndex {
    ListCustomAttributes = 0,
    ListResources = 1,
    ListResourceCustomAttributes = 2,
    ListSecondaryResourceCustomAttributes = 3,
    LoadMultipleResourceCustomAttributes = 4,
    CreateCustomAttribute = 5,
    UpdateCustomAttribute = 6,
    GetCustomAttribute = 7,
    DeleteCustomAttribute = 8,
    BulkDeleteCustomAttributes = 9,
    BulkEnableCustomAttributes = 10,
    EnableCustomAttribute = 11,
    BulkDisableCustomAttributes = 12,
    DisableCustomAttribute = 13,
    UpdateCustomAttributeContent = 14,
    RemoveCustomAttributeContent = 15,
}

type Clients = {
    customAttributes: {
        listCustomAttributes: (args: any) => any;
        getResources: () => any;
        getResourceCustomAttributes: (args: any) => any;
        createCustomAttribute: (args: any) => any;
        editCustomAttribute: (args: any) => any;
        updateAttributeContentForResource: (args: any) => any;
        deleteAttributeContentForResource: (args: any) => any;
        getCustomAttribute: (args: any) => any;
        deleteCustomAttribute: (args: any) => any;
        bulkDeleteCustomAttributes: (args: any) => any;
        bulkEnableCustomAttributes: (args: any) => any;
        bulkDisableCustomAttributes: (args: any) => any;
        enableCustomAttribute: (args: any) => any;
        disableCustomAttribute: (args: any) => any;
    };
    vaults: {
        updateVaultInstance: (args: any) => any;
    };
    vaultProfiles: {
        updateVaultProfile: (args: any) => any;
    };
};

type EpicDeps = {
    apiClients: Clients;
};

function createDeps(overrides: Partial<Clients> = {}): EpicDeps {
    const defaultClients: Clients = {
        customAttributes: {
            listCustomAttributes: () => of([{ uuid: 'ca-1', name: 'A1' }]),
            getResources: () => of([Resource.Certificates]),
            getResourceCustomAttributes: () => of([{ uuid: 'd-1', name: 'Descriptor' }]),
            createCustomAttribute: () => of({ uuid: 'ca-1' }),
            editCustomAttribute: () => of({ uuid: 'ca-1', name: 'Updated', content: [] }),
            updateAttributeContentForResource: () =>
                of([
                    {
                        uuid: 'attr-1',
                        name: 'Attr 1',
                        contentType: 'text/plain',
                        version: AttributeVersion.V2,
                        content: [],
                    },
                ]),
            deleteAttributeContentForResource: () =>
                of([
                    {
                        uuid: 'attr-2',
                        name: 'Attr 2',
                        contentType: 'text/plain',
                        version: AttributeVersion.V2,
                        content: [],
                    },
                ]),
            getCustomAttribute: () => of({ uuid: 'ca-1', name: 'A1', content: [] }),
            deleteCustomAttribute: () => of(undefined),
            bulkDeleteCustomAttributes: () => of(undefined),
            bulkEnableCustomAttributes: () => of([]),
            bulkDisableCustomAttributes: () => of([]),
            enableCustomAttribute: () => of([]),
            disableCustomAttribute: () => of([]),
        },
        vaults: {
            updateVaultInstance: () =>
                of({
                    uuid: 'vault-1',
                    customAttributes: [
                        {
                            uuid: 'attr-1',
                            name: 'Attr 1',
                            contentType: 'text/plain',
                            version: AttributeVersion.V2,
                            content: [{ data: 'x' }],
                        },
                    ],
                }),
        },
        vaultProfiles: {
            updateVaultProfile: () =>
                of({
                    uuid: 'vp-1',
                    customAttributes: [
                        {
                            uuid: 'attr-1',
                            name: 'Attr 1',
                            contentType: 'text/plain',
                            version: AttributeVersion.V2,
                            content: [{ data: 'x' }],
                        },
                    ],
                    vaultInstance: { uuid: 'vault-1' },
                }),
        },
    };

    return {
        apiClients: {
            customAttributes: overrides.customAttributes
                ? { ...defaultClients.customAttributes, ...overrides.customAttributes }
                : defaultClients.customAttributes,
            vaults: overrides.vaults ? { ...defaultClients.vaults, ...overrides.vaults } : defaultClients.vaults,
            vaultProfiles: overrides.vaultProfiles
                ? { ...defaultClients.vaultProfiles, ...overrides.vaultProfiles }
                : defaultClients.vaultProfiles,
        },
    };
}

function createState(overrides: any = {}) {
    return {
        customAttributes: {
            resourceCustomAttributesContents: [],
            resourceCustomAttributes: [],
        },
        vaults: {
            vault: undefined,
        },
        vaultProfiles: {
            vaultProfile: undefined,
        },
        ...overrides,
    };
}

async function runEpic(
    epicIndex: number,
    action: any,
    {
        depsOverrides = {},
        state = createState(),
        takeCount = 1,
    }: { depsOverrides?: Partial<Clients>; state?: any; takeCount?: number } = {},
): Promise<UnknownAction[]> {
    const { default: epics } = await import('./customAttributes-epics');
    const deps = createDeps(depsOverrides);
    const epic = (epics as any)[epicIndex];

    const state$ = of(state) as any;
    state$.value = state;

    const output$ = epic(of(action), state$, deps as any);
    return firstValueFrom(output$.pipe(take(takeCount), toArray()));
}

describe('customAttributes epics', () => {
    test('listCustomAttributes success emits success and removeWidgetLock', async () => {
        const emitted = await runEpic(
            CustomAttributesEpicIndex.ListCustomAttributes,
            slice.actions.listCustomAttributes({ attributeContentType: undefined }),
            { takeCount: 2 },
        );

        expect(emitted[0].type).toBe(slice.actions.listCustomAttributesSuccess.type);
        expect(emitted[1]).toEqual(userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ListOfCustomAttributes));
    });

    test('listCustomAttributes failure emits failure and insertWidgetLock', async () => {
        const err = new Error('boom');
        const emitted = await runEpic(
            CustomAttributesEpicIndex.ListCustomAttributes,
            slice.actions.listCustomAttributes({ attributeContentType: undefined }),
            {
                depsOverrides: {
                    customAttributes: {
                        listCustomAttributes: () => throwError(() => err),
                    } as any,
                },
                takeCount: 2,
            },
        );

        expect(emitted[0].type).toBe(slice.actions.listCustomAttributesFailure.type);
        expect(emitted[1].type).toBe(userInterfaceActions.insertWidgetLock.type);
    });

    test('listResources success emits listResourcesSuccess', async () => {
        const emitted = await runEpic(CustomAttributesEpicIndex.ListResources, slice.actions.listResources());
        expect(emitted[0]).toEqual(slice.actions.listResourcesSuccess([Resource.Certificates]));
    });

    test('listResources failure emits failure and fetchError', async () => {
        const err = new Error('resources failed');
        const emitted = await runEpic(CustomAttributesEpicIndex.ListResources, slice.actions.listResources(), {
            depsOverrides: {
                customAttributes: {
                    getResources: () => throwError(() => err),
                } as any,
            },
            takeCount: 2,
        });

        expect(emitted[0].type).toBe(slice.actions.listResourcesFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to get list of resources' }));
    });

    test('listResourceCustomAttributes success emits success and removeWidgetLock', async () => {
        const emitted = await runEpic(
            CustomAttributesEpicIndex.ListResourceCustomAttributes,
            slice.actions.listResourceCustomAttributes(Resource.Certificates),
            { takeCount: 2 },
        );

        expect(emitted[0].type).toBe(slice.actions.listResourceCustomAttributesSuccess.type);
        expect(emitted[1]).toEqual(userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.CustomAttributeWidget));
    });

    test('listResourceCustomAttributes failure emits failure, fetchError and insertWidgetLock', async () => {
        const err = new Error('rca failed');
        const emitted = await runEpic(
            CustomAttributesEpicIndex.ListResourceCustomAttributes,
            slice.actions.listResourceCustomAttributes(Resource.Certificates),
            {
                depsOverrides: {
                    customAttributes: {
                        getResourceCustomAttributes: () => throwError(() => err),
                    } as any,
                },
                takeCount: 3,
            },
        );

        expect(emitted[0].type).toBe(slice.actions.listResourceCustomAttributesFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to get Resource Custom Attributes list' }));
        expect(emitted[2].type).toBe(userInterfaceActions.insertWidgetLock.type);
    });

    test('listSecondaryResourceCustomAttributes success emits success', async () => {
        const emitted = await runEpic(
            CustomAttributesEpicIndex.ListSecondaryResourceCustomAttributes,
            slice.actions.listSecondaryResourceCustomAttributes(Resource.Certificates),
        );

        expect(emitted[0].type).toBe(slice.actions.listSecondaryResourceCustomAttributesSuccess.type);
    });

    test('listSecondaryResourceCustomAttributes failure emits failure and fetchError', async () => {
        const err = new Error('srca failed');
        const emitted = await runEpic(
            CustomAttributesEpicIndex.ListSecondaryResourceCustomAttributes,
            slice.actions.listSecondaryResourceCustomAttributes(Resource.Certificates),
            {
                depsOverrides: {
                    customAttributes: {
                        getResourceCustomAttributes: () => throwError(() => err),
                    } as any,
                },
                takeCount: 2,
            },
        );

        expect(emitted[0].type).toBe(slice.actions.listSecondaryResourceCustomAttributesFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to get Resource Custom Attributes list' }));
    });

    test('loadMultipleResourceCustomAttributes emits mapped resources and empty list on partial error', async () => {
        const emitted = await runEpic(
            CustomAttributesEpicIndex.LoadMultipleResourceCustomAttributes,
            slice.actions.loadMultipleResourceCustomAttributes([
                { resource: Resource.Certificates, customAttributes: [] },
                { resource: Resource.Secrets, customAttributes: [] },
            ]),
            {
                depsOverrides: {
                    customAttributes: {
                        getResourceCustomAttributes: ({ resource }: { resource: Resource }) =>
                            resource === Resource.Secrets ? throwError(() => new Error('secret failed')) : of([{ uuid: 'ok', name: 'ok' }]),
                    } as any,
                },
            },
        );

        expect(emitted[0].type).toBe(slice.actions.receiveMultipleResourceCustomAttributes.type);
        expect((emitted[0] as any).payload).toHaveLength(2);
        expect((emitted[0] as any).payload[1].customAttributes).toEqual([]);
    });

    test('createCustomAttribute success emits success and redirect', async () => {
        const emitted = await runEpic(
            CustomAttributesEpicIndex.CreateCustomAttribute,
            slice.actions.createCustomAttribute({ name: 'name', contentType: 'text/plain' } as any),
            { takeCount: 2 },
        );

        expect(emitted[0]).toEqual(slice.actions.createCustomAttributeSuccess({ uuid: 'ca-1' }));
        expect(emitted[1]).toEqual(appRedirectActions.redirect({ url: '../customattributes/detail/ca-1' }));
    });

    test('createCustomAttribute failure emits failure and fetchError', async () => {
        const err = new Error('create failed');
        const emitted = await runEpic(
            CustomAttributesEpicIndex.CreateCustomAttribute,
            slice.actions.createCustomAttribute({ name: 'name', contentType: 'text/plain' } as any),
            {
                depsOverrides: {
                    customAttributes: {
                        createCustomAttribute: () => throwError(() => err),
                    } as any,
                },
                takeCount: 2,
            },
        );

        expect(emitted[0].type).toBe(slice.actions.createCustomAttributeFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to create custom attribute' }));
    });

    test('updateCustomAttribute success emits success, getCustomAttribute and redirect', async () => {
        const emitted = await runEpic(
            CustomAttributesEpicIndex.UpdateCustomAttribute,
            slice.actions.updateCustomAttribute({
                uuid: 'ca-1',
                customAttributeUpdateRequest: { name: 'updated' } as any,
            }),
            { takeCount: 3 },
        );

        expect(emitted[0].type).toBe(slice.actions.updateCustomAttributeSuccess.type);
        expect(emitted[1]).toEqual(slice.actions.getCustomAttribute('ca-1'));
        expect(emitted[2]).toEqual(appRedirectActions.redirect({ url: '../../customattributes/detail/ca-1' }));
    });

    test('updateCustomAttribute failure emits failure and fetchError', async () => {
        const err = new Error('update failed');
        const emitted = await runEpic(
            CustomAttributesEpicIndex.UpdateCustomAttribute,
            slice.actions.updateCustomAttribute({ uuid: 'ca-1', customAttributeUpdateRequest: {} as any }),
            {
                depsOverrides: {
                    customAttributes: {
                        editCustomAttribute: () => throwError(() => err),
                    } as any,
                },
                takeCount: 2,
            },
        );

        expect(emitted[0].type).toBe(slice.actions.updateCustomAttributeFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to update custom attribute' }));
    });

    test('updateCustomAttributeContent for generic resource success emits success', async () => {
        const emitted = await runEpic(
            CustomAttributesEpicIndex.UpdateCustomAttributeContent,
            slice.actions.updateCustomAttributeContent({
                resource: Resource.Certificates,
                resourceUuid: 'obj-1',
                attributeUuid: 'attr-1',
                content: [{ data: 'v' }] as any,
            }),
        );

        expect(emitted[0].type).toBe(slice.actions.updateCustomAttributeContentSuccess.type);
    });

    test('updateCustomAttributeContent for generic resource failure emits failure and fetchError', async () => {
        const err = new Error('generic update failed');
        const emitted = await runEpic(
            CustomAttributesEpicIndex.UpdateCustomAttributeContent,
            slice.actions.updateCustomAttributeContent({
                resource: Resource.Certificates,
                resourceUuid: 'obj-1',
                attributeUuid: 'attr-1',
                content: [{ data: 'v' }] as any,
            }),
            {
                depsOverrides: {
                    customAttributes: {
                        updateAttributeContentForResource: () => throwError(() => err),
                    } as any,
                },
                takeCount: 2,
            },
        );

        expect(emitted[0].type).toBe(slice.actions.updateCustomAttributeContentFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to update custom attribute content' }));
    });

    test('updateCustomAttributeContent for vault returns failure when context is missing', async () => {
        const emitted = await runEpic(
            CustomAttributesEpicIndex.UpdateCustomAttributeContent,
            slice.actions.updateCustomAttributeContent({
                resource: Resource.Vaults,
                resourceUuid: 'vault-1',
                attributeUuid: 'attr-1',
                content: [{ data: 'v' }] as any,
            }),
            {
                state: createState(),
            },
        );

        expect(emitted[0].type).toBe(slice.actions.updateCustomAttributeContentFailure.type);
    });

    test('updateCustomAttributeContent for vault returns failure when descriptor and existing attr are missing', async () => {
        const state = createState({
            vaults: {
                vault: {
                    uuid: 'vault-1',
                    attributes: [],
                    customAttributes: [],
                },
            },
        });
        const emitted = await runEpic(
            CustomAttributesEpicIndex.UpdateCustomAttributeContent,
            slice.actions.updateCustomAttributeContent({
                resource: Resource.Vaults,
                resourceUuid: 'vault-1',
                attributeUuid: 'missing-attr',
                content: [{ data: 'v' }] as any,
            }),
            { state },
        );

        expect(emitted[0].type).toBe(slice.actions.updateCustomAttributeContentFailure.type);
    });

    test('updateCustomAttributeContent for vault success emits success and updateVaultSuccess', async () => {
        let capturedRequest: any;
        const state = createState({
            customAttributes: {
                resourceCustomAttributesContents: [],
                resourceCustomAttributes: [
                    {
                        uuid: 'attr-1',
                        name: 'Attr 1',
                        type: 'string',
                        contentType: 'application/json',
                        version: '3',
                        properties: { label: 'Attr Label' },
                    },
                ],
            },
            vaults: {
                vault: {
                    uuid: 'vault-1',
                    attributes: [
                        {
                            uuid: 'base-1',
                            name: 'Base 1',
                            contentType: 'application/json',
                            version: AttributeVersion.V3,
                            content: [{ value: 'a', contentType: 'application/json' }],
                        },
                    ],
                    customAttributes: [],
                },
            },
        });

        const emitted = await runEpic(
            CustomAttributesEpicIndex.UpdateCustomAttributeContent,
            slice.actions.updateCustomAttributeContent({
                resource: Resource.Vaults,
                resourceUuid: 'vault-1',
                attributeUuid: 'attr-1',
                content: [{ value: 'b' }] as any,
            }),
            {
                state,
                depsOverrides: {
                    vaults: {
                        updateVaultInstance: (args: any) => {
                            capturedRequest = args;
                            return of({
                                uuid: 'vault-1',
                                customAttributes: [
                                    {
                                        uuid: 'attr-1',
                                        name: 'Attr 1',
                                        contentType: 'application/json',
                                        version: AttributeVersion.V3,
                                        content: [{ value: 'b', contentType: 'application/json' }],
                                    },
                                ],
                            });
                        },
                    },
                },
                takeCount: 2,
            },
        );

        expect(capturedRequest.uuid).toBe('vault-1');
        expect(capturedRequest.vaultInstanceUpdateRequestDto.customAttributes[0].version).toBe(AttributeVersion.V3);
        expect(capturedRequest.vaultInstanceUpdateRequestDto.customAttributes[0].content[0].contentType).toBe('application/json');
        expect(emitted[0].type).toBe(slice.actions.updateCustomAttributeContentSuccess.type);
        expect(emitted[1].type).toBe(vaultActions.updateVaultSuccess.type);
    });

    test('updateCustomAttributeContent for vault API failure emits failure and fetchError', async () => {
        const err = new Error('vault update failed');
        const state = createState({
            customAttributes: {
                resourceCustomAttributesContents: [
                    {
                        resource: Resource.Vaults,
                        resourceUuid: 'vault-1',
                        customAttributes: [
                            {
                                uuid: 'attr-1',
                                name: 'Attr 1',
                                contentType: 'text/plain',
                                version: AttributeVersion.V2,
                                content: [],
                            },
                        ],
                    },
                ],
                resourceCustomAttributes: [],
            },
            vaults: {
                vault: {
                    uuid: 'vault-1',
                    attributes: [],
                    customAttributes: [],
                },
            },
        });

        const emitted = await runEpic(
            CustomAttributesEpicIndex.UpdateCustomAttributeContent,
            slice.actions.updateCustomAttributeContent({
                resource: Resource.Vaults,
                resourceUuid: 'vault-1',
                attributeUuid: 'attr-1',
                content: [{ data: 'v' }] as any,
            }),
            {
                state,
                depsOverrides: {
                    vaults: {
                        updateVaultInstance: () => throwError(() => err),
                    },
                },
                takeCount: 2,
            },
        );

        expect(emitted[0].type).toBe(slice.actions.updateCustomAttributeContentFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to update custom attribute content' }));
    });

    test('updateCustomAttributeContent for vault profile returns failure when context is missing', async () => {
        const emitted = await runEpic(
            CustomAttributesEpicIndex.UpdateCustomAttributeContent,
            slice.actions.updateCustomAttributeContent({
                resource: Resource.VaultProfiles,
                resourceUuid: 'vp-1',
                attributeUuid: 'attr-1',
                content: [{ data: 'v' }] as any,
            }),
            { state: createState() },
        );

        expect(emitted[0].type).toBe(slice.actions.updateCustomAttributeContentFailure.type);
    });

    test('updateCustomAttributeContent for vault profile returns failure when descriptor and existing attr are missing', async () => {
        const state = createState({
            vaultProfiles: {
                vaultProfile: {
                    uuid: 'vp-1',
                    vaultInstance: { uuid: 'vault-1' },
                    customAttributes: [],
                },
            },
        });

        const emitted = await runEpic(
            CustomAttributesEpicIndex.UpdateCustomAttributeContent,
            slice.actions.updateCustomAttributeContent({
                resource: Resource.VaultProfiles,
                resourceUuid: 'vp-1',
                attributeUuid: 'missing-attr',
                content: [{ data: 'v' }] as any,
            }),
            { state },
        );

        expect(emitted[0].type).toBe(slice.actions.updateCustomAttributeContentFailure.type);
    });

    test('updateCustomAttributeContent for vault profile success emits success and updateVaultProfileSuccess', async () => {
        const state = createState({
            customAttributes: {
                resourceCustomAttributesContents: [],
                resourceCustomAttributes: [
                    {
                        uuid: 'attr-1',
                        name: 'Attr 1',
                        type: 'string',
                        contentType: 'text/plain',
                        version: AttributeVersion.V2,
                        properties: { label: 'Attr Label' },
                    },
                ],
            },
            vaultProfiles: {
                vaultProfile: {
                    uuid: 'vp-1',
                    vaultInstance: { uuid: 'vault-1' },
                    customAttributes: [],
                },
            },
        });

        const emitted = await runEpic(
            CustomAttributesEpicIndex.UpdateCustomAttributeContent,
            slice.actions.updateCustomAttributeContent({
                resource: Resource.VaultProfiles,
                resourceUuid: 'vp-1',
                attributeUuid: 'attr-1',
                content: [{ data: 'v' }] as any,
            }),
            { state, takeCount: 2 },
        );

        expect(emitted[0].type).toBe(slice.actions.updateCustomAttributeContentSuccess.type);
        expect(emitted[1].type).toBe(vaultProfileActions.updateVaultProfileSuccess.type);
    });

    test('updateCustomAttributeContent for vault profile API failure emits failure and fetchError', async () => {
        const err = new Error('profile update failed');
        const state = createState({
            customAttributes: {
                resourceCustomAttributesContents: [
                    {
                        resource: Resource.VaultProfiles,
                        resourceUuid: 'vp-1',
                        customAttributes: [
                            {
                                uuid: 'attr-1',
                                name: 'Attr 1',
                                contentType: 'text/plain',
                                version: AttributeVersion.V2,
                                content: [],
                            },
                        ],
                    },
                ],
                resourceCustomAttributes: [],
            },
            vaultProfiles: {
                vaultProfile: {
                    uuid: 'vp-1',
                    vaultInstance: { uuid: 'vault-1' },
                    customAttributes: [],
                },
            },
        });

        const emitted = await runEpic(
            CustomAttributesEpicIndex.UpdateCustomAttributeContent,
            slice.actions.updateCustomAttributeContent({
                resource: Resource.VaultProfiles,
                resourceUuid: 'vp-1',
                attributeUuid: 'attr-1',
                content: [{ data: 'v' }] as any,
            }),
            {
                state,
                depsOverrides: {
                    vaultProfiles: {
                        updateVaultProfile: () => throwError(() => err),
                    },
                },
                takeCount: 2,
            },
        );

        expect(emitted[0].type).toBe(slice.actions.updateCustomAttributeContentFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to update custom attribute content' }));
    });

    test('removeCustomAttributeContent for generic resource success emits success', async () => {
        const emitted = await runEpic(
            CustomAttributesEpicIndex.RemoveCustomAttributeContent,
            slice.actions.removeCustomAttributeContent({
                resource: Resource.Certificates,
                resourceUuid: 'obj-1',
                attributeUuid: 'attr-2',
            }),
        );

        expect(emitted[0].type).toBe(slice.actions.removeCustomAttributeContentSuccess.type);
    });

    test('removeCustomAttributeContent for generic resource failure emits failure and fetchError', async () => {
        const err = new Error('generic remove failed');
        const emitted = await runEpic(
            CustomAttributesEpicIndex.RemoveCustomAttributeContent,
            slice.actions.removeCustomAttributeContent({
                resource: Resource.Certificates,
                resourceUuid: 'obj-1',
                attributeUuid: 'attr-2',
            }),
            {
                depsOverrides: {
                    customAttributes: {
                        deleteAttributeContentForResource: () => throwError(() => err),
                    } as any,
                },
                takeCount: 2,
            },
        );

        expect(emitted[0].type).toBe(slice.actions.removeCustomAttributeContentFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to remove custom attribute content' }));
    });

    test('removeCustomAttributeContent for vault returns failure when context is missing', async () => {
        const emitted = await runEpic(
            CustomAttributesEpicIndex.RemoveCustomAttributeContent,
            slice.actions.removeCustomAttributeContent({
                resource: Resource.Vaults,
                resourceUuid: 'vault-1',
                attributeUuid: 'attr-1',
            }),
            { state: createState() },
        );

        expect(emitted[0].type).toBe(slice.actions.removeCustomAttributeContentFailure.type);
    });

    test('removeCustomAttributeContent for vault success emits success and updateVaultSuccess', async () => {
        const state = createState({
            customAttributes: {
                resourceCustomAttributesContents: [
                    {
                        resource: Resource.Vaults,
                        resourceUuid: 'vault-1',
                        customAttributes: [
                            {
                                uuid: 'attr-1',
                                name: 'Attr 1',
                                contentType: 'text/plain',
                                version: AttributeVersion.V2,
                                content: [],
                            },
                        ],
                    },
                ],
                resourceCustomAttributes: [],
            },
            vaults: {
                vault: {
                    uuid: 'vault-1',
                    attributes: [],
                    customAttributes: [],
                },
            },
        });

        const emitted = await runEpic(
            CustomAttributesEpicIndex.RemoveCustomAttributeContent,
            slice.actions.removeCustomAttributeContent({
                resource: Resource.Vaults,
                resourceUuid: 'vault-1',
                attributeUuid: 'attr-1',
            }),
            { state, takeCount: 2 },
        );

        expect(emitted[0].type).toBe(slice.actions.removeCustomAttributeContentSuccess.type);
        expect(emitted[1].type).toBe(vaultActions.updateVaultSuccess.type);
    });

    test('removeCustomAttributeContent for vault keeps v3 when attribute version is numeric 3', async () => {
        let capturedRequest: any;
        const state = createState({
            customAttributes: {
                resourceCustomAttributesContents: [
                    {
                        resource: Resource.Vaults,
                        resourceUuid: 'vault-1',
                        customAttributes: [
                            {
                                uuid: 'attr-1',
                                name: 'Attr 1',
                                contentType: 'application/json',
                                version: 3,
                                content: [{ value: 'x' }],
                            },
                        ],
                    },
                ],
                resourceCustomAttributes: [],
            },
            vaults: {
                vault: {
                    uuid: 'vault-1',
                    attributes: [
                        {
                            uuid: 'base-1',
                            name: 'Base 1',
                            contentType: 'application/json',
                            version: 3,
                            content: [{ value: 'x' }],
                        },
                    ],
                    customAttributes: [
                        {
                            uuid: 'attr-1',
                            name: 'Attr 1',
                            contentType: 'application/json',
                            version: 3,
                            content: [{ value: 'x' }],
                        },
                    ],
                },
            },
        });

        await runEpic(
            CustomAttributesEpicIndex.RemoveCustomAttributeContent,
            slice.actions.removeCustomAttributeContent({
                resource: Resource.Vaults,
                resourceUuid: 'vault-1',
                attributeUuid: 'missing-attr',
            }),
            {
                state,
                depsOverrides: {
                    vaults: {
                        updateVaultInstance: (args: any) => {
                            capturedRequest = args;
                            return of({ uuid: 'vault-1', customAttributes: [] });
                        },
                    },
                },
                takeCount: 2,
            },
        );

        expect(capturedRequest.vaultInstanceUpdateRequestDto.attributes[0].version).toBe(AttributeVersion.V3);
        expect(capturedRequest.vaultInstanceUpdateRequestDto.attributes[0].content[0].contentType).toBe('application/json');
    });

    test('removeCustomAttributeContent for vault API failure emits failure and fetchError', async () => {
        const err = new Error('vault remove failed');
        const state = createState({
            customAttributes: {
                resourceCustomAttributesContents: [
                    {
                        resource: Resource.Vaults,
                        resourceUuid: 'vault-1',
                        customAttributes: [
                            {
                                uuid: 'attr-1',
                                name: 'Attr 1',
                                contentType: 'text/plain',
                                version: AttributeVersion.V2,
                                content: [],
                            },
                        ],
                    },
                ],
                resourceCustomAttributes: [],
            },
            vaults: {
                vault: {
                    uuid: 'vault-1',
                    attributes: [],
                    customAttributes: [],
                },
            },
        });

        const emitted = await runEpic(
            CustomAttributesEpicIndex.RemoveCustomAttributeContent,
            slice.actions.removeCustomAttributeContent({
                resource: Resource.Vaults,
                resourceUuid: 'vault-1',
                attributeUuid: 'attr-1',
            }),
            {
                state,
                depsOverrides: {
                    vaults: {
                        updateVaultInstance: () => throwError(() => err),
                    },
                },
                takeCount: 2,
            },
        );

        expect(emitted[0].type).toBe(slice.actions.removeCustomAttributeContentFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to remove custom attribute content' }));
    });

    test('removeCustomAttributeContent for vault profile returns failure when context is missing', async () => {
        const emitted = await runEpic(
            CustomAttributesEpicIndex.RemoveCustomAttributeContent,
            slice.actions.removeCustomAttributeContent({
                resource: Resource.VaultProfiles,
                resourceUuid: 'vp-1',
                attributeUuid: 'attr-1',
            }),
            { state: createState() },
        );

        expect(emitted[0].type).toBe(slice.actions.removeCustomAttributeContentFailure.type);
    });

    test('removeCustomAttributeContent for vault profile success emits success and updateVaultProfileSuccess', async () => {
        const state = createState({
            customAttributes: {
                resourceCustomAttributesContents: [
                    {
                        resource: Resource.VaultProfiles,
                        resourceUuid: 'vp-1',
                        customAttributes: [
                            {
                                uuid: 'attr-1',
                                name: 'Attr 1',
                                contentType: 'text/plain',
                                version: AttributeVersion.V2,
                                content: [],
                            },
                        ],
                    },
                ],
                resourceCustomAttributes: [],
            },
            vaultProfiles: {
                vaultProfile: {
                    uuid: 'vp-1',
                    vaultInstance: { uuid: 'vault-1' },
                    customAttributes: [],
                },
            },
        });

        const emitted = await runEpic(
            CustomAttributesEpicIndex.RemoveCustomAttributeContent,
            slice.actions.removeCustomAttributeContent({
                resource: Resource.VaultProfiles,
                resourceUuid: 'vp-1',
                attributeUuid: 'attr-1',
            }),
            { state, takeCount: 2 },
        );

        expect(emitted[0].type).toBe(slice.actions.removeCustomAttributeContentSuccess.type);
        expect(emitted[1].type).toBe(vaultProfileActions.updateVaultProfileSuccess.type);
    });

    test('removeCustomAttributeContent for vault profile API failure emits failure and fetchError', async () => {
        const err = new Error('profile remove failed');
        const state = createState({
            customAttributes: {
                resourceCustomAttributesContents: [
                    {
                        resource: Resource.VaultProfiles,
                        resourceUuid: 'vp-1',
                        customAttributes: [
                            {
                                uuid: 'attr-1',
                                name: 'Attr 1',
                                contentType: 'text/plain',
                                version: AttributeVersion.V2,
                                content: [],
                            },
                        ],
                    },
                ],
                resourceCustomAttributes: [],
            },
            vaultProfiles: {
                vaultProfile: {
                    uuid: 'vp-1',
                    vaultInstance: { uuid: 'vault-1' },
                    customAttributes: [],
                },
            },
        });

        const emitted = await runEpic(
            CustomAttributesEpicIndex.RemoveCustomAttributeContent,
            slice.actions.removeCustomAttributeContent({
                resource: Resource.VaultProfiles,
                resourceUuid: 'vp-1',
                attributeUuid: 'attr-1',
            }),
            {
                state,
                depsOverrides: {
                    vaultProfiles: {
                        updateVaultProfile: () => throwError(() => err),
                    },
                },
                takeCount: 2,
            },
        );

        expect(emitted[0].type).toBe(slice.actions.removeCustomAttributeContentFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to remove custom attribute content' }));
    });

    test('getCustomAttribute success emits success and removeWidgetLock', async () => {
        const emitted = await runEpic(CustomAttributesEpicIndex.GetCustomAttribute, slice.actions.getCustomAttribute('ca-1'), {
            takeCount: 2,
        });

        expect(emitted[0].type).toBe(slice.actions.getCustomAttributeSuccess.type);
        expect(emitted[1]).toEqual(userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.CustomAttributeDetails));
    });

    test('getCustomAttribute failure emits failure and insertWidgetLock', async () => {
        const err = new Error('detail failed');
        const emitted = await runEpic(CustomAttributesEpicIndex.GetCustomAttribute, slice.actions.getCustomAttribute('ca-1'), {
            depsOverrides: {
                customAttributes: {
                    getCustomAttribute: () => throwError(() => err),
                } as any,
            },
            takeCount: 2,
        });

        expect(emitted[0].type).toBe(slice.actions.getCustomAttributeFailure.type);
        expect(emitted[1].type).toBe(userInterfaceActions.insertWidgetLock.type);
    });

    test('deleteCustomAttribute success emits success and redirect', async () => {
        const emitted = await runEpic(CustomAttributesEpicIndex.DeleteCustomAttribute, slice.actions.deleteCustomAttribute('ca-1'), {
            takeCount: 2,
        });

        expect(emitted[0]).toEqual(slice.actions.deleteCustomAttributeSuccess('ca-1'));
        expect(emitted[1]).toEqual(appRedirectActions.redirect({ url: '../../customattributes' }));
    });

    test('deleteCustomAttribute failure emits failure and fetchError', async () => {
        const err = new Error('delete failed');
        const emitted = await runEpic(CustomAttributesEpicIndex.DeleteCustomAttribute, slice.actions.deleteCustomAttribute('ca-1'), {
            depsOverrides: {
                customAttributes: {
                    deleteCustomAttribute: () => throwError(() => err),
                } as any,
            },
            takeCount: 2,
        });

        expect(emitted[0].type).toBe(slice.actions.deleteCustomAttributeFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to delete custom attribute' }));
    });

    test('bulkDeleteCustomAttributes success emits success and success alert', async () => {
        const emitted = await runEpic(
            CustomAttributesEpicIndex.BulkDeleteCustomAttributes,
            slice.actions.bulkDeleteCustomAttributes(['ca-1', 'ca-2']),
            { takeCount: 2 },
        );

        expect(emitted[0]).toEqual(slice.actions.bulkDeleteCustomAttributesSuccess(['ca-1', 'ca-2']));
        expect(emitted[1]).toEqual(alertActions.success('Selected custom attributes successfully deleted.'));
    });

    test('bulkDeleteCustomAttributes failure emits failure and fetchError', async () => {
        const err = new Error('bulk delete failed');
        const emitted = await runEpic(
            CustomAttributesEpicIndex.BulkDeleteCustomAttributes,
            slice.actions.bulkDeleteCustomAttributes(['ca-1']),
            {
                depsOverrides: {
                    customAttributes: {
                        bulkDeleteCustomAttributes: () => throwError(() => err),
                    } as any,
                },
                takeCount: 2,
            },
        );

        expect(emitted[0].type).toBe(slice.actions.bulkDeleteCustomAttributesFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to delete custom attributes' }));
    });

    test('bulkEnableCustomAttributes success emits success', async () => {
        const emitted = await runEpic(
            CustomAttributesEpicIndex.BulkEnableCustomAttributes,
            slice.actions.bulkEnableCustomAttributes(['ca-1']),
        );

        expect(emitted[0]).toEqual(slice.actions.bulkEnableCustomAttributesSuccess(['ca-1']));
    });

    test('bulkEnableCustomAttributes failure emits failure and fetchError', async () => {
        const err = new Error('bulk enable failed');
        const emitted = await runEpic(
            CustomAttributesEpicIndex.BulkEnableCustomAttributes,
            slice.actions.bulkEnableCustomAttributes(['ca-1']),
            {
                depsOverrides: {
                    customAttributes: {
                        bulkEnableCustomAttributes: () => throwError(() => err),
                    } as any,
                },
                takeCount: 2,
            },
        );

        expect(emitted[0].type).toBe(slice.actions.bulkEnableCustomAttributesFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to enable custom attributes' }));
    });

    test('bulkDisableCustomAttributes success emits success', async () => {
        const emitted = await runEpic(
            CustomAttributesEpicIndex.BulkDisableCustomAttributes,
            slice.actions.bulkDisableCustomAttributes(['ca-1']),
        );

        expect(emitted[0]).toEqual(slice.actions.bulkDisableCustomAttributesSuccess(['ca-1']));
    });

    test('bulkDisableCustomAttributes failure emits failure and fetchError', async () => {
        const err = new Error('bulk disable failed');
        const emitted = await runEpic(
            CustomAttributesEpicIndex.BulkDisableCustomAttributes,
            slice.actions.bulkDisableCustomAttributes(['ca-1']),
            {
                depsOverrides: {
                    customAttributes: {
                        bulkDisableCustomAttributes: () => throwError(() => err),
                    } as any,
                },
                takeCount: 2,
            },
        );

        expect(emitted[0].type).toBe(slice.actions.bulkDisableCustomAttributesFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to disable custom attributes' }));
    });

    test('enableCustomAttribute success emits success', async () => {
        const emitted = await runEpic(CustomAttributesEpicIndex.EnableCustomAttribute, slice.actions.enableCustomAttribute('ca-1'));
        expect(emitted[0]).toEqual(slice.actions.enableCustomAttributeSuccess('ca-1'));
    });

    test('enableCustomAttribute failure emits failure and fetchError', async () => {
        const err = new Error('enable failed');
        const emitted = await runEpic(CustomAttributesEpicIndex.EnableCustomAttribute, slice.actions.enableCustomAttribute('ca-1'), {
            depsOverrides: {
                customAttributes: {
                    enableCustomAttribute: () => throwError(() => err),
                } as any,
            },
            takeCount: 2,
        });

        expect(emitted[0].type).toBe(slice.actions.enableCustomAttributeFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to enable custom attribute' }));
    });

    test('disableCustomAttribute success emits success', async () => {
        const emitted = await runEpic(CustomAttributesEpicIndex.DisableCustomAttribute, slice.actions.disableCustomAttribute('ca-1'));
        expect(emitted[0]).toEqual(slice.actions.disableCustomAttributeSuccess('ca-1'));
    });

    test('disableCustomAttribute failure emits failure and fetchError', async () => {
        const err = new Error('disable failed');
        const emitted = await runEpic(CustomAttributesEpicIndex.DisableCustomAttribute, slice.actions.disableCustomAttribute('ca-1'), {
            depsOverrides: {
                customAttributes: {
                    disableCustomAttribute: () => throwError(() => err),
                } as any,
            },
            takeCount: 2,
        });

        expect(emitted[0].type).toBe(slice.actions.disableCustomAttributeFailure.type);
        expect(emitted[1]).toEqual(appRedirectActions.fetchError({ error: err, message: 'Failed to disable custom attribute' }));
    });
});
