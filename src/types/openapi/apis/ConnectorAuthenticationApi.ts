// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 2.8.1-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type { Observable } from "rxjs";
import type { AjaxResponse } from "rxjs/ajax";
import { BaseAPI, throwIfNullOrUndefined } from "../runtime";
import type { OperationOpts, HttpHeaders } from "../runtime";
import type { AuthenticationServiceExceptionDto, BaseAttributeDto, ErrorMessageDto, RequestAttributeDto } from "../models";

export interface ValidateApiKeyAuthAttributesRequest {
    requestAttributeDto: Array<RequestAttributeDto>;
}

export interface ValidateBasicAuthAttributesRequest {
    requestAttributeDto: Array<RequestAttributeDto>;
}

export interface ValidateCertificateAttributesRequest {
    requestAttributeDto: Array<RequestAttributeDto>;
}

export interface ValidateJWTAuthAttributesRequest {
    requestAttributeDto: Array<RequestAttributeDto>;
}

/**
 * no description
 */
export class ConnectorAuthenticationApi extends BaseAPI {
    /**
     * Get API Key auth Attributes
     */
    getApiKeyAuthAttributes(): Observable<Array<BaseAttributeDto>>;
    getApiKeyAuthAttributes(opts?: OperationOpts): Observable<AjaxResponse<Array<BaseAttributeDto>>>;
    getApiKeyAuthAttributes(opts?: OperationOpts): Observable<Array<BaseAttributeDto> | AjaxResponse<Array<BaseAttributeDto>>> {
        return this.request<Array<BaseAttributeDto>>(
            {
                url: "/v1/connectors/auth/attributes/apiKey",
                method: "GET",
            },
            opts?.responseOpts,
        );
    }

    /**
     * Get list of Authentication Types
     */
    getAuthenticationTypes(): Observable<Array<string>>;
    getAuthenticationTypes(opts?: OperationOpts): Observable<AjaxResponse<Array<string>>>;
    getAuthenticationTypes(opts?: OperationOpts): Observable<Array<string> | AjaxResponse<Array<string>>> {
        return this.request<Array<string>>(
            {
                url: "/v1/connectors/auth/types",
                method: "GET",
            },
            opts?.responseOpts,
        );
    }

    /**
     * Get basic auth Attributes
     */
    getBasicAuthAttributes(): Observable<Array<BaseAttributeDto>>;
    getBasicAuthAttributes(opts?: OperationOpts): Observable<AjaxResponse<Array<BaseAttributeDto>>>;
    getBasicAuthAttributes(opts?: OperationOpts): Observable<Array<BaseAttributeDto> | AjaxResponse<Array<BaseAttributeDto>>> {
        return this.request<Array<BaseAttributeDto>>(
            {
                url: "/v1/connectors/auth/attributes/basic",
                method: "GET",
            },
            opts?.responseOpts,
        );
    }

    /**
     * Get Attributes for certificate auth
     */
    getCertificateAttributes(): Observable<Array<BaseAttributeDto>>;
    getCertificateAttributes(opts?: OperationOpts): Observable<AjaxResponse<Array<BaseAttributeDto>>>;
    getCertificateAttributes(opts?: OperationOpts): Observable<Array<BaseAttributeDto> | AjaxResponse<Array<BaseAttributeDto>>> {
        return this.request<Array<BaseAttributeDto>>(
            {
                url: "/v1/connectors/auth/attributes/certificate",
                method: "GET",
            },
            opts?.responseOpts,
        );
    }

    /**
     * Get JWT auth Attributes
     */
    getJWTAuthAttributes(): Observable<Array<BaseAttributeDto>>;
    getJWTAuthAttributes(opts?: OperationOpts): Observable<AjaxResponse<Array<BaseAttributeDto>>>;
    getJWTAuthAttributes(opts?: OperationOpts): Observable<Array<BaseAttributeDto> | AjaxResponse<Array<BaseAttributeDto>>> {
        return this.request<Array<BaseAttributeDto>>(
            {
                url: "/v1/connectors/auth/attributes/jwt",
                method: "GET",
            },
            opts?.responseOpts,
        );
    }

    /**
     * Validate API Key Attributes
     */
    validateApiKeyAuthAttributes({ requestAttributeDto }: ValidateApiKeyAuthAttributesRequest): Observable<void>;
    validateApiKeyAuthAttributes(
        { requestAttributeDto }: ValidateApiKeyAuthAttributesRequest,
        opts?: OperationOpts,
    ): Observable<void | AjaxResponse<void>>;
    validateApiKeyAuthAttributes(
        { requestAttributeDto }: ValidateApiKeyAuthAttributesRequest,
        opts?: OperationOpts,
    ): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(requestAttributeDto, "requestAttributeDto", "validateApiKeyAuthAttributes");

        const headers: HttpHeaders = {
            "Content-Type": "application/json",
        };

        return this.request<void>(
            {
                url: "/v1/connectors/auth/attributes/apiKey/validate",
                method: "POST",
                headers,
                body: requestAttributeDto,
            },
            opts?.responseOpts,
        );
    }

    /**
     * Validate basic auth Attributes
     */
    validateBasicAuthAttributes({ requestAttributeDto }: ValidateBasicAuthAttributesRequest): Observable<void>;
    validateBasicAuthAttributes(
        { requestAttributeDto }: ValidateBasicAuthAttributesRequest,
        opts?: OperationOpts,
    ): Observable<void | AjaxResponse<void>>;
    validateBasicAuthAttributes(
        { requestAttributeDto }: ValidateBasicAuthAttributesRequest,
        opts?: OperationOpts,
    ): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(requestAttributeDto, "requestAttributeDto", "validateBasicAuthAttributes");

        const headers: HttpHeaders = {
            "Content-Type": "application/json",
        };

        return this.request<void>(
            {
                url: "/v1/connectors/auth/attributes/basic/validate",
                method: "POST",
                headers,
                body: requestAttributeDto,
            },
            opts?.responseOpts,
        );
    }

    /**
     * Validate certificate auth Attributes
     */
    validateCertificateAttributes({ requestAttributeDto }: ValidateCertificateAttributesRequest): Observable<void>;
    validateCertificateAttributes(
        { requestAttributeDto }: ValidateCertificateAttributesRequest,
        opts?: OperationOpts,
    ): Observable<void | AjaxResponse<void>>;
    validateCertificateAttributes(
        { requestAttributeDto }: ValidateCertificateAttributesRequest,
        opts?: OperationOpts,
    ): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(requestAttributeDto, "requestAttributeDto", "validateCertificateAttributes");

        const headers: HttpHeaders = {
            "Content-Type": "application/json",
        };

        return this.request<void>(
            {
                url: "/v1/connectors/auth/attributes/certificate/validate",
                method: "POST",
                headers,
                body: requestAttributeDto,
            },
            opts?.responseOpts,
        );
    }

    /**
     * Validate JWT auth Attributes
     */
    validateJWTAuthAttributes({ requestAttributeDto }: ValidateJWTAuthAttributesRequest): Observable<void>;
    validateJWTAuthAttributes(
        { requestAttributeDto }: ValidateJWTAuthAttributesRequest,
        opts?: OperationOpts,
    ): Observable<void | AjaxResponse<void>>;
    validateJWTAuthAttributes(
        { requestAttributeDto }: ValidateJWTAuthAttributesRequest,
        opts?: OperationOpts,
    ): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(requestAttributeDto, "requestAttributeDto", "validateJWTAuthAttributes");

        const headers: HttpHeaders = {
            "Content-Type": "application/json",
        };

        return this.request<void>(
            {
                url: "/v1/connectors/auth/attributes/jwt/validate",
                method: "POST",
                headers,
                body: requestAttributeDto,
            },
            opts?.responseOpts,
        );
    }
}
