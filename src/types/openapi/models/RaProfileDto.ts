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
    ResponseAttributeDto,
} from './';

/**
 * @export
 * @interface RaProfileDto
 */
export interface RaProfileDto {
    /**
     * Object identifier
     * @type {string}
     * @memberof RaProfileDto
     */
    uuid: string;
    /**
     * Object Name
     * @type {string}
     * @memberof RaProfileDto
     */
    name: string;
    /**
     * Description of RA Profile
     * @type {string}
     * @memberof RaProfileDto
     */
    description?: string;
    /**
     * UUID of Authority provider
     * @type {string}
     * @memberof RaProfileDto
     */
    authorityInstanceUuid: string;
    /**
     * Name of Authority instance
     * @type {string}
     * @memberof RaProfileDto
     */
    authorityInstanceName: string;
    /**
     * Has Authority of legacy authority provider
     * @type {boolean}
     * @memberof RaProfileDto
     */
    legacyAuthority?: boolean;
    /**
     * Enabled flag - true = enabled; false = disabled
     * @type {boolean}
     * @memberof RaProfileDto
     */
    enabled: boolean;
    /**
     * List of RA Profiles attributes
     * @type {Array<ResponseAttributeDto>}
     * @memberof RaProfileDto
     */
    attributes?: Array<ResponseAttributeDto>;
    /**
     * List of Custom Attributes
     * @type {Array<ResponseAttributeDto>}
     * @memberof RaProfileDto
     */
    customAttributes?: Array<ResponseAttributeDto>;
    /**
     * List of protocols enabled
     * @type {Array<string>}
     * @memberof RaProfileDto
     */
    enabledProtocols?: Array<string>;
}
