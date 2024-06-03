// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 2.11.1-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type {
    AttributeCallback,
    AttributeType,
    BaseAttributeDto,
} from './';

/**
 * Group attribute and its content represents dynamic list of additional attributes retrieved by callback. Its content can not be edited and is not send in requests to store.
 * @export
 * @interface GroupAttribute
 */
export interface GroupAttribute {
    /**
     * UUID of the Attribute for unique identification
     * @type {string}
     * @memberof GroupAttribute
     */
    uuid: string;
    /**
     * Name of the Attribute that is used for identification
     * @type {string}
     * @memberof GroupAttribute
     */
    name: string;
    /**
     * Optional description of the Attribute, should contain helper text on what is expected
     * @type {string}
     * @memberof GroupAttribute
     */
    description?: string;
    /**
     * List of all different types of attributes
     * @type {Array<BaseAttributeDto>}
     * @memberof GroupAttribute
     */
    content?: Array<BaseAttributeDto>;
    /**
     * @type {AttributeType}
     * @memberof GroupAttribute
     */
    type: AttributeType;
    /**
     * @type {AttributeCallback}
     * @memberof GroupAttribute
     */
    attributeCallback?: AttributeCallback;
}


