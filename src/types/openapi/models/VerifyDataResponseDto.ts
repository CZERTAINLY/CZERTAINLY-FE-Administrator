// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 2.7.1-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type { VerificationResponseData } from "./";

/**
 * @export
 * @interface VerifyDataResponseDto
 */
export interface VerifyDataResponseDto {
    /**
     * Signatures
     * @type {Array<VerificationResponseData>}
     * @memberof VerifyDataResponseDto
     */
    verifications: Array<VerificationResponseData>;
}
