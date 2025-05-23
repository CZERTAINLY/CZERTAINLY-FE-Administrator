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
    AttributeContentType,
    BaseAttributeContentDto,
    Resource,
} from './';

/**
 * @export
 * @interface CustomAttributeCreateRequestDto
 */
export interface CustomAttributeCreateRequestDto {
    /**
     * Name of the Attribute
     * @type {string}
     * @memberof CustomAttributeCreateRequestDto
     */
    name: string;
    /**
     * Attribute Content Type
     * @type {AttributeContentType}
     * @memberof CustomAttributeCreateRequestDto
     */
    contentType: AttributeContentType;
    /**
     * Attribute description
     * @type {string}
     * @memberof CustomAttributeCreateRequestDto
     */
    description?: string;
    /**
     * Friendly name of the the Attribute
     * @type {string}
     * @memberof CustomAttributeCreateRequestDto
     */
    label: string;
    /**
     * Boolean determining if the Attribute is visible and can be displayed, otherwise it should be hidden to the user.
     * @type {boolean}
     * @memberof CustomAttributeCreateRequestDto
     */
    visible?: boolean;
    /**
     * Group of the Attribute, used for the logical grouping of the Attribute
     * @type {string}
     * @memberof CustomAttributeCreateRequestDto
     */
    group?: string;
    /**
     * Boolean determining if the Attribute is required. If true, the Attribute must be provided.
     * @type {boolean}
     * @memberof CustomAttributeCreateRequestDto
     */
    required?: boolean;
    /**
     * Boolean determining if the Attribute is read only. If true, the Attribute content cannot be changed.
     * @type {boolean}
     * @memberof CustomAttributeCreateRequestDto
     */
    readOnly?: boolean;
    /**
     * Boolean determining if the Attribute contains list of values in the content
     * @type {boolean}
     * @memberof CustomAttributeCreateRequestDto
     */
    list?: boolean;
    /**
     * Boolean determining if the Attribute can have multiple values
     * @type {boolean}
     * @memberof CustomAttributeCreateRequestDto
     */
    multiSelect?: boolean;
    /**
     * Predefined content for the attribute if needed. The content of the Attribute must satisfy the type
     * @type {Array<BaseAttributeContentDto>}
     * @memberof CustomAttributeCreateRequestDto
     */
    content?: Array<BaseAttributeContentDto>;
    /**
     * List of resource to be associated with the custom attribute
     * @type {Array<Resource>}
     * @memberof CustomAttributeCreateRequestDto
     */
    resources?: Array<Resource>;
}


