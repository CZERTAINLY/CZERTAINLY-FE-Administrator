import { describe, expect, test } from 'vitest';

import reducer, { actions, initialState, selectors } from './oids';

describe('oids slice', () => {
    test('returns initial state for unknown action', () => {
        expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    test('resetState restores initial values', () => {
        const dirty = {
            ...initialState,
            oid: { oid: '1.2.3' } as any,
            oids: [{ oid: '1.2.3' } as any],
            isFetching: true,
            tempKey: 'gone',
        } as any;

        const next = reducer(dirty, actions.resetState());

        expect(next).toEqual(initialState);
        expect((next as any).tempKey).toBeUndefined();
    });

    test('listOIDs / success / failure', () => {
        let next = reducer(initialState, actions.listOIDs({ filters: [] } as any));
        expect(next.isFetching).toBe(true);
        expect(next.oids).toEqual([]);

        const items = [{ oid: '1.2.3' }, { oid: '1.2.4' }] as any[];
        next = reducer(next, actions.listOIDsSuccess({ oids: items }));
        expect(next.isFetching).toBe(false);
        expect(next.oids).toEqual(items);

        next = reducer({ ...next, isFetching: true }, actions.listOIDsFailure({ error: 'err' }));
        expect(next.isFetching).toBe(false);
    });

    test('getOID / success / failure', () => {
        let next = reducer(initialState, actions.getOID({ oid: '1.2.3' }));
        expect(next.isFetching).toBe(true);

        const oid = { oid: '1.2.3', description: 'Test' } as any;
        next = reducer(next, actions.getOIDSuccess({ oid }));
        expect(next.isFetching).toBe(false);
        expect(next.oid).toEqual(oid);

        next = reducer({ ...next, isFetching: true }, actions.getOIDFailure({ error: 'err' }));
        expect(next.isFetching).toBe(false);
    });

    test('createOID / success / failure', () => {
        let next = reducer(initialState, actions.createOID({ oid: { oid: '1.2.3', description: 'New' } as any }));
        expect(next.isCreating).toBe(true);
        expect(next.createOidSucceeded).toBe(false);

        const oid = { oid: '1.2.3', description: 'New' } as any;
        next = reducer(next, actions.createOIDSuccess({ oid }));
        expect(next.isCreating).toBe(false);
        expect(next.createOidSucceeded).toBe(true);
        expect(next.oid).toEqual(oid);

        next = reducer({ ...next, isCreating: true }, actions.createOIDFailure({ error: 'err' }));
        expect(next.isCreating).toBe(false);
        expect(next.createOidSucceeded).toBe(false);
    });

    test('updateOID / success / failure', () => {
        let next = reducer(initialState, actions.updateOID({ oid: '1.2.3', data: { description: 'Updated' } as any }));
        expect(next.isUpdating).toBe(true);
        expect(next.updateOidSucceeded).toBe(false);

        const oid = { oid: '1.2.3', description: 'Updated' } as any;
        next = reducer(next, actions.updateOIDSuccess({ oid }));
        expect(next.isUpdating).toBe(false);
        expect(next.updateOidSucceeded).toBe(true);
        expect(next.oid).toEqual(oid);

        next = reducer({ ...next, isUpdating: true }, actions.updateOIDFailure({ error: 'err' }));
        expect(next.isUpdating).toBe(false);
        expect(next.updateOidSucceeded).toBe(false);
    });

    test('deleteOID / success removes from list / failure', () => {
        const items = [{ oid: '1.2.3' } as any, { oid: '1.2.4' } as any];

        let next = reducer({ ...initialState, oids: items }, actions.deleteOID({ oid: '1.2.3' }));
        expect(next.isDeleting).toBe(true);

        next = reducer(next, actions.deleteOIDSuccess({ oid: '1.2.3' }));
        expect(next.isDeleting).toBe(false);
        expect(next.oids).toEqual([{ oid: '1.2.4' }]);

        next = reducer({ ...next, isDeleting: true }, actions.deleteOIDFailure({ error: 'err' }));
        expect(next.isDeleting).toBe(false);
    });

    test('bulkDeleteOIDs / success removes multiple / failure', () => {
        const items = [{ oid: '1.2.3' } as any, { oid: '1.2.4' } as any, { oid: '1.2.5' } as any];

        let next = reducer({ ...initialState, oids: items }, actions.bulkDeleteOIDs({ oids: ['1.2.3', '1.2.4'] }));
        expect(next.isDeleting).toBe(true);

        next = reducer(next, actions.bulkDeleteOIDsSuccess({ oids: ['1.2.3', '1.2.4'] }));
        expect(next.isDeleting).toBe(false);
        expect(next.oids).toEqual([{ oid: '1.2.5' }]);

        next = reducer({ ...next, isDeleting: true }, actions.bulkDeleteOIDsFailure({ error: 'err' }));
        expect(next.isDeleting).toBe(false);
    });
});

describe('oids selectors', () => {
    test('selectors read values from oids state', () => {
        const oid = { oid: '1.2.3', description: 'Test' } as any;
        const featureState = {
            ...initialState,
            oid,
            oids: [oid],
            isFetching: true,
            isCreating: true,
            createOidSucceeded: true,
            isUpdating: true,
            updateOidSucceeded: true,
            isDeleting: true,
        };

        const state = { oids: featureState } as any;

        expect(selectors.oid(state)).toEqual(oid);
        expect(selectors.oids(state)).toEqual([oid]);
        expect(selectors.isFetching(state)).toBe(true);
        expect(selectors.isCreating(state)).toBe(true);
        expect(selectors.createOidSucceeded(state)).toBe(true);
        expect(selectors.isUpdating(state)).toBe(true);
        expect(selectors.updateOidSucceeded(state)).toBe(true);
        expect(selectors.isDeleting(state)).toBe(true);
    });
});
