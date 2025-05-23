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
    GroupDto,
    KeyItemDto,
} from './';

/**
 * @export
 * @interface KeyDto
 */
export interface KeyDto {
    /**
     * Object identifier
     * @type {string}
     * @memberof KeyDto
     */
    uuid: string;
    /**
     * Object Name
     * @type {string}
     * @memberof KeyDto
     */
    name: string;
    /**
     * Description of the Key
     * @type {string}
     * @memberof KeyDto
     */
    description?: string;
    /**
     * Creation time of the Key. If the key is discovered from the connector, then it will be returned
     * @type {string}
     * @memberof KeyDto
     */
    creationTime: string;
    /**
     * UUID of the Token Profile
     * @type {string}
     * @memberof KeyDto
     */
    tokenProfileUuid?: string;
    /**
     * Name of the Token Profile
     * @type {string}
     * @memberof KeyDto
     */
    tokenProfileName?: string;
    /**
     * Token Instance UUID
     * @type {string}
     * @memberof KeyDto
     */
    tokenInstanceUuid?: string;
    /**
     * Token Instance Name
     * @type {string}
     * @memberof KeyDto
     */
    tokenInstanceName?: string;
    /**
     * Owner of the Key
     * @type {string}
     * @memberof KeyDto
     */
    owner?: string;
    /**
     * UUID of the owner of the Key
     * @type {string}
     * @memberof KeyDto
     */
    ownerUuid?: string;
    /**
     * Groups associated to the key
     * @type {Array<GroupDto>}
     * @memberof KeyDto
     */
    groups?: Array<GroupDto>;
    /**
     * Key Items
     * @type {Array<KeyItemDto>}
     * @memberof KeyDto
     */
    items: Array<KeyItemDto>;
    /**
     * Number of associated objects
     * @type {number}
     * @memberof KeyDto
     */
    associations: number;
}
