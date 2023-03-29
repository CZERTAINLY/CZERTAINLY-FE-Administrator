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

import type { AttributeContentType } from "./";

/**
 * @export
 * @interface AttributeDefinitionDto
 */
export interface AttributeDefinitionDto {
    /**
     * UUID of the Attribute
     * @type {string}
     * @memberof AttributeDefinitionDto
     */
    uuid: string;
    /**
     * Name of the Attribute
     * @type {string}
     * @memberof AttributeDefinitionDto
     */
    name: string;
    /**
     * @type {AttributeContentType}
     * @memberof AttributeDefinitionDto
     */
    contentType: AttributeContentType;
    /**
     * Attribute description
     * @type {string}
     * @memberof AttributeDefinitionDto
     */
    description: string;
    /**
     * Boolean determining if the Attribute is enabled. Required only for Custom Attribute
     * @type {boolean}
     * @memberof AttributeDefinitionDto
     */
    enabled?: boolean;
}
