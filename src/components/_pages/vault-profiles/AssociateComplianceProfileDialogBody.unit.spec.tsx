import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRoot, type Root } from 'react-dom/client';

import AssociateComplianceProfileDialogBody from './AssociateComplianceProfileDialogBody';
import { Resource } from 'types/openapi';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

const useDispatchMock = vi.fn();
const useSelectorMock = vi.fn();

vi.mock('react-redux', () => ({
    useDispatch: () => useDispatchMock(),
    useSelector: (selector: any) => useSelectorMock(selector),
}));

vi.mock('components/Spinner', () => ({
    default: ({ active }: any) => (active ? <div data-testid="spinner">loading</div> : null),
}));

vi.mock('components/Container', () => ({
    default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('components/Label', () => ({
    default: ({ children }: any) => <label>{children}</label>,
}));

vi.mock('components/Button', () => ({
    default: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock('components/Select', () => ({
    default: ({ onChange }: any) => (
        <button data-testid="select-compliance-profile" onClick={() => onChange('cp-2')}>
            select
        </button>
    ),
}));

describe('AssociateComplianceProfileDialogBody', () => {
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
            complianceProfiles: {
                complianceProfiles: [
                    { uuid: 'cp-1', name: 'Compliance 1' },
                    { uuid: 'cp-2', name: 'Compliance 2' },
                ],
                isFetchingList: false,
            },
        } as any;

        useSelectorMock.mockImplementation((selector: any) => selector(state));
    });

    it('dispatches association action for selected compliance profile and vault profile resource object', async () => {
        await act(async () => {
            root.render(
                <AssociateComplianceProfileDialogBody
                    visible
                    onClose={() => {}}
                    resource={Resource.VaultProfiles}
                    resourceObject={{ uuid: 'vp-1', name: 'Vault Profile One' }}
                    availableComplianceProfileUuids={['cp-1']}
                />,
            );
        });

        const selectButton = container.querySelector('[data-testid="select-compliance-profile"]') as HTMLButtonElement;
        await act(async () => {
            selectButton.click();
        });

        const associateButton = Array.from(container.querySelectorAll('button')).find(
            (el) => el.textContent === 'Associate',
        ) as HTMLButtonElement;
        await act(async () => {
            associateButton.click();
        });

        expect(dispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'complianceProfiles/associateComplianceProfile',
                payload: {
                    uuid: 'cp-2',
                    resource: Resource.VaultProfiles,
                    associationObjectUuid: 'vp-1',
                    associationObjectName: 'Vault Profile One',
                },
            }),
        );
    });
});
