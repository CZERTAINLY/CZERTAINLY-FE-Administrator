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
 * Time attribute content in predefined format
 * @export
 * @interface TimeAttributeContent
 */
export interface TimeAttributeContent {
    /**
     * Content Reference
     * @type {string}
     * @memberof TimeAttributeContent
     */
    reference?: string;
    /**
     * Time attribute value in format HH:mm:ss
     * @type {string}
     * @memberof TimeAttributeContent
     */
    data: string;
}
