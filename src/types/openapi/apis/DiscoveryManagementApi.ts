// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 2.14.2-SNAPSHOT
 * Contact: info@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type { Observable } from 'rxjs';
import type { AjaxResponse } from 'rxjs/ajax';
import { BaseAPI, throwIfNullOrUndefined, encodeURI } from '../runtime';
import type { OperationOpts, HttpHeaders, HttpQuery } from '../runtime';
import type {
    AuthenticationServiceExceptionDto,
    DiscoveryCertificateResponseDto,
    DiscoveryDto,
    DiscoveryHistoryDetailDto,
    DiscoveryResponseDto,
    ErrorMessageDto,
    ScheduleDiscoveryDto,
    SearchFieldDataByGroupDto,
    SearchRequestDto,
    UuidDto,
} from '../models';

export interface BulkDeleteDiscoveryRequest {
    requestBody: Array<string>;
}

export interface CreateDiscoveryRequest {
    discoveryDto: DiscoveryDto;
}

export interface DeleteDiscoveryRequest {
    uuid: string;
}

export interface GetDiscoveryRequest {
    uuid: string;
}

export interface GetDiscoveryCertificatesRequest {
    uuid: string;
    newlyDiscovered?: boolean;
    itemsPerPage?: number;
    pageNumber?: number;
}

export interface ListDiscoveriesRequest {
    searchRequestDto: SearchRequestDto;
}

export interface ScheduleDiscoveryRequest {
    scheduleDiscoveryDto: ScheduleDiscoveryDto;
}

/**
 * no description
 */
export class DiscoveryManagementApi extends BaseAPI {

    /**
     * Delete Multiple Discoveries
     */
    bulkDeleteDiscovery({ requestBody }: BulkDeleteDiscoveryRequest): Observable<void>
    bulkDeleteDiscovery({ requestBody }: BulkDeleteDiscoveryRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>>
    bulkDeleteDiscovery({ requestBody }: BulkDeleteDiscoveryRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(requestBody, 'requestBody', 'bulkDeleteDiscovery');

        const headers: HttpHeaders = {
            'Content-Type': 'application/json',
        };

        return this.request<void>({
            url: '/v1/discoveries',
            method: 'DELETE',
            headers,
            body: requestBody,
        }, opts?.responseOpts);
    };

    /**
     * Create Discovery
     */
    createDiscovery({ discoveryDto }: CreateDiscoveryRequest): Observable<UuidDto>
    createDiscovery({ discoveryDto }: CreateDiscoveryRequest, opts?: OperationOpts): Observable<AjaxResponse<UuidDto>>
    createDiscovery({ discoveryDto }: CreateDiscoveryRequest, opts?: OperationOpts): Observable<UuidDto | AjaxResponse<UuidDto>> {
        throwIfNullOrUndefined(discoveryDto, 'discoveryDto', 'createDiscovery');

        const headers: HttpHeaders = {
            'Content-Type': 'application/json',
        };

        return this.request<UuidDto>({
            url: '/v1/discoveries',
            method: 'POST',
            headers,
            body: discoveryDto,
        }, opts?.responseOpts);
    };

    /**
     * Delete Discovery
     */
    deleteDiscovery({ uuid }: DeleteDiscoveryRequest): Observable<void>
    deleteDiscovery({ uuid }: DeleteDiscoveryRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>>
    deleteDiscovery({ uuid }: DeleteDiscoveryRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(uuid, 'uuid', 'deleteDiscovery');

        return this.request<void>({
            url: '/v1/discoveries/{uuid}'.replace('{uuid}', encodeURI(uuid)),
            method: 'DELETE',
        }, opts?.responseOpts);
    };

    /**
     * Discovery Details
     */
    getDiscovery({ uuid }: GetDiscoveryRequest): Observable<DiscoveryHistoryDetailDto>
    getDiscovery({ uuid }: GetDiscoveryRequest, opts?: OperationOpts): Observable<AjaxResponse<DiscoveryHistoryDetailDto>>
    getDiscovery({ uuid }: GetDiscoveryRequest, opts?: OperationOpts): Observable<DiscoveryHistoryDetailDto | AjaxResponse<DiscoveryHistoryDetailDto>> {
        throwIfNullOrUndefined(uuid, 'uuid', 'getDiscovery');

        return this.request<DiscoveryHistoryDetailDto>({
            url: '/v1/discoveries/{uuid}'.replace('{uuid}', encodeURI(uuid)),
            method: 'GET',
        }, opts?.responseOpts);
    };

    /**
     * Discovery Details
     */
    getDiscoveryCertificates({ uuid, newlyDiscovered, itemsPerPage, pageNumber }: GetDiscoveryCertificatesRequest): Observable<DiscoveryCertificateResponseDto>
    getDiscoveryCertificates({ uuid, newlyDiscovered, itemsPerPage, pageNumber }: GetDiscoveryCertificatesRequest, opts?: OperationOpts): Observable<AjaxResponse<DiscoveryCertificateResponseDto>>
    getDiscoveryCertificates({ uuid, newlyDiscovered, itemsPerPage, pageNumber }: GetDiscoveryCertificatesRequest, opts?: OperationOpts): Observable<DiscoveryCertificateResponseDto | AjaxResponse<DiscoveryCertificateResponseDto>> {
        throwIfNullOrUndefined(uuid, 'uuid', 'getDiscoveryCertificates');

        const query: HttpQuery = {};

        if (newlyDiscovered != null) { query['newlyDiscovered'] = newlyDiscovered; }
        if (itemsPerPage != null) { query['itemsPerPage'] = itemsPerPage; }
        if (pageNumber != null) { query['pageNumber'] = pageNumber; }

        return this.request<DiscoveryCertificateResponseDto>({
            url: '/v1/discoveries/{uuid}/certificates'.replace('{uuid}', encodeURI(uuid)),
            method: 'GET',
            query,
        }, opts?.responseOpts);
    };

    /**
     * Get Discovery searchable fields information
     */
    getSearchableFieldInformation3(): Observable<Array<SearchFieldDataByGroupDto>>
    getSearchableFieldInformation3(opts?: OperationOpts): Observable<AjaxResponse<Array<SearchFieldDataByGroupDto>>>
    getSearchableFieldInformation3(opts?: OperationOpts): Observable<Array<SearchFieldDataByGroupDto> | AjaxResponse<Array<SearchFieldDataByGroupDto>>> {
        return this.request<Array<SearchFieldDataByGroupDto>>({
            url: '/v1/discoveries/search',
            method: 'GET',
        }, opts?.responseOpts);
    };

    /**
     * List Discovery
     */
    listDiscoveries({ searchRequestDto }: ListDiscoveriesRequest): Observable<DiscoveryResponseDto>
    listDiscoveries({ searchRequestDto }: ListDiscoveriesRequest, opts?: OperationOpts): Observable<AjaxResponse<DiscoveryResponseDto>>
    listDiscoveries({ searchRequestDto }: ListDiscoveriesRequest, opts?: OperationOpts): Observable<DiscoveryResponseDto | AjaxResponse<DiscoveryResponseDto>> {
        throwIfNullOrUndefined(searchRequestDto, 'searchRequestDto', 'listDiscoveries');

        const headers: HttpHeaders = {
            'Content-Type': 'application/json',
        };

        return this.request<DiscoveryResponseDto>({
            url: '/v1/discoveries/list',
            method: 'POST',
            headers,
            body: searchRequestDto,
        }, opts?.responseOpts);
    };

    /**
     * Schedule Discovery
     */
    scheduleDiscovery({ scheduleDiscoveryDto }: ScheduleDiscoveryRequest): Observable<UuidDto>
    scheduleDiscovery({ scheduleDiscoveryDto }: ScheduleDiscoveryRequest, opts?: OperationOpts): Observable<AjaxResponse<UuidDto>>
    scheduleDiscovery({ scheduleDiscoveryDto }: ScheduleDiscoveryRequest, opts?: OperationOpts): Observable<UuidDto | AjaxResponse<UuidDto>> {
        throwIfNullOrUndefined(scheduleDiscoveryDto, 'scheduleDiscoveryDto', 'scheduleDiscovery');

        const headers: HttpHeaders = {
            'Content-Type': 'application/json',
        };

        return this.request<UuidDto>({
            url: '/v1/discoveries/schedule',
            method: 'POST',
            headers,
            body: scheduleDiscoveryDto,
        }, opts?.responseOpts);
    };

}
