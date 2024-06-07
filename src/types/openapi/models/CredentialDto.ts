// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 2.12.1-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type {
    ResponseAttributeDto,
} from './';

/**
 * @export
 * @interface CredentialDto
 */
export interface CredentialDto {
    /**
     * Object identifier
     * @type {string}
     * @memberof CredentialDto
     */
    uuid: string;
    /**
     * Object Name
     * @type {string}
     * @memberof CredentialDto
     */
    name: string;
    /**
     * Credential Kind
     * @type {string}
     * @memberof CredentialDto
     */
    kind: string;
    /**
     * List of Credential Attributes
     * @type {Array<ResponseAttributeDto>}
     * @memberof CredentialDto
     */
    attributes: Array<ResponseAttributeDto>;
    /**
     * List of Custom Attributes
     * @type {Array<ResponseAttributeDto>}
     * @memberof CredentialDto
     */
    customAttributes?: Array<ResponseAttributeDto>;
    /**
     * Enabled flag - true = enabled; false = disabled
     * @type {boolean}
     * @memberof CredentialDto
     */
    enabled: boolean;
    /**
     * UUID of Credential provider Connector
     * @type {string}
     * @memberof CredentialDto
     */
    connectorUuid: string;
    /**
     * Name of Credential provider Connector
     * @type {string}
     * @memberof CredentialDto
     */
    connectorName: string;
}
