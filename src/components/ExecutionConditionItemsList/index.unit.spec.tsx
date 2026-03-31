import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRoot, Root } from 'react-dom/client';

import ConditionsExecutionsList from './index';
import { ExecutionType } from 'types/openapi';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

const useSelectorMock = vi.fn();
let isFetchingFilters = false;

vi.mock('react-redux', () => ({
    useDispatch: () => vi.fn(),
    useSelector: (selector: any) => useSelectorMock(selector),
}));

vi.mock('ducks/filters', () => ({
    EntityType: { CONDITIONS: 'CONDITIONS', ACTIONS: 'ACTIONS' },
    actions: {
        getAvailableFilters: (payload: any) => ({ type: 'filters/getAvailableFilters', payload }),
    },
    selectors: {
        isFetchingFilters: () => () => isFetchingFilters,
    },
}));

vi.mock('ducks/rules', () => ({
    selectors: {
        isFetchingRuleDetails: () => false,
        isFetchingActionDetails: () => false,
    },
}));

vi.mock('components/Widget', () => ({
    default: ({ title, children }: any) => (
        <div>
            <h3 data-testid="widget-title">{title}</h3>
            {children}
        </div>
    ),
}));

vi.mock('components/Spinner', () => ({
    default: ({ active }: { active: boolean }) => (active ? <div data-testid="spinner">loading</div> : null),
}));

vi.mock('./ConditionsItemsList', () => ({
    default: ({ conditionName }: any) => <div data-testid="condition-item">{conditionName}</div>,
}));

vi.mock('./ExecutionsItemsList', () => ({
    default: ({ executionUuid, onEditExecutionItems }: any) => (
        <button data-testid={`edit-${executionUuid}`} onClick={onEditExecutionItems}>
            edit
        </button>
    ),
}));

describe('ConditionsExecutionsList unit', () => {
    let container: HTMLDivElement;
    let root: Root;

    beforeEach(() => {
        isFetchingFilters = false;
        useSelectorMock.mockImplementation((selector: any) => selector({}));
        container = document.createElement('div');
        document.body.appendChild(container);
        root = createRoot(container);
    });

    it('passes execution uuid through onEditExecutionItems callback', async () => {
        const onEditExecutionItems = vi.fn();

        await act(async () => {
            root.render(
                <ConditionsExecutionsList
                    listType="executionItems"
                    actionExecutions={[
                        { uuid: 'exec-1', name: 'Exec 1', type: ExecutionType.SetField, items: [] } as any,
                        { uuid: 'exec-2', name: 'Exec 2', type: ExecutionType.SetField, items: [] } as any,
                    ]}
                    getAvailableFiltersApi={vi.fn() as any}
                    onEditExecutionItems={onEditExecutionItems}
                />,
            );
        });

        const editButton = container.querySelector('[data-testid="edit-exec-1"]') as HTMLButtonElement;
        await act(async () => {
            editButton.click();
        });

        expect(onEditExecutionItems).toHaveBeenCalledWith('exec-1');
    });

    it('renders spinner while filters are being fetched', async () => {
        isFetchingFilters = true;

        await act(async () => {
            root.render(
                <ConditionsExecutionsList
                    listType="executionItems"
                    actionExecutions={[{ uuid: 'exec-1', name: 'Exec 1', type: ExecutionType.SetField, items: [] } as any]}
                    getAvailableFiltersApi={vi.fn() as any}
                />,
            );
        });

        expect(container.querySelector('[data-testid="spinner"]')).toBeTruthy();
    });
});
