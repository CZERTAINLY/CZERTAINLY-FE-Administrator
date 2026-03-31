import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRoot, Root } from 'react-dom/client';

import RuleDetails from './index';
import { PlatformEnum } from 'types/openapi';
import { initialState as rulesInitialState } from 'ducks/rules';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

const useDispatchMock = vi.fn();
const useSelectorMock = vi.fn();

vi.mock('react-redux', () => ({
    useDispatch: () => useDispatchMock(),
    useSelector: (selector: any) => useSelectorMock(selector),
}));

vi.mock('react-router', () => ({
    Link: ({ children, to }: any) => <a href={to}>{children}</a>,
    useParams: () => ({ id: 'action-1' }),
}));

vi.mock('components/Breadcrumb', () => ({
    default: ({ items }: any) => <div data-testid="breadcrumb">{items?.[1]?.label}</div>,
}));

vi.mock('components/Container', () => ({
    default: ({ children }: any) => <div data-testid="container">{children}</div>,
}));

vi.mock('components/Widget', () => ({
    default: ({ title, widgetButtons, children }: any) => (
        <div data-testid={`widget-${title}`}>
            <h3>{title}</h3>
            {(widgetButtons || []).map((button: any, index: number) => (
                <button
                    key={`${button.icon}-${index}`}
                    data-testid={`widget-btn-${button.icon}-${index}`}
                    onClick={button.onClick}
                    disabled={button.disabled}
                >
                    {button.icon}
                </button>
            ))}
            {children}
        </div>
    ),
}));

vi.mock('components/TextInput', () => ({
    default: ({ value, onChange, placeholder }: any) => (
        <div>
            <input value={value ?? ''} placeholder={placeholder} onChange={(e) => onChange((e.target as HTMLInputElement).value)} />
            <button data-testid="set-text-input-value" onClick={() => onChange('Updated action description')}>
                set-text
            </button>
        </div>
    ),
}));

vi.mock('components/Button', () => ({
    default: ({ title, onClick, disabled, children }: any) => (
        <button title={title} onClick={onClick} disabled={disabled}>
            {children || title || 'button'}
        </button>
    ),
}));

vi.mock('components/icons/EditIcon', () => ({
    default: () => <span>Edit</span>,
}));

vi.mock('components/CustomTable', () => ({
    default: ({ data, newRowWidgetProps }: any) => (
        <div>
            {(data || []).map((row: any) => (
                <div data-testid={`row-${row.id}`} key={row.id}>
                    {(row.columns || []).map((column: any, index: number) => (
                        <div key={index}>{column}</div>
                    ))}
                </div>
            ))}
            {newRowWidgetProps && (
                <button
                    data-testid="add-execution"
                    onClick={() => newRowWidgetProps.onAddClick([{ value: 'exec-new', label: 'Execution New' }])}
                >
                    add
                </button>
            )}
        </div>
    ),
}));

vi.mock('components/Dialog', () => ({
    default: ({ isOpen, caption, body, buttons, toggle }: any) =>
        isOpen ? (
            <div data-testid="dialog">
                <div data-testid="dialog-caption">{caption}</div>
                <div data-testid="dialog-body">{body}</div>
                <button data-testid="dialog-toggle" onClick={toggle}>
                    toggle
                </button>
                {(buttons || []).map((button: any, i: number) => (
                    <button data-testid={`dialog-btn-${i}`} key={i} onClick={() => button.onClick()}>
                        {button.body}
                    </button>
                ))}
            </div>
        ) : null,
}));

vi.mock('components/ExecutionConditionItemsList', () => ({
    default: ({ actionExecutions, onEditExecutionItems }: any) => (
        <div>
            {(actionExecutions || []).map((execution: any) => (
                <button
                    key={execution.uuid}
                    data-testid={`edit-execution-${execution.uuid}`}
                    onClick={() => onEditExecutionItems?.(execution.uuid)}
                >
                    edit {execution.name}
                </button>
            ))}
        </div>
    ),
}));

vi.mock('components/FilterWidgetRuleAction', () => ({
    default: ({ ExecutionsList, onActionsUpdate }: any) => (
        <div>
            <span data-testid="fwra-count">{(ExecutionsList || []).length}</span>
            <button
                data-testid="fwra-save"
                onClick={() =>
                    onActionsUpdate?.([
                        {
                            fieldSource: 'meta',
                            fieldIdentifier: 'status',
                            data: 'updated',
                        },
                    ])
                }
            >
                save-fwra
            </button>
        </div>
    ),
}));

vi.mock('components/_pages/executions/SendNotificationExecutionItems', () => ({
    SendNotificationExecutionItems: ({ notificationProfileItems, onNotificationProfileItemsChange }: any) => (
        <div>
            <span data-testid="send-count">{(notificationProfileItems || []).length}</span>
            <button data-testid="send-save" onClick={() => onNotificationProfileItemsChange?.([{ label: 'Profile 1', value: 'np-1' }])}>
                save-send
            </button>
        </div>
    ),
}));

describe('Action details unit', () => {
    let container: HTMLDivElement;
    let root: Root;
    let dispatch: ReturnType<typeof vi.fn>;
    let mockState: any;

    const render = async () => {
        await act(async () => {
            root.render(<RuleDetails />);
        });
    };

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        root = createRoot(container);

        dispatch = vi.fn();
        useDispatchMock.mockReturnValue(dispatch);

        mockState = {
            rules: {
                ...rulesInitialState,
                isFetchingActionDetails: false,
                isUpdatingAction: false,
                isUpdatingExecution: false,
                actionDetails: {
                    uuid: 'action-1',
                    name: 'Action One',
                    resource: 'actions',
                    description: 'Initial description',
                    executions: [
                        {
                            uuid: 'exec-set',
                            name: 'Exec Set',
                            type: 'setField',
                            description: 'set description',
                            items: [{ fieldSource: 'meta', fieldIdentifier: 'status', data: 'old' }],
                        },
                        {
                            uuid: 'exec-send',
                            name: 'Exec Send',
                            type: 'sendNotification',
                            description: 'send description',
                            items: [{ notificationProfileUuid: 'np-old', notificationProfileName: 'Old Profile' }],
                        },
                    ],
                },
                executions: [
                    { uuid: 'exec-set', name: 'Exec Set' },
                    { uuid: 'exec-send', name: 'Exec Send' },
                    { uuid: 'exec-new', name: 'Exec New' },
                ],
            },
            enums: {
                platformEnums: {
                    [PlatformEnum.Resource]: {
                        actions: { label: 'Actions' },
                    },
                    [PlatformEnum.ExecutionType]: {
                        setField: { label: 'Set Field' },
                        sendNotification: { label: 'Send Notification' },
                    },
                },
            },
        };

        useSelectorMock.mockImplementation((selector: any) => selector(mockState));
    });

    it('opens set-field execution editor and dispatches updateExecution on save', async () => {
        await render();

        const editSetButton = container.querySelector('[data-testid="edit-execution-exec-set"]') as HTMLButtonElement;
        await act(async () => {
            editSetButton.click();
        });

        expect(container.querySelector('[data-testid="dialog-caption"]')?.textContent).toContain('Edit Execution Items - Exec Set');
        expect(container.querySelector('[data-testid="fwra-count"]')?.textContent).toBe('1');

        const saveButton = container.querySelector('[data-testid="fwra-save"]') as HTMLButtonElement;
        await act(async () => {
            saveButton.click();
        });

        const updateExecutionActions = dispatch.mock.calls
            .map((call) => call[0])
            .filter((action) => action?.type === 'rules/updateExecution');

        expect(updateExecutionActions.length).toBeGreaterThan(0);
        expect(updateExecutionActions.at(-1)).toEqual(
            expect.objectContaining({
                payload: expect.objectContaining({
                    executionUuid: 'exec-set',
                    execution: expect.objectContaining({
                        description: 'set description',
                        items: [{ fieldSource: 'meta', fieldIdentifier: 'status', data: 'updated' }],
                    }),
                }),
            }),
        );
    });

    it('opens send-notification editor and dispatches updateExecution with mapped uuids', async () => {
        await render();

        const editSendButton = container.querySelector('[data-testid="edit-execution-exec-send"]') as HTMLButtonElement;
        await act(async () => {
            editSendButton.click();
        });

        expect(container.querySelector('[data-testid="dialog-caption"]')?.textContent).toContain('Edit Execution Items - Exec Send');
        expect(container.querySelector('[data-testid="send-count"]')?.textContent).toBe('1');

        const saveButton = container.querySelector('[data-testid="send-save"]') as HTMLButtonElement;
        await act(async () => {
            saveButton.click();
        });

        const updateExecutionActions = dispatch.mock.calls
            .map((call) => call[0])
            .filter((action) => action?.type === 'rules/updateExecution');

        expect(updateExecutionActions.at(-1)).toEqual(
            expect.objectContaining({
                payload: expect.objectContaining({
                    executionUuid: 'exec-send',
                    execution: expect.objectContaining({
                        items: [{ notificationProfileUuid: 'np-1' }],
                    }),
                }),
            }),
        );
    });

    it('closes execution editor dialog by close button', async () => {
        await render();

        const editSetButton = container.querySelector('[data-testid="edit-execution-exec-set"]') as HTMLButtonElement;
        await act(async () => {
            editSetButton.click();
        });

        expect(container.querySelector('[data-testid="dialog"]')).toBeTruthy();

        const closeButton = container.querySelector('[data-testid="dialog-btn-0"]') as HTMLButtonElement;
        await act(async () => {
            closeButton.click();
        });

        expect(container.querySelector('[data-testid="dialog"]')).toBeNull();
    });

    it('updates action description through description edit controls', async () => {
        mockState.rules.actionDetails.description = '';
        await render();

        const updateDescriptionButton = container.querySelector('button[title="Update Description"]') as HTMLButtonElement;
        await act(async () => {
            updateDescriptionButton.click();
        });

        const input = container.querySelector('input[placeholder="Enter Description"]') as HTMLInputElement;
        await act(async () => {
            input.value = 'Updated action description';
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        });

        const setTextButton = container.querySelector('[data-testid="set-text-input-value"]') as HTMLButtonElement;
        await act(async () => {
            setTextButton.click();
        });

        const confirmButton = container.querySelector('button[title="Update Description"]') as HTMLButtonElement;
        await act(async () => {
            confirmButton.click();
        });

        const updateActionActions = dispatch.mock.calls.map((call) => call[0]).filter((action) => action?.type === 'rules/updateAction');
        expect(updateActionActions.at(-1)).toEqual(
            expect.objectContaining({
                payload: expect.objectContaining({
                    actionUuid: 'action-1',
                    action: expect.objectContaining({ description: 'Updated action description' }),
                }),
            }),
        );
    });

    it('adds execution uuid to action when add row callback is triggered', async () => {
        await render();

        const addButton = container.querySelector('[data-testid="add-execution"]') as HTMLButtonElement;
        await act(async () => {
            addButton.click();
        });

        const updateActionActions = dispatch.mock.calls.map((call) => call[0]).filter((action) => action?.type === 'rules/updateAction');

        expect(updateActionActions.at(-1)).toEqual(
            expect.objectContaining({
                payload: expect.objectContaining({
                    action: expect.objectContaining({
                        executionsUuids: ['exec-set', 'exec-send', 'exec-new'],
                    }),
                }),
            }),
        );
    });

    it('deletes selected execution from action list', async () => {
        await render();

        const deleteExecutionButton = container.querySelector('button[title*="Delete"]') as HTMLButtonElement;
        expect(deleteExecutionButton).toBeTruthy();
        await act(async () => {
            deleteExecutionButton.click();
        });

        const updateActionActions = dispatch.mock.calls.map((call) => call[0]).filter((action) => action?.type === 'rules/updateAction');

        expect(updateActionActions.at(-1)).toEqual(
            expect.objectContaining({
                payload: expect.objectContaining({
                    action: expect.objectContaining({ executionsUuids: ['exec-send'] }),
                }),
            }),
        );
    });

    it('confirms action deletion from delete dialog', async () => {
        await render();

        const deleteWidgetButton = container.querySelector('[data-testid="widget-btn-trash-0"]') as HTMLButtonElement;
        await act(async () => {
            deleteWidgetButton.click();
        });

        expect(container.querySelector('[data-testid="dialog-caption"]')?.textContent).toContain('Delete an Action');

        const confirmDeleteButton = Array.from(container.querySelectorAll('[data-testid^="dialog-btn-"]')).find((btn) =>
            (btn as HTMLButtonElement).textContent?.includes('Delete'),
        ) as HTMLButtonElement;

        await act(async () => {
            confirmDeleteButton.click();
        });

        const deleteActionActions = dispatch.mock.calls.map((call) => call[0]).filter((action) => action?.type === 'rules/deleteAction');
        expect(deleteActionActions.at(-1)).toEqual(expect.objectContaining({ payload: { actionUuid: 'action-1' } }));
    });
});
