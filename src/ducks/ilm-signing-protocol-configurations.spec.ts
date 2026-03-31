import { describe, expect, test } from 'vitest';

import reducer, { actions, initialState, selectors } from './ilm-signing-protocol-configurations';

describe('ilmSigningProtocolConfigurations slice', () => {
    test('returns initial state for unknown action', () => {
        expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    test('resetState restores initial values', () => {
        const dirty = {
            ...initialState,
            ilmSigningProtocolConfiguration: { uuid: 'c-1' } as any,
            ilmSigningProtocolConfigurations: [{ uuid: 'c-1' } as any],
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

    test('listIlmSigningProtocolConfigurations sets isFetchingList', () => {
        const next = reducer(initialState, actions.listIlmSigningProtocolConfigurations());
        expect(next.isFetchingList).toBe(true);
    });

    test('listIlmSigningProtocolConfigurationsSuccess updates list and totalItems', () => {
        const configs = [{ uuid: 'c-1' }] as any[];
        const next = reducer(
            { ...initialState, isFetchingList: true },
            actions.listIlmSigningProtocolConfigurationsSuccess({ ilmSigningProtocolConfigurations: configs, totalItems: 1 }),
        );
        expect(next.isFetchingList).toBe(false);
        expect(next.ilmSigningProtocolConfigurations).toEqual(configs);
        expect(next.ilmSigningProtocolConfigurationsTotalItems).toBe(1);
    });

    test('listIlmSigningProtocolConfigurationsFailure clears isFetchingList', () => {
        const next = reducer(
            { ...initialState, isFetchingList: true },
            actions.listIlmSigningProtocolConfigurationsFailure({ error: 'err' }),
        );
        expect(next.isFetchingList).toBe(false);
    });

    test('getIlmSigningProtocolConfiguration sets isFetchingDetail', () => {
        const next = reducer(initialState, actions.getIlmSigningProtocolConfiguration({ uuid: 'c-1' }));
        expect(next.isFetchingDetail).toBe(true);
    });

    test('getIlmSigningProtocolConfigurationSuccess sets detail and updates list entry', () => {
        const existing = { uuid: 'c-1', name: 'Old' } as any;
        const updated = { uuid: 'c-1', name: 'New' } as any;
        const state = { ...initialState, isFetchingDetail: true, ilmSigningProtocolConfigurations: [existing] };
        const next = reducer(state, actions.getIlmSigningProtocolConfigurationSuccess({ ilmSigningProtocolConfiguration: updated }));
        expect(next.isFetchingDetail).toBe(false);
        expect(next.ilmSigningProtocolConfiguration).toEqual(updated);
        expect(next.ilmSigningProtocolConfigurations[0]).toEqual(updated);
    });

    test('getIlmSigningProtocolConfigurationFailure clears isFetchingDetail', () => {
        const next = reducer(
            { ...initialState, isFetchingDetail: true },
            actions.getIlmSigningProtocolConfigurationFailure({ error: 'err' }),
        );
        expect(next.isFetchingDetail).toBe(false);
    });

    test('listIlmSigningProtocolConfigurationSearchableFields sets isFetchingSearchableFields', () => {
        const next = reducer(initialState, actions.listIlmSigningProtocolConfigurationSearchableFields());
        expect(next.isFetchingSearchableFields).toBe(true);
    });

    test('listIlmSigningProtocolConfigurationSearchableFieldsSuccess sets fields', () => {
        const fields = [{ searchGroupEnum: 'grp' }] as any[];
        const next = reducer(
            { ...initialState, isFetchingSearchableFields: true },
            actions.listIlmSigningProtocolConfigurationSearchableFieldsSuccess({ searchableFields: fields }),
        );
        expect(next.isFetchingSearchableFields).toBe(false);
        expect(next.searchableFields).toEqual(fields);
    });

    test('listIlmSigningProtocolConfigurationSearchableFieldsFailure clears flag', () => {
        const next = reducer(
            { ...initialState, isFetchingSearchableFields: true },
            actions.listIlmSigningProtocolConfigurationSearchableFieldsFailure({ error: 'err' }),
        );
        expect(next.isFetchingSearchableFields).toBe(false);
    });

    test('createIlmSigningProtocolConfiguration sets isCreating', () => {
        const next = reducer(
            initialState,
            actions.createIlmSigningProtocolConfiguration({ ilmSigningProtocolConfigurationRequestDto: {} as any }),
        );
        expect(next.isCreating).toBe(true);
    });

    test('createIlmSigningProtocolConfigurationSuccess clears isCreating', () => {
        const next = reducer(
            { ...initialState, isCreating: true },
            actions.createIlmSigningProtocolConfigurationSuccess({ ilmSigningProtocolConfiguration: { uuid: 'c-1' } as any }),
        );
        expect(next.isCreating).toBe(false);
    });

    test('createIlmSigningProtocolConfigurationFailure clears isCreating', () => {
        const next = reducer({ ...initialState, isCreating: true }, actions.createIlmSigningProtocolConfigurationFailure({ error: 'err' }));
        expect(next.isCreating).toBe(false);
    });

    test('updateIlmSigningProtocolConfiguration sets isUpdating', () => {
        const next = reducer(
            initialState,
            actions.updateIlmSigningProtocolConfiguration({ uuid: 'c-1', ilmSigningProtocolConfigurationRequestDto: {} as any }),
        );
        expect(next.isUpdating).toBe(true);
    });

    test('updateIlmSigningProtocolConfigurationSuccess updates detail and list', () => {
        const existing = { uuid: 'c-1', name: 'Old' } as any;
        const updated = { uuid: 'c-1', name: 'Updated' } as any;
        const state = {
            ...initialState,
            isUpdating: true,
            ilmSigningProtocolConfiguration: existing,
            ilmSigningProtocolConfigurations: [existing],
        };
        const next = reducer(state, actions.updateIlmSigningProtocolConfigurationSuccess({ ilmSigningProtocolConfiguration: updated }));
        expect(next.isUpdating).toBe(false);
        expect(next.ilmSigningProtocolConfiguration).toEqual(updated);
        expect(next.ilmSigningProtocolConfigurations[0]).toEqual(updated);
    });

    test('updateIlmSigningProtocolConfigurationFailure clears isUpdating', () => {
        const next = reducer({ ...initialState, isUpdating: true }, actions.updateIlmSigningProtocolConfigurationFailure({ error: 'err' }));
        expect(next.isUpdating).toBe(false);
    });

    test('deleteIlmSigningProtocolConfiguration sets isDeleting and clears deleteErrorMessage', () => {
        const next = reducer(
            { ...initialState, deleteErrorMessage: 'old error' },
            actions.deleteIlmSigningProtocolConfiguration({ uuid: 'c-1' }),
        );
        expect(next.isDeleting).toBe(true);
        expect(next.deleteErrorMessage).toBe('');
    });

    test('deleteIlmSigningProtocolConfigurationSuccess removes from list and clears detail', () => {
        const config = { uuid: 'c-1' } as any;
        const state = {
            ...initialState,
            isDeleting: true,
            ilmSigningProtocolConfiguration: config,
            ilmSigningProtocolConfigurations: [config],
        };
        const next = reducer(state, actions.deleteIlmSigningProtocolConfigurationSuccess({ uuid: 'c-1' }));
        expect(next.isDeleting).toBe(false);
        expect(next.ilmSigningProtocolConfigurations).toHaveLength(0);
        expect(next.ilmSigningProtocolConfiguration).toBeUndefined();
    });

    test('deleteIlmSigningProtocolConfigurationFailure sets deleteErrorMessage', () => {
        const next = reducer(
            { ...initialState, isDeleting: true },
            actions.deleteIlmSigningProtocolConfigurationFailure({ error: 'delete failed' }),
        );
        expect(next.isDeleting).toBe(false);
        expect(next.deleteErrorMessage).toBe('delete failed');
    });

    test('enableIlmSigningProtocolConfiguration sets isEnabling', () => {
        const next = reducer(initialState, actions.enableIlmSigningProtocolConfiguration({ uuid: 'c-1' }));
        expect(next.isEnabling).toBe(true);
    });

    test('enableIlmSigningProtocolConfigurationSuccess sets enabled=true in list and detail', () => {
        const config = { uuid: 'c-1', enabled: false } as any;
        const state = {
            ...initialState,
            isEnabling: true,
            ilmSigningProtocolConfiguration: config,
            ilmSigningProtocolConfigurations: [{ ...config }],
        };
        const next = reducer(state, actions.enableIlmSigningProtocolConfigurationSuccess({ uuid: 'c-1' }));
        expect(next.isEnabling).toBe(false);
        expect(next.ilmSigningProtocolConfigurations[0].enabled).toBe(true);
        expect(next.ilmSigningProtocolConfiguration?.enabled).toBe(true);
    });

    test('disableIlmSigningProtocolConfigurationSuccess sets enabled=false in list and detail', () => {
        const config = { uuid: 'c-1', enabled: true } as any;
        const state = {
            ...initialState,
            isDisabling: true,
            ilmSigningProtocolConfiguration: config,
            ilmSigningProtocolConfigurations: [{ ...config }],
        };
        const next = reducer(state, actions.disableIlmSigningProtocolConfigurationSuccess({ uuid: 'c-1' }));
        expect(next.isDisabling).toBe(false);
        expect(next.ilmSigningProtocolConfigurations[0].enabled).toBe(false);
        expect(next.ilmSigningProtocolConfiguration?.enabled).toBe(false);
    });

    test('bulkDeleteIlmSigningProtocolConfigurations sets isBulkDeleting and clears errors', () => {
        const next = reducer(
            { ...initialState, bulkDeleteErrorMessages: [{ message: 'err' } as any] },
            actions.bulkDeleteIlmSigningProtocolConfigurations({ uuids: ['c-1'] }),
        );
        expect(next.isBulkDeleting).toBe(true);
        expect(next.bulkDeleteErrorMessages).toEqual([]);
    });

    test('bulkDeleteIlmSigningProtocolConfigurationsSuccess removes items from list', () => {
        const configs = [{ uuid: 'c-1' }, { uuid: 'c-2' }] as any[];
        const state = { ...initialState, isBulkDeleting: true, ilmSigningProtocolConfigurations: configs };
        const next = reducer(state, actions.bulkDeleteIlmSigningProtocolConfigurationsSuccess({ uuids: ['c-1'], errors: [] }));
        expect(next.isBulkDeleting).toBe(false);
        expect(next.ilmSigningProtocolConfigurations).toHaveLength(1);
        expect(next.ilmSigningProtocolConfigurations[0].uuid).toBe('c-2');
    });

    test('bulkDeleteIlmSigningProtocolConfigurationsSuccess with errors sets bulkDeleteErrorMessages', () => {
        const errors = [{ message: 'err', uuid: 'c-1', name: 'Config 1' }] as any[];
        const configs = [{ uuid: 'c-1' }] as any[];
        const state = { ...initialState, isBulkDeleting: true, ilmSigningProtocolConfigurations: configs };
        const next = reducer(state, actions.bulkDeleteIlmSigningProtocolConfigurationsSuccess({ uuids: ['c-1'], errors }));
        expect(next.isBulkDeleting).toBe(false);
        expect(next.bulkDeleteErrorMessages).toEqual(errors);
        expect(next.ilmSigningProtocolConfigurations).toHaveLength(1);
    });

    test('bulkEnableIlmSigningProtocolConfigurationsSuccess sets enabled=true for matching uuids', () => {
        const configs = [
            { uuid: 'c-1', enabled: false },
            { uuid: 'c-2', enabled: false },
        ] as any[];
        const state = { ...initialState, isBulkEnabling: true, ilmSigningProtocolConfigurations: configs };
        const next = reducer(state, actions.bulkEnableIlmSigningProtocolConfigurationsSuccess({ uuids: ['c-1'] }));
        expect(next.isBulkEnabling).toBe(false);
        expect(next.ilmSigningProtocolConfigurations[0].enabled).toBe(true);
        expect(next.ilmSigningProtocolConfigurations[1].enabled).toBe(false);
    });

    test('bulkDisableIlmSigningProtocolConfigurationsSuccess sets enabled=false for matching uuids', () => {
        const configs = [
            { uuid: 'c-1', enabled: true },
            { uuid: 'c-2', enabled: true },
        ] as any[];
        const state = { ...initialState, isBulkDisabling: true, ilmSigningProtocolConfigurations: configs };
        const next = reducer(state, actions.bulkDisableIlmSigningProtocolConfigurationsSuccess({ uuids: ['c-1'] }));
        expect(next.isBulkDisabling).toBe(false);
        expect(next.ilmSigningProtocolConfigurations[0].enabled).toBe(false);
        expect(next.ilmSigningProtocolConfigurations[1].enabled).toBe(true);
    });
});

describe('ilmSigningProtocolConfigurations selectors', () => {
    test('selectors read all values from state', () => {
        const config = { uuid: 'c-1' } as any;
        const configs = [config];
        const fields = [{ searchGroupEnum: 'g-1' }] as any[];
        const bulkErrors = [{ message: 'err' }] as any[];

        const featureState = {
            ...initialState,
            ilmSigningProtocolConfiguration: config,
            ilmSigningProtocolConfigurations: configs,
            ilmSigningProtocolConfigurationsTotalItems: 5,
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

        const state = { ilmSigningProtocolConfigurations: featureState } as any;

        expect(selectors.ilmSigningProtocolConfiguration(state)).toEqual(config);
        expect(selectors.ilmSigningProtocolConfigurations(state)).toEqual(configs);
        expect(selectors.ilmSigningProtocolConfigurationsTotalItems(state)).toBe(5);
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
