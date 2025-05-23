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
    DiscoveryDto,
} from './';

/**
 * @export
 * @interface ScheduleDiscoveryDto
 */
export interface ScheduleDiscoveryDto {
    /**
     * @type {string}
     * @memberof ScheduleDiscoveryDto
     */
    jobName?: string;
    /**
     * @type {string}
     * @memberof ScheduleDiscoveryDto
     */
    cronExpression?: string;
    /**
     * @type {boolean}
     * @memberof ScheduleDiscoveryDto
     */
    oneTime?: boolean;
    /**
     * @type {DiscoveryDto}
     * @memberof ScheduleDiscoveryDto
     */
    request?: DiscoveryDto;
}
