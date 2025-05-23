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
    AttributeType,
    BaseAttributeContentDto,
    InfoAttributeProperties,
} from './';

/**
 * Info attribute contains content that is for information purpose or represents additional information for object (metadata). Its content can not be edited and is not send in requests to store.
 * @export
 * @interface InfoAttribute
 */
export interface InfoAttribute {
    /**
     * Version of the Attribute
     * @type {number}
     * @memberof InfoAttribute
     */
    version?: number;
    /**
     * UUID of the Attribute for unique identification
     * @type {string}
     * @memberof InfoAttribute
     */
    uuid: string;
    /**
     * Name of the Attribute that is used for identification
     * @type {string}
     * @memberof InfoAttribute
     */
    name: string;
    /**
     * Optional description of the Attribute, should contain helper text on what is expected
     * @type {string}
     * @memberof InfoAttribute
     */
    description?: string;
    /**
     * Content of the Attribute
     * @type {Array<BaseAttributeContentDto>}
     * @memberof InfoAttribute
     */
    content: Array<BaseAttributeContentDto>;
    /**
     * Type of the Attribute
     * @type {AttributeType}
     * @memberof InfoAttribute
     */
    type: AttributeType;
    /**
     * Type of the Content
     * @type {AttributeContentType}
     * @memberof InfoAttribute
     */
    contentType: AttributeContentType;
    /**
     * Properties of the Attributes
     * @type {InfoAttributeProperties}
     * @memberof InfoAttribute
     */
    properties: InfoAttributeProperties;
}


