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
} from './';

/**
 * @export
 * @interface BulkKeyUsageRequestDto
 */
export interface BulkKeyUsageRequestDto {
    /**
     * Usages for the Key
     * @type {Array<KeyUsage>}
     * @memberof BulkKeyUsageRequestDto
     */
    usage: Array<KeyUsage>;
    /**
     * Key UUIDs
     * @type {Array<string>}
     * @memberof BulkKeyUsageRequestDto
     */
    uuids: Array<string>;
}
