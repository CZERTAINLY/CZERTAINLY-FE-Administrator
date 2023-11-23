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

import type { RequestAttributeDto } from "./";

/**
 * @export
 * @interface CredentialRequestDto
 */
export interface CredentialRequestDto {
    /**
     * Credential name
     * @type {string}
     * @memberof CredentialRequestDto
     */
    name: string;
    /**
     * Credential Kind
     * @type {string}
     * @memberof CredentialRequestDto
     */
    kind: string;
    /**
     * List of Credential Attributes
     * @type {Array<RequestAttributeDto>}
     * @memberof CredentialRequestDto
     */
    attributes: Array<RequestAttributeDto>;
    /**
     * List of Custom Attributes
     * @type {Array<RequestAttributeDto>}
     * @memberof CredentialRequestDto
     */
    customAttributes?: Array<RequestAttributeDto>;
    /**
     * UUID of Credential provider Connector
     * @type {string}
     * @memberof CredentialRequestDto
     */
    connectorUuid: string;
}
