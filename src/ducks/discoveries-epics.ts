import { AppEpic } from 'ducks';
import { iif, of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { extractError } from 'utils/net';
import { FunctionGroupCode, UuidDto } from '../types/openapi';
import { actions as alertActions } from './alerts';
import { actions as appRedirectActions } from './app-redirect';
import { actions as userInterfaceActions } from './user-interface';

import { store } from 'index';
import { LockWidgetNameEnum } from 'types/user-interface';
import { slice } from './discoveries';
import { EntityType } from './filters';
import { actions as pagingActions } from './paging';
import { transformAttributeDescriptorDtoToModel } from './transform/attributes';
import { transformSearchRequestModelToDto } from './transform/certificates';
import { transformConnectorResponseDtoToModel } from './transform/connectors';
import {
    transformDiscoveryCertificateListDtoToModel,
    transformDiscoveryRequestModelToDto,
    transformDiscoveryResponseDetailDtoToModel,
    transformDiscoveryResponseDtoToModel,
} from './transform/discoveries';

const listDiscoveries: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listDiscoveries.match),
        switchMap((action) => {
            store.dispatch(pagingActions.list(EntityType.DISCOVERY));
            return deps.apiClients.discoveries.listDiscoveries({ searchRequestDto: transformSearchRequestModelToDto(action.payload) }).pipe(
                mergeMap((discoveryResponse) =>
                    of(
                        slice.actions.listDiscoveriesSuccess(discoveryResponse.discoveries.map(transformDiscoveryResponseDtoToModel)),
                        pagingActions.listSuccess({ entity: EntityType.DISCOVERY, totalItems: discoveryResponse.totalItems }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.DiscoveriesStore),
                    ),
                ),

                catchError((err) =>
                    of(
                        pagingActions.listFailure(EntityType.DISCOVERY),
                        userInterfaceActions.insertWidgetLock(err, LockWidgetNameEnum.DiscoveriesStore),
                    ),
                ),
            );
        }),
    );
};

const getDiscoveryDetail: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getDiscoveryDetail.match),

        switchMap((action) =>
            deps.apiClients.discoveries.getDiscovery({ uuid: action.payload.uuid }).pipe(
                switchMap((discoveryDto) =>
                    of(
                        slice.actions.getDiscoveryDetailSuccess({ discovery: transformDiscoveryResponseDetailDtoToModel(discoveryDto) }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.DiscoveryDetails),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.getDiscoveryDetailFailure({ error: extractError(err, 'Failed to get Discovery detail') }),
                        userInterfaceActions.insertWidgetLock(err, LockWidgetNameEnum.DiscoveryDetails),
                    ),
                ),
            ),
        ),
    );
};

const listDiscoveryProviders: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.listDiscoveryProviders.match),
        switchMap(() =>
            deps.apiClients.connectors.listConnectors({ functionGroup: FunctionGroupCode.DiscoveryProvider }).pipe(
                map((providers) =>
                    slice.actions.listDiscoveryProvidersSuccess({
                        connectors: providers.map(transformConnectorResponseDtoToModel),
                    }),
                ),

                catchError((err) =>
                    of(
                        slice.actions.listDiscoveryProvidersFailure({ error: extractError(err, 'Failed to get Discovery Provider list') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to get Discovery Provider list' }),
                    ),
                ),
            ),
        ),
    );
};

const getDiscoveryProviderAttributesDescriptors: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.getDiscoveryProviderAttributesDescriptors.match),
        switchMap((action) =>
            deps.apiClients.connectors
                .getAttributes({
                    uuid: action.payload.uuid,
                    functionGroup: FunctionGroupCode.DiscoveryProvider,
                    kind: action.payload.kind,
                })
                .pipe(
                    map((attributeDescriptors) =>
                        slice.actions.getDiscoveryProviderAttributesDescriptorsSuccess({
                            attributeDescriptor: attributeDescriptors.map(transformAttributeDescriptorDtoToModel),
                        }),
                    ),

                    catchError((err) =>
                        of(
                            slice.actions.getDiscoveryProviderAttributeDescriptorsFailure({
                                error: extractError(err, 'Failed to get Discovery Provider Attribute list'),
                            }),
                            appRedirectActions.fetchError({ error: err, message: 'Failed to get Discovery Provider Attribute list' }),
                        ),
                    ),
                ),
        ),
    );
};

const getDiscoveryCertificates: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.getDiscoveryCertificates.match),
        switchMap((action) =>
            deps.apiClients.discoveries.getDiscoveryCertificates(action.payload).pipe(
                map((certificates) =>
                    slice.actions.getDiscoveryCertificatesSuccess(transformDiscoveryCertificateListDtoToModel(certificates)),
                ),
                catchError((err) =>
                    of(
                        slice.actions.getDiscoveryCertificatesFailure({
                            error: extractError(err, 'Failed to get Discovery Certificates list'),
                        }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to get Discovery Certificates list' }),
                    ),
                ),
            ),
        ),
    );
};

const createDiscovery: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.createDiscovery.match),
        switchMap((action) => {
            const url = action.payload.scheduled ? '../../jobs/detail/' : '../discoveries/detail/';
            return iif(
                () => action.payload.scheduled,
                deps.apiClients.discoveries.scheduleDiscovery({
                    scheduleDiscoveryDto: {
                        jobName: action.payload.jobName,
                        cronExpression: action.payload.cronExpression,
                        oneTime: action.payload.oneTime,
                        request: transformDiscoveryRequestModelToDto(action.payload.request),
                    },
                }),
                deps.apiClients.discoveries.createDiscovery({ discoveryDto: transformDiscoveryRequestModelToDto(action.payload.request) }),
            ).pipe(
                mergeMap((obj: UuidDto) =>
                    of(slice.actions.createDiscoverySuccess({ uuid: obj.uuid }), appRedirectActions.redirect({ url: `${url}${obj.uuid}` })),
                ),

                catchError((err) =>
                    of(
                        slice.actions.createDiscoveryFailure({ error: extractError(err, 'Failed to create discovery') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to create discovery' }),
                    ),
                ),
            );
        }),
    );
};

const deleteDiscovery: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteDiscovery.match),
        switchMap((action) =>
            deps.apiClients.discoveries.deleteDiscovery({ uuid: action.payload.uuid }).pipe(
                mergeMap(() =>
                    of(
                        slice.actions.deleteDiscoverySuccess({ uuid: action.payload.uuid }),
                        appRedirectActions.redirect({ url: '../../discoveries' }),
                    ),
                ),

                catchError((err) =>
                    of(
                        slice.actions.deleteDiscoveryFailure({ error: extractError(err, 'Failed to delete discovery') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to delete discovery' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkDeleteDiscovery: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDeleteDiscovery.match),
        switchMap((action) =>
            deps.apiClients.discoveries.bulkDeleteDiscovery({ requestBody: action.payload.uuids }).pipe(
                mergeMap(() =>
                    of(
                        slice.actions.bulkDeleteDiscoverySuccess({ uuids: action.payload.uuids }),
                        alertActions.success('Selected discoveries successfully deleted.'),
                    ),
                ),

                catchError((err) =>
                    of(
                        slice.actions.bulkDeleteDiscoveryFailure({ error: extractError(err, 'Failed to bulk delete Discoveries') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to bulk delete Discoveries' }),
                    ),
                ),
            ),
        ),
    );
};

const epics = [
    listDiscoveries,
    getDiscoveryDetail,
    listDiscoveryProviders,
    getDiscoveryProviderAttributesDescriptors,
    getDiscoveryCertificates,
    createDiscovery,
    deleteDiscovery,
    bulkDeleteDiscovery,
];

export default epics;
