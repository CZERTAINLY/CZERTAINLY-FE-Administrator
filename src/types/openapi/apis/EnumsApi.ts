// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 2.7.2-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type { Observable } from "rxjs";
import type { AjaxResponse } from "rxjs/ajax";
import { BaseAPI } from "../runtime";
import type { OperationOpts } from "../runtime";
import type { EnumItemDto, ErrorMessageDto } from "../models";

/**
 * no description
 */
export class EnumsApi extends BaseAPI {
    /**
     * Get platform enums
     */
    getPlatformEnums(): Observable<{ [key: string]: { [key: string]: EnumItemDto } }>;
    getPlatformEnums(opts?: OperationOpts): Observable<AjaxResponse<{ [key: string]: { [key: string]: EnumItemDto } }>>;
    getPlatformEnums(
        opts?: OperationOpts,
    ): Observable<{ [key: string]: { [key: string]: EnumItemDto } } | AjaxResponse<{ [key: string]: { [key: string]: EnumItemDto } }>> {
        return this.request<{ [key: string]: { [key: string]: EnumItemDto } }>(
            {
                url: "/v1/enums",
                method: "GET",
            },
            opts?.responseOpts,
        );
    }
}
