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

/**
 * @export
 * @interface CertificateUpdateObjectsDto
 */
export interface CertificateUpdateObjectsDto {
    /**
     * Certificate Groups UUIDs (set to empty list to remove certificate from all groups)
     * @type {Array<string>}
     * @memberof CertificateUpdateObjectsDto
     */
    groupUuids?: Array<string>;
    /**
     * Certificate owner user UUID (set to empty string to remove owner of certificate)
     * @type {string}
     * @memberof CertificateUpdateObjectsDto
     */
    ownerUuid?: string;
    /**
     * RA Profile UUID (set to empty string to remove certificate from RA profile)
     * @type {string}
     * @memberof CertificateUpdateObjectsDto
     */
    raProfileUuid?: string;
    /**
     * Mark CA certificate as trusted
     * @type {boolean}
     * @memberof CertificateUpdateObjectsDto
     */
    trustedCa?: boolean;
}
