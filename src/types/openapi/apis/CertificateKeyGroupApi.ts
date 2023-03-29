// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 2.7.1-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type { Observable } from "rxjs";
import type { AjaxResponse } from "rxjs/ajax";
import { BaseAPI, throwIfNullOrUndefined, encodeURI } from "../runtime";
import type { OperationOpts, HttpHeaders } from "../runtime";
import type { AuthenticationServiceExceptionDto, ErrorMessageDto, GroupDto, GroupRequestDto, UuidDto } from "../models";

export interface BulkDeleteGroupRequest {
    requestBody: Array<string>;
}

export interface CreateGroupRequest {
    groupRequestDto: GroupRequestDto;
}

export interface DeleteGroupRequest {
    uuid: string;
}

export interface EditGroupRequest {
    uuid: string;
    groupRequestDto: GroupRequestDto;
}

export interface GetGroupRequest {
    uuid: string;
}

/**
 * no description
 */
export class CertificateKeyGroupApi extends BaseAPI {
    /**
     * Delete multiple Groups
     */
    bulkDeleteGroup({ requestBody }: BulkDeleteGroupRequest): Observable<void>;
    bulkDeleteGroup({ requestBody }: BulkDeleteGroupRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>>;
    bulkDeleteGroup({ requestBody }: BulkDeleteGroupRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(requestBody, "requestBody", "bulkDeleteGroup");

        const headers: HttpHeaders = {
            "Content-Type": "application/json",
        };

        return this.request<void>(
            {
                url: "/v1/groups",
                method: "DELETE",
                headers,
                body: requestBody,
            },
            opts?.responseOpts,
        );
    }

    /**
     * Create Group
     */
    createGroup({ groupRequestDto }: CreateGroupRequest): Observable<UuidDto>;
    createGroup({ groupRequestDto }: CreateGroupRequest, opts?: OperationOpts): Observable<AjaxResponse<UuidDto>>;
    createGroup({ groupRequestDto }: CreateGroupRequest, opts?: OperationOpts): Observable<UuidDto | AjaxResponse<UuidDto>> {
        throwIfNullOrUndefined(groupRequestDto, "groupRequestDto", "createGroup");

        const headers: HttpHeaders = {
            "Content-Type": "application/json",
        };

        return this.request<UuidDto>(
            {
                url: "/v1/groups",
                method: "POST",
                headers,
                body: groupRequestDto,
            },
            opts?.responseOpts,
        );
    }

    /**
     * Delete Group
     */
    deleteGroup({ uuid }: DeleteGroupRequest): Observable<void>;
    deleteGroup({ uuid }: DeleteGroupRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>>;
    deleteGroup({ uuid }: DeleteGroupRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(uuid, "uuid", "deleteGroup");

        return this.request<void>(
            {
                url: "/v1/groups/{uuid}".replace("{uuid}", encodeURI(uuid)),
                method: "DELETE",
            },
            opts?.responseOpts,
        );
    }

    /**
     * Edit Group
     */
    editGroup({ uuid, groupRequestDto }: EditGroupRequest): Observable<GroupDto>;
    editGroup({ uuid, groupRequestDto }: EditGroupRequest, opts?: OperationOpts): Observable<AjaxResponse<GroupDto>>;
    editGroup({ uuid, groupRequestDto }: EditGroupRequest, opts?: OperationOpts): Observable<GroupDto | AjaxResponse<GroupDto>> {
        throwIfNullOrUndefined(uuid, "uuid", "editGroup");
        throwIfNullOrUndefined(groupRequestDto, "groupRequestDto", "editGroup");

        const headers: HttpHeaders = {
            "Content-Type": "application/json",
        };

        return this.request<GroupDto>(
            {
                url: "/v1/groups/{uuid}".replace("{uuid}", encodeURI(uuid)),
                method: "PUT",
                headers,
                body: groupRequestDto,
            },
            opts?.responseOpts,
        );
    }

    /**
     * Group details
     */
    getGroup({ uuid }: GetGroupRequest): Observable<GroupDto>;
    getGroup({ uuid }: GetGroupRequest, opts?: OperationOpts): Observable<AjaxResponse<GroupDto>>;
    getGroup({ uuid }: GetGroupRequest, opts?: OperationOpts): Observable<GroupDto | AjaxResponse<GroupDto>> {
        throwIfNullOrUndefined(uuid, "uuid", "getGroup");

        return this.request<GroupDto>(
            {
                url: "/v1/groups/{uuid}".replace("{uuid}", encodeURI(uuid)),
                method: "GET",
            },
            opts?.responseOpts,
        );
    }

    /**
     * List Groups
     */
    listGroups(): Observable<Array<GroupDto>>;
    listGroups(opts?: OperationOpts): Observable<AjaxResponse<Array<GroupDto>>>;
    listGroups(opts?: OperationOpts): Observable<Array<GroupDto> | AjaxResponse<Array<GroupDto>>> {
        return this.request<Array<GroupDto>>(
            {
                url: "/v1/groups",
                method: "GET",
            },
            opts?.responseOpts,
        );
    }
}
