// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 2.9.1-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 * Encrypted data
 * @export
 * @interface CipherResponseData
 */
export interface CipherResponseData {
    /**
     * Base64 encoded encrypted/decrypted data
     * @type {string}
     * @memberof CipherResponseData
     */
    data: string;
    /**
     * Custom identifier of the data, that should be the same as in the request, if available
     * @type {string}
     * @memberof CipherResponseData
     */
    identifier?: string;
    /**
     * Additional details of the data, for example, the data type, error handling, etc.
     * @type {object}
     * @memberof CipherResponseData
     */
    details?: object;
}
