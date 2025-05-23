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
 * @interface CustomAttributeProperties
 */
export interface CustomAttributeProperties {
    /**
     * Friendly name of the the Attribute
     * @type {string}
     * @memberof CustomAttributeProperties
     */
    label: string;
    /**
     * Boolean determining if the Attribute is visible and can be displayed, otherwise it should be hidden to the user.
     * @type {boolean}
     * @memberof CustomAttributeProperties
     */
    visible: boolean;
    /**
     * Group of the Attribute, used for the logical grouping of the Attribute
     * @type {string}
     * @memberof CustomAttributeProperties
     */
    group?: string;
    /**
     * Boolean determining if the Attribute is required. If true, the Attribute must be provided.
     * @type {boolean}
     * @memberof CustomAttributeProperties
     */
    required: boolean;
    /**
     * Boolean determining if the Attribute is read only. If true, the Attribute content cannot be changed.
     * @type {boolean}
     * @memberof CustomAttributeProperties
     */
    readOnly: boolean;
    /**
     * Boolean determining if the Attribute contains list of values in the content
     * @type {boolean}
     * @memberof CustomAttributeProperties
     */
    list: boolean;
    /**
     * Boolean determining if the Attribute can have multiple values
     * @type {boolean}
     * @memberof CustomAttributeProperties
     */
    multiSelect: boolean;
}
