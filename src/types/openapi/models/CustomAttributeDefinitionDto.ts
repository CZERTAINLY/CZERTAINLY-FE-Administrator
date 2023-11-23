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

import type { AttributeContentType, Resource } from "./";

/**
 * @export
 * @interface CustomAttributeDefinitionDto
 */
export interface CustomAttributeDefinitionDto {
    /**
     * UUID of the Attribute
     * @type {string}
     * @memberof CustomAttributeDefinitionDto
     */
    uuid: string;
    /**
     * Name of the Attribute
     * @type {string}
     * @memberof CustomAttributeDefinitionDto
     */
    name: string;
    /**
     * @type {AttributeContentType}
     * @memberof CustomAttributeDefinitionDto
     */
    contentType: AttributeContentType;
    /**
     * Attribute description
     * @type {string}
     * @memberof CustomAttributeDefinitionDto
     */
    description: string;
    /**
     * Boolean determining if the Attribute is enabled. Required only for Custom Attribute
     * @type {boolean}
     * @memberof CustomAttributeDefinitionDto
     */
    enabled?: boolean;
    /**
     * List of resources for custom attribute
     * @type {Array<Resource>}
     * @memberof CustomAttributeDefinitionDto
     */
    resources: Array<Resource>;
}
