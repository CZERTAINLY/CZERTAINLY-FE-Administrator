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

import type {
    ApprovalStepRequestDto,
} from './';

/**
 * @export
 * @interface ApprovalProfileRequestDto
 */
export interface ApprovalProfileRequestDto {
    /**
     * Name of the Approval profile
     * @type {string}
     * @memberof ApprovalProfileRequestDto
     */
    name: string;
    /**
     * Description of the Approval profile
     * @type {string}
     * @memberof ApprovalProfileRequestDto
     */
    description?: string;
    /**
     * Enable of the Approval profile
     * @type {boolean}
     * @memberof ApprovalProfileRequestDto
     */
    enabled: boolean;
    /**
     * Expiration of the Approval profile in hours
     * @type {number}
     * @memberof ApprovalProfileRequestDto
     */
    expiry?: number;
    /**
     * List of Approval steps for the Approval profile
     * @type {Array<ApprovalStepRequestDto>}
     * @memberof ApprovalProfileRequestDto
     */
    approvalSteps: Array<ApprovalStepRequestDto>;
}
