// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 2.9.1-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type { RequestAttributeDto } from "./";

/**
 * @export
 * @interface IssueToLocationRequestDto
 */
export interface IssueToLocationRequestDto {
    /**
     * RA Profile UUID
     * @type {string}
     * @memberof IssueToLocationRequestDto
     */
    raProfileUuid: string;
    /**
     * List of CSR Attributes for Location
     * @type {Array<RequestAttributeDto>}
     * @memberof IssueToLocationRequestDto
     */
    csrAttributes: Array<RequestAttributeDto>;
    /**
     * List of certificate issue Attributes for RA Profile
     * @type {Array<RequestAttributeDto>}
     * @memberof IssueToLocationRequestDto
     */
    issueAttributes: Array<RequestAttributeDto>;
    /**
     * List of Custom Attributes
     * @type {Array<RequestAttributeDto>}
     * @memberof IssueToLocationRequestDto
     */
    customAttributes?: Array<RequestAttributeDto>;
    /**
     * List of Certificate Custom Attributes
     * @type {Array<RequestAttributeDto>}
     * @memberof IssueToLocationRequestDto
     */
    certificateCustomAttributes?: Array<RequestAttributeDto>;
}
