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
    ResponseAttributeDto,
    SimplifiedRaProfileDto,
} from './';

/**
 * @export
 * @interface AcmeProfileDto
 */
export interface AcmeProfileDto {
    /**
     * Object identifier
     * @type {string}
     * @memberof AcmeProfileDto
     */
    uuid: string;
    /**
     * Object Name
     * @type {string}
     * @memberof AcmeProfileDto
     */
    name: string;
    /**
     * Enabled flag - true = enabled; false = disabled
     * @type {boolean}
     * @memberof AcmeProfileDto
     */
    enabled: boolean;
    /**
     * ACME Profile description
     * @type {string}
     * @memberof AcmeProfileDto
     */
    description?: string;
    /**
     * Terms of Service URL
     * @type {string}
     * @memberof AcmeProfileDto
     */
    termsOfServiceUrl?: string;
    /**
     * Website URL
     * @type {string}
     * @memberof AcmeProfileDto
     */
    websiteUrl?: string;
    /**
     * DNS Resolver IP address
     * @type {string}
     * @memberof AcmeProfileDto
     */
    dnsResolverIp?: string;
    /**
     * DNS Resolver port number
     * @type {string}
     * @memberof AcmeProfileDto
     */
    dnsResolverPort?: string;
    /**
     * RA Profile
     * @type {SimplifiedRaProfileDto}
     * @memberof AcmeProfileDto
     */
    raProfile?: SimplifiedRaProfileDto;
    /**
     * Retry interval for ACME client requests
     * @type {number}
     * @memberof AcmeProfileDto
     */
    retryInterval?: number;
    /**
     * Disable new Orders (change in Terms of Service)
     * @type {boolean}
     * @memberof AcmeProfileDto
     */
    termsOfServiceChangeDisable?: boolean;
    /**
     * Order validity
     * @type {number}
     * @memberof AcmeProfileDto
     */
    validity?: number;
    /**
     * ACME Directory URL
     * @type {string}
     * @memberof AcmeProfileDto
     */
    directoryUrl?: string;
    /**
     * Changes of Terms of Service URL
     * @type {string}
     * @memberof AcmeProfileDto
     */
    termsOfServiceChangeUrl?: string;
    /**
     * Require Contact information for new Account
     * @type {boolean}
     * @memberof AcmeProfileDto
     */
    requireContact?: boolean;
    /**
     * Require new Account to agree on Terms of Service
     * @type {boolean}
     * @memberof AcmeProfileDto
     */
    requireTermsOfService?: boolean;
    /**
     * List of Attributes to issue a Certificate
     * @type {Array<ResponseAttributeDto>}
     * @memberof AcmeProfileDto
     */
    issueCertificateAttributes?: Array<ResponseAttributeDto>;
    /**
     * List of Attributes to revoke a Certificate
     * @type {Array<ResponseAttributeDto>}
     * @memberof AcmeProfileDto
     */
    revokeCertificateAttributes?: Array<ResponseAttributeDto>;
    /**
     * List of Custom Attributes
     * @type {Array<ResponseAttributeDto>}
     * @memberof AcmeProfileDto
     */
    customAttributes?: Array<ResponseAttributeDto>;
}
