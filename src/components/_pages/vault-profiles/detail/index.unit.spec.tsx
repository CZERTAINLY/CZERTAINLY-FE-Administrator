import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRoot, Root } from 'react-dom/client';

import VaultProfileDetail from './index';
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
    useParams: () => ({ vaultUuid: 'vault-1', id: 'vp-1' }),
}));

vi.mock('components/Breadcrumb', () => ({
    default: ({ items }: any) => <div data-testid="breadcrumb">{items?.[1]?.label}</div>,
}));

vi.mock('components/Container', () => ({
    default: ({ children }: any) => <div>{children}</div>,
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
                    {(row.columns || []).map((col: any, i: number) => (
                        <div key={i}>{col}</div>
                    ))}
                </div>
            ))}
        </div>
    ),
}));

vi.mock('components/WidgetButtons', () => ({
    default: ({ buttons }: any) => (
        <div>
            {(buttons || []).map((button: any, index: number) => (
                <button key={index} title={button.tooltip} onClick={button.onClick}>
                    {button.icon}
                </button>
            ))}
        </div>
    ),
}));

vi.mock('components/Attributes/AttributeViewer', () => ({
    default: () => <div data-testid="attributes">attributes</div>,
}));

vi.mock('components/Attributes/CustomAttributeWidget', () => ({
    default: () => <div data-testid="custom-attributes">custom-attributes</div>,
}));

vi.mock('components/Badge', () => ({
    default: ({ children }: any) => <span>{children}</span>,
}));

vi.mock('../edit-form', () => ({
    default: () => <div data-testid="edit-form">edit-form</div>,
}));

vi.mock('../AssociateComplianceProfileDialogBody', () => ({
    default: () => <div data-testid="associate-compliance-dialog-body">associate-compliance-dialog-body</div>,
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

describe('VaultProfileDetail compliance integration', () => {
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
            vaultProfiles: {
                vaultProfile: {
                    uuid: 'vp-1',
                    name: 'Vault Profile One',
                    description: 'desc',
                    enabled: true,
                    vaultInstance: { uuid: 'vault-1', name: 'Vault One' },
                    attributes: [],
                    customAttributes: [],
                },
                isFetchingDetail: false,
                isEnabling: false,
                isDisabling: false,
                isDeleting: false,
            },
            complianceProfiles: {
                associatedComplianceProfiles: [{ uuid: 'cp-1', name: 'Compliance A', description: 'A' }],
                isFetchingAssociatedComplianceProfiles: false,
            },
            enums: {
                platformEnums: {
                    [PlatformEnum.Resource]: {
                        [Resource.VaultProfiles]: { label: 'Vault Profiles' },
                    },
                },
            },
        } as any;

        useSelectorMock.mockImplementation((selector: any) => selector(state));
    });

    it('dispatches compliance check action when check is confirmed', async () => {
        await act(async () => {
            root.render(<VaultProfileDetail />);
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
                payload: { resource: Resource.VaultProfiles, objectUuid: 'vp-1' },
            }),
        );
    });

    it('dispatches dissociate compliance profile action from compliance widget row', async () => {
        await act(async () => {
            root.render(<VaultProfileDetail />);
        });

        const removeButton = container.querySelector('button[title="Remove"]') as HTMLButtonElement;
        await act(async () => {
            removeButton.click();
        });

        expect(dispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'complianceProfiles/dissociateComplianceProfile',
                payload: {
                    uuid: 'cp-1',
                    resource: Resource.VaultProfiles,
                    associationObjectUuid: 'vp-1',
                },
            }),
        );
    });

    it('dispatches initial detail and associated compliance profile fetch actions', async () => {
        await act(async () => {
            root.render(<VaultProfileDetail />);
        });

        expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'vaultProfiles/resetState' }));
        expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'vaultProfiles/getVaultProfileDetail' }));
        expect(dispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'complianceProfiles/getAssociatedComplianceProfiles',
                payload: {
                    resource: Resource.VaultProfiles,
                    associationObjectUuid: 'vp-1',
                },
            }),
        );
    });

    it('opens associate and edit dialogs and dispatches disable and delete actions', async () => {
        await act(async () => {
            root.render(<VaultProfileDetail />);
        });

        const associateButton = container.querySelector('button[title="Associate Compliance Profile"]') as HTMLButtonElement;
        await act(async () => {
            associateButton.click();
        });

        expect(container.textContent).toContain('Associate Compliance Profile');

        const editButton = container.querySelector('button[title="Edit"]') as HTMLButtonElement;
        await act(async () => {
            editButton.click();
        });

        expect(container.textContent).toContain('Edit Vault Profile');

        const disableButton = container.querySelector('button[title="Disable"]') as HTMLButtonElement;
        await act(async () => {
            disableButton.click();
        });

        const deleteButton = container.querySelector('button[title="Delete"]') as HTMLButtonElement;
        await act(async () => {
            deleteButton.click();
        });
        await act(async () => {
            (Array.from(container.querySelectorAll('button')).find((el) => el.textContent === 'Delete') as HTMLButtonElement).click();
        });

        expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'vaultProfiles/disableVaultProfile' }));
        expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'vaultProfiles/deleteVaultProfile' }));
    });

    it('dispatches enable action when profile is disabled', async () => {
        state.vaultProfiles.vaultProfile.enabled = false;

        await act(async () => {
            root.render(<VaultProfileDetail />);
        });

        const enableButton = container.querySelector('button[title="Enable"]') as HTMLButtonElement;
        await act(async () => {
            enableButton.click();
        });

        expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'vaultProfiles/enableVaultProfile' }));
    });
});
