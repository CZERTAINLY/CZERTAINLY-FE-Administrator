import { describe, expect, test } from 'vitest';

import reducer, { actions, initialState, selectors } from './tsp-configurations';

describe('tspConfigurations slice', () => {
    test('returns initial state for unknown action', () => {
        expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    test('resetState restores initial values', () => {
        const dirty = {
            ...initialState,
            tspConfiguration: { uuid: 'c-1' } as any,
            tspConfigurations: [{ uuid: 'c-1' } as any],
            isFetchingList: true,
            tempKey: 'gone',
        } as any;

        const next = reducer(dirty, actions.resetState());

        expect(next).toEqual(initialState);
        expect((next as any).tempKey).toBeUndefined();
    });

    test('setCheckedRows updates checkedRows', () => {
        const next = reducer(initialState, actions.setCheckedRows({ checkedRows: ['c-1', 'c-2'] }));
        expect(next.checkedRows).toEqual(['c-1', 'c-2']);
    });

    test('clearDeleteErrorMessages clears error fields', () => {
        const next = reducer(
            { ...initialState, deleteErrorMessage: 'some error', bulkDeleteErrorMessages: [{ message: 'err' } as any] },
            actions.clearDeleteErrorMessages(),
        );
        expect(next.deleteErrorMessage).toBe('');
        expect(next.bulkDeleteErrorMessages).toEqual([]);
    });

    test('listTspConfigurations sets isFetchingList', () => {
        const next = reducer(initialState, actions.listTspConfigurations());
        expect(next.isFetchingList).toBe(true);
    });

    test('listTspConfigurationsSuccess updates list and totalItems', () => {
        const configs = [{ uuid: 'c-1' }] as any[];
        const next = reducer(
            { ...initialState, isFetchingList: true },
            actions.listTspConfigurationsSuccess({ tspConfigurations: configs, totalItems: 1 }),
        );
        expect(next.isFetchingList).toBe(false);
        expect(next.tspConfigurations).toEqual(configs);
        expect(next.tspConfigurationsTotalItems).toBe(1);
    });

    test('listTspConfigurationsFailure clears isFetchingList', () => {
        const next = reducer({ ...initialState, isFetchingList: true }, actions.listTspConfigurationsFailure({ error: 'err' }));
        expect(next.isFetchingList).toBe(false);
    });

    test('getTspConfiguration sets isFetchingDetail', () => {
        const next = reducer(initialState, actions.getTspConfiguration({ uuid: 'c-1' }));
        expect(next.isFetchingDetail).toBe(true);
    });

    test('getTspConfigurationSuccess sets detail and updates list entry', () => {
        const existing = { uuid: 'c-1', name: 'Old' } as any;
        const updated = { uuid: 'c-1', name: 'New' } as any;
        const state = { ...initialState, isFetchingDetail: true, tspConfigurations: [existing] };
        const next = reducer(state, actions.getTspConfigurationSuccess({ tspConfiguration: updated }));
        expect(next.isFetchingDetail).toBe(false);
        expect(next.tspConfiguration).toEqual(updated);
        expect(next.tspConfigurations[0]).toEqual(updated);
    });

    test('getTspConfigurationFailure clears isFetchingDetail', () => {
        const next = reducer({ ...initialState, isFetchingDetail: true }, actions.getTspConfigurationFailure({ error: 'err' }));
        expect(next.isFetchingDetail).toBe(false);
    });

    test('listTspConfigurationSearchableFields sets isFetchingSearchableFields', () => {
        const next = reducer(initialState, actions.listTspConfigurationSearchableFields());
        expect(next.isFetchingSearchableFields).toBe(true);
    });

    test('listTspConfigurationSearchableFieldsSuccess sets fields', () => {
        const fields = [{ searchGroupEnum: 'grp' }] as any[];
        const next = reducer(
            { ...initialState, isFetchingSearchableFields: true },
            actions.listTspConfigurationSearchableFieldsSuccess({ searchableFields: fields }),
        );
        expect(next.isFetchingSearchableFields).toBe(false);
        expect(next.searchableFields).toEqual(fields);
    });

    test('listTspConfigurationSearchableFieldsFailure clears flag', () => {
        const next = reducer(
            { ...initialState, isFetchingSearchableFields: true },
            actions.listTspConfigurationSearchableFieldsFailure({ error: 'err' }),
        );
        expect(next.isFetchingSearchableFields).toBe(false);
    });

    test('createTspConfiguration sets isCreating', () => {
        const next = reducer(initialState, actions.createTspConfiguration({ tspConfigurationRequestDto: {} as any }));
        expect(next.isCreating).toBe(true);
    });

    test('createTspConfigurationSuccess clears isCreating', () => {
        const next = reducer(
            { ...initialState, isCreating: true },
            actions.createTspConfigurationSuccess({ tspConfiguration: { uuid: 'c-1' } as any }),
        );
        expect(next.isCreating).toBe(false);
    });

    test('createTspConfigurationFailure clears isCreating', () => {
        const next = reducer({ ...initialState, isCreating: true }, actions.createTspConfigurationFailure({ error: 'err' }));
        expect(next.isCreating).toBe(false);
    });

    test('updateTspConfiguration sets isUpdating', () => {
        const next = reducer(initialState, actions.updateTspConfiguration({ uuid: 'c-1', tspConfigurationRequestDto: {} as any }));
        expect(next.isUpdating).toBe(true);
    });

    test('updateTspConfigurationSuccess updates detail and list', () => {
        const existing = { uuid: 'c-1', name: 'Old' } as any;
        const updated = { uuid: 'c-1', name: 'Updated' } as any;
        const state = { ...initialState, isUpdating: true, tspConfiguration: existing, tspConfigurations: [existing] };
        const next = reducer(state, actions.updateTspConfigurationSuccess({ tspConfiguration: updated }));
        expect(next.isUpdating).toBe(false);
        expect(next.tspConfiguration).toEqual(updated);
        expect(next.tspConfigurations[0]).toEqual(updated);
    });

    test('updateTspConfigurationFailure clears isUpdating', () => {
        const next = reducer({ ...initialState, isUpdating: true }, actions.updateTspConfigurationFailure({ error: 'err' }));
        expect(next.isUpdating).toBe(false);
    });

    test('deleteTspConfiguration sets isDeleting and clears deleteErrorMessage', () => {
        const next = reducer({ ...initialState, deleteErrorMessage: 'old error' }, actions.deleteTspConfiguration({ uuid: 'c-1' }));
        expect(next.isDeleting).toBe(true);
        expect(next.deleteErrorMessage).toBe('');
    });

    test('deleteTspConfigurationSuccess removes from list and clears detail', () => {
        const config = { uuid: 'c-1' } as any;
        const state = { ...initialState, isDeleting: true, tspConfiguration: config, tspConfigurations: [config] };
        const next = reducer(state, actions.deleteTspConfigurationSuccess({ uuid: 'c-1' }));
        expect(next.isDeleting).toBe(false);
        expect(next.tspConfigurations).toHaveLength(0);
        expect(next.tspConfiguration).toBeUndefined();
    });

    test('deleteTspConfigurationFailure sets deleteErrorMessage', () => {
        const next = reducer({ ...initialState, isDeleting: true }, actions.deleteTspConfigurationFailure({ error: 'delete failed' }));
        expect(next.isDeleting).toBe(false);
        expect(next.deleteErrorMessage).toBe('delete failed');
    });

    test('enableTspConfiguration sets isEnabling', () => {
        const next = reducer(initialState, actions.enableTspConfiguration({ uuid: 'c-1' }));
        expect(next.isEnabling).toBe(true);
    });

    test('enableTspConfigurationSuccess sets enabled=true in list and detail', () => {
        const config = { uuid: 'c-1', enabled: false } as any;
        const state = {
            ...initialState,
            isEnabling: true,
            tspConfiguration: config,
            tspConfigurations: [{ ...config }],
        };
        const next = reducer(state, actions.enableTspConfigurationSuccess({ uuid: 'c-1' }));
        expect(next.isEnabling).toBe(false);
        expect(next.tspConfigurations[0].enabled).toBe(true);
        expect(next.tspConfiguration?.enabled).toBe(true);
    });

    test('disableTspConfigurationSuccess sets enabled=false in list and detail', () => {
        const config = { uuid: 'c-1', enabled: true } as any;
        const state = {
            ...initialState,
            isDisabling: true,
            tspConfiguration: config,
            tspConfigurations: [{ ...config }],
        };
        const next = reducer(state, actions.disableTspConfigurationSuccess({ uuid: 'c-1' }));
        expect(next.isDisabling).toBe(false);
        expect(next.tspConfigurations[0].enabled).toBe(false);
        expect(next.tspConfiguration?.enabled).toBe(false);
    });

    test('bulkDeleteTspConfigurations sets isBulkDeleting and clears errors', () => {
        const next = reducer(
            { ...initialState, bulkDeleteErrorMessages: [{ message: 'err' } as any] },
            actions.bulkDeleteTspConfigurations({ uuids: ['c-1'] }),
        );
        expect(next.isBulkDeleting).toBe(true);
        expect(next.bulkDeleteErrorMessages).toEqual([]);
    });

    test('bulkDeleteTspConfigurationsSuccess removes items from list', () => {
        const configs = [{ uuid: 'c-1' }, { uuid: 'c-2' }] as any[];
        const state = { ...initialState, isBulkDeleting: true, tspConfigurations: configs };
        const next = reducer(state, actions.bulkDeleteTspConfigurationsSuccess({ uuids: ['c-1'], errors: [] }));
        expect(next.isBulkDeleting).toBe(false);
        expect(next.tspConfigurations).toHaveLength(1);
        expect(next.tspConfigurations[0].uuid).toBe('c-2');
    });

    test('bulkDeleteTspConfigurationsSuccess with errors sets bulkDeleteErrorMessages', () => {
        const errors = [{ message: 'err', uuid: 'c-1', name: 'TSP Config 1' }] as any[];
        const configs = [{ uuid: 'c-1' }] as any[];
        const state = { ...initialState, isBulkDeleting: true, tspConfigurations: configs };
        const next = reducer(state, actions.bulkDeleteTspConfigurationsSuccess({ uuids: ['c-1'], errors }));
        expect(next.isBulkDeleting).toBe(false);
        expect(next.bulkDeleteErrorMessages).toEqual(errors);
        expect(next.tspConfigurations).toHaveLength(1);
    });

    test('bulkEnableTspConfigurationsSuccess sets enabled=true for matching uuids', () => {
        const configs = [
            { uuid: 'c-1', enabled: false },
            { uuid: 'c-2', enabled: false },
        ] as any[];
        const state = { ...initialState, isBulkEnabling: true, tspConfigurations: configs };
        const next = reducer(state, actions.bulkEnableTspConfigurationsSuccess({ uuids: ['c-1'] }));
        expect(next.isBulkEnabling).toBe(false);
        expect(next.tspConfigurations[0].enabled).toBe(true);
        expect(next.tspConfigurations[1].enabled).toBe(false);
    });

    test('bulkDisableTspConfigurationsSuccess sets enabled=false for matching uuids', () => {
        const configs = [
            { uuid: 'c-1', enabled: true },
            { uuid: 'c-2', enabled: true },
        ] as any[];
        const state = { ...initialState, isBulkDisabling: true, tspConfigurations: configs };
        const next = reducer(state, actions.bulkDisableTspConfigurationsSuccess({ uuids: ['c-1'] }));
        expect(next.isBulkDisabling).toBe(false);
        expect(next.tspConfigurations[0].enabled).toBe(false);
        expect(next.tspConfigurations[1].enabled).toBe(true);
    });
});

describe('tspConfigurations selectors', () => {
    test('selectors read all values from state', () => {
        const config = { uuid: 'c-1' } as any;
        const configs = [config];
        const fields = [{ searchGroupEnum: 'g-1' }] as any[];
        const bulkErrors = [{ message: 'err' }] as any[];

        const featureState = {
            ...initialState,
            tspConfiguration: config,
            tspConfigurations: configs,
            tspConfigurationsTotalItems: 5,
            searchableFields: fields,
            checkedRows: ['c-1'],
            deleteErrorMessage: 'del err',
            bulkDeleteErrorMessages: bulkErrors,
            isFetchingList: true,
            isFetchingDetail: true,
            isFetchingSearchableFields: true,
            isCreating: true,
            isDeleting: true,
            isUpdating: true,
            isEnabling: true,
            isDisabling: true,
            isBulkDeleting: true,
            isBulkEnabling: true,
            isBulkDisabling: true,
        };

        const state = { tspConfigurations: featureState } as any;

        expect(selectors.tspConfiguration(state)).toEqual(config);
        expect(selectors.tspConfigurations(state)).toEqual(configs);
        expect(selectors.tspConfigurationsTotalItems(state)).toBe(5);
        expect(selectors.searchableFields(state)).toEqual(fields);
        expect(selectors.checkedRows(state)).toEqual(['c-1']);
        expect(selectors.deleteErrorMessage(state)).toBe('del err');
        expect(selectors.bulkDeleteErrorMessages(state)).toEqual(bulkErrors);
        expect(selectors.isFetchingList(state)).toBe(true);
        expect(selectors.isFetchingDetail(state)).toBe(true);
        expect(selectors.isFetchingSearchableFields(state)).toBe(true);
        expect(selectors.isCreating(state)).toBe(true);
        expect(selectors.isDeleting(state)).toBe(true);
        expect(selectors.isUpdating(state)).toBe(true);
        expect(selectors.isEnabling(state)).toBe(true);
        expect(selectors.isDisabling(state)).toBe(true);
        expect(selectors.isBulkDeleting(state)).toBe(true);
        expect(selectors.isBulkEnabling(state)).toBe(true);
        expect(selectors.isBulkDisabling(state)).toBe(true);
    });
});
