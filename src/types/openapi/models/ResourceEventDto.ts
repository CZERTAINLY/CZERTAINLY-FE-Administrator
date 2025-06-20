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
    Resource,
    ResourceEvent,
} from './';

/**
 * @export
 * @interface ResourceEventDto
 */
export interface ResourceEventDto {
    /**
     * Resource event code
     * @type {ResourceEvent}
     * @memberof ResourceEventDto
     */
    event: ResourceEvent;
    /**
     * Resource of objects that are subject of event
     * @type {Resource}
     * @memberof ResourceEventDto
     */
    producedResource?: Resource;
}


