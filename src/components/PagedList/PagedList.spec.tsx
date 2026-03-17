import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import React from 'react';
import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';

import PagedList from './PagedList';
import pagingReducer from 'ducks/paging';
import filtersReducer, { actions as filterActions, EntityType } from 'ducks/filters';

const navigateMock = vi.fn();

vi.mock('react-router', () => ({
    useNavigate: () => navigateMock,
}));

vi.mock('components/FilterWidget', () => ({
    default: ({ title }: { title: string }) => React.createElement('div', { 'data-testid': 'mock-filter-widget' }, title),
}));

vi.mock('components/Dialog', () => ({
    default: ({ isOpen, caption, buttons }: any) =>
        isOpen
            ? React.createElement(
                  'div',
                  { 'data-testid': 'mock-dialog' },
                  React.createElement('div', { 'data-testid': 'mock-dialog-caption' }, caption),
                  ...(buttons || []).map((button: any, index: number) =>
                      React.createElement(
                          'button',
                          {
                              key: `${button.body}-${index}`,
                              type: 'button',
                              onClick: () => button.onClick(),
                          },
                          button.body,
                      ),
                  ),
              )
            : null,
}));

vi.mock('components/Widget', () => ({
    default: ({ title, children, busy, hideWidgetButtons, widgetButtons }: any) =>
        React.createElement(
            'section',
            {
                'data-testid': 'mock-widget',
                'data-busy': String(!!busy),
                'data-hide-widget-buttons': String(!!hideWidgetButtons),
            },
            React.createElement('h2', null, title),
            !hideWidgetButtons
                ? React.createElement(
                      'div',
                      { 'data-testid': 'mock-widget-buttons' },
                      ...(widgetButtons || []).map((button: any, index: number) =>
                          React.createElement(
                              'button',
                              {
                                  key: `${button.tooltip}-${index}`,
                                  type: 'button',
                                  title: button.tooltip,
                                  disabled: !!button.disabled,
                                  onClick: (event) => button.onClick(event),
                              },
                              button.tooltip,
                          ),
                      ),
                  )
                : null,
            children,
        ),
}));

vi.mock('components/CustomTable', () => ({
    default: ({ onPageChanged, onPageSizeChanged, onCheckedRowsChanged, hasCheckboxes, multiSelect, hasDetails }: any) =>
        React.createElement(
            'div',
            {
                'data-testid': 'mock-custom-table',
                'data-has-checkboxes': String(!!hasCheckboxes),
                'data-multi-select': String(!!multiSelect),
                'data-has-details': String(!!hasDetails),
            },
            React.createElement(
                'button',
                {
                    type: 'button',
                    'data-testid': 'mock-page-4',
                    onClick: () => onPageChanged?.(4),
                },
                'Page 4',
            ),
            React.createElement(
                'button',
                {
                    type: 'button',
                    'data-testid': 'mock-size-50',
                    onClick: () => onPageSizeChanged?.(50),
                },
                'Page size 50',
            ),
            React.createElement(
                'button',
                {
                    type: 'button',
                    'data-testid': 'mock-check-two',
                    onClick: () => onCheckedRowsChanged?.(['row-1', 'row-2']),
                },
                'Check rows',
            ),
        ),
}));

type MockStore = ReturnType<typeof createStore>;

const reducer = combineReducers({
    pagings: pagingReducer,
    filters: filtersReducer,
});

function createStore(preloadedState?: Partial<ReturnType<typeof reducer>>) {
    return configureStore({
        reducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
            }),
        preloadedState: preloadedState as ReturnType<typeof reducer>,
    });
}

function renderPagedList({
    store,
    onListCallback,
    onDeleteCallback,
    props,
}: {
    store: MockStore;
    onListCallback: (filters: any) => void;
    onDeleteCallback?: (uuids: string[], filters: any[]) => void;
    props?: Partial<React.ComponentProps<typeof PagedList>>;
}) {
    return React.createElement(
        Provider as any,
        { store },
        React.createElement(PagedList, {
            entity: EntityType.CERTIFICATE,
            headers: [{ id: 'name', content: 'Name' }] as any,
            data: [
                { id: 'row-1', columns: ['First row'] },
                { id: 'row-2', columns: ['Second row'] },
            ] as any,
            title: 'Certificates',
            onListCallback,
            onDeleteCallback,
            addHidden: true,
            ...props,
        }),
    );
}

async function flushEffects() {
    await act(async () => {
        await Promise.resolve();
    });
}

describe('PagedList component', () => {
    let container: HTMLDivElement;
    let root: Root;

    beforeEach(() => {
        (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
        container = document.createElement('div');
        document.body.appendChild(container);
        root = createRoot(container);
    });

    afterEach(() => {
        act(() => {
            root.unmount();
        });
        container.remove();
        vi.clearAllMocks();
        navigateMock.mockReset();
    });

    test('covers default prop values and initial refresh callback', async () => {
        const onListCallback = vi.fn();
        const store = createStore({
            pagings: {
                pagings: [
                    {
                        entity: EntityType.CERTIFICATE,
                        paging: {
                            totalItems: 100,
                            checkedRows: ['row-1'],
                            isFetchingList: false,
                            pageNumber: 3,
                            pageSize: 20,
                        },
                    },
                ],
            },
        });

        await act(async () => {
            root.render(renderPagedList({ store, onListCallback, props: { addHidden: false } }));
        });
        await flushEffects();

        const widget = container.querySelector('[data-testid="mock-widget"]') as HTMLElement;
        expect(widget.getAttribute('data-busy')).toBe('false');
        expect(widget.getAttribute('data-hide-widget-buttons')).toBe('false');

        const table = container.querySelector('[data-testid="mock-custom-table"]') as HTMLElement;
        expect(table.getAttribute('data-has-checkboxes')).toBe('true');
        expect(table.getAttribute('data-multi-select')).toBe('true');
        expect(table.getAttribute('data-has-details')).toBe('false');

        expect(onListCallback).toHaveBeenCalledWith({ itemsPerPage: 20, pageNumber: 3, filters: [] });
        expect((store.getState() as any).pagings.pagings[0].paging.checkedRows).toEqual([]);
    });

    test('resets page number on filter snapshot change', async () => {
        const onListCallback = vi.fn();
        const store = createStore({
            pagings: {
                pagings: [
                    {
                        entity: EntityType.CERTIFICATE,
                        paging: {
                            totalItems: 100,
                            checkedRows: [],
                            isFetchingList: false,
                            pageNumber: 5,
                            pageSize: 20,
                        },
                    },
                ],
            },
        });

        await act(async () => {
            root.render(renderPagedList({ store, onListCallback }));
        });
        await flushEffects();

        await act(async () => {
            store.dispatch(
                filterActions.setCurrentFilters({
                    entity: EntityType.CERTIFICATE,
                    currentFilters: [
                        {
                            fieldSource: 'METADATA' as any,
                            fieldIdentifier: 'status',
                            condition: 'EQUALS' as any,
                            value: 'ACTIVE',
                        },
                    ] as any,
                }),
            );
        });
        await flushEffects();

        expect((store.getState() as any).pagings.pagings[0].paging.pageNumber).toBe(1);
    });

    test('handles page number and page size updates from table callbacks', async () => {
        const onListCallback = vi.fn();
        const store = createStore();

        await act(async () => {
            root.render(renderPagedList({ store, onListCallback }));
        });
        await flushEffects();

        const pageButton = container.querySelector('[data-testid="mock-page-4"]') as HTMLButtonElement;
        const sizeButton = container.querySelector('[data-testid="mock-size-50"]') as HTMLButtonElement;

        await act(async () => {
            pageButton.click();
        });
        await flushEffects();

        expect((store.getState() as any).pagings.pagings[0].paging.pageNumber).toBe(4);

        await act(async () => {
            sizeButton.click();
        });
        await flushEffects();

        const paging = (store.getState() as any).pagings.pagings[0].paging;
        expect(paging.pageSize).toBe(50);
        expect(paging.pageNumber).toBe(1);
    });

    test('covers delete confirm flow and onDeleteConfirmed callback', async () => {
        const onListCallback = vi.fn();
        const onDeleteCallback = vi.fn();

        const store = createStore();

        await act(async () => {
            root.render(
                renderPagedList({
                    store,
                    onListCallback,
                    onDeleteCallback,
                    props: {
                        addHidden: false,
                        entityNameSingular: 'certificate',
                        entityNamePlural: 'certificates',
                    },
                }),
            );
        });
        await flushEffects();

        const checkRowsButton = container.querySelector('[data-testid="mock-check-two"]') as HTMLButtonElement;
        await act(async () => {
            checkRowsButton.click();
        });
        await flushEffects();

        const openDeleteDialogButton = container.querySelector('button[title="Delete"]') as HTMLButtonElement;
        expect(openDeleteDialogButton).toBeTruthy();

        await act(async () => {
            openDeleteDialogButton.click();
        });
        await flushEffects();

        const caption = container.querySelector('[data-testid="mock-dialog-caption"]')?.textContent;
        expect(caption).toContain('Delete certificates');

        const confirmDeleteButton = Array.from(container.querySelectorAll('[data-testid="mock-dialog"] button')).find(
            (button) => button.textContent === 'Delete',
        ) as HTMLButtonElement;

        await act(async () => {
            confirmDeleteButton.click();
        });
        await flushEffects();

        expect(onDeleteCallback).toHaveBeenCalledWith(['row-1', 'row-2'], []);
        expect(container.querySelector('[data-testid="mock-dialog"]')).toBeNull();
    });

    test('renders filter widget when filter props are provided', async () => {
        const onListCallback = vi.fn();
        const store = createStore();

        await act(async () => {
            root.render(
                renderPagedList({
                    store,
                    onListCallback,
                    props: {
                        filterTitle: 'Filters',
                        getAvailableFiltersApi: (() => ({ subscribe: () => ({ unsubscribe: () => {} }) })) as any,
                    },
                }),
            );
        });
        await flushEffects();

        expect(container.querySelector('[data-testid="mock-filter-widget"]')?.textContent).toContain('Filters');
    });
});
