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

import type { CertificateDto } from "./";

/**
 * @export
 * @interface CertificateResponseDto
 */
export interface CertificateResponseDto {
    /**
     * Certificates
     * @type {Array<CertificateDto>}
     * @memberof CertificateResponseDto
     */
    certificates: Array<CertificateDto>;
    /**
     * Number of entries per page
     * @type {number}
     * @memberof CertificateResponseDto
     */
    itemsPerPage: number;
    /**
     * Page number for the request
     * @type {number}
     * @memberof CertificateResponseDto
     */
    pageNumber: number;
    /**
     * Number of pages available
     * @type {number}
     * @memberof CertificateResponseDto
     */
    totalPages: number;
    /**
     * Number of items available
     * @type {number}
     * @memberof CertificateResponseDto
     */
    totalItems: number;
}
