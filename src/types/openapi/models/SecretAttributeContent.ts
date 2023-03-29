// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 2.7.1-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type { SecretAttributeContentData } from "./";

/**
 * @export
 * @interface SecretAttributeContent
 */
export interface SecretAttributeContent {
    /**
     * Content Reference
     * @type {string}
     * @memberof SecretAttributeContent
     */
    reference?: string;
    /**
     * @type {SecretAttributeContentData}
     * @memberof SecretAttributeContent
     */
    data: SecretAttributeContentData;
}
