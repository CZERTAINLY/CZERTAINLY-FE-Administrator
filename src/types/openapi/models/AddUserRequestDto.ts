// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 2.7.1-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type { RequestAttributeDto } from "./";

/**
 * @export
 * @interface AddUserRequestDto
 */
export interface AddUserRequestDto {
    /**
     * Username of the user
     * @type {string}
     * @memberof AddUserRequestDto
     */
    username: string;
    /**
     * Description of the user
     * @type {string}
     * @memberof AddUserRequestDto
     */
    description?: string;
    /**
     * First name of the user
     * @type {string}
     * @memberof AddUserRequestDto
     */
    firstName?: string;
    /**
     * Last name of the user
     * @type {string}
     * @memberof AddUserRequestDto
     */
    lastName?: string;
    /**
     * Email of the user
     * @type {string}
     * @memberof AddUserRequestDto
     */
    email?: string;
    /**
     * Status of the user. True = Enabled, False = Disabled
     * @type {boolean}
     * @memberof AddUserRequestDto
     */
    enabled?: boolean;
    /**
     * Base64 Content of the user certificate
     * @type {string}
     * @memberof AddUserRequestDto
     */
    certificateData?: string;
    /**
     * UUID of the existing certificate in the Inventory
     * @type {string}
     * @memberof AddUserRequestDto
     */
    certificateUuid?: string;
    /**
     * List of Custom Attributes
     * @type {Array<RequestAttributeDto>}
     * @memberof AddUserRequestDto
     */
    customAttributes?: Array<RequestAttributeDto>;
}
