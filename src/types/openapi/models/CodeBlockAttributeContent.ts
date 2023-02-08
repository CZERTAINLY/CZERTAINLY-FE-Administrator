// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 1.5.1-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type {
    CodeBlockAttributeContentData,
} from './';

/**
 * @export
 * @interface CodeBlockAttributeContent
 */
export interface CodeBlockAttributeContent {
    /**
     * Content Reference
     * @type {string}
     * @memberof CodeBlockAttributeContent
     */
    reference?: string;
    /**
     * @type {CodeBlockAttributeContentData}
     * @memberof CodeBlockAttributeContent
     */
    data: CodeBlockAttributeContentData;
}
