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
    GroupDto,
    KeyAlgorithm,
    KeyFormat,
    KeyState,
    KeyType,
    KeyUsage,
} from './';

/**
 * Cryptographic Keys
 * @export
 * @interface KeyItemDto
 */
export interface KeyItemDto {
    /**
     * Object identifier
     * @type {string}
     * @memberof KeyItemDto
     */
    uuid: string;
    /**
     * Object Name
     * @type {string}
     * @memberof KeyItemDto
     */
    name: string;
    /**
     * Description of the Key
     * @type {string}
     * @memberof KeyItemDto
     */
    description: string;
    /**
     * Creation time of the Key. If the key is discovered from the connector, then it will be returned
     * @type {string}
     * @memberof KeyItemDto
     */
    creationTime: string;
    /**
     * UUID of the wrapper object
     * @type {string}
     * @memberof KeyItemDto
     */
    keyWrapperUuid: string;
    /**
     * UUID of the Token Profile
     * @type {string}
     * @memberof KeyItemDto
     */
    tokenProfileUuid?: string;
    /**
     * Name of the Token Profile
     * @type {string}
     * @memberof KeyItemDto
     */
    tokenProfileName?: string;
    /**
     * Token Instance UUID
     * @type {string}
     * @memberof KeyItemDto
     */
    tokenInstanceUuid: string;
    /**
     * Token Instance Name
     * @type {string}
     * @memberof KeyItemDto
     */
    tokenInstanceName: string;
    /**
     * Owner of the Key
     * @type {string}
     * @memberof KeyItemDto
     */
    owner?: string;
    /**
     * UUID of the owner of the Key
     * @type {string}
     * @memberof KeyItemDto
     */
    ownerUuid?: string;
    /**
     * Groups associated to the Key
     * @type {Array<GroupDto>}
     * @memberof KeyItemDto
     */
    groups?: Array<GroupDto>;
    /**
     * Number of associated objects
     * @type {number}
     * @memberof KeyItemDto
     */
    associations?: number;
    /**
     * UUID of the key item in the Connector
     * @type {string}
     * @memberof KeyItemDto
     */
    keyReferenceUuid: string;
    /**
     * @type {KeyType}
     * @memberof KeyItemDto
     */
    type: KeyType;
    /**
     * @type {KeyAlgorithm}
     * @memberof KeyItemDto
     */
    keyAlgorithm: KeyAlgorithm;
    /**
     * @type {KeyFormat}
     * @memberof KeyItemDto
     */
    format?: KeyFormat;
    /**
     * Key Length
     * @type {number}
     * @memberof KeyItemDto
     */
    length?: number;
    /**
     * Key Usages
     * @type {Array<KeyUsage>}
     * @memberof KeyItemDto
     */
    usage: Array<KeyUsage>;
    /**
     * Boolean describing if the key is enabled or not
     * @type {boolean}
     * @memberof KeyItemDto
     */
    enabled: boolean;
    /**
     * @type {KeyState}
     * @memberof KeyItemDto
     */
    state: KeyState;
}


