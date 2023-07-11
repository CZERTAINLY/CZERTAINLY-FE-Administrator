// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 2.8.2-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type { ComplianceConnectorAndGroupsDto, ComplianceConnectorAndRulesDto, ResponseAttributeDto, SimplifiedRaProfileDto } from "./";

/**
 * @export
 * @interface ComplianceProfileDto
 */
export interface ComplianceProfileDto {
    /**
     * Object identifier
     * @type {string}
     * @memberof ComplianceProfileDto
     */
    uuid: string;
    /**
     * Object Name
     * @type {string}
     * @memberof ComplianceProfileDto
     */
    name: string;
    /**
     * Description of the Compliance Profile
     * @type {string}
     * @memberof ComplianceProfileDto
     */
    description?: string;
    /**
     * List of rules
     * @type {Array<ComplianceConnectorAndRulesDto>}
     * @memberof ComplianceProfileDto
     */
    rules: Array<ComplianceConnectorAndRulesDto>;
    /**
     * List of groups
     * @type {Array<ComplianceConnectorAndGroupsDto>}
     * @memberof ComplianceProfileDto
     */
    groups: Array<ComplianceConnectorAndGroupsDto>;
    /**
     * List of associated RA Profiles
     * @type {Array<SimplifiedRaProfileDto>}
     * @memberof ComplianceProfileDto
     */
    raProfiles?: Array<SimplifiedRaProfileDto>;
    /**
     * List of Custom Attributes
     * @type {Array<ResponseAttributeDto>}
     * @memberof ComplianceProfileDto
     */
    customAttributes?: Array<ResponseAttributeDto>;
}
