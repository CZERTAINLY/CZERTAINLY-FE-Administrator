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
    TokenInstanceStatus,
} from './';

/**
 * @export
 * @interface TokenProfileDto
 */
export interface TokenProfileDto {
    /**
     * Object identifier
     * @type {string}
     * @memberof TokenProfileDto
     */
    uuid: string;
    /**
     * Object Name
     * @type {string}
     * @memberof TokenProfileDto
     */
    name: string;
    /**
     * Description of Token Profile
     * @type {string}
     * @memberof TokenProfileDto
     */
    description?: string;
    /**
     * UUID of Token Instance
     * @type {string}
     * @memberof TokenProfileDto
     */
    tokenInstanceUuid: string;
    /**
     * Name of Token instance
     * @type {string}
     * @memberof TokenProfileDto
     */
    tokenInstanceName: string;
    /**
     * Token Instance Status
     * @type {TokenInstanceStatus}
     * @memberof TokenProfileDto
     */
    tokenInstanceStatus: TokenInstanceStatus;
    /**
     * Enabled flag - true = enabled; false = disabled
     * @type {boolean}
     * @memberof TokenProfileDto
     */
    enabled: boolean;
    /**
     * Usages for the Keys assoiated to the profile
     * @type {Array<KeyUsage>}
     * @memberof TokenProfileDto
     */
    usages: Array<KeyUsage>;
}


