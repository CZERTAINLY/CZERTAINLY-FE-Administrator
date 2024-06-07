// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 2.12.1-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type {
    Resource,
} from './';

/**
 * List of associated items
 * @export
 * @interface KeyAssociationDto
 */
export interface KeyAssociationDto {
    /**
     * Object identifier
     * @type {string}
     * @memberof KeyAssociationDto
     */
    uuid: string;
    /**
     * Object Name
     * @type {string}
     * @memberof KeyAssociationDto
     */
    name: string;
    /**
     * @type {Resource}
     * @memberof KeyAssociationDto
     */
    resource: Resource;
}


