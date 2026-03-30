import { describe, expect, test } from 'vitest';
import reducer, { actions, initialState, selectors } from './table-pagination';

describe('table-pagination slice', () => {
    test('returns initial state for unknown action', () => {
        expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    test('setPagination stores state by key', () => {
        const next = reducer(
            initialState,
            actions.setPagination({
                key: 'custom-table-pagination:/roles:roles-table',
                page: 3,
                pageSize: 20,
            }),
        );

        expect(next.byKey['custom-table-pagination:/roles:roles-table']).toEqual({ page: 3, pageSize: 20 });
    });

    test('clearPagination removes key', () => {
        const withPagination = reducer(
            initialState,
            actions.setPagination({
                key: 'custom-table-pagination:/roles:roles-table',
                page: 2,
                pageSize: 10,
            }),
        );

        const next = reducer(
            withPagination,
            actions.clearPagination({
                key: 'custom-table-pagination:/roles:roles-table',
            }),
        );

        expect(next.byKey['custom-table-pagination:/roles:roles-table']).toBeUndefined();
    });

    test('clearPaginationByRootRoute clears only matching route keys', () => {
        const withRoles = reducer(
            initialState,
            actions.setPagination({
                key: 'custom-table-pagination:/roles:roles-table',
                page: 4,
                pageSize: 10,
            }),
        );
        const withUsers = reducer(
            withRoles,
            actions.setPagination({
                key: 'custom-table-pagination:/users:users-table',
                page: 2,
                pageSize: 20,
            }),
        );
        const withPagedRoles = reducer(
            withUsers,
            actions.setPagination({
                key: 'paged-custom-table-pagination:/roles:history-table',
                page: 7,
                pageSize: 50,
            }),
        );

        const next = reducer(withPagedRoles, actions.clearPaginationByRootRoute({ rootRoute: 'roles' }));

        expect(next.byKey['custom-table-pagination:/roles:roles-table']).toBeUndefined();
        expect(next.byKey['paged-custom-table-pagination:/roles:history-table']).toBeUndefined();
        expect(next.byKey['custom-table-pagination:/users:users-table']).toEqual({ page: 2, pageSize: 20 });
    });

    test('setActiveRootRoute stores active root route', () => {
        const next = reducer(initialState, actions.setActiveRootRoute({ rootRoute: 'users' }));

        expect(next.activeRootRoute).toBe('users');
    });
});

describe('table-pagination selectors', () => {
    test('pagination selector returns defaults when key missing', () => {
        const state = { tablePagination: initialState } as any;
        expect(selectors.pagination('missing')(state)).toEqual({ page: 1, pageSize: 10 });
    });

    test('pagination selector returns stored key value', () => {
        const state = {
            tablePagination: {
                byKey: {
                    'custom-table-pagination:/roles:roles-table': { page: 5, pageSize: 100 },
                },
                activeRootRoute: 'roles',
            },
        } as any;

        expect(selectors.pagination('custom-table-pagination:/roles:roles-table')(state)).toEqual({ page: 5, pageSize: 100 });
    });

    test('activeRootRoute selector returns current route', () => {
        const state = {
            tablePagination: {
                byKey: {},
                activeRootRoute: 'locations',
            },
        } as any;

        expect(selectors.activeRootRoute(state)).toBe('locations');
    });
});
