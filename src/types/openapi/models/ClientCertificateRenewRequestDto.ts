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
 * @export
 * @interface ClientCertificateRenewRequestDto
 */
export interface ClientCertificateRenewRequestDto {
    /**
     * True to replace renewed certificate in the associated locations
     * @type {boolean}
     * @memberof ClientCertificateRenewRequestDto
     */
    replaceInLocations?: boolean;
    /**
     * Certificate sign request (PKCS#10) encoded as Base64 string. If not provided, Existing CSR will be used
     * @type {string}
     * @memberof ClientCertificateRenewRequestDto
     */
    pkcs10?: string;
}
