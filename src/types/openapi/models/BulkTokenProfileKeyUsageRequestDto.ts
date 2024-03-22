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
    KeyUsage,
} from './';

/**
 * @export
 * @interface BulkTokenProfileKeyUsageRequestDto
 */
export interface BulkTokenProfileKeyUsageRequestDto {
    /**
     * Usages for the Key
     * @type {Array<KeyUsage>}
     * @memberof BulkTokenProfileKeyUsageRequestDto
     */
    usage: Array<KeyUsage>;
    /**
     * Token Profile UUIDs
     * @type {Array<string>}
     * @memberof BulkTokenProfileKeyUsageRequestDto
     */
    uuids: Array<string>;
}
