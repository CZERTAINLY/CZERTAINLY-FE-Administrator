// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 2.7.2-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type { CertificateDto, RaProfileDto, ResponseAttributeDto } from "./";

/**
 * @export
 * @interface ScepProfileDetailDto
 */
export interface ScepProfileDetailDto {
    /**
     * Object identifier
     * @type {string}
     * @memberof ScepProfileDetailDto
     */
    uuid: string;
    /**
     * Object Name
     * @type {string}
     * @memberof ScepProfileDetailDto
     */
    name: string;
    /**
     * Enabled flag - true = enabled; false = disabled
     * @type {boolean}
     * @memberof ScepProfileDetailDto
     */
    enabled: boolean;
    /**
     * SCEP Profile description
     * @type {string}
     * @memberof ScepProfileDetailDto
     */
    description?: string;
    /**
     * Name of the RA Profile
     * @type {string}
     * @memberof ScepProfileDetailDto
     */
    raProfileName?: string;
    /**
     * UUID of RA Profile
     * @type {string}
     * @memberof ScepProfileDetailDto
     */
    raProfileUuid?: string;
    /**
     * Include CA certificate in the SCEP response
     * @type {boolean}
     * @memberof ScepProfileDetailDto
     */
    includeCaCertificate: boolean;
    /**
     * Include CA certificate chain in the SCEP response
     * @type {boolean}
     * @memberof ScepProfileDetailDto
     */
    includeCaCertificateChain: boolean;
    /**
     * Renewal time threshold in days
     * @type {number}
     * @memberof ScepProfileDetailDto
     */
    renewThreshold?: number;
    /**
     * SCEP URL
     * @type {string}
     * @memberof ScepProfileDetailDto
     */
    scepUrl?: string;
    /**
     * Status of Intune
     * @type {boolean}
     * @memberof ScepProfileDetailDto
     */
    enableIntune?: boolean;
    /**
     * @type {RaProfileDto}
     * @memberof ScepProfileDetailDto
     */
    raProfile?: RaProfileDto;
    /**
     * List of Attributes to issue a Certificate
     * @type {Array<ResponseAttributeDto>}
     * @memberof ScepProfileDetailDto
     */
    issueCertificateAttributes?: Array<ResponseAttributeDto>;
    /**
     * List of Custom Attributes
     * @type {Array<ResponseAttributeDto>}
     * @memberof ScepProfileDetailDto
     */
    customAttributes?: Array<ResponseAttributeDto>;
    /**
     * @type {CertificateDto}
     * @memberof ScepProfileDetailDto
     */
    caCertificate?: CertificateDto;
    /**
     * Intune tenant
     * @type {string}
     * @memberof ScepProfileDetailDto
     */
    intuneTenant?: string;
    /**
     * Intune application ID
     * @type {string}
     * @memberof ScepProfileDetailDto
     */
    intuneApplicationId?: string;
}
