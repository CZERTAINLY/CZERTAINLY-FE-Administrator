// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 2.8.1-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 * Groups associated
 * @export
 * @interface ComplianceGroupsDto
 */
export interface ComplianceGroupsDto {
    /**
     * Object identifier
     * @type {string}
     * @memberof ComplianceGroupsDto
     */
    uuid: string;
    /**
     * Object Name
     * @type {string}
     * @memberof ComplianceGroupsDto
     */
    name: string;
    /**
     * Description of the group
     * @type {string}
     * @memberof ComplianceGroupsDto
     */
    description?: string;
}
