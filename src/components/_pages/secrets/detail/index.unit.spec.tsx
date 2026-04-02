import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRoot, Root } from 'react-dom/client';

import SecretDetail from './index';
import { PlatformEnum, Resource } from 'types/openapi';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

const useDispatchMock = vi.fn();
const useSelectorMock = vi.fn();

vi.mock('react-redux', () => ({
    useDispatch: () => useDispatchMock(),
    useSelector: (selector: any) => useSelectorMock(selector),
}));

vi.mock('react-router', () => ({
    Link: ({ to, children }: any) => <a href={to}>{children}</a>,
    useParams: () => ({ id: 'sec-1' }),
}));

vi.mock('components/Breadcrumb', () => ({
    default: ({ items }: any) => <div>{items?.[1]?.label}</div>,
}));

vi.mock('components/Container', () => ({
    default: ({ children }: any) => <div>{children}</div>,
}));

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

vi.mock('components/Widget', () => ({
    default: ({ title, widgetButtons, children }: any) => (
        <div data-testid={`widget-${title || 'root'}`}>
            {(widgetButtons || []).map((button: any, index: number) => (
                <button key={index} title={button.tooltip} onClick={button.onClick}>
                    {button.icon}
                </button>
            ))}
            {children}
        </div>
    ),
}));

vi.mock('components/CustomTable', () => ({
    default: ({ data }: any) => (
        <div>
            {(data || []).map((row: any) => (
                <div key={row.id} data-testid={`row-${row.id}`}>
                    {(row.columns || []).map((column: any, index: number) => (
                        <div key={index}>{column}</div>
                    ))}
                </div>
            ))}
        </div>
    ),
}));

vi.mock('components/Dialog', () => ({
    default: ({ isOpen, caption, body, buttons, toggle }: any) =>
        isOpen ? (
            <div data-testid="dialog">
                <div>{caption}</div>
                <div>{body}</div>
                <button onClick={toggle}>toggle</button>
                {(buttons || []).map((button: any, i: number) => (
                    <button key={i} onClick={button.onClick}>
                        {button.body}
                    </button>
                ))}
            </div>
        ) : null,
}));

vi.mock('components/Attributes/AttributeViewer', () => ({
    default: ({ attributes }: any) => <div data-testid="attributes">{attributes ? 'has-attributes' : 'no-attributes'}</div>,
    ATTRIBUTE_VIEWER_TYPE: { METADATA: 'metadata' },
}));

vi.mock('components/Attributes/CustomAttributeWidget', () => ({
    default: () => <div data-testid="custom-attributes">custom-attributes</div>,
}));

vi.mock('components/Badge', () => ({
    default: ({ children }: any) => <span>{children}</span>,
}));

vi.mock('components/Button', () => ({
    default: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock('components/icons/EditIcon', () => ({
    default: () => <span>Edit</span>,
}));

vi.mock('components/Select', () => ({
    default: ({ id, onChange, isMulti }: any) => (
        <button
            data-testid={`select-${id}`}
            onClick={() => {
                if (isMulti) {
                    onChange([{ value: 'group-1', label: 'Group 1' }]);
                    return;
                }

                if (id === 'secret-vault-profile-detail') {
                    onChange('vp-2');
                    return;
                }

                onChange('user-1');
            }}
        >
            select
        </button>
    ),
}));

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
            users: { users: [{ uuid: 'user-1', username: 'owner1' }] },
            certificateGroups: { certificateGroups: [{ uuid: 'group-1', name: 'Group 1' }] },
            vaultProfiles: {
                vaultProfiles: [
                    { uuid: 'vp-1', name: 'Vault Profile One', enabled: true, vaultInstance: { uuid: 'vault-1' } },
                    { uuid: 'vp-2', name: 'Vault Profile Two', enabled: true, vaultInstance: { uuid: 'vault-2' } },
                ],
            },
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

        const checkButton = container.querySelector('button[title="Check Compliance"]') as HTMLButtonElement;
        await act(async () => {
            checkButton.click();
        });

        const yesButton = Array.from(container.querySelectorAll('button')).find((el) => el.textContent === 'Yes') as HTMLButtonElement;
        await act(async () => {
            yesButton.click();
        });

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

        const disableButton = container.querySelector('button[title="Disable"]') as HTMLButtonElement;
        await act(async () => {
            disableButton.click();
        });
        await act(async () => {
            (Array.from(container.querySelectorAll('button')).find((el) => el.textContent === 'Disable') as HTMLButtonElement).click();
        });

        const deleteButton = container.querySelector('button[title="Delete"]') as HTMLButtonElement;
        await act(async () => {
            deleteButton.click();
        });
        await act(async () => {
            (Array.from(container.querySelectorAll('button')).find((el) => el.textContent === 'Delete') as HTMLButtonElement).click();
        });

        const removeSyncButton = container.querySelector('button[title="Remove Sync Vault Profile"]') as HTMLButtonElement;
        await act(async () => {
            removeSyncButton.click();
        });

        const syncAttrButton = container.querySelector('button[title="Show Sync Vault Profile attributes"]') as HTMLButtonElement;
        await act(async () => {
            syncAttrButton.click();
        });

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

        const ownerButton = container.querySelector('button[title="Update Owner"]') as HTMLButtonElement;
        await act(async () => {
            ownerButton.click();
        });
        await act(async () => {
            (container.querySelector('[data-testid="select-secret-owner-detail"]') as HTMLButtonElement).click();
        });
        await act(async () => {
            (Array.from(container.querySelectorAll('button')).find((el) => el.textContent === 'Update') as HTMLButtonElement).click();
        });

        await act(async () => {
            ownerButton.click();
        });
        await act(async () => {
            (Array.from(container.querySelectorAll('button')).find((el) => el.textContent === 'Remove') as HTMLButtonElement).click();
        });

        const groupsButton = container.querySelector('button[title="Update Groups"]') as HTMLButtonElement;
        await act(async () => {
            groupsButton.click();
        });
        await act(async () => {
            (container.querySelector('[data-testid="select-secret-groups-detail"]') as HTMLButtonElement).click();
        });
        await act(async () => {
            (Array.from(container.querySelectorAll('button')).find((el) => el.textContent === 'Update') as HTMLButtonElement).click();
        });

        await act(async () => {
            groupsButton.click();
        });
        await act(async () => {
            (Array.from(container.querySelectorAll('button')).find((el) => el.textContent === 'Clear') as HTMLButtonElement).click();
        });

        const sourceVaultButton = container.querySelector('button[title="Update Source Vault Profile"]') as HTMLButtonElement;
        await act(async () => {
            sourceVaultButton.click();
        });
        await act(async () => {
            (container.querySelector('[data-testid="select-secret-vault-profile-detail"]') as HTMLButtonElement).click();
        });
        await act(async () => {
            (Array.from(container.querySelectorAll('button')).find((el) => el.textContent === 'Update') as HTMLButtonElement).click();
        });

        expect(dispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'secrets/updateSecretObjects',
                payload: { uuid: 'sec-1', update: { ownerUuid: 'user-1' } },
            }),
        );
        expect(dispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'secrets/updateSecretObjects',
                payload: { uuid: 'sec-1', update: { ownerUuid: '' } },
            }),
        );
        expect(dispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'secrets/updateSecretObjects',
                payload: { uuid: 'sec-1', update: { groupUuids: ['group-1'] } },
            }),
        );
        expect(dispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'secrets/updateSecretObjects',
                payload: { uuid: 'sec-1', update: { groupUuids: [] } },
            }),
        );
        expect(dispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'secrets/updateSecretObjects',
                payload: { uuid: 'sec-1', update: { sourceVaultProfileUuid: 'vp-2' } },
            }),
        );
    });

    it('dispatches enable action when secret is disabled and opens add sync vault profile dialog', async () => {
        state.secrets.secret.enabled = false;

        await act(async () => {
            root.render(<SecretDetail />);
        });

        const enableButton = container.querySelector('button[title="Enable"]') as HTMLButtonElement;
        await act(async () => {
            enableButton.click();
        });

        await act(async () => {
            (Array.from(container.querySelectorAll('button')).find((el) => el.textContent === 'Enable') as HTMLButtonElement).click();
        });

        const addSyncButton = container.querySelector('button[title="Add Sync Vault Profile"]') as HTMLButtonElement;
        await act(async () => {
            addSyncButton.click();
        });

        expect(container.textContent).toContain('Add Sync Vault Profile');
        expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'secrets/enableSecret' }));
    });
});
