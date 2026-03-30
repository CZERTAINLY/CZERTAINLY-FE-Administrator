import { from, iif, of } from 'rxjs';
import { catchError, concatMap, filter, map, mergeMap, switchMap, toArray } from 'rxjs/operators';

import { AppEpic } from 'ducks';
import { extractError } from 'utils/net';

import { store } from '../App';
import { actions as appRedirectActions } from './app-redirect';
import { slice } from './entities';
import { EntityType } from './filters';
import { actions as pagingActions } from './paging';
import { actions as userInterfaceActions } from './user-interface';

import { FunctionGroupCode } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';
import { transformAttributeDescriptorDtoToModel, transformAttributeRequestModelToDto } from './transform/attributes';
import { transformSearchRequestModelToDto } from './transform/certificates';
import { transformConnectorResponseDtoToModel } from './transform/connectors';
import { transformEntityRequestModelToDto, transformEntityResponseDtoToModel } from './transform/entities';

const listEntityProviders: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.listEntityProviders.match),
        switchMap(() =>
            deps.apiClients.connectors.listConnectors({ functionGroup: FunctionGroupCode.EntityProvider }).pipe(
                map((providers) =>
                    slice.actions.listEntityProvidersSuccess({
                        providers: providers.map(transformConnectorResponseDtoToModel),
                    }),
                ),

                catchError((error) =>
                    of(
                        slice.actions.listEntityProvidersFailure({ error: extractError(error, 'Failed to get Entity Provider list') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to get Entity Provider list' }),
                    ),
                ),
            ),
        ),
    );
};

const getEntityProviderAttributesDescriptors: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.getEntityProviderAttributesDescriptors.match),
        switchMap((action) =>
            deps.apiClients.connectors
                .getAttributes({
                    uuid: action.payload.uuid,
                    functionGroup: FunctionGroupCode.EntityProvider,
                    kind: action.payload.kind,
                })
                .pipe(
                    map((attributeDescriptors) =>
                        slice.actions.getEntityProviderAttributesDescriptorsSuccess({
                            attributeDescriptor: attributeDescriptors.map(transformAttributeDescriptorDtoToModel),
                        }),
                    ),

                    catchError((error) =>
                        of(
                            slice.actions.getEntityProviderAttributeDescriptorsFailure({
                                error: extractError(error, 'Failed to get Entity Provider Attribute Descriptor list'),
                            }),
                            appRedirectActions.fetchError({ error, message: 'Failed to get Entity Provider Attribute Descriptor list' }),
                        ),
                    ),
                ),
        ),
    );
};

const listEntities: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listEntities.match),
        switchMap((action) => {
            store.dispatch(pagingActions.list(EntityType.ENTITY));
            return deps.apiClients.entities
                .listEntityInstances({ searchRequestDto: transformSearchRequestModelToDto(action.payload) })
                .pipe(
                    mergeMap((entityResponse) =>
                        of(
                            slice.actions.listEntitiesSuccess(entityResponse.entities.map(transformEntityResponseDtoToModel)),
                            pagingActions.listSuccess({ entity: EntityType.ENTITY, totalItems: entityResponse.totalItems }),
                            userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.EntityStore),
                        ),
                    ),

                    catchError((error) =>
                        of(
                            pagingActions.listFailure(EntityType.ENTITY),
                            userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.EntityStore),
                        ),
                    ),
                );
        }),
    );
};

const getEntityDetail: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getEntityDetail.match),
        switchMap((action) =>
            deps.apiClients.entities.getEntityInstance({ entityUuid: action.payload.uuid }).pipe(
                switchMap((entity) =>
                    of(
                        slice.actions.getEntityDetailSuccess({ entity: transformEntityResponseDtoToModel(entity) }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.EntityDetails),
                    ),
                ),

                catchError((error) =>
                    of(
                        slice.actions.getEntityDetailFailure({ error: extractError(error, 'Failed to get Entity detail') }),
                        userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.EntityDetails),
                    ),
                ),
            ),
        ),
    );
};

const addEntity: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.addEntity.match),
        switchMap((action) =>
            deps.apiClients.entities
                .createEntityInstance({ entityInstanceRequestDto: transformEntityRequestModelToDto(action.payload) })
                .pipe(
                    mergeMap((obj) =>
                        of(
                            slice.actions.addEntitySuccess({ uuid: obj.uuid }),
                            appRedirectActions.redirect({ url: `../entities/detail/${obj.uuid}` }),
                        ),
                    ),

                    catchError((error) =>
                        of(
                            slice.actions.addEntityFailure({ error: extractError(error, 'Failed to add Entity') }),
                            appRedirectActions.fetchError({ error, message: 'Failed to add Entity' }),
                        ),
                    ),
                ),
        ),
    );
};

const updateEntity: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.updateEntity.match),
        switchMap((action) =>
            deps.apiClients.entities
                .editEntityInstance({
                    entityUuid: action.payload.uuid,
                    entityInstanceUpdateRequestDto: {
                        attributes: action.payload.attributes.map(transformAttributeRequestModelToDto),
                        customAttributes: action.payload.customAttributes?.map(transformAttributeRequestModelToDto),
                    },
                })
                .pipe(
                    mergeMap((entity) =>
                        of(
                            slice.actions.updateEntitySuccess({ entity: transformEntityResponseDtoToModel(entity) }),
                            appRedirectActions.redirect({ url: `../../entities/detail/${entity.uuid}` }),
                        ),
                    ),

                    catchError((error) =>
                        of(
                            slice.actions.updateEntityFailure({ error: extractError(error, 'Failed to update Entity') }),
                            appRedirectActions.fetchError({ error, message: 'Failed to update Entity' }),
                        ),
                    ),
                ),
        ),
    );
};

const deleteEntity: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteEntity.match),
        mergeMap((action) =>
            deps.apiClients.entities.deleteEntityInstance({ entityUuid: action.payload.uuid }).pipe(
                mergeMap(() =>
                    iif(
                        () => !!action.payload.redirect,
                        of(
                            slice.actions.deleteEntitySuccess({ uuid: action.payload.uuid, redirect: action.payload.redirect }),
                            appRedirectActions.redirect({ url: action.payload.redirect! }),
                        ),
                        of(slice.actions.deleteEntitySuccess({ uuid: action.payload.uuid, redirect: action.payload.redirect })),
                    ),
                ),

                catchError((error) =>
                    of(
                        slice.actions.deleteEntityFailure({ error: extractError(error, 'Failed to delete Entity') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to delete Entity' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkDeleteEntities: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDeleteEntities.match),
        switchMap((action) =>
            from(action.payload.uuids).pipe(
                concatMap((uuid) =>
                    deps.apiClients.entities.deleteEntityInstance({ entityUuid: uuid }).pipe(
                        map(() => ({ uuid, ok: true })),
                        catchError(() => of({ uuid, ok: false })),
                    ),
                ),
                toArray(),
                mergeMap((results) => {
                    const deletedUuids = results.filter((result) => result.ok).map((result) => result.uuid);
                    const failedDeletes = results.length - deletedUuids.length;

                    if (failedDeletes === 0) {
                        return of(slice.actions.bulkDeleteEntitiesSuccess({ uuids: deletedUuids }));
                    }

                    return of(
                        slice.actions.bulkDeleteEntitiesSuccess({ uuids: deletedUuids }),
                        slice.actions.bulkDeleteEntitiesFailure({
                            error: `Failed to delete ${failedDeletes} entit${failedDeletes === 1 ? 'y' : 'ies'}`,
                        }),
                        appRedirectActions.fetchError({
                            error: undefined,
                            message: `Failed to delete ${failedDeletes} entit${failedDeletes === 1 ? 'y' : 'ies'}`,
                        }),
                    );
                }),
                catchError((error) =>
                    of(
                        slice.actions.bulkDeleteEntitiesFailure({ error: extractError(error, 'Failed to delete Entities') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to delete Entities' }),
                    ),
                ),
            ),
        ),
    );
};

const listLocationAttributeDescriptors: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listLocationAttributeDescriptors.match),
        switchMap((action) =>
            deps.apiClients.entities.listLocationAttributes({ entityUuid: action.payload.entityUuid }).pipe(
                map((descriptors) =>
                    slice.actions.listLocationAttributeDescriptorsSuccess({
                        descriptors: descriptors.map(transformAttributeDescriptorDtoToModel),
                    }),
                ),

                catchError((error) =>
                    of(
                        slice.actions.listLocationAttributeDescriptorsFailure({
                            error: extractError(error, 'Failed to get Location Attribute Descriptors'),
                        }),
                        appRedirectActions.fetchError({ error, message: 'Failed to get Location Attribute Descriptors' }),
                    ),
                ),
            ),
        ),
    );
};

const epics = [
    listEntityProviders,
    getEntityProviderAttributesDescriptors,
    listEntities,
    getEntityDetail,
    addEntity,
    updateEntity,
    deleteEntity,
    bulkDeleteEntities,
    listLocationAttributeDescriptors,
];

export default epics;
