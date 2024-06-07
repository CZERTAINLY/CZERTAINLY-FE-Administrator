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
    AttributeContentType,
} from './';

/**
 * @export
 * @interface GlobalMetadataCreateRequestDto
 */
export interface GlobalMetadataCreateRequestDto {
    /**
     * Name of the Attribute
     * @type {string}
     * @memberof GlobalMetadataCreateRequestDto
     */
    name: string;
    /**
     * @type {AttributeContentType}
     * @memberof GlobalMetadataCreateRequestDto
     */
    contentType: AttributeContentType;
    /**
     * Attribute description
     * @type {string}
     * @memberof GlobalMetadataCreateRequestDto
     */
    description?: string;
    /**
     * Friendly name of the the Attribute
     * @type {string}
     * @memberof GlobalMetadataCreateRequestDto
     */
    label: string;
    /**
     * Boolean determining if the Attribute is visible and can be displayed, otherwise it should be hidden to the user.
     * @type {boolean}
     * @memberof GlobalMetadataCreateRequestDto
     */
    visible?: boolean;
    /**
     * Group of the Attribute, used for the logical grouping of the Attribute
     * @type {string}
     * @memberof GlobalMetadataCreateRequestDto
     */
    group?: string;
}


