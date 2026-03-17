import { test, expect } from '../../../playwright/ct-test';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';

import PagedList from './PagedList';
import pagingReducer from 'ducks/paging';
import filtersReducer, { EntityType } from 'ducks/filters';
import userInterfaceReducer from 'ducks/user-interface';

const reducer = combineReducers({
    pagings: pagingReducer,
    filters: filtersReducer,
    userInterface: userInterfaceReducer,
});

type RootState = ReturnType<typeof reducer>;

const headers = [{ id: 'name', content: 'Name', sortable: true }];
const rows = [
    { id: 'row-1', columns: ['First row'] },
    { id: 'row-2', columns: ['Second row'] },
    { id: 'row-3', columns: ['Third row'] },
];

const preloadedDeleteState = {
    pagings: {
        pagings: [
            {
                entity: EntityType.CBOM,
                paging: {
                    totalItems: 10,
                    checkedRows: ['row-1', 'row-2'],
                    isFetchingList: false,
                    pageNumber: 1,
                    pageSize: 10,
                },
            },
        ],
    } as any,
};

function createStore(preloadedState?: Partial<RootState>) {
    return configureStore({
        reducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
            }),
        preloadedState: preloadedState as RootState,
    });
}

function renderPagedList(options?: {
    preloadedState?: Partial<RootState>;
    addHidden?: boolean;
    hideWidgetButtons?: boolean;
    isBusy?: boolean;
    onDeleteCallback?: (uuids: string[]) => void;
    additionalButtons?: any[];
}) {
    const store = createStore(options?.preloadedState);

    return (
        <Provider store={store}>
            <MemoryRouter initialEntries={['/cboms/list']}>
                <PagedList
                    entity={EntityType.CBOM}
                    headers={headers as any}
                    data={rows as any}
                    title="CBOMs"
                    entityNameSingular="CBOM"
                    entityNamePlural="CBOMs"
                    addHidden={options?.addHidden ?? true}
                    hideWidgetButtons={options?.hideWidgetButtons ?? false}
                    isBusy={options?.isBusy ?? false}
                    onListCallback={() => {}}
                    onDeleteCallback={options?.onDeleteCallback as any}
                    additionalButtons={options?.additionalButtons as any}
                    hasCheckboxes
                />
            </MemoryRouter>
        </Provider>
    );
}

test.describe('PagedList', () => {
    test('mounts with default props', async ({ mount }) => {
        await mount(renderPagedList());
    });

    test('mounts with busy state', async ({ mount }) => {
        await mount(renderPagedList({ isBusy: true }));
    });

    test('mounts with create and delete controls enabled', async ({ mount }) => {
        await mount(
            renderPagedList({
                addHidden: false,
                onDeleteCallback: () => {},
                preloadedState: {
                    pagings: {
                        pagings: [
                            {
                                entity: EntityType.CBOM,
                                paging: {
                                    totalItems: 10,
                                    checkedRows: ['row-1'],
                                    isFetchingList: false,
                                    pageNumber: 1,
                                    pageSize: 10,
                                },
                            },
                        ],
                    } as any,
                },
            }),
        );
    });

    test('hides widget action icons when hideWidgetButtons is true', async ({ mount }) => {
        const component = await mount(
            renderPagedList({
                addHidden: false,
                hideWidgetButtons: true,
                onDeleteCallback: () => {},
            }),
        );

        await expect(component.locator('button:has(svg.lucide-plus)')).toHaveCount(0);
        await expect(component.locator('button:has(svg.lucide-trash2)')).toHaveCount(0);
    });

    test('mounts with preselected rows for delete flow', async ({ mount }) => {
        await mount(
            renderPagedList({
                onDeleteCallback: () => {},
                preloadedState: preloadedDeleteState,
            }),
        );
    });

    test('mounts with additional action buttons', async ({ mount }) => {
        await mount(
            renderPagedList({
                additionalButtons: [
                    {
                        icon: 'sync',
                        disabled: false,
                        tooltip: 'Sync',
                        onClick: () => {},
                    },
                ],
            }),
        );
    });
});
