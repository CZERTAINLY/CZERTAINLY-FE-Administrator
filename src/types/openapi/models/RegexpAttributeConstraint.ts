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
    AttributeConstraintType,
} from './';

/**
 * @export
 * @interface RegexpAttributeConstraint
 */
export interface RegexpAttributeConstraint {
    /**
     * Description of the constraint
     * @type {string}
     * @memberof RegexpAttributeConstraint
     */
    description?: string;
    /**
     * Error message to be displayed for wrong data
     * @type {string}
     * @memberof RegexpAttributeConstraint
     */
    errorMessage?: string;
    /**
     * @type {AttributeConstraintType}
     * @memberof RegexpAttributeConstraint
     */
    type: AttributeConstraintType;
    /**
     * Regular Expression Attribute Constraint Data
     * @type {string}
     * @memberof RegexpAttributeConstraint
     */
    data?: string;
}


