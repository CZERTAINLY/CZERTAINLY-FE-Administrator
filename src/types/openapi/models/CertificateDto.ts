// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 1.6.1-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type { CertificateStatus, CertificateType, ComplianceStatus, GroupDto, SimplifiedRaProfileDto } from "./";

/**
 * Certificates
 * @export
 * @interface CertificateDto
 */
export interface CertificateDto {
    /**
     * UUID of the Certificate
     * @type {string}
     * @memberof CertificateDto
     */
    uuid: string;
    /**
     * Certificate common name
     * @type {string}
     * @memberof CertificateDto
     */
    commonName: string;
    /**
     * Certificate serial number
     * @type {string}
     * @memberof CertificateDto
     */
    serialNumber?: string;
    /**
     * Certificate issuer common name
     * @type {string}
     * @memberof CertificateDto
     */
    issuerCommonName?: string;
    /**
     * Issuer DN of the Certificate
     * @type {string}
     * @memberof CertificateDto
     */
    issuerDn?: string;
    /**
     * Subject DN of the Certificate
     * @type {string}
     * @memberof CertificateDto
     */
    subjectDn: string;
    /**
     * Certificate validity start date
     * @type {string}
     * @memberof CertificateDto
     */
    notBefore?: string;
    /**
     * Certificate expiration date
     * @type {string}
     * @memberof CertificateDto
     */
    notAfter?: string;
    /**
     * Public key algorithm
     * @type {string}
     * @memberof CertificateDto
     */
    publicKeyAlgorithm: string;
    /**
     * Certificate signature algorithm
     * @type {string}
     * @memberof CertificateDto
     */
    signatureAlgorithm: string;
    /**
     * Certificate key size
     * @type {number}
     * @memberof CertificateDto
     */
    keySize: number;
    /**
     * @type {CertificateStatus}
     * @memberof CertificateDto
     */
    status: CertificateStatus;
    /**
     * @type {SimplifiedRaProfileDto}
     * @memberof CertificateDto
     */
    raProfile?: SimplifiedRaProfileDto;
    /**
     * SHA256 fingerprint of the Certificate
     * @type {string}
     * @memberof CertificateDto
     */
    fingerprint?: string;
    /**
     * @type {GroupDto}
     * @memberof CertificateDto
     */
    group?: GroupDto;
    /**
     * Certificate Owner
     * @type {string}
     * @memberof CertificateDto
     */
    owner?: string;
    /**
     * @type {CertificateType}
     * @memberof CertificateDto
     */
    certificateType?: CertificateType;
    /**
     * Serial number of the issuer
     * @type {string}
     * @memberof CertificateDto
     */
    issuerSerialNumber?: string;
    /**
     * @type {ComplianceStatus}
     * @memberof CertificateDto
     */
    complianceStatus?: ComplianceStatus;
    /**
     * Private Key Availability
     * @type {boolean}
     * @memberof CertificateDto
     */
    privateKeyAvailability: boolean;
}
