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

import type { ScheduledJobHistoryDto } from "./";

/**
 * @export
 * @interface ScheduledJobHistoryResponseDto
 */
export interface ScheduledJobHistoryResponseDto {
    /**
     * Number of entries per page
     * @type {number}
     * @memberof ScheduledJobHistoryResponseDto
     */
    itemsPerPage: number;
    /**
     * Page number for the request
     * @type {number}
     * @memberof ScheduledJobHistoryResponseDto
     */
    pageNumber: number;
    /**
     * Number of pages available
     * @type {number}
     * @memberof ScheduledJobHistoryResponseDto
     */
    totalPages: number;
    /**
     * Number of items available
     * @type {number}
     * @memberof ScheduledJobHistoryResponseDto
     */
    totalItems: number;
    /**
     * Scheduled job history
     * @type {Array<ScheduledJobHistoryDto>}
     * @memberof ScheduledJobHistoryResponseDto
     */
    scheduledJobHistory: Array<ScheduledJobHistoryDto>;
}
