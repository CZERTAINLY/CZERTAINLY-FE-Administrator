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
    KeyUsage,
    RequestAttributeDto,
} from './';

/**
 * @export
 * @interface EditTokenProfileRequestDto
 */
export interface EditTokenProfileRequestDto {
    /**
     * Description of Token Profile
     * @type {string}
     * @memberof EditTokenProfileRequestDto
     */
    description?: string;
    /**
     * List of Attributes for Token Profile
     * @type {Array<RequestAttributeDto>}
     * @memberof EditTokenProfileRequestDto
     */
    attributes: Array<RequestAttributeDto>;
    /**
     * List of Custom Attributes
     * @type {Array<RequestAttributeDto>}
     * @memberof EditTokenProfileRequestDto
     */
    customAttributes?: Array<RequestAttributeDto>;
    /**
     * Enabled flag - true = enabled; false = disabled
     * @type {boolean}
     * @memberof EditTokenProfileRequestDto
     */
    enabled?: boolean;
    /**
     * Usages for the Key
     * @type {Array<KeyUsage>}
     * @memberof EditTokenProfileRequestDto
     */
    usage?: Array<KeyUsage>;
}
