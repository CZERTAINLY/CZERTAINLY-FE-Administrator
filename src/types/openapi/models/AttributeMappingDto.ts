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

/**
 * List of attribute mappings between mapping attributes and (recipient) custom attributes
 * @export
 * @interface AttributeMappingDto
 */
export interface AttributeMappingDto {
    /**
     * Mapping Attribute UUID
     * @type {string}
     * @memberof AttributeMappingDto
     */
    mappingAttributeUuid: string;
    /**
     * Mapping Attribute Name
     * @type {string}
     * @memberof AttributeMappingDto
     */
    mappingAttributeName: string;
    /**
     * Custom Attribute Uuid
     * @type {string}
     * @memberof AttributeMappingDto
     */
    customAttributeUuid: string;
    /**
     * Custom Attribute Label
     * @type {string}
     * @memberof AttributeMappingDto
     */
    customAttributeLabel: string;
}
