// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 2.8.1-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type { ResourcePermissionsDto } from "./";

/**
 * @export
 * @interface SubjectPermissionsDto
 */
export interface SubjectPermissionsDto {
    /**
     * Allow all resources, True = Yes, False = No
     * @type {boolean}
     * @memberof SubjectPermissionsDto
     */
    allowAllResources: boolean;
    /**
     * Resources
     * @type {Array<ResourcePermissionsDto>}
     * @memberof SubjectPermissionsDto
     */
    resources: Array<ResourcePermissionsDto>;
}
