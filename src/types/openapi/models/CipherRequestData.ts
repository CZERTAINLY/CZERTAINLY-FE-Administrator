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

/**
 * @export
 * @interface CipherRequestData
 */
export interface CipherRequestData {
    /**
     * Base64 encoded encrypted/decrypted data
     * @type {string}
     * @memberof CipherRequestData
     */
    data: string;
    /**
     * Custom identifier of the data, that should be the same as in the request, if available
     * @type {string}
     * @memberof CipherRequestData
     */
    identifier?: string;
}
