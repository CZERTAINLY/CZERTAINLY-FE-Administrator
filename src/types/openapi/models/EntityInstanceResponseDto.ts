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

import type {
    EntityInstanceDto,
} from './';

/**
 * @export
 * @interface EntityInstanceResponseDto
 */
export interface EntityInstanceResponseDto {
    /**
     * Entities
     * @type {Array<EntityInstanceDto>}
     * @memberof EntityInstanceResponseDto
     */
    entities: Array<EntityInstanceDto>;
    /**
     * Number of entries per page
     * @type {number}
     * @memberof EntityInstanceResponseDto
     */
    itemsPerPage: number;
    /**
     * Page number for the request
     * @type {number}
     * @memberof EntityInstanceResponseDto
     */
    pageNumber: number;
    /**
     * Number of pages available
     * @type {number}
     * @memberof EntityInstanceResponseDto
     */
    totalPages: number;
    /**
     * Number of items available
     * @type {number}
     * @memberof EntityInstanceResponseDto
     */
    totalItems: number;
}
