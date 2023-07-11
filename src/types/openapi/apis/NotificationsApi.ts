// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 2.8.2-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type { Observable } from "rxjs";
import type { AjaxResponse } from "rxjs/ajax";
import type { NotificationDto, NotificationRequestDto, NotificationResponseDto } from "../models";
import type { HttpQuery, OperationOpts } from "../runtime";
import { BaseAPI, encodeURI, throwIfNullOrUndefined } from "../runtime";

export interface DeleteNotificationRequest {
    uuid: string;
}

export interface ListNotificationsRequest {
    request: NotificationRequestDto;
}

export interface MarkNotificationAsReadRequest {
    uuid: string;
}

/**
 * no description
 */
export class NotificationsApi extends BaseAPI {
    /**
     * Delete a notification for logged user
     */
    deleteNotification({ uuid }: DeleteNotificationRequest): Observable<void>;
    deleteNotification({ uuid }: DeleteNotificationRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>>;
    deleteNotification({ uuid }: DeleteNotificationRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(uuid, "uuid", "deleteNotification");

        return this.request<void>(
            {
                url: "/v1/notifications/{uuid}".replace("{uuid}", encodeURI(uuid)),
                method: "DELETE",
            },
            opts?.responseOpts,
        );
    }

    /**
     * List notifications for logged user
     */
    listNotifications({ request }: ListNotificationsRequest): Observable<NotificationResponseDto>;
    listNotifications({ request }: ListNotificationsRequest, opts?: OperationOpts): Observable<AjaxResponse<NotificationResponseDto>>;
    listNotifications(
        { request }: ListNotificationsRequest,
        opts?: OperationOpts,
    ): Observable<NotificationResponseDto | AjaxResponse<NotificationResponseDto>> {
        const query: HttpQuery = {};

        if (request != null) {
            Object.assign(query, request);
        }

        return this.request<NotificationResponseDto>(
            {
                url: "/v1/notifications",
                method: "GET",
                query,
            },
            opts?.responseOpts,
        );
    }

    /**
     * Mark notification as read for logged user
     */
    markNotificationAsRead({ uuid }: MarkNotificationAsReadRequest): Observable<NotificationDto>;
    markNotificationAsRead({ uuid }: MarkNotificationAsReadRequest, opts?: OperationOpts): Observable<AjaxResponse<NotificationDto>>;
    markNotificationAsRead(
        { uuid }: MarkNotificationAsReadRequest,
        opts?: OperationOpts,
    ): Observable<NotificationDto | AjaxResponse<NotificationDto>> {
        throwIfNullOrUndefined(uuid, "uuid", "markNotificationAsRead");

        return this.request<NotificationDto>(
            {
                url: "/v1/notifications/{uuid}".replace("{uuid}", encodeURI(uuid)),
                method: "PATCH",
            },
            opts?.responseOpts,
        );
    }
}
