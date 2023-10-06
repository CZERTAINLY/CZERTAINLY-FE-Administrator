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
import { BaseAPI, throwIfNullOrUndefined, encodeURI } from "../runtime";
import type { OperationOpts, HttpHeaders, HttpQuery } from "../runtime";
import type {
    AttributeDefinitionDto,
    AuthenticationServiceExceptionDto,
    ConnectorMetadataPromotionRequestDto,
    ConnectorMetadataResponseDto,
    ErrorMessageDto,
    GlobalMetadataCreateRequestDto,
    GlobalMetadataDefinitionDetailDto,
    GlobalMetadataUpdateRequestDto,
    UuidDto,
} from "../models";

export interface BulkDeleteGlobalMetadataRequest {
    requestBody: Array<string>;
}

export interface CreateGlobalMetadataRequest {
    globalMetadataCreateRequestDto: GlobalMetadataCreateRequestDto;
}

export interface DeleteGlobalMetadataRequest {
    uuid: string;
}

export interface EditGlobalMetadataRequest {
    uuid: string;
    globalMetadataUpdateRequestDto: GlobalMetadataUpdateRequestDto;
}

export interface GetConnectorMetadataRequest {
    connectorUuid?: string;
}

export interface GetGlobalMetadataRequest {
    uuid: string;
}

export interface PromoteConnectorMetadataRequest {
    connectorMetadataPromotionRequestDto: ConnectorMetadataPromotionRequestDto;
}

/**
 * no description
 */
export class GlobalMetadataApi extends BaseAPI {
    /**
     * Delete multiple Global Metadata
     */
    bulkDeleteGlobalMetadata({ requestBody }: BulkDeleteGlobalMetadataRequest): Observable<void>;
    bulkDeleteGlobalMetadata({ requestBody }: BulkDeleteGlobalMetadataRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>>;
    bulkDeleteGlobalMetadata(
        { requestBody }: BulkDeleteGlobalMetadataRequest,
        opts?: OperationOpts,
    ): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(requestBody, "requestBody", "bulkDeleteGlobalMetadata");

        const headers: HttpHeaders = {
            "Content-Type": "application/json",
        };

        return this.request<void>(
            {
                url: "/v1/attributes/metadata",
                method: "DELETE",
                headers,
                body: requestBody,
            },
            opts?.responseOpts,
        );
    }

    /**
     * Create Global Metadata
     */
    createGlobalMetadata({ globalMetadataCreateRequestDto }: CreateGlobalMetadataRequest): Observable<UuidDto>;
    createGlobalMetadata(
        { globalMetadataCreateRequestDto }: CreateGlobalMetadataRequest,
        opts?: OperationOpts,
    ): Observable<AjaxResponse<UuidDto>>;
    createGlobalMetadata(
        { globalMetadataCreateRequestDto }: CreateGlobalMetadataRequest,
        opts?: OperationOpts,
    ): Observable<UuidDto | AjaxResponse<UuidDto>> {
        throwIfNullOrUndefined(globalMetadataCreateRequestDto, "globalMetadataCreateRequestDto", "createGlobalMetadata");

        const headers: HttpHeaders = {
            "Content-Type": "application/json",
        };

        return this.request<UuidDto>(
            {
                url: "/v1/attributes/metadata",
                method: "POST",
                headers,
                body: globalMetadataCreateRequestDto,
            },
            opts?.responseOpts,
        );
    }

    /**
     * Delete Global Metadata
     */
    deleteGlobalMetadata({ uuid }: DeleteGlobalMetadataRequest): Observable<void>;
    deleteGlobalMetadata({ uuid }: DeleteGlobalMetadataRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>>;
    deleteGlobalMetadata({ uuid }: DeleteGlobalMetadataRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(uuid, "uuid", "deleteGlobalMetadata");

        return this.request<void>(
            {
                url: "/v1/attributes/metadata/{uuid}".replace("{uuid}", encodeURI(uuid)),
                method: "DELETE",
            },
            opts?.responseOpts,
        );
    }

    /**
     * Edit Global Metadata
     */
    editGlobalMetadata({ uuid, globalMetadataUpdateRequestDto }: EditGlobalMetadataRequest): Observable<GlobalMetadataDefinitionDetailDto>;
    editGlobalMetadata(
        { uuid, globalMetadataUpdateRequestDto }: EditGlobalMetadataRequest,
        opts?: OperationOpts,
    ): Observable<AjaxResponse<GlobalMetadataDefinitionDetailDto>>;
    editGlobalMetadata(
        { uuid, globalMetadataUpdateRequestDto }: EditGlobalMetadataRequest,
        opts?: OperationOpts,
    ): Observable<GlobalMetadataDefinitionDetailDto | AjaxResponse<GlobalMetadataDefinitionDetailDto>> {
        throwIfNullOrUndefined(uuid, "uuid", "editGlobalMetadata");
        throwIfNullOrUndefined(globalMetadataUpdateRequestDto, "globalMetadataUpdateRequestDto", "editGlobalMetadata");

        const headers: HttpHeaders = {
            "Content-Type": "application/json",
        };

        return this.request<GlobalMetadataDefinitionDetailDto>(
            {
                url: "/v1/attributes/metadata/{uuid}".replace("{uuid}", encodeURI(uuid)),
                method: "PUT",
                headers,
                body: globalMetadataUpdateRequestDto,
            },
            opts?.responseOpts,
        );
    }

    /**
     * Get Available Connector Metadata
     */
    getConnectorMetadata({ connectorUuid }: GetConnectorMetadataRequest): Observable<Array<ConnectorMetadataResponseDto>>;
    getConnectorMetadata(
        { connectorUuid }: GetConnectorMetadataRequest,
        opts?: OperationOpts,
    ): Observable<AjaxResponse<Array<ConnectorMetadataResponseDto>>>;
    getConnectorMetadata(
        { connectorUuid }: GetConnectorMetadataRequest,
        opts?: OperationOpts,
    ): Observable<Array<ConnectorMetadataResponseDto> | AjaxResponse<Array<ConnectorMetadataResponseDto>>> {
        const query: HttpQuery = {};

        if (connectorUuid != null) {
            query["connectorUuid"] = connectorUuid;
        }

        return this.request<Array<ConnectorMetadataResponseDto>>(
            {
                url: "/v1/attributes/metadata/promote",
                method: "GET",
                query,
            },
            opts?.responseOpts,
        );
    }

    /**
     * Global Metadata details
     */
    getGlobalMetadata({ uuid }: GetGlobalMetadataRequest): Observable<GlobalMetadataDefinitionDetailDto>;
    getGlobalMetadata(
        { uuid }: GetGlobalMetadataRequest,
        opts?: OperationOpts,
    ): Observable<AjaxResponse<GlobalMetadataDefinitionDetailDto>>;
    getGlobalMetadata(
        { uuid }: GetGlobalMetadataRequest,
        opts?: OperationOpts,
    ): Observable<GlobalMetadataDefinitionDetailDto | AjaxResponse<GlobalMetadataDefinitionDetailDto>> {
        throwIfNullOrUndefined(uuid, "uuid", "getGlobalMetadata");

        return this.request<GlobalMetadataDefinitionDetailDto>(
            {
                url: "/v1/attributes/metadata/{uuid}".replace("{uuid}", encodeURI(uuid)),
                method: "GET",
            },
            opts?.responseOpts,
        );
    }

    /**
     * List Global Metadata
     */
    listGlobalMetadata(): Observable<Array<AttributeDefinitionDto>>;
    listGlobalMetadata(opts?: OperationOpts): Observable<AjaxResponse<Array<AttributeDefinitionDto>>>;
    listGlobalMetadata(opts?: OperationOpts): Observable<Array<AttributeDefinitionDto> | AjaxResponse<Array<AttributeDefinitionDto>>> {
        return this.request<Array<AttributeDefinitionDto>>(
            {
                url: "/v1/attributes/metadata",
                method: "GET",
            },
            opts?.responseOpts,
        );
    }

    /**
     * Promote Connector Metadata to Global Metadata
     */
    promoteConnectorMetadata({
        connectorMetadataPromotionRequestDto,
    }: PromoteConnectorMetadataRequest): Observable<GlobalMetadataDefinitionDetailDto>;
    promoteConnectorMetadata(
        { connectorMetadataPromotionRequestDto }: PromoteConnectorMetadataRequest,
        opts?: OperationOpts,
    ): Observable<AjaxResponse<GlobalMetadataDefinitionDetailDto>>;
    promoteConnectorMetadata(
        { connectorMetadataPromotionRequestDto }: PromoteConnectorMetadataRequest,
        opts?: OperationOpts,
    ): Observable<GlobalMetadataDefinitionDetailDto | AjaxResponse<GlobalMetadataDefinitionDetailDto>> {
        throwIfNullOrUndefined(connectorMetadataPromotionRequestDto, "connectorMetadataPromotionRequestDto", "promoteConnectorMetadata");

        const headers: HttpHeaders = {
            "Content-Type": "application/json",
        };

        return this.request<GlobalMetadataDefinitionDetailDto>(
            {
                url: "/v1/attributes/metadata/promote",
                method: "POST",
                headers,
                body: connectorMetadataPromotionRequestDto,
            },
            opts?.responseOpts,
        );
    }
}
