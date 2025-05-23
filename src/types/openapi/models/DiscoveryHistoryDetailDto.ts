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
    DiscoveryStatus,
    MetadataResponseDto,
    ResponseAttributeDto,
    TriggerDto,
} from './';

/**
 * @export
 * @interface DiscoveryHistoryDetailDto
 */
export interface DiscoveryHistoryDetailDto {
    /**
     * Object identifier
     * @type {string}
     * @memberof DiscoveryHistoryDetailDto
     */
    uuid: string;
    /**
     * Object Name
     * @type {string}
     * @memberof DiscoveryHistoryDetailDto
     */
    name: string;
    /**
     * Discovery Kind
     * @type {string}
     * @memberof DiscoveryHistoryDetailDto
     */
    kind: string;
    /**
     * Status of Discovery
     * @type {DiscoveryStatus}
     * @memberof DiscoveryHistoryDetailDto
     */
    status: DiscoveryStatus;
    /**
     * Status of Discovery returned by connector
     * @type {DiscoveryStatus}
     * @memberof DiscoveryHistoryDetailDto
     */
    connectorStatus: DiscoveryStatus;
    /**
     * Failure/Success Messages
     * @type {string}
     * @memberof DiscoveryHistoryDetailDto
     */
    message?: string;
    /**
     * Date and time when Discovery started
     * @type {string}
     * @memberof DiscoveryHistoryDetailDto
     */
    startTime?: string;
    /**
     * Date and time when Discovery finished
     * @type {string}
     * @memberof DiscoveryHistoryDetailDto
     */
    endTime?: string;
    /**
     * Number of certificates that are discovered
     * @type {number}
     * @memberof DiscoveryHistoryDetailDto
     */
    totalCertificatesDiscovered?: number;
    /**
     * Number of certificates that were discovered by connector
     * @type {number}
     * @memberof DiscoveryHistoryDetailDto
     */
    connectorTotalCertificatesDiscovered?: number;
    /**
     * UUID of the Discovery Provider
     * @type {string}
     * @memberof DiscoveryHistoryDetailDto
     */
    connectorUuid: string;
    /**
     * Name of the Discovery Provider
     * @type {string}
     * @memberof DiscoveryHistoryDetailDto
     */
    connectorName: string;
    /**
     * List of Discovery Attributes
     * @type {Array<ResponseAttributeDto>}
     * @memberof DiscoveryHistoryDetailDto
     */
    attributes: Array<ResponseAttributeDto>;
    /**
     * List of Custom Attributes
     * @type {Array<ResponseAttributeDto>}
     * @memberof DiscoveryHistoryDetailDto
     */
    customAttributes?: Array<ResponseAttributeDto>;
    /**
     * Metadata of the Discovery
     * @type {Array<MetadataResponseDto>}
     * @memberof DiscoveryHistoryDetailDto
     */
    metadata?: Array<MetadataResponseDto>;
    /**
     * List of associated triggers
     * @type {Array<TriggerDto>}
     * @memberof DiscoveryHistoryDetailDto
     */
    triggers: Array<TriggerDto>;
}


