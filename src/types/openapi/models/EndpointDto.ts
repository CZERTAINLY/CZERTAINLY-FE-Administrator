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
 * @interface EndpointDto
 */
export interface EndpointDto {
    /**
     * Object identifier
     * @type {string}
     * @memberof EndpointDto
     */
    uuid: string;
    /**
     * Object Name
     * @type {string}
     * @memberof EndpointDto
     */
    name: string;
    /**
     * Context of the Endpoint
     * @type {string}
     * @memberof EndpointDto
     */
    context: string;
    /**
     * Method to be used for the Endpoint
     * @type {string}
     * @memberof EndpointDto
     */
    method: string;
    /**
     * True if the Endpoint is required for implementation
     * @type {boolean}
     * @memberof EndpointDto
     */
    required: boolean;
}
