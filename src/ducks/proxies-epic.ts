import { AppEpic } from 'ducks';
import { of, forkJoin } from 'rxjs';
import { catchError, filter, switchMap, mergeMap } from 'rxjs/operators';
import { LockWidgetNameEnum } from 'types/user-interface';
import { extractError } from 'utils/net';
import { actions as alertActions } from './alerts';
import { actions as appRedirectActions } from './app-redirect';
import { actions as userInterfaceActions } from './user-interface';

import { slice } from './proxies';

import {
    transformProxyListDtoToModel,
    transformProxyRequestModelToDto,
    transformProxyResponseDtoToModel,
    transformProxyUpdateRequestModelToDto,
} from './transform/proxies';

const listProxies: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.listProxies.match),
        switchMap((action) =>
            deps.apiClients.proxies.listProxies({ status: action.payload?.status }).pipe(
                mergeMap((list) =>
                    of(
                        slice.actions.listProxiesSuccess({
                            proxiesList: list.map(transformProxyListDtoToModel),
                        }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ProxyStore),
                    ),
                ),

                catchError((error) =>
                    of(slice.actions.listProxiesFailure(), userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.ProxyStore)),
                ),
            ),
        ),
    );
};

const getProxyDetail: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.getProxyDetail.match),
        switchMap((action) =>
            deps.apiClients.proxies.getProxy({ uuid: action.payload.uuid }).pipe(
                mergeMap((detail) =>
                    of(
                        slice.actions.getProxyDetailSuccess({ proxy: transformProxyResponseDtoToModel(detail) }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ProxyDetails),
                    ),
                ),
                catchError((error) =>
                    of(
                        slice.actions.getProxyDetailFailure(),
                        userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.ProxyDetails),
                    ),
                ),
            ),
        ),
    );
};

const createProxy: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.createProxy.match),
        switchMap((action) =>
            deps.apiClients.proxies.createProxy({ proxyRequestDto: transformProxyRequestModelToDto(action.payload) }).pipe(
                switchMap((obj) =>
                    deps.apiClients.proxies.getProxy({ uuid: obj.uuid }).pipe(
                        mergeMap((proxy) =>
                            of(
                                slice.actions.createProxySuccess({
                                    proxy: transformProxyResponseDtoToModel(proxy),
                                }),
                                appRedirectActions.redirect({ url: `../proxies/detail/${proxy.uuid}` }),
                            ),
                        ),

                        catchError((error) =>
                            of(
                                slice.actions.createProxyFailure(),
                                appRedirectActions.fetchError({ error, message: 'Failed to get created proxy' }),
                            ),
                        ),
                    ),
                ),

                catchError((error) =>
                    of(slice.actions.createProxyFailure(), appRedirectActions.fetchError({ error, message: 'Failed to create proxy' })),
                ),
            ),
        ),
    );
};

const updateProxy: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.updateProxy.match),
        switchMap((action) =>
            deps.apiClients.proxies
                .editProxy({
                    uuid: action.payload.uuid,
                    proxyUpdateRequestDto: transformProxyUpdateRequestModelToDto(action.payload.proxyUpdateRequest),
                })
                .pipe(
                    mergeMap((proxy) =>
                        of(
                            slice.actions.updateProxySuccess({ proxy: transformProxyResponseDtoToModel(proxy) }),
                            appRedirectActions.redirect({ url: `../../proxies/detail/${proxy.uuid}` }),
                        ),
                    ),

                    catchError((error) =>
                        of(slice.actions.updateProxyFailure(), appRedirectActions.fetchError({ error, message: 'Failed to update proxy' })),
                    ),
                ),
        ),
    );
};

const deleteProxy: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteProxy.match),
        switchMap((action) =>
            deps.apiClients.proxies.deleteProxy({ uuid: action.payload.uuid }).pipe(
                mergeMap(() =>
                    of(
                        slice.actions.deleteProxySuccess({ uuid: action.payload.uuid }),
                        alertActions.success('Proxy successfully deleted'),
                        appRedirectActions.redirect({ url: '../../proxies' }),
                    ),
                ),

                catchError((error) =>
                    of(
                        slice.actions.deleteProxyFailure({ error: extractError(error, 'Failed to delete proxy') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to delete proxy' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkDeleteProxies: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDeleteProxies.match),
        mergeMap((action) =>
            forkJoin(action.payload.uuids.map((uuid) => deps.apiClients.proxies.deleteProxy({ uuid }))).pipe(
                mergeMap(() =>
                    of(
                        slice.actions.bulkDeleteProxiesSuccess({ uuids: action.payload.uuids }),
                        alertActions.success('Proxies successfully deleted'),
                    ),
                ),

                catchError((error) =>
                    of(
                        slice.actions.bulkDeleteProxiesFailure({ error: extractError(error, 'Failed to delete proxies') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to delete proxies' }),
                    ),
                ),
            ),
        ),
    );
};

export default [listProxies, getProxyDetail, createProxy, updateProxy, deleteProxy, bulkDeleteProxies];
