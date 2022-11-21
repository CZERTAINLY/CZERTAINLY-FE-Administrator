// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 1.5.1-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type {
    BaseAttributeDto,
} from './';

/**
 * Rules from Compliance Provider
 * @export
 * @interface ComplianceRulesResponseDto
 */
export interface ComplianceRulesResponseDto {
    /**
     * UUID of the rule
     * @type {string}
     * @memberof ComplianceRulesResponseDto
     */
    uuid: string;
    /**
     * UUID of the group to which the rule belongs to
     * @type {string}
     * @memberof ComplianceRulesResponseDto
     */
    groupUuid?: string;
    /**
     * Name of the rule
     * @type {string}
     * @memberof ComplianceRulesResponseDto
     */
    name: string;
    /**
     * Type of the certificate to which this rule can be applied
     * @type {string}
     * @memberof ComplianceRulesResponseDto
     */
    certificateType: ComplianceRulesResponseDtoCertificateTypeEnum;
    /**
     * Rule attributes
     * @type {Array<BaseAttributeDto>}
     * @memberof ComplianceRulesResponseDto
     */
    attributes?: Array<BaseAttributeDto>;
    /**
     * Description of the rule
     * @type {string}
     * @memberof ComplianceRulesResponseDto
     */
    description?: string;
}

/**
 * @export
 * @enum {string}
 */
export enum ComplianceRulesResponseDtoCertificateTypeEnum {
    X509 = 'X509',
    Ssh = 'SSH'
}

