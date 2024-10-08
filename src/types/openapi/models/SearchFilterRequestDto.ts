// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 2.12.1-SNAPSHOT
 * Contact: info@czertainly.com
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
 * Certificate filter input
 * @export
 * @interface SearchFilterRequestDto
 */
export interface SearchFilterRequestDto {
    /**
     * @type {FilterFieldSource}
     * @memberof SearchFilterRequestDto
     */
    fieldSource: FilterFieldSource;
    /**
     * Field identifier of search filter. List of available fields with their identifiers can be retrieved from corresponding endpoint `GET /v1/{resource}/search`, e.g.: [**GET /v1/certificates/search**](../core-certificate/#tag/Certificate-Inventory/operation/getSearchableFieldInformation)
     * @type {string}
     * @memberof SearchFilterRequestDto
     */
    fieldIdentifier: string;
    /**
     * @type {FilterConditionOperator}
     * @memberof SearchFilterRequestDto
     */
    condition: FilterConditionOperator;
    /**
     * Value to match
     * @type {object}
     * @memberof SearchFilterRequestDto
     */
    value?: object;
}


