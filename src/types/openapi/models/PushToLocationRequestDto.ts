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
    RequestAttributeDto,
} from './';

/**
 * @export
 * @interface PushToLocationRequestDto
 */
export interface PushToLocationRequestDto {
    /**
     * List of push Attributes for Location
     * @type {Array<RequestAttributeDto>}
     * @memberof PushToLocationRequestDto
     */
    attributes: Array<RequestAttributeDto>;
}
