// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 1.6.1-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type { KeyUsage } from "./";

/**
 * @export
 * @interface TokenProfileKeyUsageRequestDto
 */
export interface TokenProfileKeyUsageRequestDto {
    /**
     * Usages for the Key
     * @type {Array<KeyUsage>}
     * @memberof TokenProfileKeyUsageRequestDto
     */
    usage: Array<KeyUsage>;
}
