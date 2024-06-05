// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 2.12.1-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type {
    ConditionDto,
    ExecutionDto,
} from './';

/**
 * List of records for each action that has not been performed and each condition that has not been evaluated.
 * @export
 * @interface TriggerHistoryRecordDto
 */
export interface TriggerHistoryRecordDto {
    /**
     * Message with cause of action/condition failure.
     * @type {string}
     * @memberof TriggerHistoryRecordDto
     */
    message: string;
    /**
     * @type {ConditionDto}
     * @memberof TriggerHistoryRecordDto
     */
    condition?: ConditionDto;
    /**
     * @type {ExecutionDto}
     * @memberof TriggerHistoryRecordDto
     */
    execution?: ExecutionDto;
}
