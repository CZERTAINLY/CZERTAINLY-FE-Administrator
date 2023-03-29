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
import { BaseAPI, throwIfNullOrUndefined } from "../runtime";
import type { OperationOpts, HttpHeaders } from "../runtime";
import type { ConnectorRequestDto, ErrorMessageDto, UuidDto } from "../models";

export interface RegisterRequest {
    connectorRequestDto: ConnectorRequestDto;
}

/**
 * no description
 */
export class ConnectorRegistrationApi extends BaseAPI {
    /**
     * Register a Connector
     */
    register({ connectorRequestDto }: RegisterRequest): Observable<UuidDto>;
    register({ connectorRequestDto }: RegisterRequest, opts?: OperationOpts): Observable<AjaxResponse<UuidDto>>;
    register({ connectorRequestDto }: RegisterRequest, opts?: OperationOpts): Observable<UuidDto | AjaxResponse<UuidDto>> {
        throwIfNullOrUndefined(connectorRequestDto, "connectorRequestDto", "register");

        const headers: HttpHeaders = {
            "Content-Type": "application/json",
        };

        return this.request<UuidDto>(
            {
                url: "/v1/connector/register",
                method: "POST",
                headers,
                body: connectorRequestDto,
            },
            opts?.responseOpts,
        );
    }
}
