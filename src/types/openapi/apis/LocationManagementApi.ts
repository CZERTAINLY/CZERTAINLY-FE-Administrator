// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 2.11.1-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type { Observable } from 'rxjs';
import type { AjaxResponse } from 'rxjs/ajax';
import { BaseAPI, throwIfNullOrUndefined, encodeURI } from '../runtime';
import type { OperationOpts, HttpHeaders } from '../runtime';
import type {
    AddLocationRequestDto,
    AuthenticationServiceExceptionDto,
    BaseAttributeDto,
    EditLocationRequestDto,
    ErrorMessageDto,
    IssueToLocationRequestDto,
    LocationDto,
    LocationsResponseDto,
    PushToLocationRequestDto,
    SearchFieldDataByGroupDto,
    SearchRequestDto,
    UuidDto,
} from '../models';

export interface AddLocationRequest {
    entityUuid: string;
    addLocationRequestDto: AddLocationRequestDto;
}

export interface DeleteLocationRequest {
    entityUuid: string;
    locationUuid: string;
}

export interface DisableLocationRequest {
    entityUuid: string;
    locationUuid: string;
}

export interface EditLocationRequest {
    entityUuid: string;
    locationUuid: string;
    editLocationRequestDto: EditLocationRequestDto;
}

export interface EnableLocationRequest {
    entityUuid: string;
    locationUuid: string;
}

export interface GetLocationRequest {
    entityUuid: string;
    locationUuid: string;
}

export interface IssueCertificateToLocationRequest {
    entityUuid: string;
    locationUuid: string;
    issueToLocationRequestDto: IssueToLocationRequestDto;
}

export interface ListCsrAttributesRequest {
    entityUuid: string;
    locationUuid: string;
}

export interface ListLocationsRequest {
    searchRequestDto: SearchRequestDto;
}

export interface ListPushAttributesRequest {
    entityUuid: string;
    locationUuid: string;
}

export interface PushCertificateRequest {
    entityUuid: string;
    locationUuid: string;
    certificateUuid: string;
    pushToLocationRequestDto: PushToLocationRequestDto;
}

export interface RemoveCertificateRequest {
    entityUuid: string;
    locationUuid: string;
    certificateUuid: string;
}

export interface RenewCertificateInLocationRequest {
    entityUuid: string;
    locationUuid: string;
    certificateUuid: string;
}

export interface UpdateLocationContentRequest {
    entityUuid: string;
    locationUuid: string;
}

/**
 * no description
 */
export class LocationManagementApi extends BaseAPI {

    /**
     * Add Location
     */
    addLocation({ entityUuid, addLocationRequestDto }: AddLocationRequest): Observable<UuidDto>
    addLocation({ entityUuid, addLocationRequestDto }: AddLocationRequest, opts?: OperationOpts): Observable<AjaxResponse<UuidDto>>
    addLocation({ entityUuid, addLocationRequestDto }: AddLocationRequest, opts?: OperationOpts): Observable<UuidDto | AjaxResponse<UuidDto>> {
        throwIfNullOrUndefined(entityUuid, 'entityUuid', 'addLocation');
        throwIfNullOrUndefined(addLocationRequestDto, 'addLocationRequestDto', 'addLocation');

        const headers: HttpHeaders = {
            'Content-Type': 'application/json',
        };

        return this.request<UuidDto>({
            url: '/v1/entities/{entityUuid}/locations'.replace('{entityUuid}', encodeURI(entityUuid)),
            method: 'POST',
            headers,
            body: addLocationRequestDto,
        }, opts?.responseOpts);
    };

    /**
     * Delete Location
     */
    deleteLocation({ entityUuid, locationUuid }: DeleteLocationRequest): Observable<void>
    deleteLocation({ entityUuid, locationUuid }: DeleteLocationRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>>
    deleteLocation({ entityUuid, locationUuid }: DeleteLocationRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(entityUuid, 'entityUuid', 'deleteLocation');
        throwIfNullOrUndefined(locationUuid, 'locationUuid', 'deleteLocation');

        return this.request<void>({
            url: '/v1/entities/{entityUuid}/locations/{locationUuid}'.replace('{entityUuid}', encodeURI(entityUuid)).replace('{locationUuid}', encodeURI(locationUuid)),
            method: 'DELETE',
        }, opts?.responseOpts);
    };

    /**
     * Disable Location
     */
    disableLocation({ entityUuid, locationUuid }: DisableLocationRequest): Observable<void>
    disableLocation({ entityUuid, locationUuid }: DisableLocationRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>>
    disableLocation({ entityUuid, locationUuid }: DisableLocationRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(entityUuid, 'entityUuid', 'disableLocation');
        throwIfNullOrUndefined(locationUuid, 'locationUuid', 'disableLocation');

        return this.request<void>({
            url: '/v1/entities/{entityUuid}/locations/{locationUuid}/disable'.replace('{entityUuid}', encodeURI(entityUuid)).replace('{locationUuid}', encodeURI(locationUuid)),
            method: 'PATCH',
        }, opts?.responseOpts);
    };

    /**
     * Edit Location
     */
    editLocation({ entityUuid, locationUuid, editLocationRequestDto }: EditLocationRequest): Observable<LocationDto>
    editLocation({ entityUuid, locationUuid, editLocationRequestDto }: EditLocationRequest, opts?: OperationOpts): Observable<AjaxResponse<LocationDto>>
    editLocation({ entityUuid, locationUuid, editLocationRequestDto }: EditLocationRequest, opts?: OperationOpts): Observable<LocationDto | AjaxResponse<LocationDto>> {
        throwIfNullOrUndefined(entityUuid, 'entityUuid', 'editLocation');
        throwIfNullOrUndefined(locationUuid, 'locationUuid', 'editLocation');
        throwIfNullOrUndefined(editLocationRequestDto, 'editLocationRequestDto', 'editLocation');

        const headers: HttpHeaders = {
            'Content-Type': 'application/json',
        };

        return this.request<LocationDto>({
            url: '/v1/entities/{entityUuid}/locations/{locationUuid}'.replace('{entityUuid}', encodeURI(entityUuid)).replace('{locationUuid}', encodeURI(locationUuid)),
            method: 'PUT',
            headers,
            body: editLocationRequestDto,
        }, opts?.responseOpts);
    };

    /**
     * Enable Location
     */
    enableLocation({ entityUuid, locationUuid }: EnableLocationRequest): Observable<void>
    enableLocation({ entityUuid, locationUuid }: EnableLocationRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>>
    enableLocation({ entityUuid, locationUuid }: EnableLocationRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(entityUuid, 'entityUuid', 'enableLocation');
        throwIfNullOrUndefined(locationUuid, 'locationUuid', 'enableLocation');

        return this.request<void>({
            url: '/v1/entities/{entityUuid}/locations/{locationUuid}/enable'.replace('{entityUuid}', encodeURI(entityUuid)).replace('{locationUuid}', encodeURI(locationUuid)),
            method: 'PATCH',
        }, opts?.responseOpts);
    };

    /**
     * Get Location Details
     */
    getLocation({ entityUuid, locationUuid }: GetLocationRequest): Observable<LocationDto>
    getLocation({ entityUuid, locationUuid }: GetLocationRequest, opts?: OperationOpts): Observable<AjaxResponse<LocationDto>>
    getLocation({ entityUuid, locationUuid }: GetLocationRequest, opts?: OperationOpts): Observable<LocationDto | AjaxResponse<LocationDto>> {
        throwIfNullOrUndefined(entityUuid, 'entityUuid', 'getLocation');
        throwIfNullOrUndefined(locationUuid, 'locationUuid', 'getLocation');

        return this.request<LocationDto>({
            url: '/v1/entities/{entityUuid}/locations/{locationUuid}'.replace('{entityUuid}', encodeURI(entityUuid)).replace('{locationUuid}', encodeURI(locationUuid)),
            method: 'GET',
        }, opts?.responseOpts);
    };

    /**
     * Get Locations searchable fields information
     */
    getSearchableFieldInformation(): Observable<Array<SearchFieldDataByGroupDto>>
    getSearchableFieldInformation(opts?: OperationOpts): Observable<AjaxResponse<Array<SearchFieldDataByGroupDto>>>
    getSearchableFieldInformation(opts?: OperationOpts): Observable<Array<SearchFieldDataByGroupDto> | AjaxResponse<Array<SearchFieldDataByGroupDto>>> {
        return this.request<Array<SearchFieldDataByGroupDto>>({
            url: '/v1/search',
            method: 'GET',
        }, opts?.responseOpts);
    };

    /**
     * Issue Certificate to Location
     */
    issueCertificateToLocation({ entityUuid, locationUuid, issueToLocationRequestDto }: IssueCertificateToLocationRequest): Observable<LocationDto>
    issueCertificateToLocation({ entityUuid, locationUuid, issueToLocationRequestDto }: IssueCertificateToLocationRequest, opts?: OperationOpts): Observable<AjaxResponse<LocationDto>>
    issueCertificateToLocation({ entityUuid, locationUuid, issueToLocationRequestDto }: IssueCertificateToLocationRequest, opts?: OperationOpts): Observable<LocationDto | AjaxResponse<LocationDto>> {
        throwIfNullOrUndefined(entityUuid, 'entityUuid', 'issueCertificateToLocation');
        throwIfNullOrUndefined(locationUuid, 'locationUuid', 'issueCertificateToLocation');
        throwIfNullOrUndefined(issueToLocationRequestDto, 'issueToLocationRequestDto', 'issueCertificateToLocation');

        const headers: HttpHeaders = {
            'Content-Type': 'application/json',
        };

        return this.request<LocationDto>({
            url: '/v1/entities/{entityUuid}/locations/{locationUuid}/certificates'.replace('{entityUuid}', encodeURI(entityUuid)).replace('{locationUuid}', encodeURI(locationUuid)),
            method: 'POST',
            headers,
            body: issueToLocationRequestDto,
        }, opts?.responseOpts);
    };

    /**
     * Get CSR Attributes
     */
    listCsrAttributes({ entityUuid, locationUuid }: ListCsrAttributesRequest): Observable<Array<BaseAttributeDto>>
    listCsrAttributes({ entityUuid, locationUuid }: ListCsrAttributesRequest, opts?: OperationOpts): Observable<AjaxResponse<Array<BaseAttributeDto>>>
    listCsrAttributes({ entityUuid, locationUuid }: ListCsrAttributesRequest, opts?: OperationOpts): Observable<Array<BaseAttributeDto> | AjaxResponse<Array<BaseAttributeDto>>> {
        throwIfNullOrUndefined(entityUuid, 'entityUuid', 'listCsrAttributes');
        throwIfNullOrUndefined(locationUuid, 'locationUuid', 'listCsrAttributes');

        return this.request<Array<BaseAttributeDto>>({
            url: '/v1/entities/{entityUuid}/locations/{locationUuid}/attributes/issue'.replace('{entityUuid}', encodeURI(entityUuid)).replace('{locationUuid}', encodeURI(locationUuid)),
            method: 'GET',
        }, opts?.responseOpts);
    };

    /**
     * List Locations
     */
    listLocations({ searchRequestDto }: ListLocationsRequest): Observable<LocationsResponseDto>
    listLocations({ searchRequestDto }: ListLocationsRequest, opts?: OperationOpts): Observable<AjaxResponse<LocationsResponseDto>>
    listLocations({ searchRequestDto }: ListLocationsRequest, opts?: OperationOpts): Observable<LocationsResponseDto | AjaxResponse<LocationsResponseDto>> {
        throwIfNullOrUndefined(searchRequestDto, 'searchRequestDto', 'listLocations');

        const headers: HttpHeaders = {
            'Content-Type': 'application/json',
        };

        return this.request<LocationsResponseDto>({
            url: '/v1/locations',
            method: 'POST',
            headers,
            body: searchRequestDto,
        }, opts?.responseOpts);
    };

    /**
     * Get push Attributes
     */
    listPushAttributes({ entityUuid, locationUuid }: ListPushAttributesRequest): Observable<Array<BaseAttributeDto>>
    listPushAttributes({ entityUuid, locationUuid }: ListPushAttributesRequest, opts?: OperationOpts): Observable<AjaxResponse<Array<BaseAttributeDto>>>
    listPushAttributes({ entityUuid, locationUuid }: ListPushAttributesRequest, opts?: OperationOpts): Observable<Array<BaseAttributeDto> | AjaxResponse<Array<BaseAttributeDto>>> {
        throwIfNullOrUndefined(entityUuid, 'entityUuid', 'listPushAttributes');
        throwIfNullOrUndefined(locationUuid, 'locationUuid', 'listPushAttributes');

        return this.request<Array<BaseAttributeDto>>({
            url: '/v1/entities/{entityUuid}/locations/{locationUuid}/attributes/push'.replace('{entityUuid}', encodeURI(entityUuid)).replace('{locationUuid}', encodeURI(locationUuid)),
            method: 'GET',
        }, opts?.responseOpts);
    };

    /**
     * Push Certificate to Location
     */
    pushCertificate({ entityUuid, locationUuid, certificateUuid, pushToLocationRequestDto }: PushCertificateRequest): Observable<LocationDto>
    pushCertificate({ entityUuid, locationUuid, certificateUuid, pushToLocationRequestDto }: PushCertificateRequest, opts?: OperationOpts): Observable<AjaxResponse<LocationDto>>
    pushCertificate({ entityUuid, locationUuid, certificateUuid, pushToLocationRequestDto }: PushCertificateRequest, opts?: OperationOpts): Observable<LocationDto | AjaxResponse<LocationDto>> {
        throwIfNullOrUndefined(entityUuid, 'entityUuid', 'pushCertificate');
        throwIfNullOrUndefined(locationUuid, 'locationUuid', 'pushCertificate');
        throwIfNullOrUndefined(certificateUuid, 'certificateUuid', 'pushCertificate');
        throwIfNullOrUndefined(pushToLocationRequestDto, 'pushToLocationRequestDto', 'pushCertificate');

        const headers: HttpHeaders = {
            'Content-Type': 'application/json',
        };

        return this.request<LocationDto>({
            url: '/v1/entities/{entityUuid}/locations/{locationUuid}/certificates/{certificateUuid}'.replace('{entityUuid}', encodeURI(entityUuid)).replace('{locationUuid}', encodeURI(locationUuid)).replace('{certificateUuid}', encodeURI(certificateUuid)),
            method: 'PUT',
            headers,
            body: pushToLocationRequestDto,
        }, opts?.responseOpts);
    };

    /**
     * Remove Certificate from Location
     */
    removeCertificate({ entityUuid, locationUuid, certificateUuid }: RemoveCertificateRequest): Observable<LocationDto>
    removeCertificate({ entityUuid, locationUuid, certificateUuid }: RemoveCertificateRequest, opts?: OperationOpts): Observable<AjaxResponse<LocationDto>>
    removeCertificate({ entityUuid, locationUuid, certificateUuid }: RemoveCertificateRequest, opts?: OperationOpts): Observable<LocationDto | AjaxResponse<LocationDto>> {
        throwIfNullOrUndefined(entityUuid, 'entityUuid', 'removeCertificate');
        throwIfNullOrUndefined(locationUuid, 'locationUuid', 'removeCertificate');
        throwIfNullOrUndefined(certificateUuid, 'certificateUuid', 'removeCertificate');

        return this.request<LocationDto>({
            url: '/v1/entities/{entityUuid}/locations/{locationUuid}/certificates/{certificateUuid}'.replace('{entityUuid}', encodeURI(entityUuid)).replace('{locationUuid}', encodeURI(locationUuid)).replace('{certificateUuid}', encodeURI(certificateUuid)),
            method: 'DELETE',
        }, opts?.responseOpts);
    };

    /**
     * Renew Certificate in Location
     */
    renewCertificateInLocation({ entityUuid, locationUuid, certificateUuid }: RenewCertificateInLocationRequest): Observable<LocationDto>
    renewCertificateInLocation({ entityUuid, locationUuid, certificateUuid }: RenewCertificateInLocationRequest, opts?: OperationOpts): Observable<AjaxResponse<LocationDto>>
    renewCertificateInLocation({ entityUuid, locationUuid, certificateUuid }: RenewCertificateInLocationRequest, opts?: OperationOpts): Observable<LocationDto | AjaxResponse<LocationDto>> {
        throwIfNullOrUndefined(entityUuid, 'entityUuid', 'renewCertificateInLocation');
        throwIfNullOrUndefined(locationUuid, 'locationUuid', 'renewCertificateInLocation');
        throwIfNullOrUndefined(certificateUuid, 'certificateUuid', 'renewCertificateInLocation');

        return this.request<LocationDto>({
            url: '/v1/entities/{entityUuid}/locations/{locationUuid}/certificates/{certificateUuid}'.replace('{entityUuid}', encodeURI(entityUuid)).replace('{locationUuid}', encodeURI(locationUuid)).replace('{certificateUuid}', encodeURI(certificateUuid)),
            method: 'PATCH',
        }, opts?.responseOpts);
    };

    /**
     * Sync Location content
     */
    updateLocationContent({ entityUuid, locationUuid }: UpdateLocationContentRequest): Observable<LocationDto>
    updateLocationContent({ entityUuid, locationUuid }: UpdateLocationContentRequest, opts?: OperationOpts): Observable<AjaxResponse<LocationDto>>
    updateLocationContent({ entityUuid, locationUuid }: UpdateLocationContentRequest, opts?: OperationOpts): Observable<LocationDto | AjaxResponse<LocationDto>> {
        throwIfNullOrUndefined(entityUuid, 'entityUuid', 'updateLocationContent');
        throwIfNullOrUndefined(locationUuid, 'locationUuid', 'updateLocationContent');

        return this.request<LocationDto>({
            url: '/v1/entities/{entityUuid}/locations/{locationUuid}/sync'.replace('{entityUuid}', encodeURI(entityUuid)).replace('{locationUuid}', encodeURI(locationUuid)),
            method: 'PUT',
        }, opts?.responseOpts);
    };

}
