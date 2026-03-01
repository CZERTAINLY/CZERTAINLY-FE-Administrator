import { test, expect } from '../../playwright/ct-test';
import reducer, { actions, initialState } from './proxies';
import { ProxyStatus } from 'types/openapi';

const proxyA = { uuid: 'proxy-a', name: 'Proxy A', status: ProxyStatus.Connected, code: 'proxy-a-code' };
const proxyB = { uuid: 'proxy-b', name: 'Proxy B', status: ProxyStatus.Disconnected, code: 'proxy-b-code' };

test.describe('proxies rxjs slice', () => {
    test('initial state', () => {
        expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
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

    test('getProxyDetailSuccess updates or appends proxy in list', () => {
        const startState = { ...initialState, proxies: [proxyA] };
        const updated = { ...proxyA, name: 'Proxy A+' } as any;
        const next = reducer(startState, actions.getProxyDetailSuccess({ proxy: updated }));
        expect(next.proxy).toEqual(updated);
        expect(next.proxies).toHaveLength(1);
        expect(next.proxies[0].name).toBe('Proxy A+');
    });

    test('createProxySuccess stores proxy in list and detail', () => {
        const next = reducer(initialState, actions.createProxySuccess({ proxy: proxyA }));
        expect(next.isCreating).toBe(false);
        expect(next.proxy).toEqual(proxyA);
        expect(next.proxies).toHaveLength(1);
    });

    test('updateProxySuccess updates proxy in list and detail', () => {
        const startState = { ...initialState, proxies: [proxyA] };
        const updated = { ...proxyA, name: 'Proxy A updated' } as any;
        const next = reducer(startState, actions.updateProxySuccess({ proxy: updated }));
        expect(next.isUpdating).toBe(false);
        expect(next.proxies[0].name).toBe('Proxy A updated');
        expect(next.proxy).toEqual(updated);
    });

    test('deleteProxyFailure stores error message', () => {
        const next = reducer(initialState, actions.deleteProxyFailure({ error: 'Failed to delete' }));
        expect(next.isDeleting).toBe(false);
        expect(next.deleteErrorMessage).toBe('Failed to delete');
    });

    test('bulkDeleteProxiesSuccess removes deleted proxies', () => {
        const startState = { ...initialState, proxies: [proxyA, proxyB] };
        const next = reducer(startState, actions.bulkDeleteProxiesSuccess({ uuids: ['proxy-a'] }));
        expect(next.proxies).toEqual([proxyB]);
        expect(next.isBulkDeleting).toBe(false);
    });

    test('resetState restores initial state', () => {
        const modified = { ...initialState, proxies: [proxyA], isCreating: true };
        const next = reducer(modified, actions.resetState());
        expect(next).toEqual(initialState);
    });
});
