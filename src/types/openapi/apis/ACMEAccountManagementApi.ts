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
import type { OperationOpts, HttpHeaders } from '../runtime';
import type {
    AcmeAccountListResponseDto,
    AcmeAccountResponseDto,
    AuthenticationServiceExceptionDto,
    ErrorMessageDto,
} from '../models';

export interface BulkDisableAcmeAccountRequest {
    requestBody: Array<string>;
}

export interface BulkEnableAcmeAccountRequest {
    requestBody: Array<string>;
}

export interface BulkRevokeAcmeAccountRequest {
    requestBody: Array<string>;
}

export interface DisableAcmeAccountRequest {
    acmeProfileUuid: string;
    acmeAccountUuid: string;
}

export interface EnableAcmeAccountRequest {
    acmeProfileUuid: string;
    acmeAccountUuid: string;
}

export interface GetAcmeAccountRequest {
    acmeProfileUuid: string;
    acmeAccountUuid: string;
}

export interface RevokeAcmeAccountRequest {
    acmeProfileUuid: string;
    acmeAccountUuid: string;
}

/**
 * no description
 */
export class ACMEAccountManagementApi extends BaseAPI {

    /**
     * Disable multiple ACME Accounts
     */
    bulkDisableAcmeAccount({ requestBody }: BulkDisableAcmeAccountRequest): Observable<void>
    bulkDisableAcmeAccount({ requestBody }: BulkDisableAcmeAccountRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>>
    bulkDisableAcmeAccount({ requestBody }: BulkDisableAcmeAccountRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(requestBody, 'requestBody', 'bulkDisableAcmeAccount');

        const headers: HttpHeaders = {
            'Content-Type': 'application/json',
        };

        return this.request<void>({
            url: '/v1/acmeAccounts/disable',
            method: 'PATCH',
            headers,
            body: requestBody,
        }, opts?.responseOpts);
    };

    /**
     * Enable multiple ACME Accounts
     */
    bulkEnableAcmeAccount({ requestBody }: BulkEnableAcmeAccountRequest): Observable<void>
    bulkEnableAcmeAccount({ requestBody }: BulkEnableAcmeAccountRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>>
    bulkEnableAcmeAccount({ requestBody }: BulkEnableAcmeAccountRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(requestBody, 'requestBody', 'bulkEnableAcmeAccount');

        const headers: HttpHeaders = {
            'Content-Type': 'application/json',
        };

        return this.request<void>({
            url: '/v1/acmeAccounts/enable',
            method: 'PATCH',
            headers,
            body: requestBody,
        }, opts?.responseOpts);
    };

    /**
     * Revoke multiple ACME Accounts
     */
    bulkRevokeAcmeAccount({ requestBody }: BulkRevokeAcmeAccountRequest): Observable<void>
    bulkRevokeAcmeAccount({ requestBody }: BulkRevokeAcmeAccountRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>>
    bulkRevokeAcmeAccount({ requestBody }: BulkRevokeAcmeAccountRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(requestBody, 'requestBody', 'bulkRevokeAcmeAccount');

        const headers: HttpHeaders = {
            'Content-Type': 'application/json',
        };

        return this.request<void>({
            url: '/v1/acmeAccounts/revoke',
            method: 'PUT',
            headers,
            body: requestBody,
        }, opts?.responseOpts);
    };

    /**
     * Disable ACME Account
     */
    disableAcmeAccount({ acmeProfileUuid, acmeAccountUuid }: DisableAcmeAccountRequest): Observable<void>
    disableAcmeAccount({ acmeProfileUuid, acmeAccountUuid }: DisableAcmeAccountRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>>
    disableAcmeAccount({ acmeProfileUuid, acmeAccountUuid }: DisableAcmeAccountRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(acmeProfileUuid, 'acmeProfileUuid', 'disableAcmeAccount');
        throwIfNullOrUndefined(acmeAccountUuid, 'acmeAccountUuid', 'disableAcmeAccount');

        return this.request<void>({
            url: '/v1/acmeProfiles/{acmeProfileUuid}/acmeAccounts/{acmeAccountUuid}/disable'.replace('{acmeProfileUuid}', encodeURI(acmeProfileUuid)).replace('{acmeAccountUuid}', encodeURI(acmeAccountUuid)),
            method: 'PATCH',
        }, opts?.responseOpts);
    };

    /**
     * Enable ACME Account
     */
    enableAcmeAccount({ acmeProfileUuid, acmeAccountUuid }: EnableAcmeAccountRequest): Observable<void>
    enableAcmeAccount({ acmeProfileUuid, acmeAccountUuid }: EnableAcmeAccountRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>>
    enableAcmeAccount({ acmeProfileUuid, acmeAccountUuid }: EnableAcmeAccountRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(acmeProfileUuid, 'acmeProfileUuid', 'enableAcmeAccount');
        throwIfNullOrUndefined(acmeAccountUuid, 'acmeAccountUuid', 'enableAcmeAccount');

        return this.request<void>({
            url: '/v1/acmeProfiles/{acmeProfileUuid}/acmeAccounts/{acmeAccountUuid}/enable'.replace('{acmeProfileUuid}', encodeURI(acmeProfileUuid)).replace('{acmeAccountUuid}', encodeURI(acmeAccountUuid)),
            method: 'PATCH',
        }, opts?.responseOpts);
    };

    /**
     * Details of ACME Account
     */
    getAcmeAccount({ acmeProfileUuid, acmeAccountUuid }: GetAcmeAccountRequest): Observable<AcmeAccountResponseDto>
    getAcmeAccount({ acmeProfileUuid, acmeAccountUuid }: GetAcmeAccountRequest, opts?: OperationOpts): Observable<AjaxResponse<AcmeAccountResponseDto>>
    getAcmeAccount({ acmeProfileUuid, acmeAccountUuid }: GetAcmeAccountRequest, opts?: OperationOpts): Observable<AcmeAccountResponseDto | AjaxResponse<AcmeAccountResponseDto>> {
        throwIfNullOrUndefined(acmeProfileUuid, 'acmeProfileUuid', 'getAcmeAccount');
        throwIfNullOrUndefined(acmeAccountUuid, 'acmeAccountUuid', 'getAcmeAccount');

        return this.request<AcmeAccountResponseDto>({
            url: '/v1/acmeProfiles/{acmeProfileUuid}/acmeAccounts/{acmeAccountUuid}'.replace('{acmeProfileUuid}', encodeURI(acmeProfileUuid)).replace('{acmeAccountUuid}', encodeURI(acmeAccountUuid)),
            method: 'GET',
        }, opts?.responseOpts);
    };

    /**
     * List ACME Accounts
     */
    listAcmeAccounts(): Observable<Array<AcmeAccountListResponseDto>>
    listAcmeAccounts(opts?: OperationOpts): Observable<AjaxResponse<Array<AcmeAccountListResponseDto>>>
    listAcmeAccounts(opts?: OperationOpts): Observable<Array<AcmeAccountListResponseDto> | AjaxResponse<Array<AcmeAccountListResponseDto>>> {
        return this.request<Array<AcmeAccountListResponseDto>>({
            url: '/v1/acmeAccounts',
            method: 'GET',
        }, opts?.responseOpts);
    };

    /**
     * Revoke ACME Account
     */
    revokeAcmeAccount({ acmeProfileUuid, acmeAccountUuid }: RevokeAcmeAccountRequest): Observable<void>
    revokeAcmeAccount({ acmeProfileUuid, acmeAccountUuid }: RevokeAcmeAccountRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>>
    revokeAcmeAccount({ acmeProfileUuid, acmeAccountUuid }: RevokeAcmeAccountRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(acmeProfileUuid, 'acmeProfileUuid', 'revokeAcmeAccount');
        throwIfNullOrUndefined(acmeAccountUuid, 'acmeAccountUuid', 'revokeAcmeAccount');

        return this.request<void>({
            url: '/v1/acmeProfiles/{acmeProfileUuid}/acmeAccounts/{acmeAccountUuid}'.replace('{acmeProfileUuid}', encodeURI(acmeProfileUuid)).replace('{acmeAccountUuid}', encodeURI(acmeAccountUuid)),
            method: 'POST',
        }, opts?.responseOpts);
    };

}
