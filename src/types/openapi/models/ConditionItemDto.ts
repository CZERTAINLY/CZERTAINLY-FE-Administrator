// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 2.11.1-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type {
    FilterConditionOperator,
    FilterFieldSource,
} from './';

/**
 * List of the condition items
 * @export
 * @interface ConditionItemDto
 */
export interface ConditionItemDto {
    /**
     * @type {FilterFieldSource}
     * @memberof ConditionItemDto
     */
    fieldSource: FilterFieldSource;
    /**
     * Field identifier of the condition item
     * @type {string}
     * @memberof ConditionItemDto
     */
    fieldIdentifier: string;
    /**
     * @type {FilterConditionOperator}
     * @memberof ConditionItemDto
     */
    operator: FilterConditionOperator;
    /**
     * Value of the condition item
     * @type {object}
     * @memberof ConditionItemDto
     */
    value?: object;
}


