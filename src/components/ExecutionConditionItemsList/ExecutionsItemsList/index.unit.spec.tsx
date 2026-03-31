import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRoot, Root } from 'react-dom/client';

import ExecutionsItemsList from './index';
import { ExecutionType } from 'types/openapi';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

const useSelectorMock = vi.fn();
let availableFiltersMock: any[] = [];
let platformEnumsMock: any = {};
let isFetchingFiltersMock = false;
let isFetchingConditionDetailsMock = false;

vi.mock('react-redux', () => ({
    useSelector: (selector: any) => useSelectorMock(selector),
}));

vi.mock('ducks/enums', () => ({
    selectors: {
        platformEnum: () => () => ({ meta: { label: 'Meta' } }),
        platformEnums: () => platformEnumsMock,
    },
    getEnumLabel: (platformEnum: any, key: string) => platformEnum?.[key]?.label ?? key,
}));

vi.mock('ducks/filters', () => ({
    EntityType: { ACTIONS: 'ACTIONS' },
    selectors: {
        availableFilters: () => () => availableFiltersMock,
        isFetchingFilters: () => () => isFetchingFiltersMock,
    },
}));

vi.mock('ducks/rules', () => ({
    selectors: {
        isFetchingConditionDetails: () => isFetchingConditionDetailsMock,
    },
}));

vi.mock('components/Spinner', () => ({
    default: ({ active }: { active: boolean }) => (active ? <div data-testid="spinner">loading</div> : null),
}));

vi.mock('components/Badge', () => ({
    default: ({ children }: any) => <span data-testid="badge">{children}</span>,
}));

vi.mock('components/Button', () => ({
    default: ({ title, onClick, children }: any) => (
        <button title={title} onClick={onClick}>
            {children || title}
        </button>
    ),
}));

vi.mock('components/icons/EditIcon', () => ({
    default: () => <span>Edit</span>,
}));

describe('ExecutionsItemsList unit', () => {
    let container: HTMLDivElement;
    let root: Root;

    beforeEach(() => {
        availableFiltersMock = [];
        platformEnumsMock = {};
        isFetchingFiltersMock = false;
        isFetchingConditionDetailsMock = false;
        useSelectorMock.mockImplementation((selector: any) => selector({}));
        container = document.createElement('div');
        document.body.appendChild(container);
        root = createRoot(container);
    });

    it('renders edit button and calls callback when provided', async () => {
        const onEditExecutionItems = vi.fn();

        await act(async () => {
            root.render(
                <ExecutionsItemsList
                    executionUuid="exec-1"
                    executionName="Execution One"
                    executionType={ExecutionType.SetField}
                    executionItems={[{ fieldSource: 'meta', fieldIdentifier: 'status', data: 'active' } as any]}
                    onEditExecutionItems={onEditExecutionItems}
                />,
            );
        });

        const editButton = container.querySelector('button[title="Edit Execution Items"]') as HTMLButtonElement;
        expect(editButton).toBeTruthy();

        await act(async () => {
            editButton.click();
        });

        expect(onEditExecutionItems).toHaveBeenCalledTimes(1);
    });

    it('does not render edit button when callback is not provided', async () => {
        await act(async () => {
            root.render(
                <ExecutionsItemsList
                    executionUuid="exec-1"
                    executionName="Execution One"
                    executionType={ExecutionType.SetField}
                    executionItems={[{ fieldSource: 'meta', fieldIdentifier: 'status', data: 'active' } as any]}
                />,
            );
        });

        expect(container.querySelector('button[title="Edit Execution Items"]')).toBeNull();
    });

    it('renders spinner while data is loading', async () => {
        isFetchingFiltersMock = true;
        isFetchingConditionDetailsMock = true;

        await act(async () => {
            root.render(
                <ExecutionsItemsList
                    executionUuid="exec-1"
                    executionName="Execution One"
                    executionType={ExecutionType.SetField}
                    executionItems={[]}
                />,
            );
        });

        expect(container.querySelector('[data-testid="spinner"]')).toBeTruthy();
    });

    it('renders set-field badges for string, boolean and list values', async () => {
        availableFiltersMock = [
            {
                filterFieldSource: 'meta',
                searchFieldData: [
                    { fieldIdentifier: 'status', fieldLabel: 'Status', type: 'string' },
                    { fieldIdentifier: 'enabled', fieldLabel: 'Enabled', type: 'boolean' },
                    {
                        fieldIdentifier: 'kind',
                        fieldLabel: 'Kind',
                        type: 'list',
                        value: [
                            { uuid: 'k1', name: 'Kind One' },
                            { uuid: 'k2', name: 'Kind Two' },
                        ],
                    },
                ],
            },
        ];

        await act(async () => {
            root.render(
                <ExecutionsItemsList
                    executionUuid="exec-1"
                    executionName="Execution One"
                    executionType={ExecutionType.SetField}
                    executionItems={
                        [
                            { fieldSource: 'meta', fieldIdentifier: 'status', data: 'active' },
                            { fieldSource: 'meta', fieldIdentifier: 'enabled', data: true },
                            { fieldSource: 'meta', fieldIdentifier: 'kind', data: ['k1', 'k2'] },
                        ] as any
                    }
                />,
            );
        });

        expect(container.textContent).toContain("'Status'");
        expect(container.textContent).toContain("'True'");
        expect(container.textContent).toContain('Kind One, Kind Two');
    });

    it('renders smaller badges variant for set-field type', async () => {
        availableFiltersMock = [
            {
                filterFieldSource: 'meta',
                searchFieldData: [{ fieldIdentifier: 'status', fieldLabel: 'Status', type: 'string' }],
            },
        ];

        await act(async () => {
            root.render(
                <ExecutionsItemsList
                    executionUuid="exec-1"
                    executionName="Execution One"
                    executionType={ExecutionType.SetField}
                    smallerBadges
                    executionItems={[{ fieldSource: 'meta', fieldIdentifier: 'status', data: 'active' } as any]}
                />,
            );
        });

        expect(container.textContent).toContain("Execution One's Execution Items");
        expect(container.textContent).toContain("'Status'");
    });

    it('renders send-notification badges for default and smaller variants', async () => {
        await act(async () => {
            root.render(
                <ExecutionsItemsList
                    executionUuid="exec-2"
                    executionName="Execution Notify"
                    executionType={ExecutionType.SendNotification}
                    executionItems={[{ notificationProfileUuid: 'np-1', notificationProfileName: 'Ops Team' } as any]}
                />,
            );
        });

        expect(container.textContent).toContain('Send notifications to:');
        expect(container.textContent).toContain('Ops Team');

        await act(async () => {
            root.render(
                <ExecutionsItemsList
                    executionUuid="exec-2"
                    executionName="Execution Notify"
                    executionType={ExecutionType.SendNotification}
                    smallerBadges
                    executionItems={[{ notificationProfileUuid: 'np-1', notificationProfileName: 'Ops Team' } as any]}
                />,
            );
        });

        expect(container.textContent).toContain("Execution Notify's Execution Items");
        expect(container.textContent).toContain('Ops Team');
    });
});
