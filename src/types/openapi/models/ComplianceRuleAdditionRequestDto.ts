// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 2.10.1-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type {
    RequestAttributeDto,
} from './';

/**
 * @export
 * @interface ComplianceRuleAdditionRequestDto
 */
export interface ComplianceRuleAdditionRequestDto {
    /**
     * UUID of the Compliance Provider
     * @type {string}
     * @memberof ComplianceRuleAdditionRequestDto
     */
    connectorUuid: string;
    /**
     * Kind of the Compliance Provider
     * @type {string}
     * @memberof ComplianceRuleAdditionRequestDto
     */
    kind: string;
    /**
     * UUID of the rule
     * @type {string}
     * @memberof ComplianceRuleAdditionRequestDto
     */
    ruleUuid: string;
    /**
     * Attributes for the rule
     * @type {Array<RequestAttributeDto>}
     * @memberof ComplianceRuleAdditionRequestDto
     */
    attributes?: Array<RequestAttributeDto>;
}
