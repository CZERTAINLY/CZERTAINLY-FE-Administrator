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

import type { DiscoveryHistoryDto } from "./";

/**
 * @export
 * @interface DiscoveryResponseDto
 */
export interface DiscoveryResponseDto {
    /**
     * Discoveries
     * @type {Array<DiscoveryHistoryDto>}
     * @memberof DiscoveryResponseDto
     */
    discoveries: Array<DiscoveryHistoryDto>;
    /**
     * Number of entries per page
     * @type {number}
     * @memberof DiscoveryResponseDto
     */
    itemsPerPage: number;
    /**
     * Page number for the request
     * @type {number}
     * @memberof DiscoveryResponseDto
     */
    pageNumber: number;
    /**
     * Number of pages available
     * @type {number}
     * @memberof DiscoveryResponseDto
     */
    totalPages: number;
    /**
     * Number of items available
     * @type {number}
     * @memberof DiscoveryResponseDto
     */
    totalItems: number;
}
