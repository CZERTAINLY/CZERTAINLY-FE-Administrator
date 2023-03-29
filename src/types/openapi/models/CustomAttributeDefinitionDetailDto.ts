// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 2.7.1-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type { AttributeContentType, AttributeType, BaseAttributeContentDto, Resource } from "./";

/**
 * @export
 * @interface CustomAttributeDefinitionDetailDto
 */
export interface CustomAttributeDefinitionDetailDto {
    /**
     * UUID of the Attribute
     * @type {string}
     * @memberof CustomAttributeDefinitionDetailDto
     */
    uuid: string;
    /**
     * Name of the Attribute
     * @type {string}
     * @memberof CustomAttributeDefinitionDetailDto
     */
    name: string;
    /**
     * @type {AttributeContentType}
     * @memberof CustomAttributeDefinitionDetailDto
     */
    contentType: AttributeContentType;
    /**
     * Attribute description
     * @type {string}
     * @memberof CustomAttributeDefinitionDetailDto
     */
    description: string;
    /**
     * Boolean determining if the Attribute is enabled. Required only for Custom Attribute
     * @type {boolean}
     * @memberof CustomAttributeDefinitionDetailDto
     */
    enabled?: boolean;
    /**
     * @type {AttributeType}
     * @memberof CustomAttributeDefinitionDetailDto
     */
    type: AttributeType;
    /**
     * Friendly name of the the Attribute
     * @type {string}
     * @memberof CustomAttributeDefinitionDetailDto
     */
    label: string;
    /**
     * Boolean determining if the Attribute is required. If true, the Attribute must be provided.
     * @type {boolean}
     * @memberof CustomAttributeDefinitionDetailDto
     */
    required: boolean;
    /**
     * Boolean determining if the Attribute is visible and can be displayed, otherwise it should be hidden to the user.
     * @type {boolean}
     * @memberof CustomAttributeDefinitionDetailDto
     */
    visible?: boolean;
    /**
     * Group of the Attribute, used for the logical grouping of the Attribute
     * @type {string}
     * @memberof CustomAttributeDefinitionDetailDto
     */
    group?: string;
    /**
     * Boolean determining if the Attribute is read only. If true, the Attribute content cannot be changed.
     * @type {boolean}
     * @memberof CustomAttributeDefinitionDetailDto
     */
    readOnly?: boolean;
    /**
     * Boolean determining if the Attribute contains list of values in the content
     * @type {boolean}
     * @memberof CustomAttributeDefinitionDetailDto
     */
    list?: boolean;
    /**
     * Boolean determining if the Attribute can have multiple values
     * @type {boolean}
     * @memberof CustomAttributeDefinitionDetailDto
     */
    multiSelect?: boolean;
    /**
     * Predefined content for the attribute if needed. The content of the Attribute must satisfy the type
     * @type {Array<BaseAttributeContentDto>}
     * @memberof CustomAttributeDefinitionDetailDto
     */
    content?: Array<BaseAttributeContentDto>;
    /**
     * List of resources which are allowed to use the Custom Attribute
     * @type {Array<Resource>}
     * @memberof CustomAttributeDefinitionDetailDto
     */
    resources?: Array<Resource>;
}
