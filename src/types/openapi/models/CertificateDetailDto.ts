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

import type {
    CertificateComplianceResultDto,
    CertificateStatus,
    CertificateType,
    ComplianceStatus,
    GroupDto,
    KeyDto,
    LocationDto,
    MetadataResponseDto,
    ResponseAttributeDto,
    SimplifiedRaProfileDto,
} from "./";

/**
 * @export
 * @interface CertificateDetailDto
 */
export interface CertificateDetailDto {
    /**
     * UUID of the Certificate
     * @type {string}
     * @memberof CertificateDetailDto
     */
    uuid: string;
    /**
     * Certificate common name
     * @type {string}
     * @memberof CertificateDetailDto
     */
    commonName: string;
    /**
     * Certificate serial number
     * @type {string}
     * @memberof CertificateDetailDto
     */
    serialNumber?: string;
    /**
     * Certificate issuer common name
     * @type {string}
     * @memberof CertificateDetailDto
     */
    issuerCommonName?: string;
    /**
     * Issuer DN of the Certificate
     * @type {string}
     * @memberof CertificateDetailDto
     */
    issuerDn?: string;
    /**
     * Subject DN of the Certificate
     * @type {string}
     * @memberof CertificateDetailDto
     */
    subjectDn: string;
    /**
     * Certificate validity start date
     * @type {string}
     * @memberof CertificateDetailDto
     */
    notBefore?: string;
    /**
     * Certificate expiration date
     * @type {string}
     * @memberof CertificateDetailDto
     */
    notAfter?: string;
    /**
     * Public key algorithm
     * @type {string}
     * @memberof CertificateDetailDto
     */
    publicKeyAlgorithm: string;
    /**
     * Certificate signature algorithm
     * @type {string}
     * @memberof CertificateDetailDto
     */
    signatureAlgorithm: string;
    /**
     * Certificate key size
     * @type {number}
     * @memberof CertificateDetailDto
     */
    keySize: number;
    /**
     * @type {CertificateStatus}
     * @memberof CertificateDetailDto
     */
    status: CertificateStatus;
    /**
     * @type {SimplifiedRaProfileDto}
     * @memberof CertificateDetailDto
     */
    raProfile?: SimplifiedRaProfileDto;
    /**
     * SHA256 fingerprint of the Certificate
     * @type {string}
     * @memberof CertificateDetailDto
     */
    fingerprint?: string;
    /**
     * @type {GroupDto}
     * @memberof CertificateDetailDto
     */
    group?: GroupDto;
    /**
     * Certificate Owner
     * @type {string}
     * @memberof CertificateDetailDto
     */
    owner?: string;
    /**
     * @type {CertificateType}
     * @memberof CertificateDetailDto
     */
    certificateType?: CertificateType;
    /**
     * Serial number of the issuer
     * @type {string}
     * @memberof CertificateDetailDto
     */
    issuerSerialNumber?: string;
    /**
     * @type {ComplianceStatus}
     * @memberof CertificateDetailDto
     */
    complianceStatus?: ComplianceStatus;
    /**
     * Private Key Availability
     * @type {boolean}
     * @memberof CertificateDetailDto
     */
    privateKeyAvailability: boolean;
    /**
     * Extended key usages
     * @type {Array<string>}
     * @memberof CertificateDetailDto
     */
    extendedKeyUsage?: Array<string>;
    /**
     * Key usages
     * @type {Array<string>}
     * @memberof CertificateDetailDto
     */
    keyUsage: Array<string>;
    /**
     * Basic Constraints
     * @type {string}
     * @memberof CertificateDetailDto
     */
    basicConstraints: string;
    /**
     * Certificate metadata
     * @type {Array<MetadataResponseDto>}
     * @memberof CertificateDetailDto
     */
    metadata?: Array<MetadataResponseDto>;
    /**
     * Base64 encoded Certificate content
     * @type {string}
     * @memberof CertificateDetailDto
     */
    certificateContent: string;
    /**
     * Subject alternative names
     * @type {{ [key: string]: object; }}
     * @memberof CertificateDetailDto
     */
    subjectAlternativeNames?: { [key: string]: object };
    /**
     * Locations associated to the Certificate
     * @type {Array<LocationDto>}
     * @memberof CertificateDetailDto
     */
    locations?: Array<LocationDto>;
    /**
     * Certificate compliance check result
     * @type {Array<CertificateComplianceResultDto>}
     * @memberof CertificateDetailDto
     */
    nonCompliantRules?: Array<CertificateComplianceResultDto>;
    /**
     * List of Custom Attributes
     * @type {Array<ResponseAttributeDto>}
     * @memberof CertificateDetailDto
     */
    customAttributes?: Array<ResponseAttributeDto>;
    /**
     * CSR for the certificate
     * @type {string}
     * @memberof CertificateDetailDto
     */
    csr?: string;
    /**
     * CSR Attributes
     * @type {Array<ResponseAttributeDto>}
     * @memberof CertificateDetailDto
     */
    csrAttributes?: Array<ResponseAttributeDto>;
    /**
     * Signature Attributes
     * @type {Array<ResponseAttributeDto>}
     * @memberof CertificateDetailDto
     */
    signatureAttributes?: Array<ResponseAttributeDto>;
    /**
     * @type {KeyDto}
     * @memberof CertificateDetailDto
     */
    key?: KeyDto;
}
