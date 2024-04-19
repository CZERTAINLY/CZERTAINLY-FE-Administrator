import { AppEpic } from 'ducks';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';

import { extractError } from 'utils/net';
import { Resource } from '../types/openapi';
import { actions as alertActions } from './alerts';
import { actions as appRedirectActions } from './app-redirect';
import { slice } from './globalMetadata';
import { actions as userInterfaceActions } from './user-interface';

import { LockWidgetNameEnum } from 'types/user-interface';
import {
    transformConnectorMetadataResponseDtoToModel,
    transformGlobalMetadataCreateRequestModelToDto,
    transformGlobalMetadataDetailResponseDtoToModel,
    transformGlobalMetadataResponseDtoToModel,
    transformGlobalMetadataUpdateRequestModelToDto,
} from './transform/globalMetadata';
import { transformNameAndUuidDtoToModel } from './transform/locations';

const listGlobalMetadata: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listGlobalMetadata.match),
        switchMap(() =>
            deps.apiClients.globalMetadata.listGlobalMetadata().pipe(
                switchMap((list) =>
                    of(
                        slice.actions.listGlobalMetadataSuccess(list.map(transformGlobalMetadataResponseDtoToModel)),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ListOfGlobalMetadata),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.listGlobalMetadataFailure({ error: extractError(err, 'Failed to get Global Metadata list') }),
                        userInterfaceActions.insertWidgetLock(err, LockWidgetNameEnum.ListOfGlobalMetadata),
                    ),
                ),
            ),
        ),
    );
};

const createGlobalMetadata: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.createGlobalMetadata.match),
        switchMap((action) =>
            deps.apiClients.globalMetadata
                .createGlobalMetadata({ globalMetadataCreateRequestDto: transformGlobalMetadataCreateRequestModelToDto(action.payload) })
                .pipe(
                    mergeMap((obj) =>
                        of(
                            slice.actions.createGlobalMetadataSuccess({ uuid: obj.uuid }),
                            appRedirectActions.redirect({ url: `../globalmetadata/detail/${obj.uuid}` }),
                        ),
                    ),
                    catchError((err) =>
                        of(
                            slice.actions.createGlobalMetadataFailure({ error: extractError(err, 'Failed to create global metadata') }),
                            appRedirectActions.fetchError({ error: err, message: 'Failed to create global metadata' }),
                        ),
                    ),
                ),
        ),
    );
};

const updateGlobalMetadata: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.updateGlobalMetadata.match),
        switchMap((action) =>
            deps.apiClients.globalMetadata
                .editGlobalMetadata({
                    uuid: action.payload.uuid,
                    globalMetadataUpdateRequestDto: transformGlobalMetadataUpdateRequestModelToDto(
                        action.payload.globalMetadataUpdateRequest,
                    ),
                })
                .pipe(
                    mergeMap((globalMetadataDetail) =>
                        of(
                            slice.actions.updateGlobalMetadataSuccess(
                                transformGlobalMetadataDetailResponseDtoToModel(globalMetadataDetail),
                            ),
                            appRedirectActions.redirect({ url: `../../globalmetadata/detail/${globalMetadataDetail.uuid}` }),
                        ),
                    ),
                    catchError((err) =>
                        of(
                            slice.actions.updateGlobalMetadataFailure({ error: extractError(err, 'Failed to update global metadata') }),
                            appRedirectActions.fetchError({ error: err, message: 'Failed to update global metadata' }),
                        ),
                    ),
                ),
        ),
    );
};

const getGlobalMetadata: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getGlobalMetadata.match),
        switchMap((action) =>
            deps.apiClients.globalMetadata.getGlobalMetadata({ uuid: action.payload }).pipe(
                switchMap((globalMetadataDetail) =>
                    of(
                        slice.actions.getGlobalMetadataSuccess(transformGlobalMetadataDetailResponseDtoToModel(globalMetadataDetail)),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.GlobalMetadataDetails),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.getGlobalMetadataFailure({ error: extractError(err, 'Failed to get global metadata detail') }),
                        userInterfaceActions.insertWidgetLock(err, LockWidgetNameEnum.GlobalMetadataDetails),
                    ),
                ),
            ),
        ),
    );
};

const getConnectorList: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getConnectorList.match),
        switchMap((action) =>
            deps.apiClients.auth.getObjectsForResource({ resourceName: Resource.Connectors }).pipe(
                map((connectors) => slice.actions.getConnectorListSuccess(connectors.map(transformNameAndUuidDtoToModel))),
                catchError((err) =>
                    of(
                        slice.actions.getConnectorListFailure({ error: extractError(err, 'Failed to get list of connectors') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to get list of connectors' }),
                    ),
                ),
            ),
        ),
    );
};

const getConnectorMetadata: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getConnectorMetadata.match),
        switchMap((action) =>
            deps.apiClients.globalMetadata.getConnectorMetadata({ connectorUuid: action.payload }).pipe(
                map((metadata) => slice.actions.getConnectorMetadataSuccess(metadata.map(transformConnectorMetadataResponseDtoToModel))),
                catchError((err) =>
                    of(
                        slice.actions.getConnectorMetadataFailure({ error: extractError(err, 'Failed to get list of connector metadata') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to get list of connector metadata' }),
                    ),
                ),
            ),
        ),
    );
};

const promoteConnectorMetadata: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.promoteConnectorMetadata.match),
        switchMap((action) =>
            deps.apiClients.globalMetadata
                .promoteConnectorMetadata({
                    connectorMetadataPromotionRequestDto: {
                        uuid: action.payload.uuid,
                        connectorUuid: action.payload.connectorUuid,
                    },
                })
                .pipe(
                    map((obj) =>
                        slice.actions.promoteConnectorMetadataSuccess({
                            uuid: action.payload.uuid,
                            globalMetadata: transformGlobalMetadataDetailResponseDtoToModel(obj),
                        }),
                    ),
                    catchError((err) =>
                        of(
                            slice.actions.promoteConnectorMetadataFailure({
                                error: extractError(err, 'Failed to promote connector metadata'),
                            }),
                            appRedirectActions.fetchError({ error: err, message: 'Failed to promote connector metadata' }),
                        ),
                    ),
                ),
        ),
    );
};

const deleteGlobalMetadata: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteGlobalMetadata.match),
        switchMap((action) =>
            deps.apiClients.globalMetadata.deleteGlobalMetadata({ uuid: action.payload }).pipe(
                mergeMap(() =>
                    of(
                        slice.actions.deleteGlobalMetadataSuccess(action.payload),
                        appRedirectActions.redirect({ url: '../../globalmetadata' }),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.deleteGlobalMetadataFailure({ error: extractError(err, 'Failed to delete global metadata') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to delete global metadata' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkDeleteGlobalMetadata: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDeleteGlobalMetadata.match),
        switchMap((action) =>
            deps.apiClients.globalMetadata.bulkDeleteGlobalMetadata({ requestBody: action.payload }).pipe(
                mergeMap(() =>
                    of(
                        slice.actions.bulkDeleteGlobalMetadataSuccess(action.payload),
                        alertActions.success('Selected global metadata successfully deleted.'),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.bulkDeleteGlobalMetadataFailure({ error: extractError(err, 'Failed to delete global metadata') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to delete global metadata' }),
                    ),
                ),
            ),
        ),
    );
};

const epics = [
    listGlobalMetadata,
    createGlobalMetadata,
    updateGlobalMetadata,
    getGlobalMetadata,
    getConnectorList,
    getConnectorMetadata,
    promoteConnectorMetadata,
    deleteGlobalMetadata,
    bulkDeleteGlobalMetadata,
];

export default epics;
