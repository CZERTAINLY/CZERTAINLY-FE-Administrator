import { AppEpic } from "ducks";
import { of } from "rxjs";
import { catchError, filter, map, mergeMap, switchMap } from "rxjs/operators";
import { extractError } from "utils/net";
import { actions as alertActions } from "./alerts";
import { actions as appRedirectActions } from "./app-redirect";
import { actions as widgetLockActions } from "./widget-locks";

import { AnyAction } from "@reduxjs/toolkit";
import { store } from "index";
import { FunctionGroupCode } from "types/openapi";
import { LockWidgetNameEnum } from "types/widget-locks";
import { EntityType } from "./filters";
import { slice } from "./notifications";
import { actions as pagingActions } from "./paging";
import { transformAttributeDescriptorDtoToModel } from "./transform/attributes";
import { transformSearchRequestModelToDto } from "./transform/certificates";
import { transformConnectorResponseDtoToModel } from "./transform/connectors";
import {
    transformNotificationDtoToModel,
    transformNotificationInstanceDtoToModel,
    transformNotificationInstanceModelToDto,
} from "./transform/notifications";

const listOverviewNotifications: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listOverviewNotifications.match),
        switchMap((action) =>
            deps.apiClients.internalNotificationApi.listNotifications({ request: { unread: true } }).pipe(
                mergeMap((response) =>
                    of(
                        slice.actions.listOverviewNotificationsSuccess(response.items.map(transformNotificationDtoToModel)),
                        widgetLockActions.removeWidgetLock(LockWidgetNameEnum.NotificationsOverview),
                    ),
                ),

                catchError((err) =>
                    of(
                        slice.actions.listOverviewNotificationsFailure({
                            error: extractError(err, "Failed to list overview notification"),
                        }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to list overview notifications" }),
                        widgetLockActions.insertWidgetLock(err, LockWidgetNameEnum.NotificationsOverview),
                    ),
                ),
            ),
        ),
    );
};

const listNotifications: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listNotifications.match),
        switchMap((action) => {
            store.dispatch(pagingActions.list(EntityType.NOTIFICATIONS));
            return deps.apiClients.internalNotificationApi
                .listNotifications({
                    request: { unread: action.payload.unread, ...transformSearchRequestModelToDto(action.payload.pagination) },
                })
                .pipe(
                    mergeMap((response) =>
                        of(
                            slice.actions.listNotificationsSuccess(response.items.map(transformNotificationDtoToModel)),
                            pagingActions.listSuccess({ entity: EntityType.NOTIFICATIONS, totalItems: response.totalItems }),
                            widgetLockActions.removeWidgetLock(LockWidgetNameEnum.ListOfNotifications),
                        ),
                    ),

                    catchError((err) =>
                        of(
                            pagingActions.listFailure(EntityType.NOTIFICATIONS),
                            appRedirectActions.fetchError({ error: err, message: "Failed to get list of notifications" }),
                            widgetLockActions.insertWidgetLock(err, LockWidgetNameEnum.ListOfNotifications),
                        ),
                    ),
                );
        }),
    );
};

const deleteNotification: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteNotification.match),
        mergeMap((action) =>
            deps.apiClients.internalNotificationApi.deleteNotification({ uuid: action.payload.uuid }).pipe(
                mergeMap(() =>
                    of(slice.actions.deleteNotificationSuccess({ uuid: action.payload.uuid }), slice.actions.listOverviewNotifications()),
                ),

                catchError((err) =>
                    of(
                        slice.actions.deleteNotificationFailure({ error: extractError(err, "Failed to delete notification") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to delete notification" }),
                    ),
                ),
            ),
        ),
    );
};

const markAsReadNotification: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.markAsReadNotification.match),
        mergeMap((action) =>
            deps.apiClients.internalNotificationApi.markNotificationAsRead({ uuid: action.payload.uuid }).pipe(
                mergeMap((res) =>
                    of(
                        slice.actions.markAsReadNotificationSuccess(transformNotificationDtoToModel(res)),
                        slice.actions.listOverviewNotifications(),
                    ),
                ),

                catchError((err) =>
                    of(
                        slice.actions.markAsReadNotificationFailure({ error: extractError(err, "Failed to mark notification as read") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to mark notification as read" }),
                    ),
                ),
            ),
        ),
    );
};

const listNotificationInstances: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listNotificationInstances.match),
        mergeMap((action) =>
            deps.apiClients.externalNotificationManagementApi.listNotificationInstances().pipe(
                mergeMap((res) => of(slice.actions.listNotificationInstancesSuccess(res.map(transformNotificationInstanceDtoToModel)))),

                catchError((err) =>
                    of(
                        slice.actions.listNotificationInstancesFailure({
                            error: extractError(err, "Failed to list notification instances"),
                        }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to list notification instances" }),
                    ),
                ),
            ),
        ),
    );
};

export const listNotificationProviders: AppEpic = (action$, state, deps) => {
    return action$.pipe(
        filter(slice.actions.listNotificationProviders.match),
        switchMap(() =>
            deps.apiClients.connectors.listConnectors({ functionGroup: FunctionGroupCode.NotificationProvider }).pipe(
                map((providers) =>
                    slice.actions.listNotificationProvidersSuccess({
                        providers: providers.map(transformConnectorResponseDtoToModel),
                    }),
                ),
                catchError((error) =>
                    of(
                        slice.actions.listNotificationProvidersFailure({
                            error: extractError(error, "Failed to get Entity Provider list"),
                        }),
                        appRedirectActions.fetchError({
                            error,
                            message: "Failed to get Entity Provider list",
                        }),
                    ),
                ),
            ),
        ),
        catchError((error) => of(appRedirectActions.fetchError({ error: error, message: "Failed to get Entity Provider list" }))),
        map((action) => action as AnyAction),
    );
};

const getNotificationInstance: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getNotificationInstance.match),
        mergeMap((action) =>
            deps.apiClients.externalNotificationManagementApi.getNotificationInstance({ uuid: action.payload.uuid }).pipe(
                mergeMap((res) => of(slice.actions.getNotificationInstanceSuccess(transformNotificationInstanceDtoToModel(res)))),

                catchError((err) =>
                    of(
                        slice.actions.getNotificationInstanceFailure({
                            error: extractError(err, "Failed to get notification instance details"),
                        }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to get notification instance" }),
                    ),
                ),
            ),
        ),
    );
};

const createNotificationInstance: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.createNotificationInstance.match),
        mergeMap((action) =>
            deps.apiClients.externalNotificationManagementApi
                .createNotificationInstance({ notificationInstanceRequestDto: transformNotificationInstanceModelToDto(action.payload) })
                .pipe(
                    mergeMap((res) =>
                        of(
                            slice.actions.createNotificationInstanceSuccess(),
                            alertActions.success("Notifications Instance added successfully."),
                            appRedirectActions.redirect({ url: `/notificationinstances/detail/${res.uuid}` }),
                        ),
                    ),
                    catchError((err) =>
                        of(
                            slice.actions.createNotificationInstanceFailure({
                                error: extractError(err, "Failed to create notification instance"),
                            }),
                            appRedirectActions.fetchError({ error: err, message: "Failed to create notification instance" }),
                        ),
                    ),
                ),
        ),
    );
};

const editNotificationInstance: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.editNotificationInstance.match),
        mergeMap((action) =>
            deps.apiClients.externalNotificationManagementApi
                .editNotificationInstance({
                    uuid: action.payload.uuid,
                    notificationInstanceUpdateRequestDto: transformNotificationInstanceModelToDto(action.payload.notificationInstance),
                })
                .pipe(
                    mergeMap((res) =>
                        of(
                            slice.actions.editNotificationInstanceSuccess(),
                            alertActions.success("Notifications Instance updated successfully."),
                            appRedirectActions.redirect({ url: `/notificationinstances/detail/${res.uuid}` }),
                        ),
                    ),
                    catchError((err) =>
                        of(
                            slice.actions.editNotificationInstanceFailure({
                                error: extractError(err, "Failed to edit notification instance"),
                            }),
                            appRedirectActions.fetchError({ error: err, message: "Failed to edit notification instance" }),
                        ),
                    ),
                ),
        ),
    );
};

const getNotificationAttributesDescriptors: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getNotificationAttributesDescriptors.match),
        mergeMap((action) =>
            deps.apiClients.connectors
                .getAttributes({
                    kind: action.payload.kind,
                    functionGroup: FunctionGroupCode.NotificationProvider,
                    uuid: action.payload.uuid,
                })
                .pipe(
                    map((attributeDescriptors) =>
                        slice.actions.getNotificationAttributesDescriptorsSuccess({
                            attributeDescriptor: attributeDescriptors.map(transformAttributeDescriptorDtoToModel),
                        }),
                    ),

                    catchError((err) =>
                        of(
                            slice.actions.getNotificationAttributeDescriptorsFailure({
                                error: extractError(err, "Failed to get notification provider attributes descriptors"),
                            }),
                            appRedirectActions.fetchError({
                                error: err,
                                message: "Failed to get notification provider attributes descriptors",
                            }),
                        ),
                    ),
                ),
        ),
    );
};

const deleteNotificationInstance: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteNotificationInstance.match),
        mergeMap((action) =>
            deps.apiClients.externalNotificationManagementApi.deleteNotificationInstance({ uuid: action.payload.uuid }).pipe(
                mergeMap((res) =>
                    of(
                        slice.actions.deleteNotificationInstanceSuccess({ uuid: action.payload.uuid }),
                        alertActions.success("Notifications Instance deleted successfully."),
                        appRedirectActions.redirect({ url: `../../../notificationssettings` }),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.deleteNotificationInstanceFailure({
                            error: extractError(err, "Failed to delete notification instance"),
                        }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to delete notification instance" }),
                    ),
                ),
            ),
        ),
    );
};

const listMappingAttributes: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listMappingAttributes.match),
        mergeMap((action) =>
            deps.apiClients.externalNotificationManagementApi.listMappingAttributes({ ...action.payload }).pipe(
                mergeMap((res) => of(slice.actions.listMappingAttributesSuccess({ mappingAttributes: res }))),
                catchError((err) =>
                    of(
                        slice.actions.listMappingAttributesFailure({
                            error: extractError(err, "Failed to get mapping attributes"),
                        }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to get mapping attributes" }),
                    ),
                ),
            ),
        ),
    );
};

const epics = [
    listOverviewNotifications,
    listNotifications,
    deleteNotification,
    markAsReadNotification,
    listNotificationInstances,
    getNotificationInstance,
    createNotificationInstance,
    listNotificationProviders,
    getNotificationAttributesDescriptors,
    editNotificationInstance,
    deleteNotificationInstance,
    listMappingAttributes,
];

export default epics;
