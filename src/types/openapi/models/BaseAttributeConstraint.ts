// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 2.14.1-SNAPSHOT
 * Contact: info@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type {
    AttributeConstraintType,
    DateTimeAttributeConstraint,
    DateTimeAttributeConstraintData,
    RangeAttributeConstraint,
    RegexpAttributeConstraint,
} from './';

/**
 * @type BaseAttributeConstraint
 * Optional regular expressions and constraints used for validating the Attribute content
 * @export
 */
export type BaseAttributeConstraint = DateTimeAttributeConstraint | RangeAttributeConstraint | RegexpAttributeConstraint;
