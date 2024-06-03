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
    ProgrammingLanguageEnum,
} from './';

/**
 * CodeBlock attribute content data
 * @export
 * @interface CodeBlockAttributeContentData
 */
export interface CodeBlockAttributeContentData {
    /**
     * @type {ProgrammingLanguageEnum}
     * @memberof CodeBlockAttributeContentData
     */
    language: ProgrammingLanguageEnum;
    /**
     * Block of the code in Base64. Formatting of the code is specified by variable language
     * @type {string}
     * @memberof CodeBlockAttributeContentData
     */
    code: string;
}


