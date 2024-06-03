import { AppEpic } from 'ducks';
import { iif, of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { LockWidgetNameEnum } from 'types/user-interface';
import { extractError } from 'utils/net';
import { actions as alertActions } from './alerts';
import { actions as appRedirectActions } from './app-redirect';
import { actions as userInterfaceActions } from './user-interface';

import { slice } from './connectors';

import {
    transformAttributeDescriptorCollectionDtoToModel,
    transformAttributeDescriptorDtoToModel,
    transformAttributeRequestModelToDto,
    transformCallbackAttributeModelToDto,
    transformHealthDtoToModel,
} from './transform/attributes';

import {
    transformBulkActionDtoToModel,
    transformConnectorRequestModelToDto,
    transformConnectorResponseDtoToModel,
    transformConnectorUpdateRequestModelToDto,
    transformFunctionGroupDtoToModel,
} from './transform/connectors';

const listConnectors: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.listConnectors.match),
        switchMap(() =>
            deps.apiClients.connectors.listConnectors({}).pipe(
                mergeMap((list) =>
                    of(
                        slice.actions.listConnectorsSuccess({
                            connectorList: list.map(transformConnectorResponseDtoToModel),
                        }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ConnectorStore),
                    ),
                ),

                catchError((error) =>
                    of(
                        slice.actions.listConnectorsFailure(),
                        userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.ConnectorStore),
                    ),
                ),
            ),
        ),
    );
};

const getConnectorDetail: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.getConnectorDetail.match),
        switchMap((action) =>
            deps.apiClients.connectors.getConnector({ uuid: action.payload.uuid }).pipe(
                mergeMap((detail) =>
                    of(
                        slice.actions.getConnectorDetailSuccess({ connector: transformConnectorResponseDtoToModel(detail) }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ConnectorDetails),
                    ),
                ),
                catchError((error) =>
                    of(
                        slice.actions.getConnectorDetailFailure(),
                        userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.ConnectorDetails),
                    ),
                ),
            ),
        ),
    );
};

const getConnectorAttributesDescriptors: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.getConnectorAttributesDescriptors.match),
        switchMap((action) =>
            deps.apiClients.connectors
                .getAttributes({
                    uuid: action.payload.uuid,
                    functionGroup: action.payload.functionGroup,
                    kind: action.payload.kind,
                })
                .pipe(
                    map((attrs) =>
                        slice.actions.getConnectorAttributeDescriptorsSuccess({
                            functionGroup: action.payload.functionGroup,
                            kind: action.payload.kind,
                            attributes: attrs.map(transformAttributeDescriptorDtoToModel),
                        }),
                    ),

                    catchError((error) =>
                        of(
                            slice.actions.getConnectorAttributesDescriptorsFailure(),
                            appRedirectActions.fetchError({ error, message: 'Failed to get connector attributes' }),
                        ),
                    ),
                ),
        ),
    );
};

const getConnectorAllAttributesDescriptors: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.getConnectorAllAttributesDescriptors.match),
        switchMap((action) =>
            deps.apiClients.connectors.getAttributesAll({ uuid: action.payload.uuid }).pipe(
                map(
                    (descColl) =>
                        slice.actions.getConnectorAllAttributesDescriptorsSuccess({
                            attributeDescriptorCollection: transformAttributeDescriptorCollectionDtoToModel(descColl),
                        }),
                    userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ConnectorAttributes),
                ),

                catchError((error) =>
                    of(
                        slice.actions.getAllConnectorAllAttributesDescriptorsFailure(),
                        userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.ConnectorAttributes),
                    ),
                ),
            ),
        ),
    );
};

const getConnectorHealth: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.getConnectorHealth.match),
        switchMap((action) =>
            deps.apiClients.connectors.checkHealth({ uuid: action.payload.uuid }).pipe(
                map((health) => slice.actions.getConnectorHealthSuccess({ health: transformHealthDtoToModel(health) })),

                catchError((error) => of(slice.actions.getConnectorHealthFailure())),
            ),
        ),
    );
};

const createConnector: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.createConnector.match),
        switchMap((action) =>
            deps.apiClients.connectors.createConnector({ connectorRequestDto: transformConnectorRequestModelToDto(action.payload) }).pipe(
                switchMap((obj) =>
                    deps.apiClients.connectors.getConnector({ uuid: obj.uuid }).pipe(
                        mergeMap((connector) =>
                            of(
                                slice.actions.createConnectorSuccess({
                                    connector: transformConnectorResponseDtoToModel(connector),
                                }),
                                appRedirectActions.redirect({ url: `../connectors/detail/${connector.uuid}` }),
                            ),
                        ),

                        catchError((error) =>
                            of(
                                slice.actions.createConnectorFailure(),
                                appRedirectActions.fetchError({ error, message: 'Failed to get created connector' }),
                            ),
                        ),
                    ),
                ),

                catchError((error) =>
                    of(
                        slice.actions.createConnectorFailure(),
                        appRedirectActions.fetchError({ error, message: 'Failed to create connector' }),
                    ),
                ),
            ),
        ),
    );
};

const updateConnector: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.updateConnector.match),
        switchMap((action) =>
            deps.apiClients.connectors
                .editConnector({
                    uuid: action.payload.uuid,
                    connectorUpdateRequestDto: transformConnectorUpdateRequestModelToDto(action.payload.connectorUpdateRequest),
                })
                .pipe(
                    mergeMap((connector) =>
                        of(
                            slice.actions.updateConnectorSuccess({ connector: transformConnectorResponseDtoToModel(connector) }),
                            appRedirectActions.redirect({ url: `../../connectors/detail/${connector.uuid}` }),
                        ),
                    ),

                    catchError((error) =>
                        of(
                            slice.actions.updateConnectorFailure(),
                            appRedirectActions.fetchError({ error, message: 'Failed to update connector' }),
                        ),
                    ),
                ),
        ),
    );
};

const deleteConnector: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteConnector.match),
        switchMap((action) =>
            deps.apiClients.connectors.deleteConnector({ uuid: action.payload.uuid }).pipe(
                mergeMap(() =>
                    of(
                        slice.actions.deleteConnectorSuccess({ uuid: action.payload.uuid }),
                        appRedirectActions.redirect({ url: '../../connectors' }),
                    ),
                ),

                catchError((error) =>
                    of(
                        slice.actions.deleteConnectorFailure({ error: extractError(error, 'Failed to delete connector') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to delete connector' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkDeleteConnectors: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDeleteConnectors.match),
        switchMap((action) =>
            deps.apiClients.connectors.bulkDeleteConnector({ requestBody: action.payload.uuids }).pipe(
                mergeMap((errors) =>
                    of(
                        slice.actions.bulkDeleteConnectorsSuccess({
                            uuids: action.payload.uuids,
                            errors: errors.map(transformBulkActionDtoToModel),
                        }),
                        alertActions.success('Selected connectors successfully deleted.'),
                    ),
                ),

                catchError((error) =>
                    of(
                        slice.actions.bulkDeleteConnectorsFailure(),
                        appRedirectActions.fetchError({ error, message: 'Failed to delete connector' }),
                    ),
                ),
            ),
        ),
    );
};

const connectConnector: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.connectConnector.match),
        switchMap((action) =>
            deps.apiClients.connectors
                .connect({
                    connectRequestDto: {
                        ...action.payload,
                        authAttributes: action.payload.authAttributes?.map(transformAttributeRequestModelToDto),
                    },
                })
                .pipe(
                    map((connection) =>
                        slice.actions.connectConnectorSuccess({
                            connectionDetails: connection.map((connection) => transformFunctionGroupDtoToModel(connection.functionGroup)),
                        }),
                    ),

                    catchError((error) =>
                        of(
                            slice.actions.connectConnectorFailure(),
                            appRedirectActions.fetchError({ error, message: 'Failed to connect to connector' }),
                        ),
                    ),
                ),
        ),
    );
};

const reconnectConnector: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.reconnectConnector.match),
        switchMap((action) =>
            deps.apiClients.connectors.reconnect({ uuid: action.payload.uuid }).pipe(
                mergeMap((connection) =>
                    of(
                        slice.actions.reconnectConnectorSuccess({
                            uuid: action.payload.uuid,
                            functionGroups: connection.map((connection) => transformFunctionGroupDtoToModel(connection.functionGroup)),
                        }),
                        slice.actions.getConnectorHealth({ uuid: action.payload.uuid }),
                    ),
                ),

                catchError((error) =>
                    of(
                        slice.actions.reconnectConnectorFailure(),
                        appRedirectActions.fetchError({ error, message: 'Failed to reconnect to connector' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkReconnectConnectors: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkReconnectConnectors.match),
        switchMap((action) =>
            deps.apiClients.connectors.bulkReconnect({ requestBody: action.payload.uuids }).pipe(
                map(() => slice.actions.bulkReconnectConnectorsSuccess({ uuids: action.payload.uuids })),

                catchError((error) =>
                    of(
                        slice.actions.bulkReconnectConnectorsFailure(),
                        appRedirectActions.fetchError({ error, message: 'Failed to bulk reconnect to connectors' }),
                    ),
                ),
            ),
        ),
    );
};

const authorizeConnector: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.authorizeConnector.match),
        switchMap((action) =>
            deps.apiClients.connectors.approve({ uuid: action.payload.uuid }).pipe(
                mergeMap(() =>
                    of(
                        slice.actions.authorizeConnectorSuccess({ uuid: action.payload.uuid }),
                        slice.actions.getConnectorDetail({ uuid: action.payload.uuid }),
                        slice.actions.getConnectorHealth({ uuid: action.payload.uuid }),
                    ),
                ),

                catchError((error) =>
                    of(
                        slice.actions.authorizeConnectorFailure(),
                        appRedirectActions.fetchError({ error, message: 'Failed to authorize connector' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkAuthorizeConnectors: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkAuthorizeConnectors.match),
        switchMap((action) =>
            deps.apiClients.connectors.bulkApprove({ requestBody: action.payload.uuids }).pipe(
                mergeMap(() =>
                    of(slice.actions.bulkAuthorizeConnectorsSuccess({ uuids: action.payload.uuids }), slice.actions.listConnectors()),
                ),

                catchError((error) =>
                    of(
                        slice.actions.bulkAuthorizeConnectorsFailure(),
                        appRedirectActions.fetchError({ error, message: 'Failed to bulk authorize connectors' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkForceDeleteConnectors: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkForceDeleteConnectors.match),
        switchMap((action) =>
            deps.apiClients.connectors.forceDeleteConnector({ requestBody: action.payload.uuids }).pipe(
                mergeMap(() =>
                    iif(
                        () => !!action.payload.successRedirect,
                        of(
                            slice.actions.bulkForceDeleteConnectorsSuccess({
                                uuids: action.payload.uuids,
                                successRedirect: action.payload.successRedirect,
                            }),
                            appRedirectActions.redirect({ url: action.payload.successRedirect! }),
                        ),
                        of(
                            slice.actions.bulkForceDeleteConnectorsSuccess({
                                uuids: action.payload.uuids,
                                successRedirect: action.payload.successRedirect,
                            }),
                        ),
                    ),
                ),

                catchError((error) =>
                    of(
                        slice.actions.bulkForceDeleteConnectorsFailure(),
                        appRedirectActions.fetchError({ error, message: 'Failed to force delete connectors' }),
                    ),
                ),
            ),
        ),
    );
};

const callbackConnector: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.callbackConnector.match),
        mergeMap((action) =>
            deps.apiClients.callback
                .callback({
                    ...action.payload.callbackConnector,
                    requestAttributeCallback: transformCallbackAttributeModelToDto(
                        action.payload.callbackConnector.requestAttributeCallback,
                    ),
                })
                .pipe(
                    map((data) => {
                        return slice.actions.callbackSuccess({ callbackId: action.payload.callbackId, data });
                    }),

                    catchError((error) =>
                        of(
                            slice.actions.callbackFailure({ callbackId: action.payload.callbackId }),
                            appRedirectActions.fetchError({ error, message: 'Connector callback failure' }),
                        ),
                    ),
                ),
        ),

        catchError((error) =>
            of(
                slice.actions.callbackFailure({ callbackId: '' }),
                appRedirectActions.fetchError({ error, message: 'Failed to perform connector callback' }),
            ),
        ),
    );
};

const callbackResource: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.callbackResource.match),
        mergeMap((action) =>
            deps.apiClients.callback
                .resourceCallback({
                    ...action.payload.callbackResource,
                    requestAttributeCallback: transformCallbackAttributeModelToDto(
                        action.payload.callbackResource.requestAttributeCallback,
                    ),
                })
                .pipe(
                    map((data) => {
                        return slice.actions.callbackSuccess({ callbackId: action.payload.callbackId, data });
                    }),

                    catchError((error) =>
                        of(
                            slice.actions.callbackFailure({ callbackId: action.payload.callbackId }),
                            appRedirectActions.fetchError({ error, message: 'Resource callback failure' }),
                        ),
                    ),
                ),
        ),

        catchError((error) =>
            of(
                slice.actions.callbackFailure({ callbackId: '' }),
                appRedirectActions.fetchError({ error, message: 'Failed to perform resource callback' }),
            ),
        ),
    );
};

const epics = [
    listConnectors,
    getConnectorDetail,
    getConnectorAttributesDescriptors,
    getConnectorAllAttributesDescriptors,
    getConnectorHealth,
    createConnector,
    updateConnector,
    deleteConnector,
    bulkDeleteConnectors,
    connectConnector,
    reconnectConnector,
    bulkReconnectConnectors,
    authorizeConnector,
    bulkAuthorizeConnectors,
    bulkForceDeleteConnectors,
    callbackConnector,
    callbackResource,
];

export default epics;
