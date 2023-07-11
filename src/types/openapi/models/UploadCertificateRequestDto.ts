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

import type { RequestAttributeDto } from "./";

/**
 * @export
 * @interface UploadCertificateRequestDto
 */
export interface UploadCertificateRequestDto {
    /**
     * Base64 Content of the Certificate
     * @type {string}
     * @memberof UploadCertificateRequestDto
     */
    certificate: string;
    /**
     * Custom Attributes for the Certificate
     * @type {Array<RequestAttributeDto>}
     * @memberof UploadCertificateRequestDto
     */
    customAttributes: Array<RequestAttributeDto>;
}
