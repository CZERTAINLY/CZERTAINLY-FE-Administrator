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

import type { ScheduledJobDto } from "./";

/**
 * @export
 * @interface ScheduledJobsResponseDto
 */
export interface ScheduledJobsResponseDto {
    /**
     * Number of entries per page
     * @type {number}
     * @memberof ScheduledJobsResponseDto
     */
    itemsPerPage: number;
    /**
     * Page number for the request
     * @type {number}
     * @memberof ScheduledJobsResponseDto
     */
    pageNumber: number;
    /**
     * Number of pages available
     * @type {number}
     * @memberof ScheduledJobsResponseDto
     */
    totalPages: number;
    /**
     * Number of items available
     * @type {number}
     * @memberof ScheduledJobsResponseDto
     */
    totalItems: number;
    /**
     * Scheduled jobs
     * @type {Array<ScheduledJobDto>}
     * @memberof ScheduledJobsResponseDto
     */
    scheduledJobs: Array<ScheduledJobDto>;
}
