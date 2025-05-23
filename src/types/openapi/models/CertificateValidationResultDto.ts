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
    CertificateValidationCheckDto,
    CertificateValidationStatus,
} from './';

/**
 * @export
 * @interface CertificateValidationResultDto
 */
export interface CertificateValidationResultDto {
    /**
     * Overall certificate validation result status
     * @type {CertificateValidationStatus}
     * @memberof CertificateValidationResultDto
     */
    resultStatus: CertificateValidationStatus;
    /**
     * Certificate validation check results
     * @type {{ [key: string]: CertificateValidationCheckDto; }}
     * @memberof CertificateValidationResultDto
     */
    validationChecks?: { [key: string]: CertificateValidationCheckDto; };
    /**
     * Overall certificate validation result message
     * @type {string}
     * @memberof CertificateValidationResultDto
     */
    message?: string;
    /**
     * Date of the most recent validation of the certificate
     * @type {string}
     * @memberof CertificateValidationResultDto
     */
    validationTimestamp?: string;
}


