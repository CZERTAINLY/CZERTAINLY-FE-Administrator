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

import type { ApprovalStepDto } from "./";

/**
 * @export
 * @interface ApprovalProfileDetailDto
 */
export interface ApprovalProfileDetailDto {
    /**
     * UUID of the Approval profile
     * @type {string}
     * @memberof ApprovalProfileDetailDto
     */
    uuid: string;
    /**
     * Name of the Approval profile
     * @type {string}
     * @memberof ApprovalProfileDetailDto
     */
    name: string;
    /**
     * Version of the Approval profile
     * @type {number}
     * @memberof ApprovalProfileDetailDto
     */
    version: number;
    /**
     * Description of the Approval profile
     * @type {string}
     * @memberof ApprovalProfileDetailDto
     */
    description?: string;
    /**
     * Enable of the Approval profile
     * @type {boolean}
     * @memberof ApprovalProfileDetailDto
     */
    enabled: boolean;
    /**
     * Expiration of the Approval profile in hours
     * @type {number}
     * @memberof ApprovalProfileDetailDto
     */
    expiry?: number;
    /**
     * Number of the Approval profile steps
     * @type {number}
     * @memberof ApprovalProfileDetailDto
     */
    numberOfSteps: number;
    /**
     * List of Approval steps for the Approval profile
     * @type {Array<ApprovalStepDto>}
     * @memberof ApprovalProfileDetailDto
     */
    approvalSteps: Array<ApprovalStepDto>;
}