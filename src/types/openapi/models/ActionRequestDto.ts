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
    Resource,
} from './';

/**
 * @export
 * @interface ActionRequestDto
 */
export interface ActionRequestDto {
    /**
     * Name of the action
     * @type {string}
     * @memberof ActionRequestDto
     */
    name: string;
    /**
     * Description of the action
     * @type {string}
     * @memberof ActionRequestDto
     */
    description?: string;
    /**
     * @type {Resource}
     * @memberof ActionRequestDto
     */
    resource: Resource;
    /**
     * List of UUIDs of existing executions to add to the action
     * @type {Array<string>}
     * @memberof ActionRequestDto
     */
    executionsUuids: Array<string>;
}


