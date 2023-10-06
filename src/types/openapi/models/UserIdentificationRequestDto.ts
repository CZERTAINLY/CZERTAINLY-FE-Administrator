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
 * @interface UserIdentificationRequestDto
 */
export interface UserIdentificationRequestDto {
    /**
     * Base64 Content of the certificate
     * @type {string}
     * @memberof UserIdentificationRequestDto
     */
    certificateContent?: string;
    /**
     * Authentication Token
     * @type {string}
     * @memberof UserIdentificationRequestDto
     */
    authenticationToken?: string;
}
