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

/**
 * @export
 * @interface ApprovalProfileDto
 */
export interface ApprovalProfileDto {
    /**
     * UUID of the Approval profile
     * @type {string}
     * @memberof ApprovalProfileDto
     */
    uuid: string;
    /**
     * Name of the Approval profile
     * @type {string}
     * @memberof ApprovalProfileDto
     */
    name: string;
    /**
     * Version of the Approval profile
     * @type {number}
     * @memberof ApprovalProfileDto
     */
    version: number;
    /**
     * Description of the Approval profile
     * @type {string}
     * @memberof ApprovalProfileDto
     */
    description?: string;
    /**
     * Enable of the Approval profile
     * @type {boolean}
     * @memberof ApprovalProfileDto
     */
    enabled: boolean;
    /**
     * Expiration of the Approval profile in hours
     * @type {number}
     * @memberof ApprovalProfileDto
     */
    expiry?: number;
    /**
     * Number of the Approval profile steps
     * @type {number}
     * @memberof ApprovalProfileDto
     */
    numberOfSteps: number;
    /**
     * Number of associated objects
     * @type {number}
     * @memberof ApprovalProfileDto
     */
    associations: number;
}
