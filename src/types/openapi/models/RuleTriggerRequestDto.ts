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
    RuleActionRequestDto,
    RuleTriggerType,
} from './';

/**
 * @export
 * @interface RuleTriggerRequestDto
 */
export interface RuleTriggerRequestDto {
    /**
     * Name of the Rule Trigger
     * @type {string}
     * @memberof RuleTriggerRequestDto
     */
    name: string;
    /**
     * Description of the Rule Trigger
     * @type {string}
     * @memberof RuleTriggerRequestDto
     */
    description?: string;
    /**
     * @type {RuleTriggerType}
     * @memberof RuleTriggerRequestDto
     */
    triggerType: RuleTriggerType;
    /**
     * Name of the event of the Rule Trigger
     * @type {string}
     * @memberof RuleTriggerRequestDto
     */
    eventName?: RuleTriggerRequestDtoEventNameEnum;
    /**
     * @type {Resource}
     * @memberof RuleTriggerRequestDto
     */
    resource: Resource;
    /**
     * @type {Resource}
     * @memberof RuleTriggerRequestDto
     */
    triggerResource?: Resource;
    /**
     * List of UUIDs of existing Rules to add in the Rule Trigger
     * @type {Array<string>}
     * @memberof RuleTriggerRequestDto
     */
    rulesUuids?: Array<string>;
    /**
     * List of UUIDs of existing Action Groups to add in the Rule Trigger
     * @type {Array<string>}
     * @memberof RuleTriggerRequestDto
     */
    actionGroupsUuids?: Array<string>;
    /**
     * List of new Rule Actions to add in the Rule Trigger
     * @type {Array<RuleActionRequestDto>}
     * @memberof RuleTriggerRequestDto
     */
    actions?: Array<RuleActionRequestDto>;
}

/**
 * @export
 * @enum {string}
 */
export enum RuleTriggerRequestDtoEventNameEnum {
    DiscoveryFinished = 'discoveryFinished'
}

