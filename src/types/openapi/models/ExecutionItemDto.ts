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
    FilterFieldSource,
} from './';

/**
 * List of the execution items
 * @export
 * @interface ExecutionItemDto
 */
export interface ExecutionItemDto {
    /**
     * @type {FilterFieldSource}
     * @memberof ExecutionItemDto
     */
    fieldSource: FilterFieldSource;
    /**
     * Field identifier of the execution item
     * @type {string}
     * @memberof ExecutionItemDto
     */
    fieldIdentifier: string;
    /**
     * Data of the execution item
     * @type {object}
     * @memberof ExecutionItemDto
     */
    data?: object;
}


