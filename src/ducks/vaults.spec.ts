import { describe, expect, test } from 'vitest';

import reducer, { actions, initialState, selectors } from './vaults';

describe('vaults slice', () => {
    test('returns initial state for unknown action', () => {
        expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    test('resetState restores initial values and clears extra keys', () => {
        const dirtyState = {
            ...initialState,
            vaults: [{ uuid: 'v-1' } as any],
            vault: { uuid: 'detail-1' } as any,
            isFetchingList: true,
            isCreating: true,
            isUpdating: true,
            isDeleting: true,
            vaultInstanceAttributeDescriptors: [{ uuid: 'a-1' } as any],
            vaultInstanceAttributesConnectorUuid: 'c-1',
            isFetchingVaultInstanceAttributes: true,
            tempOnlyKey: 'to-be-removed',
        } as any;

        const next = reducer(dirtyState, actions.resetState());

        expect(next).toEqual(initialState);
        expect((next as any).tempOnlyKey).toBeUndefined();
    });

    test('listVaults / success / failure update list flags and data', () => {
        const search = { pageNumber: 1, itemsPerPage: 10, filters: [] } as any;

        let next = reducer(initialState, actions.listVaults(search));
        expect(next.isFetchingList).toBe(true);
        expect(next.vaults).toEqual([]);

        const items = [{ uuid: 'v-1' }, { uuid: 'v-2' }] as any[];
        next = reducer(next, actions.listVaultsSuccess({ items }));
        expect(next.isFetchingList).toBe(false);
        expect(next.vaults).toEqual(items);

        next = reducer({ ...next, isFetchingList: true }, actions.listVaultsFailure({ error: 'err' }));
        expect(next.isFetchingList).toBe(false);
    });

    test('createVault / success / failure update flags and detail', () => {
        const request = {
            connectorUuid: 'c-1',
            interfaceUuid: 'V2',
            name: 'vault-1',
            description: 'desc',
            attributes: [],
            customAttributes: [],
        };

        let next = reducer(initialState, actions.createVault({ request }));
        expect(next.isCreating).toBe(true);

        const detail = { uuid: 'v-1', name: 'vault-1' } as any;
        next = reducer(next, actions.createVaultSuccess({ vault: detail }));
        expect(next.isCreating).toBe(false);
        expect(next.vault).toEqual(detail);

        next = reducer({ ...next, isCreating: true }, actions.createVaultFailure({ error: 'failed' }));
        expect(next.isCreating).toBe(false);
    });

    test('updateVault / success / failure update vault and flags', () => {
        const request = { description: 'Updated', attributes: [], customAttributes: [] } as any;
        let next = reducer({ ...initialState, vault: { uuid: 'v-1', name: 'Old' } as any }, actions.updateVault({ uuid: 'v-1', request }));
        expect(next.isUpdating).toBe(true);

        const updated = { uuid: 'v-1', name: 'Old', description: 'Updated' } as any;
        next = reducer(next, actions.updateVaultSuccess({ vault: updated }));
        expect(next.isUpdating).toBe(false);
        expect(next.vault).toEqual(updated);

        next = reducer({ ...next, isUpdating: true }, actions.updateVaultFailure({ error: 'failed' }));
        expect(next.isUpdating).toBe(false);
    });

    test('deleteVault / success / failure update list, detail and flags', () => {
        const items = [{ uuid: 'v-1' } as any, { uuid: 'v-2' } as any];

        let next = reducer({ ...initialState, vaults: items, vault: { uuid: 'v-1' } as any }, actions.deleteVault({ uuid: 'v-1' }));
        expect(next.isDeleting).toBe(true);

        next = reducer(next, actions.deleteVaultSuccess({ uuid: 'v-1' }));
        expect(next.isDeleting).toBe(false);
        expect(next.vaults).toEqual([{ uuid: 'v-2' }]);
        expect(next.vault).toBeUndefined();

        next = reducer({ ...next, isDeleting: true }, actions.deleteVaultFailure({ error: 'failed' }));
        expect(next.isDeleting).toBe(false);
    });

    test('getVaultDetail / success / failure update detail and flags', () => {
        let next = reducer(
            { ...initialState, vault: { uuid: 'old' } as any, isFetchingDetail: false },
            actions.getVaultDetail({ uuid: 'v-1' }),
        );
        expect(next.vault).toBeUndefined();
        expect(next.isFetchingDetail).toBe(true);

        const detail = { uuid: 'v-1', name: 'vault-1' } as any;
        next = reducer(next, actions.getVaultDetailSuccess({ vault: detail }));
        expect(next.isFetchingDetail).toBe(false);
        expect(next.vault).toEqual(detail);

        next = reducer({ ...next, isFetchingDetail: true }, actions.getVaultDetailFailure({ error: 'failed' }));
        expect(next.isFetchingDetail).toBe(false);
    });

    test('getVaultInstanceAttributes / success / failure update descriptors and flags', () => {
        let next = reducer(initialState, actions.getVaultInstanceAttributes({ connectorUuid: 'c-1' }));
        expect(next.isFetchingVaultInstanceAttributes).toBe(true);
        expect(next.vaultInstanceAttributesConnectorUuid).toBe('c-1');

        const attrs = [{ uuid: 'a-1', name: 'Attr1' }] as any[];
        next = reducer(next, actions.getVaultInstanceAttributesSuccess({ connectorUuid: 'c-1', attributes: attrs }));
        expect(next.isFetchingVaultInstanceAttributes).toBe(false);
        expect(next.vaultInstanceAttributeDescriptors).toEqual(attrs);
        expect(next.vaultInstanceAttributesConnectorUuid).toBe('c-1');

        next = reducer(
            { ...next, vaultInstanceAttributesConnectorUuid: 'c-1', vaultInstanceAttributeDescriptors: attrs },
            actions.getVaultInstanceAttributesFailure({ connectorUuid: 'c-1' }),
        );
        expect(next.vaultInstanceAttributeDescriptors).toEqual([]);
        expect(next.vaultInstanceAttributesConnectorUuid).toBeNull();
        expect(next.isFetchingVaultInstanceAttributes).toBe(false);
    });

    test('getVaultInstanceAttributesSuccess ignores result when connectorUuid does not match', () => {
        const attrs = [{ uuid: 'a-1' }] as any[];
        const next = reducer(
            { ...initialState, vaultInstanceAttributesConnectorUuid: 'c-other', isFetchingVaultInstanceAttributes: true },
            actions.getVaultInstanceAttributesSuccess({ connectorUuid: 'c-1', attributes: attrs }),
        );
        expect(next.vaultInstanceAttributeDescriptors).toEqual([]);
        expect(next.vaultInstanceAttributesConnectorUuid).toBe('c-other');
        expect(next.isFetchingVaultInstanceAttributes).toBe(false);
    });

    test('getVaultInstanceAttributesFailure clears descriptors only when connectorUuid matches', () => {
        const attrs = [{ uuid: 'a-1' }] as any[];
        const next = reducer(
            {
                ...initialState,
                vaultInstanceAttributesConnectorUuid: 'c-1',
                vaultInstanceAttributeDescriptors: attrs,
                isFetchingVaultInstanceAttributes: true,
            },
            actions.getVaultInstanceAttributesFailure({ connectorUuid: 'c-other' }),
        );
        expect(next.vaultInstanceAttributeDescriptors).toEqual(attrs);
        expect(next.vaultInstanceAttributesConnectorUuid).toBe('c-1');
        expect(next.isFetchingVaultInstanceAttributes).toBe(false);
    });
});

describe('vaults selectors', () => {
    test('selectors read values from vaults state', () => {
        const attrs = [{ uuid: 'a-1' }] as any[];
        const vaultsState = {
            ...initialState,
            vaults: [{ uuid: 'v-1' } as any],
            vault: { uuid: 'v-1' } as any,
            vaultInstanceAttributeDescriptors: attrs,
            vaultInstanceAttributesConnectorUuid: 'c-1',
            isFetchingVaultInstanceAttributes: true,
            isFetchingList: true,
            isFetchingDetail: true,
            isCreating: true,
            isUpdating: true,
            isDeleting: true,
        };

        const state = { vaults: vaultsState } as any;

        expect(selectors.vaults(state)).toEqual(vaultsState.vaults);
        expect(selectors.vault(state)).toEqual(vaultsState.vault);
        expect(selectors.vaultInstanceAttributeDescriptors(state)).toEqual(attrs);
        expect(selectors.vaultInstanceAttributesConnectorUuid(state)).toBe('c-1');
        expect(selectors.isFetchingVaultInstanceAttributes(state)).toBe(true);
        expect(selectors.isFetchingList(state)).toBe(true);
        expect(selectors.isFetchingDetail(state)).toBe(true);
        expect(selectors.isCreating(state)).toBe(true);
        expect(selectors.isUpdating(state)).toBe(true);
        expect(selectors.isDeleting(state)).toBe(true);
    });
});
