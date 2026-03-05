import { describe, expect, test } from 'vitest';
import reducer, { actions, initialState, selectors } from './proxies';
import { ProxyStatus } from 'types/openapi';

const proxyA = { uuid: 'proxy-a', name: 'Proxy A', status: ProxyStatus.Connected, code: 'proxy-a-code' };
const proxyB = { uuid: 'proxy-b', name: 'Proxy B', status: ProxyStatus.Disconnected, code: 'proxy-b-code' };

describe('proxies rxjs slice', () => {
    test('initial state', () => {
        expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    test('clearDeleteErrorMessages clears error message', () => {
        const startState = { ...initialState, deleteErrorMessage: 'Error' };
        const next = reducer(startState, actions.clearDeleteErrorMessages());
        expect(next.deleteErrorMessage).toBe('');
    });

    test('setCheckedRows updates checked rows', () => {
        const next = reducer(initialState, actions.setCheckedRows({ checkedRows: ['proxy-a'] }));
        expect(next.checkedRows).toEqual(['proxy-a']);
    });

    test('listProxies resets list and sets loading state', () => {
        const startState = { ...initialState, proxies: [proxyA], checkedRows: ['proxy-a'] };
        const next = reducer(startState, actions.listProxies({}));
        expect(next.proxies).toEqual([]);
        expect(next.checkedRows).toEqual([]);
        expect(next.isFetchingList).toBe(true);
    });

    test('listProxiesSuccess stores list and clears loading', () => {
        const next = reducer(initialState, actions.listProxiesSuccess({ proxiesList: [proxyA, proxyB] }));
        expect(next.proxies).toHaveLength(2);
        expect(next.isFetchingList).toBe(false);
    });

    test('listProxiesFailure clears loading', () => {
        const startState = { ...initialState, isFetchingList: true };
        const next = reducer(startState, actions.listProxiesFailure());
        expect(next.isFetchingList).toBe(false);
    });

    test('getProxyDetail resets detail and sets loading', () => {
        const startState = { ...initialState, proxy: proxyA };
        const next = reducer(startState, actions.getProxyDetail({ uuid: 'proxy-a' }));
        expect(next.proxy).toBeUndefined();
        expect(next.isFetchingDetail).toBe(true);
    });

    test('getProxyDetailSuccess updates or appends proxy in list', () => {
        const startState = { ...initialState, proxies: [proxyA] };
        const updated = { ...proxyA, name: 'Proxy A+' } as any;
        const next = reducer(startState, actions.getProxyDetailSuccess({ proxy: updated }));
        expect(next.proxy).toEqual(updated);
        expect(next.proxies).toHaveLength(1);
        expect(next.proxies[0].name).toBe('Proxy A+');
        expect(next.isFetchingDetail).toBe(false);
    });

    test('getProxyDetailSuccess appends if not present', () => {
        const next = reducer(initialState, actions.getProxyDetailSuccess({ proxy: proxyA }));
        expect(next.proxies).toContainEqual(proxyA);
    });

    test('getProxyDetailFailure clears loading', () => {
        const startState = { ...initialState, isFetchingDetail: true };
        const next = reducer(startState, actions.getProxyDetailFailure());
        expect(next.isFetchingDetail).toBe(false);
    });

    test('getProxyInstructions resets instructions and sets loading', () => {
        const startState = { ...initialState, proxyInstructions: 'old' };
        const next = reducer(startState, actions.getProxyInstructions({ uuid: 'proxy-a' }));
        expect(next.proxyInstructions).toBeUndefined();
        expect(next.isFetchingInstructions).toBe(true);
    });

    test('getProxyInstructionsSuccess sets instructions', () => {
        const next = reducer(initialState, actions.getProxyInstructionsSuccess({ instructions: 'new' }));
        expect(next.proxyInstructions).toBe('new');
        expect(next.isFetchingInstructions).toBe(false);
    });

    test('getProxyInstructionsFailure clears loading', () => {
        const startState = { ...initialState, isFetchingInstructions: true };
        const next = reducer(startState, actions.getProxyInstructionsFailure());
        expect(next.isFetchingInstructions).toBe(false);
    });

    test('createProxy sets loading', () => {
        const next = reducer(initialState, actions.createProxy(proxyA as any));
        expect(next.isCreating).toBe(true);
    });

    test('createProxySuccess stores proxy in list and detail', () => {
        const next = reducer(initialState, actions.createProxySuccess({ proxy: proxyA }));
        expect(next.isCreating).toBe(false);
        expect(next.proxy).toEqual(proxyA);
        expect(next.proxies).toHaveLength(1);
    });

    test('createProxySuccess updates if already present', () => {
        const startState = { ...initialState, proxies: [proxyA] };
        const updated = { ...proxyA, name: 'New Name' };
        const next = reducer(startState, actions.createProxySuccess({ proxy: updated }));
        expect(next.proxies[0].name).toBe('New Name');
        expect(next.proxies).toHaveLength(1);
    });

    test('createProxyFailure clears loading', () => {
        const startState = { ...initialState, isCreating: true };
        const next = reducer(startState, actions.createProxyFailure());
        expect(next.isCreating).toBe(false);
    });

    test('updateProxy sets loading', () => {
        const next = reducer(initialState, actions.updateProxy({ uuid: 'proxy-a', proxyUpdateRequest: {} as any }));
        expect(next.isUpdating).toBe(true);
    });

    test('updateProxySuccess updates proxy in list and detail', () => {
        const startState = { ...initialState, proxies: [proxyA] };
        const updated = { ...proxyA, name: 'Proxy A updated' } as any;
        const next = reducer(startState, actions.updateProxySuccess({ proxy: updated }));
        expect(next.isUpdating).toBe(false);
        expect(next.proxies[0].name).toBe('Proxy A updated');
        expect(next.proxy).toEqual(updated);
    });

    test('updateProxySuccess does not append if not present', () => {
        const startState = { ...initialState, proxies: [proxyB] };
        const next = reducer(startState, actions.updateProxySuccess({ proxy: proxyA }));
        expect(next.proxies).toHaveLength(1);
        expect(next.proxies[0]).toEqual(proxyB);
        expect(next.proxy).toEqual(proxyA);
    });

    test('updateProxyFailure clears loading', () => {
        const startState = { ...initialState, isUpdating: true };
        const next = reducer(startState, actions.updateProxyFailure());
        expect(next.isUpdating).toBe(false);
    });

    test('deleteProxy sets loading', () => {
        const next = reducer(initialState, actions.deleteProxy({ uuid: 'proxy-a' }));
        expect(next.isDeleting).toBe(true);
    });

    test('deleteProxySuccess removes proxy from list', () => {
        const startState = { ...initialState, proxies: [proxyA], isDeleting: true };
        const next = reducer(startState, actions.deleteProxySuccess({ uuid: 'proxy-a' }));
        expect(next.proxies).toEqual([]);
        expect(next.isDeleting).toBe(false);
    });

    test('deleteProxyFailure stores error message', () => {
        const next = reducer(initialState, actions.deleteProxyFailure({ error: 'Failed to delete' }));
        expect(next.isDeleting).toBe(false);
        expect(next.deleteErrorMessage).toBe('Failed to delete');
    });

    test('bulkDeleteProxies sets loading and clears checked rows', () => {
        const startState = { ...initialState, checkedRows: ['proxy-a'] };
        const next = reducer(startState, actions.bulkDeleteProxies({ uuids: ['proxy-a'] }));
        expect(next.isBulkDeleting).toBe(true);
        expect(next.checkedRows).toEqual([]);
    });

    test('bulkDeleteProxiesSuccess removes deleted proxies', () => {
        const startState = { ...initialState, proxies: [proxyA, proxyB] };
        const next = reducer(startState, actions.bulkDeleteProxiesSuccess({ uuids: ['proxy-a'] }));
        expect(next.proxies).toEqual([proxyB]);
        expect(next.isBulkDeleting).toBe(false);
    });

    test('bulkDeleteProxiesFailure stores error message', () => {
        const next = reducer(initialState, actions.bulkDeleteProxiesFailure({ error: 'Bulk delete failed' }));
        expect(next.isBulkDeleting).toBe(false);
        expect(next.deleteErrorMessage).toBe('Bulk delete failed');
    });

    test('resetState restores initial state', () => {
        const modified = { ...initialState, proxies: [proxyA], isCreating: true, extra: 'field' } as any;
        const next = reducer(modified, actions.resetState());
        expect(next).toEqual(initialState);
        expect((next as any).extra).toBeUndefined();
    });
});
