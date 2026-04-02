import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRoot, Root } from 'react-dom/client';

import SecretDetail from './index';
import { PlatformEnum, Resource } from 'types/openapi';
import { COMMON_GROUPS_STATE, COMMON_USERS_STATE, COMMON_VAULT_PROFILES_STATE } from '../../test-utils/mockModules';
import { clickByText, clickByTitle } from '../../test-utils/domActions';
import {
    expectSecretOwnerGroupVaultDispatchCalls,
    runSecretOwnerGroupVaultUpdateActions,
} from '../../test-utils/secretOwnerGroupVaultActions';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

const { useDispatchMock, useSelectorMock } = vi.hoisted(() => ({
    useDispatchMock: vi.fn(),
    useSelectorMock: vi.fn(),
}));

vi.mock('react-redux', async () => {
    const { reduxHooksMockModule } = await import('../../test-utils/mockModules');
    return reduxHooksMockModule(useDispatchMock, useSelectorMock);
});

vi.mock('react-router', async () => {
    const { routerLinkMockModule } = await import('../../test-utils/mockModules');
    return {
        ...routerLinkMockModule(),
        useParams: () => ({ id: 'sec-1' }),
    };
});

vi.mock('components/Breadcrumb', () => ({
    default: ({ items }: any) => <div>{items?.[1]?.label}</div>,
}));

vi.mock('components/Container', async () => {
    const { containerMockModule } = await import('../../test-utils/mockModules');
    return containerMockModule();
});

vi.mock('components/Layout/TabLayout', () => ({
    default: ({ tabs }: any) => (
        <div>
            {tabs.map((tab: any, index: number) => (
                <div key={index} data-testid={`tab-${tab.title}`}>
                    <h3>{tab.title}</h3>
                    {tab.content}
                </div>
            ))}
        </div>
    ),
}));

vi.mock('components/Widget', async () => {
    const { widgetMockModule } = await import('../../test-utils/mockModules');
    return widgetMockModule();
});

vi.mock('components/CustomTable', async () => {
    const { customTableMockModule } = await import('../../test-utils/mockModules');
    return customTableMockModule();
});

vi.mock('components/Dialog', async () => {
    const { dialogMockModule } = await import('../../test-utils/mockModules');
    return dialogMockModule();
});

vi.mock('components/Attributes/AttributeViewer', () => ({
    default: ({ attributes }: any) => <div data-testid="attributes">{attributes ? 'has-attributes' : 'no-attributes'}</div>,
    ATTRIBUTE_VIEWER_TYPE: { METADATA: 'metadata' },
}));

vi.mock('components/Attributes/CustomAttributeWidget', () => ({
    default: () => <div data-testid="custom-attributes">custom-attributes</div>,
}));

vi.mock('components/Badge', async () => {
    const { badgeMockModule } = await import('../../test-utils/mockModules');
    return badgeMockModule();
});

vi.mock('components/Button', () => ({
    default: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock('components/icons/EditIcon', () => ({
    default: () => <span>Edit</span>,
}));

vi.mock('components/Select', async () => {
    const { createSelectMockModule } = await import('../../test-utils/mockModules');
    return createSelectMockModule({ 'secret-vault-profile-detail': 'vp-2' });
});

vi.mock('../SecretStateBadge', () => ({
    default: ({ children }: any) => <span>{children}</span>,
}));

vi.mock('../form', () => ({
    default: () => <div data-testid="secret-form">secret-form</div>,
}));

vi.mock('../SyncVaultProfileDialog/SyncVaultProfileDialog', () => ({
    SyncVaultProfileDialog: () => <div data-testid="sync-vault-profile-dialog">sync-vault-profile-dialog</div>,
}));

vi.mock('components/_pages/certificates/CertificateStatus', () => ({
    default: ({ status }: any) => <span data-testid="certificate-status">{status}</span>,
}));

vi.mock('components/_pages/certificates/ComplianceCheckResultWidget/ComplianceCheckResultWidget', () => ({
    default: ({ resource }: any) => <div data-testid="compliance-widget">resource:{resource}</div>,
}));

describe('SecretDetail compliance integration', () => {
    let container: HTMLDivElement;
    let root: Root;
    let dispatch: ReturnType<typeof vi.fn>;
    let state: any;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        root = createRoot(container);

        dispatch = vi.fn();
        useDispatchMock.mockReturnValue(dispatch);

        state = {
            secrets: {
                secret: {
                    uuid: 'sec-1',
                    name: 'Secret One',
                    type: 'password',
                    description: 'desc',
                    state: 'active',
                    version: 1,
                    enabled: true,
                    complianceStatus: 'ok',
                    updatedAt: '2026-01-01T00:00:00Z',
                    sourceVaultProfile: { uuid: 'vp-1', name: 'Vault Profile One' },
                    syncVaultProfiles: [
                        {
                            uuid: 'svp-1',
                            name: 'Sync Vault Profile',
                            secretAttributes: [{ uuid: 'attr-1', name: 'Common Name' }],
                        },
                    ],
                    owner: { uuid: 'owner-1', name: 'Owner One' },
                    groups: [{ uuid: 'group-1', name: 'Group 1' }],
                    attributes: [],
                    customAttributes: [],
                    metadata: [],
                },
                versions: [],
                isFetchingDetail: false,
                isDeleting: false,
                isUpdating: false,
            },
            enums: {
                platformEnums: {
                    [PlatformEnum.Resource]: {
                        [Resource.Secrets]: { label: 'Secrets' },
                    },
                    [PlatformEnum.SecretType]: {
                        password: { label: 'Password' },
                    },
                    [PlatformEnum.SecretState]: {
                        active: { label: 'Active' },
                    },
                },
            },
            users: COMMON_USERS_STATE,
            certificateGroups: COMMON_GROUPS_STATE,
            vaultProfiles: COMMON_VAULT_PROFILES_STATE,
        } as any;

        useSelectorMock.mockImplementation((selector: any) => selector(state));
    });

    it('shows compliance status in details and renders validation tab compliance widget', async () => {
        await act(async () => {
            root.render(<SecretDetail />);
        });

        expect(container.querySelector('[data-testid="row-complianceStatus"]')?.textContent).toContain('Compliance Status');
        expect(container.querySelector('[data-testid="tab-Validation"]')?.textContent).toContain('resource:secrets');
    });

    it('dispatches single secret compliance check when confirmed', async () => {
        await act(async () => {
            root.render(<SecretDetail />);
        });

        await clickByTitle(container, 'Check Compliance');
        await clickByText(container, 'Yes');

        expect(dispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'complianceProfiles/checkResourceObjectCompliance',
                payload: {
                    resource: Resource.Secrets,
                    objectUuid: 'sec-1',
                },
            }),
        );
    });

    it('dispatches disable and delete actions and manages sync vault profile actions', async () => {
        await act(async () => {
            root.render(<SecretDetail />);
        });

        await clickByTitle(container, 'Disable');
        await clickByText(container, 'Disable');
        await clickByTitle(container, 'Delete');
        await clickByText(container, 'Delete');
        await clickByTitle(container, 'Remove Sync Vault Profile');
        await clickByTitle(container, 'Show Sync Vault Profile attributes');

        expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'secrets/disableSecret' }));
        expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'secrets/deleteSecret' }));
        expect(dispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'secrets/removeSyncVaultProfile',
                payload: { uuid: 'sec-1', vaultProfileUuid: 'svp-1' },
            }),
        );
    });

    it('dispatches owner, groups and source vault profile updates', async () => {
        await act(async () => {
            root.render(<SecretDetail />);
        });

        await runSecretOwnerGroupVaultUpdateActions(container, {
            ownerTitle: 'Update Owner',
            ownerSelectTestId: 'select-secret-owner-detail',
            groupsTitle: 'Update Groups',
            groupsSelectTestId: 'select-secret-groups-detail',
            sourceVaultTitle: 'Update Source Vault Profile',
            sourceVaultSelectTestId: 'select-secret-vault-profile-detail',
        });

        expectSecretOwnerGroupVaultDispatchCalls(dispatch, {
            uuid: 'sec-1',
            sourceVaultProfileUuid: 'vp-2',
        });
    });

    it('dispatches enable action when secret is disabled and opens add sync vault profile dialog', async () => {
        state.secrets.secret.enabled = false;

        await act(async () => {
            root.render(<SecretDetail />);
        });

        await clickByTitle(container, 'Enable');
        await clickByText(container, 'Enable');
        await clickByTitle(container, 'Add Sync Vault Profile');

        expect(container.textContent).toContain('Add Sync Vault Profile');
        expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'secrets/enableSecret' }));
    });
});
