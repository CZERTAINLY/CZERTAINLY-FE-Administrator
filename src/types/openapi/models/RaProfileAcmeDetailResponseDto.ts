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

import type {
    ResponseAttributeDto,
} from './';

/**
 * @export
 * @interface RaProfileAcmeDetailResponseDto
 */
export interface RaProfileAcmeDetailResponseDto {
    /**
     * Object identifier
     * @type {string}
     * @memberof RaProfileAcmeDetailResponseDto
     */
    uuid: string;
    /**
     * Object Name
     * @type {string}
     * @memberof RaProfileAcmeDetailResponseDto
     */
    name: string;
    /**
     * ACME availability flag - true = yes; false = no
     * @type {boolean}
     * @memberof RaProfileAcmeDetailResponseDto
     */
    acmeAvailable: boolean;
    /**
     * ACME Directory URL
     * @type {string}
     * @memberof RaProfileAcmeDetailResponseDto
     */
    directoryUrl?: string;
    /**
     * List of Attributes to issue Certificate
     * @type {Array<ResponseAttributeDto>}
     * @memberof RaProfileAcmeDetailResponseDto
     */
    issueCertificateAttributes?: Array<ResponseAttributeDto>;
    /**
     * List of Attributes to revoke Certificate
     * @type {Array<ResponseAttributeDto>}
     * @memberof RaProfileAcmeDetailResponseDto
     */
    revokeCertificateAttributes?: Array<ResponseAttributeDto>;
}
