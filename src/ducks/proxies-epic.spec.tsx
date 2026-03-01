import { Action } from 'redux';
import { Subject, lastValueFrom, of, throwError } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { StateObservable } from 'redux-observable';

import { test, expect } from '../../playwright/ct-test';
import { backendClient } from '../api';
import { actions as alertActions } from './alerts';
import { actions as appRedirectActions } from './app-redirect';
import { actions as proxiesActions } from './proxies';
import { actions as userInterfaceActions } from './user-interface';
import { AppEpic, EpicDependencies } from './index';
import { bulkDeleteProxies, createProxy, deleteProxy, listProxies, updateProxy } from './proxies-epic';
import type { ProxyManagementApi } from 'types/openapi';
import { LockTypeEnum, LockWidgetNameEnum } from 'types/user-interface';

const proxyList = [{ uuid: 'proxy-1', name: 'Proxy 1' }] as any;
const proxyDetail = { uuid: 'proxy-1', name: 'Proxy 1' } as any;

test.describe('proxies epics', () => {
    test('listProxies success emits listProxiesSuccess and removes lock', async () => {
        const deps = createDeps({
            listProxies: (request?: any) => of(proxyList),
        });

        const result = await runEpic(listProxies, proxiesActions.listProxies({}), deps);
        expect(result).toEqual([
            proxiesActions.listProxiesSuccess({ proxiesList: proxyList }),
            userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ProxyStore),
        ]);
    });

    test('listProxies failure emits listProxiesFailure and inserts lock', async () => {
        const errorPayload = { lockTitle: 'Locked', lockText: 'Nope', lockType: LockTypeEnum.GENERIC };
        const deps = createDeps({
            listProxies: (request?: any) => throwError(() => errorPayload),
        });

        const result = await runEpic(listProxies, proxiesActions.listProxies({}), deps);
        expect(result[0].type).toBe(proxiesActions.listProxiesFailure.type);
        expect(result[1].type).toBe(userInterfaceActions.insertWidgetLock.type);
        expect(result[1].payload.widgetName).toBe(LockWidgetNameEnum.ProxyStore);
        expect(result[1].payload.lockTitle).toBe('Locked');
    });

    test('createProxy success emits createProxySuccess and redirect', async () => {
        const deps = createDeps({
            createProxy: (request: any) => of({ uuid: 'proxy-1' } as any),
            getProxy: (request: any) => of(proxyDetail),
        });

        const result = await runEpic(createProxy, proxiesActions.createProxy(proxyDetail), deps);
        expect(result).toEqual([
            proxiesActions.createProxySuccess({ proxy: proxyDetail }),
            appRedirectActions.redirect({ url: '../proxies/detail/proxy-1' }),
        ]);
    });

    test('createProxy failure emits createProxyFailure and fetchError', async () => {
        const error = new Error('Create failed');
        const deps = createDeps({
            createProxy: (request: any) => throwError(() => error),
        });

        const result = await runEpic(createProxy, proxiesActions.createProxy(proxyDetail), deps);
        expect(result[0].type).toBe(proxiesActions.createProxyFailure.type);
        expect(result[1].type).toBe(appRedirectActions.fetchError.type);
        expect(result[1].payload.message).toBe('Failed to create proxy');
    });

    test('updateProxy success emits updateProxySuccess and redirect', async () => {
        const deps = createDeps({
            editProxy: (request: any) => of(proxyDetail),
        });

        const result = await runEpic(updateProxy, proxiesActions.updateProxy({ uuid: 'proxy-1', proxyUpdateRequest: proxyDetail }), deps);
        expect(result).toEqual([
            proxiesActions.updateProxySuccess({ proxy: proxyDetail }),
            appRedirectActions.redirect({ url: '../../proxies/detail/proxy-1' }),
        ]);
    });

    test('deleteProxy success emits deleteProxySuccess, alert success, and redirect', async () => {
        const deps = createDeps({
            deleteProxy: (_request: any) => of(undefined),
        });

        const result = await runEpic(deleteProxy, proxiesActions.deleteProxy({ uuid: 'proxy-1' }), deps);
        expect(result).toEqual([
            proxiesActions.deleteProxySuccess({ uuid: 'proxy-1' }),
            alertActions.success('Proxy successfully deleted'),
            appRedirectActions.redirect({ url: '../../proxies' }),
        ]);
    });

    test('bulkDeleteProxies failure emits bulkDeleteProxiesFailure and fetchError', async () => {
        const error = new Error('Bulk delete failed');
        const deps = createDeps({
            deleteProxy: (_request: any) => throwError(() => error),
        });

        const result = await runEpic(bulkDeleteProxies, proxiesActions.bulkDeleteProxies({ uuids: ['proxy-1'] }), deps);
        expect(result[0].type).toBe(proxiesActions.bulkDeleteProxiesFailure.type);
        expect(result[0].payload.error).toBe('Failed to delete proxies. Bulk delete failed');
        expect(result[1].type).toBe(appRedirectActions.fetchError.type);
        expect(result[1].payload.message).toBe('Failed to delete proxies');
    });
});

const createState$ = () => new StateObservable(new Subject<any>(), {});

const createDeps = (proxiesOverrides: Partial<ProxyManagementApi> = {}): EpicDependencies => {
    const proxies = backendClient.proxies.withMiddleware([]);
    Object.assign(proxies, proxiesOverrides);

    return {
        apiClients: {
            ...backendClient,
            proxies,
        },
    };
};

const runEpic = async (epic: AppEpic, action: Action, deps: EpicDependencies) => {
    const output$ = epic(of(action), createState$(), deps).pipe(toArray());
    return lastValueFrom(output$);
};
