import { AppEpic } from "ducks";
import { of } from "rxjs";
import { catchError, filter, mergeMap, switchMap } from "rxjs/operators";
import { extractError } from "utils/net";
import { actions as appRedirectActions } from "./app-redirect";
import { actions as widgetLockActions } from "./widget-locks";

import { store } from "index";
import { LockWidgetNameEnum } from "types/widget-locks";
import { EntityType } from "./filters";
import { slice } from "./notifications";
import { actions as pagingActions } from "./paging";
import { transformSearchRequestModelToDto } from "./transform/certificates";
import { transformNotificationDtoToModel } from "./transform/notifications";

const listOverviewNotifications: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listOverviewNotifications.match),
        switchMap((action) =>
            deps.apiClients.notifications.listNotifications({ request: { unread: true } }).pipe(
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
            return deps.apiClients.notifications
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
            deps.apiClients.notifications.deleteNotification({ uuid: action.payload.uuid }).pipe(
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
            deps.apiClients.notifications.markNotificationAsRead({ uuid: action.payload.uuid }).pipe(
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

const epics = [listOverviewNotifications, listNotifications, deleteNotification, markAsReadNotification];

export default epics;
