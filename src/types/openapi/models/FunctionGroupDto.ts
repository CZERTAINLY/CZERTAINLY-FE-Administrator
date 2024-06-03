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
    EndpointDto,
    FunctionGroupCode,
} from './';

/**
 * List of Function Groups implemented by the Connector
 * @export
 * @interface FunctionGroupDto
 */
export interface FunctionGroupDto {
    /**
     * @type {FunctionGroupCode}
     * @memberof FunctionGroupDto
     */
    functionGroupCode: FunctionGroupCode;
    /**
     * List of supported functional group kinds
     * @type {Array<string>}
     * @memberof FunctionGroupDto
     */
    kinds: Array<string>;
    /**
     * List of end points related to functional group
     * @type {Array<EndpointDto>}
     * @memberof FunctionGroupDto
     */
    endPoints: Array<EndpointDto>;
    /**
     * UUID of the Function Group
     * @type {string}
     * @memberof FunctionGroupDto
     */
    uuid: string;
    /**
     * Function Group Name
     * @type {string}
     * @memberof FunctionGroupDto
     */
    name: string;
}


