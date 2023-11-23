// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 2.9.1-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type { Observable } from "rxjs";
import type { AjaxResponse } from "rxjs/ajax";
import type {
    ApprovalProfileDetailDto,
    ApprovalProfileForVersionDto,
    ApprovalProfileRequestDto,
    ApprovalProfileResponseDto,
    ApprovalProfileUpdateRequestDto,
    PaginationRequestDto,
    UuidDto,
} from "../models";
import type { HttpHeaders, HttpQuery, OperationOpts } from "../runtime";
import { BaseAPI, encodeURI, throwIfNullOrUndefined } from "../runtime";

export interface CreateApprovalProfileRequest {
    approvalProfileRequestDto: ApprovalProfileRequestDto;
}

export interface DeleteApprovalProfileRequest {
    uuid: string;
}

export interface DisableApprovalProfileRequest {
    uuid: string;
}

export interface EditApprovalProfileRequest {
    uuid: string;
    approvalProfileUpdateRequestDto: ApprovalProfileUpdateRequestDto;
}

export interface EnableApprovalProfileRequest {
    uuid: string;
}

export interface GetApprovalProfileRequest {
    uuid: string;
    approvalProfileForVersionDto: ApprovalProfileForVersionDto;
}

export interface ListApprovalProfilesRequest {
    paginationRequestDto: PaginationRequestDto;
}

/**
 * no description
 */
export class ApprovalProfileInventoryApi extends BaseAPI {
    /**
     * Create a Approval profile
     */
    createApprovalProfile({ approvalProfileRequestDto }: CreateApprovalProfileRequest): Observable<UuidDto>;
    createApprovalProfile(
        { approvalProfileRequestDto }: CreateApprovalProfileRequest,
        opts?: OperationOpts,
    ): Observable<AjaxResponse<UuidDto>>;
    createApprovalProfile(
        { approvalProfileRequestDto }: CreateApprovalProfileRequest,
        opts?: OperationOpts,
    ): Observable<UuidDto | AjaxResponse<UuidDto>> {
        throwIfNullOrUndefined(approvalProfileRequestDto, "approvalProfileRequestDto", "createApprovalProfile");

        const headers: HttpHeaders = {
            "Content-Type": "application/json",
        };

        return this.request<UuidDto>(
            {
                url: "/v1/approvalProfiles",
                method: "POST",
                headers,
                body: approvalProfileRequestDto,
            },
            opts?.responseOpts,
        );
    }

    /**
     * Delete an approval profile
     */
    deleteApprovalProfile({ uuid }: DeleteApprovalProfileRequest): Observable<void>;
    deleteApprovalProfile({ uuid }: DeleteApprovalProfileRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>>;
    deleteApprovalProfile({ uuid }: DeleteApprovalProfileRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(uuid, "uuid", "deleteApprovalProfile");

        return this.request<void>(
            {
                url: "/v1/approvalProfiles/{uuid}".replace("{uuid}", encodeURI(uuid)),
                method: "DELETE",
            },
            opts?.responseOpts,
        );
    }

    /**
     * Disabling of Approval profile
     */
    disableApprovalProfile({ uuid }: DisableApprovalProfileRequest): Observable<void>;
    disableApprovalProfile({ uuid }: DisableApprovalProfileRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>>;
    disableApprovalProfile({ uuid }: DisableApprovalProfileRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(uuid, "uuid", "disableApprovalProfile");

        return this.request<void>(
            {
                url: "/v1/approvalProfiles/{uuid}/disable".replace("{uuid}", encodeURI(uuid)),
                method: "PATCH",
            },
            opts?.responseOpts,
        );
    }

    /**
     * Edit an Approval profile
     */
    editApprovalProfile({ uuid, approvalProfileUpdateRequestDto }: EditApprovalProfileRequest): Observable<object>;
    editApprovalProfile(
        { uuid, approvalProfileUpdateRequestDto }: EditApprovalProfileRequest,
        opts?: OperationOpts,
    ): Observable<AjaxResponse<object>>;
    editApprovalProfile(
        { uuid, approvalProfileUpdateRequestDto }: EditApprovalProfileRequest,
        opts?: OperationOpts,
    ): Observable<object | AjaxResponse<object>> {
        throwIfNullOrUndefined(uuid, "uuid", "editApprovalProfile");
        throwIfNullOrUndefined(approvalProfileUpdateRequestDto, "approvalProfileUpdateRequestDto", "editApprovalProfile");

        const headers: HttpHeaders = {
            "Content-Type": "application/json",
        };

        return this.request<object>(
            {
                url: "/v1/approvalProfiles/{uuid}".replace("{uuid}", encodeURI(uuid)),
                method: "PUT",
                headers,
                body: approvalProfileUpdateRequestDto,
            },
            opts?.responseOpts,
        );
    }

    /**
     * Enabling of Approval profile
     */
    enableApprovalProfile({ uuid }: EnableApprovalProfileRequest): Observable<void>;
    enableApprovalProfile({ uuid }: EnableApprovalProfileRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>>;
    enableApprovalProfile({ uuid }: EnableApprovalProfileRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(uuid, "uuid", "enableApprovalProfile");

        return this.request<void>(
            {
                url: "/v1/approvalProfiles/{uuid}/enable".replace("{uuid}", encodeURI(uuid)),
                method: "PATCH",
            },
            opts?.responseOpts,
        );
    }

    /**
     * Get Approval Profile Details
     */
    getApprovalProfile({ uuid, approvalProfileForVersionDto }: GetApprovalProfileRequest): Observable<ApprovalProfileDetailDto>;
    getApprovalProfile(
        { uuid, approvalProfileForVersionDto }: GetApprovalProfileRequest,
        opts?: OperationOpts,
    ): Observable<AjaxResponse<ApprovalProfileDetailDto>>;
    getApprovalProfile(
        { uuid, approvalProfileForVersionDto }: GetApprovalProfileRequest,
        opts?: OperationOpts,
    ): Observable<ApprovalProfileDetailDto | AjaxResponse<ApprovalProfileDetailDto>> {
        throwIfNullOrUndefined(uuid, "uuid", "getApprovalProfile");
        throwIfNullOrUndefined(approvalProfileForVersionDto, "approvalProfileForVersionDto", "getApprovalProfile");

        const query: HttpQuery = {};
        if (approvalProfileForVersionDto != null) {
            Object.assign(query, approvalProfileForVersionDto);
        }

        return this.request<ApprovalProfileDetailDto>(
            {
                url: "/v1/approvalProfiles/{uuid}".replace("{uuid}", encodeURI(uuid)),
                method: "GET",
                query,
            },
            opts?.responseOpts,
        );
    }

    /**
     * List Approval Profiles
     */
    listApprovalProfiles({ paginationRequestDto }: ListApprovalProfilesRequest): Observable<ApprovalProfileResponseDto>;
    listApprovalProfiles(
        { paginationRequestDto }: ListApprovalProfilesRequest,
        opts?: OperationOpts,
    ): Observable<AjaxResponse<ApprovalProfileResponseDto>>;
    listApprovalProfiles(
        { paginationRequestDto }: ListApprovalProfilesRequest,
        opts?: OperationOpts,
    ): Observable<ApprovalProfileResponseDto | AjaxResponse<ApprovalProfileResponseDto>> {
        throwIfNullOrUndefined(paginationRequestDto, "paginationRequestDto", "listApprovalProfiles");
        const query: HttpQuery = {};
        if (paginationRequestDto != null) {
            Object.assign(query, paginationRequestDto);
        }
        return this.request<ApprovalProfileResponseDto>(
            {
                url: "/v1/approvalProfiles",
                method: "GET",
                query,
            },
            opts?.responseOpts,
        );
    }
}
