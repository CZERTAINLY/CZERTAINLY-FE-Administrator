import { AppEpic } from "ducks";
import { of } from "rxjs";
import { catchError, filter, map, mergeMap, switchMap } from "rxjs/operators";
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

const listNotifications: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listNotifications.match),
        switchMap((action) => {
            store.dispatch(pagingActions.list(EntityType.NOTIFICATIONS));
            return deps.apiClients.notifications
                .listNotifications({
                    request: { ...transformSearchRequestModelToDto(action.payload.pagination), unread: action.payload.unread },
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
        switchMap((action) =>
            deps.apiClients.notifications.deleteNotification({ uuid: action.payload.uuid }).pipe(
                map(() => slice.actions.deleteNotificationSuccess({ uuid: action.payload.uuid })),

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
        switchMap((action) =>
            deps.apiClients.notifications.markNotificationAsRead({ uuid: action.payload.uuid }).pipe(
                map((res) => slice.actions.markAsReadNotificationSuccess(transformNotificationDtoToModel(res))),

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

const epics = [listNotifications, deleteNotification, markAsReadNotification];

export default epics;
