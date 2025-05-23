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
    RequestAttributeDto,
} from './';

/**
 * @export
 * @interface TokenInstanceRequestDto
 */
export interface TokenInstanceRequestDto {
    /**
     * Name of the Token Instance
     * @type {string}
     * @memberof TokenInstanceRequestDto
     */
    name: string;
    /**
     * Token Instance description
     * @type {string}
     * @memberof TokenInstanceRequestDto
     */
    description?: string;
    /**
     * UUID of the Connector
     * @type {string}
     * @memberof TokenInstanceRequestDto
     */
    connectorUuid: string;
    /**
     * Connector Kind
     * @type {string}
     * @memberof TokenInstanceRequestDto
     */
    kind: string;
    /**
     * Custom Attributes
     * @type {Array<RequestAttributeDto>}
     * @memberof TokenInstanceRequestDto
     */
    customAttributes: Array<RequestAttributeDto>;
    /**
     * Attributes for Token Instance
     * @type {Array<RequestAttributeDto>}
     * @memberof TokenInstanceRequestDto
     */
    attributes: Array<RequestAttributeDto>;
}
