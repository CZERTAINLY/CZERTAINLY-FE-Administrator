import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRoot, Root } from 'react-dom/client';

import SecretsList from './index';
import { EntityType } from 'ducks/filters';
import { COMMON_GROUPS_STATE, COMMON_USERS_STATE, COMMON_VAULT_PROFILES_STATE } from '../../test-utils/mockModules';
import { clickByTestId, clickByText, clickByTitle } from '../../test-utils/domActions';

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
    return routerLinkMockModule();
});

vi.mock('components/Badge', async () => {
    const { badgeMockModule } = await import('../../test-utils/mockModules');
    return badgeMockModule();
});

vi.mock('components/_pages/certificates/CertificateStatus', () => ({
    default: ({ status }: any) => <span data-testid="compliance-status">{status}</span>,
}));

vi.mock('components/PagedList/PagedList', () => ({
    default: ({ headers, data, additionalButtons, onDeleteCallback }: any) => (
        <div>
            <div data-testid="headers">{headers.map((h: any) => h.content).join('|')}</div>
            <div data-testid="rows">
                {(data || []).map((row: any) => (
                    <div key={row.id} data-testid={`row-${row.id}`}>
                        {(row.columns || []).map((column: any, index: number) => (
                            <span key={index}>{column}</span>
                        ))}
                    </div>
                ))}
            </div>
            {(additionalButtons || []).map((button: any, index: number) => (
                <button key={index} title={button.tooltip} onClick={button.onClick} disabled={button.disabled}>
                    {button.icon}
                </button>
            ))}
            <button title="Delete Selected" onClick={() => onDeleteCallback(['sec-1'])}>
                delete-selected
            </button>
        </div>
    ),
}));

vi.mock('components/Dialog', async () => {
    const { dialogMockModule } = await import('../../test-utils/mockModules');
    return dialogMockModule();
});

vi.mock('components/Select', async () => {
    const { createSelectMockModule } = await import('../../test-utils/mockModules');
    return createSelectMockModule({ 'secret-vault-profile': 'vp-2' });
});

vi.mock('components/Container', async () => {
    const { containerMockModule } = await import('../../test-utils/mockModules');
    return containerMockModule();
});

vi.mock('../form', () => ({
    default: () => <div data-testid="secret-form">form</div>,
}));

vi.mock('../SecretStateBadge', () => ({
    default: ({ children }: any) => <span>{children}</span>,
}));

describe('SecretsList compliance integration', () => {
    let container: HTMLDivElement;
    let root: Root;
    let dispatch: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        root = createRoot(container);

        dispatch = vi.fn();
        useDispatchMock.mockReturnValue(dispatch);

        const state = {
            secrets: {
                secrets: [
                    {
                        uuid: 'sec-1',
                        name: 'Secret One',
                        type: 'password',
                        state: 'active',
                        enabled: true,
                        complianceStatus: 'ok',
                        sourceVaultProfile: { uuid: 'vp-1', name: 'Vault Profile One' },
                        version: 1,
                        owner: { uuid: 'owner-1', name: 'Owner 1' },
                        groups: [],
                    },
                ],
                isFetchingList: false,
                isDeleting: false,
                isUpdating: false,
            },
            pagings: {
                pagings: [
                    {
                        entity: EntityType.SECRET,
                        paging: {
                            checkedRows: ['sec-1'],
                            pageNumber: 1,
                            pageSize: 10,
                            totalItems: 1,
                            isFetchingList: false,
                        },
                    },
                ],
            },
            enums: {
                platformEnums: {
                    SecretType: { password: { label: 'Password' } },
                    SecretState: { active: { label: 'Active' } },
                },
            },
            users: COMMON_USERS_STATE,
            certificateGroups: COMMON_GROUPS_STATE,
            vaultProfiles: COMMON_VAULT_PROFILES_STATE,
        } as any;

        useSelectorMock.mockImplementation((selector: any) => selector(state));
    });

    it('shows Compliance column and renders compliance status cell', async () => {
        await act(async () => {
            root.render(<SecretsList />);
        });

        expect(container.querySelector('[data-testid="headers"]')?.textContent).toContain('Compliance');
        expect(container.querySelector('[data-testid="row-sec-1"]')?.textContent).toContain('ok');
        expect(container.querySelector('[data-testid="row-sec-1"]')?.textContent).toContain('Vault Profile One');
    });

    it('dispatches enable, disable and delete actions for selected secrets', async () => {
        await act(async () => {
            root.render(<SecretsList />);
        });

        await clickByTitle(container, 'Enable selected Secrets');
        await clickByText(container, 'Enable');
        await clickByTitle(container, 'Disable selected Secrets');
        await clickByText(container, 'Disable');
        await clickByTitle(container, 'Delete Selected');

        expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'secrets/enableSecret' }));
        expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'secrets/disableSecret' }));
        expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'secrets/deleteSecret' }));
    });

    it('dispatches owner, groups and vault profile override actions', async () => {
        await act(async () => {
            root.render(<SecretsList />);
        });

        await clickByTitle(container, 'Override Owner');
        await clickByTestId(container, 'select-secret-owner');
        await clickByText(container, 'Update');

        await clickByTitle(container, 'Override Owner');
        await clickByText(container, 'Remove');

        await clickByTitle(container, 'Override Groups');
        await clickByTestId(container, 'select-secret-groups-update');
        await clickByText(container, 'Update');

        await clickByTitle(container, 'Override Groups');
        await clickByText(container, 'Clear');

        await clickByTitle(container, 'Override Source Vault Profile');
        await clickByTestId(container, 'select-secret-vault-profile');
        await clickByText(container, 'Update');

        expect(dispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'secrets/updateSecretObjects',
                payload: {
                    uuid: 'sec-1',
                    update: { ownerUuid: 'user-1' },
                },
            }),
        );
        expect(dispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'secrets/updateSecretObjects',
                payload: {
                    uuid: 'sec-1',
                    update: { ownerUuid: '' },
                },
            }),
        );
        expect(dispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'secrets/updateSecretObjects',
                payload: {
                    uuid: 'sec-1',
                    update: { groupUuids: ['group-1'] },
                },
            }),
        );
        expect(dispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'secrets/updateSecretObjects',
                payload: {
                    uuid: 'sec-1',
                    update: { groupUuids: [] },
                },
            }),
        );
        expect(dispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'secrets/updateSecretObjects',
                payload: {
                    uuid: 'sec-1',
                    update: { sourceVaultProfileUuid: 'vp-2' },
                },
            }),
        );
    });
});
