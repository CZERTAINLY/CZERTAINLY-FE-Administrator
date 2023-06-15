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

/**
 * @export
 * @interface PaginationRequestDto
 */
export interface PaginationRequestDto {
    /**
     * Number of entries per page
     * @type {number}
     * @memberof PaginationRequestDto
     */
    itemsPerPage?: number;
    /**
     * Page number for the request
     * @type {number}
     * @memberof PaginationRequestDto
     */
    pageNumber?: number;
}
