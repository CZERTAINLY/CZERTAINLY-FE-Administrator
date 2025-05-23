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

/**
 * @export
 * @interface DataAttributeProperties
 */
export interface DataAttributeProperties {
    /**
     * Friendly name of the the Attribute
     * @type {string}
     * @memberof DataAttributeProperties
     */
    label: string;
    /**
     * Boolean determining if the Attribute is visible and can be displayed, otherwise it should be hidden to the user.
     * @type {boolean}
     * @memberof DataAttributeProperties
     */
    visible: boolean;
    /**
     * Group of the Attribute, used for the logical grouping of the Attribute
     * @type {string}
     * @memberof DataAttributeProperties
     */
    group?: string;
    /**
     * Boolean determining if the Attribute is required. If true, the Attribute must be provided.
     * @type {boolean}
     * @memberof DataAttributeProperties
     */
    required: boolean;
    /**
     * Boolean determining if the Attribute is read only. If true, the Attribute content cannot be changed.
     * @type {boolean}
     * @memberof DataAttributeProperties
     */
    readOnly: boolean;
    /**
     * Boolean determining if the Attribute contains list of values in the content
     * @type {boolean}
     * @memberof DataAttributeProperties
     */
    list: boolean;
    /**
     * Boolean determining if the Attribute can have multiple values
     * @type {boolean}
     * @memberof DataAttributeProperties
     */
    multiSelect: boolean;
}
