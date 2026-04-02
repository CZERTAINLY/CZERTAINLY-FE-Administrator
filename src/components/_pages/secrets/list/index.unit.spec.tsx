import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRoot, Root } from 'react-dom/client';

import SecretsList from './index';
import { EntityType } from 'ducks/filters';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

const useDispatchMock = vi.fn();
const useSelectorMock = vi.fn();

vi.mock('react-redux', () => ({
    useDispatch: () => useDispatchMock(),
    useSelector: (selector: any) => useSelectorMock(selector),
}));

vi.mock('react-router', () => ({
    Link: ({ to, children }: any) => <a href={to}>{children}</a>,
}));

vi.mock('components/Badge', () => ({
    default: ({ children }: any) => <span>{children}</span>,
}));

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

vi.mock('components/Dialog', () => ({
    default: ({ isOpen, caption, body, buttons, toggle }: any) =>
        isOpen ? (
            <div data-testid="dialog">
                <div>{caption}</div>
                <div>{body}</div>
                <button onClick={toggle}>toggle</button>
                {(buttons || []).map((button: any, i: number) => (
                    <button key={i} onClick={button.onClick} disabled={button.disabled}>
                        {button.body}
                    </button>
                ))}
            </div>
        ) : null,
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

                if (id === 'secret-vault-profile') {
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

vi.mock('components/Container', () => ({
    default: ({ children }: any) => <div>{children}</div>,
}));

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

        const enableButton = container.querySelector('button[title="Enable selected Secrets"]') as HTMLButtonElement;
        await act(async () => {
            enableButton.click();
        });

        const enableConfirm = Array.from(container.querySelectorAll('button')).find(
            (el) => el.textContent === 'Enable',
        ) as HTMLButtonElement;
        await act(async () => {
            enableConfirm.click();
        });

        const disableButton = container.querySelector('button[title="Disable selected Secrets"]') as HTMLButtonElement;
        await act(async () => {
            disableButton.click();
        });

        const disableConfirm = Array.from(container.querySelectorAll('button')).find(
            (el) => el.textContent === 'Disable',
        ) as HTMLButtonElement;
        await act(async () => {
            disableConfirm.click();
        });

        const deleteButton = container.querySelector('button[title="Delete Selected"]') as HTMLButtonElement;
        await act(async () => {
            deleteButton.click();
        });

        expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'secrets/enableSecret' }));
        expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'secrets/disableSecret' }));
        expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'secrets/deleteSecret' }));
    });

    it('dispatches owner, groups and vault profile override actions', async () => {
        await act(async () => {
            root.render(<SecretsList />);
        });

        const ownerButton = container.querySelector('button[title="Override Owner"]') as HTMLButtonElement;
        await act(async () => {
            ownerButton.click();
        });
        await act(async () => {
            (container.querySelector('[data-testid="select-secret-owner"]') as HTMLButtonElement).click();
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

        const groupsButton = container.querySelector('button[title="Override Groups"]') as HTMLButtonElement;
        await act(async () => {
            groupsButton.click();
        });
        await act(async () => {
            (container.querySelector('[data-testid="select-secret-groups-update"]') as HTMLButtonElement).click();
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

        const vaultProfileButton = container.querySelector('button[title="Override Source Vault Profile"]') as HTMLButtonElement;
        await act(async () => {
            vaultProfileButton.click();
        });
        await act(async () => {
            (container.querySelector('[data-testid="select-secret-vault-profile"]') as HTMLButtonElement).click();
        });
        await act(async () => {
            (Array.from(container.querySelectorAll('button')).find((el) => el.textContent === 'Update') as HTMLButtonElement).click();
        });

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
