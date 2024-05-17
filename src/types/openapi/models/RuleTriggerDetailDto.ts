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
    RuleActionDto,
    RuleActionGroupDto,
    RuleDto,
    RuleTriggerType,
} from './';

/**
 * @export
 * @interface RuleTriggerDetailDto
 */
export interface RuleTriggerDetailDto {
    /**
     * Object identifier
     * @type {string}
     * @memberof RuleTriggerDetailDto
     */
    uuid: string;
    /**
     * Object Name
     * @type {string}
     * @memberof RuleTriggerDetailDto
     */
    name: string;
    /**
     * Description of the Rule Trigger
     * @type {string}
     * @memberof RuleTriggerDetailDto
     */
    description?: string;
    /**
     * @type {RuleTriggerType}
     * @memberof RuleTriggerDetailDto
     */
    triggerType: RuleTriggerType;
    /**
     * Name of the event of the Rule Trigger
     * @type {string}
     * @memberof RuleTriggerDetailDto
     */
    eventName?: RuleTriggerDetailDtoEventNameEnum;
    /**
     * @type {Resource}
     * @memberof RuleTriggerDetailDto
     */
    resource: Resource;
    /**
     * @type {Resource}
     * @memberof RuleTriggerDetailDto
     */
    triggerResource?: Resource;
    /**
     * List of Rules in the Rule Trigger
     * @type {Array<RuleDto>}
     * @memberof RuleTriggerDetailDto
     */
    rules: Array<RuleDto>;
    /**
     * List of Action Groups in the Rule Trigger
     * @type {Array<RuleActionGroupDto>}
     * @memberof RuleTriggerDetailDto
     */
    actionGroups: Array<RuleActionGroupDto>;
    /**
     * List of Rule Actions in the Rule Trigger
     * @type {Array<RuleActionDto>}
     * @memberof RuleTriggerDetailDto
     */
    actions: Array<RuleActionDto>;
}

/**
 * @export
 * @enum {string}
 */
export enum RuleTriggerDetailDtoEventNameEnum {
    DiscoveryFinished = 'discoveryFinished'
}

