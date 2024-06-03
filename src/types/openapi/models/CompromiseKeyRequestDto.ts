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
    KeyCompromiseReason,
} from './';

/**
 * @export
 * @interface CompromiseKeyRequestDto
 */
export interface CompromiseKeyRequestDto {
    /**
     * @type {KeyCompromiseReason}
     * @memberof CompromiseKeyRequestDto
     */
    reason: KeyCompromiseReason;
    /**
     * List of UUIDs of the key Items. If not provided, the usage will be updated to all the itemsin the key
     * @type {Array<string>}
     * @memberof CompromiseKeyRequestDto
     */
    uuids?: Array<string>;
}


