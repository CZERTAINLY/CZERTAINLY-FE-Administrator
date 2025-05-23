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
    FilterFieldSource,
    SearchFieldDataDto,
} from './';

/**
 * @export
 * @interface SearchFieldDataByGroupDto
 */
export interface SearchFieldDataByGroupDto {
    /**
     * Search group
     * @type {FilterFieldSource}
     * @memberof SearchFieldDataByGroupDto
     */
    filterFieldSource: FilterFieldSource;
    /**
     * List of search fields for specified search group
     * @type {Array<SearchFieldDataDto>}
     * @memberof SearchFieldDataByGroupDto
     */
    searchFieldData?: Array<SearchFieldDataDto>;
}


