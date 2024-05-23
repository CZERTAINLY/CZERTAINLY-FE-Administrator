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

import type { Observable } from 'rxjs';
import type { AjaxResponse } from 'rxjs/ajax';
import { BaseAPI, throwIfNullOrUndefined, encodeURI } from '../runtime';
import type { OperationOpts, HttpHeaders, HttpQuery } from '../runtime';
import type {
    AuthenticationServiceExceptionDto,
    Resource,
    RuleActionGroupDto,
    RuleActionGroupRequestDto,
    RuleConditionGroupDto,
    RuleConditionGroupRequestDto,
    RuleDetailDto,
    RuleDto,
    RuleRequestDto,
    RuleTriggerDetailDto,
    RuleTriggerDto,
    RuleTriggerHistoryDto,
    RuleTriggerRequestDto,
    UpdateRuleActionGroupRequestDto,
    UpdateRuleConditionGroupRequestDto,
    UpdateRuleRequestDto,
    UpdateRuleTriggerRequestDto,
} from '../models';

export interface CreateActionGroupRequest {
    ruleActionGroupRequestDto: RuleActionGroupRequestDto;
}

export interface CreateConditionGroupRequest {
    ruleConditionGroupRequestDto: RuleConditionGroupRequestDto;
}

export interface CreateRuleRequest {
    ruleRequestDto: RuleRequestDto;
}

export interface CreateTriggerRequest {
    ruleTriggerRequestDto: RuleTriggerRequestDto;
}

export interface DeleteActionGroupRequest {
    actionGroupUuid: string;
}

export interface DeleteConditionGroupRequest {
    conditionGroupUuid: string;
}

export interface DeleteRuleRequest {
    ruleUuid: string;
}

export interface DeleteTriggerRequest {
    triggerUuid: string;
}

export interface GetActionGroupRequest {
    actionGroupUuid: string;
}

export interface GetConditionGroupRequest {
    conditionGroupUuid: string;
}

export interface GetRuleRequest {
    ruleUuid: string;
}

export interface GetTriggerRequest {
    triggerUuid: string;
}

export interface GetTriggerHistoryRequest {
    triggerUuid: string;
    triggerObjectUuid: string;
}

export interface ListActionGroupsRequest {
    resource?: Resource;
}

export interface ListConditionGroupsRequest {
    resource?: Resource;
}

export interface ListRulesRequest {
    resource?: Resource;
}

export interface ListTriggersRequest {
    resource?: Resource;
    triggerResource?: Resource;
}

export interface UpdateActionGroupRequest {
    actionGroupUuid: string;
    updateRuleActionGroupRequestDto: UpdateRuleActionGroupRequestDto;
}

export interface UpdateConditionGroupRequest {
    conditionGroupUuid: string;
    updateRuleConditionGroupRequestDto: UpdateRuleConditionGroupRequestDto;
}

export interface UpdateRuleRequest {
    ruleUuid: string;
    updateRuleRequestDto: UpdateRuleRequestDto;
}

export interface UpdateTriggerRequest {
    triggerUuid: string;
    updateRuleTriggerRequestDto: UpdateRuleTriggerRequestDto;
}

/**
 * no description
 */
export class RulesManagementApi extends BaseAPI {

    /**
     * Create Action Group
     */
    createActionGroup({ ruleActionGroupRequestDto }: CreateActionGroupRequest): Observable<RuleActionGroupDto>
    createActionGroup({ ruleActionGroupRequestDto }: CreateActionGroupRequest, opts?: OperationOpts): Observable<AjaxResponse<RuleActionGroupDto>>
    createActionGroup({ ruleActionGroupRequestDto }: CreateActionGroupRequest, opts?: OperationOpts): Observable<RuleActionGroupDto | AjaxResponse<RuleActionGroupDto>> {
        throwIfNullOrUndefined(ruleActionGroupRequestDto, 'ruleActionGroupRequestDto', 'createActionGroup');

        const headers: HttpHeaders = {
            'Content-Type': 'application/json',
        };

        return this.request<RuleActionGroupDto>({
            url: '/v1/rules/actionGroups',
            method: 'POST',
            headers,
            body: ruleActionGroupRequestDto,
        }, opts?.responseOpts);
    };

    /**
     * Create Condition Group
     */
    createConditionGroup({ ruleConditionGroupRequestDto }: CreateConditionGroupRequest): Observable<RuleConditionGroupDto>
    createConditionGroup({ ruleConditionGroupRequestDto }: CreateConditionGroupRequest, opts?: OperationOpts): Observable<AjaxResponse<RuleConditionGroupDto>>
    createConditionGroup({ ruleConditionGroupRequestDto }: CreateConditionGroupRequest, opts?: OperationOpts): Observable<RuleConditionGroupDto | AjaxResponse<RuleConditionGroupDto>> {
        throwIfNullOrUndefined(ruleConditionGroupRequestDto, 'ruleConditionGroupRequestDto', 'createConditionGroup');

        const headers: HttpHeaders = {
            'Content-Type': 'application/json',
        };

        return this.request<RuleConditionGroupDto>({
            url: '/v1/rules/conditionGroups',
            method: 'POST',
            headers,
            body: ruleConditionGroupRequestDto,
        }, opts?.responseOpts);
    };

    /**
     * Create Rule
     */
    createRule({ ruleRequestDto }: CreateRuleRequest): Observable<RuleDetailDto>
    createRule({ ruleRequestDto }: CreateRuleRequest, opts?: OperationOpts): Observable<AjaxResponse<RuleDetailDto>>
    createRule({ ruleRequestDto }: CreateRuleRequest, opts?: OperationOpts): Observable<RuleDetailDto | AjaxResponse<RuleDetailDto>> {
        throwIfNullOrUndefined(ruleRequestDto, 'ruleRequestDto', 'createRule');

        const headers: HttpHeaders = {
            'Content-Type': 'application/json',
        };

        return this.request<RuleDetailDto>({
            url: '/v1/rules',
            method: 'POST',
            headers,
            body: ruleRequestDto,
        }, opts?.responseOpts);
    };

    /**
     * Create Trigger
     */
    createTrigger({ ruleTriggerRequestDto }: CreateTriggerRequest): Observable<RuleTriggerDetailDto>
    createTrigger({ ruleTriggerRequestDto }: CreateTriggerRequest, opts?: OperationOpts): Observable<AjaxResponse<RuleTriggerDetailDto>>
    createTrigger({ ruleTriggerRequestDto }: CreateTriggerRequest, opts?: OperationOpts): Observable<RuleTriggerDetailDto | AjaxResponse<RuleTriggerDetailDto>> {
        throwIfNullOrUndefined(ruleTriggerRequestDto, 'ruleTriggerRequestDto', 'createTrigger');

        const headers: HttpHeaders = {
            'Content-Type': 'application/json',
        };

        return this.request<RuleTriggerDetailDto>({
            url: '/v1/rules/triggers',
            method: 'POST',
            headers,
            body: ruleTriggerRequestDto,
        }, opts?.responseOpts);
    };

    /**
     * Delete Action Group
     */
    deleteActionGroup({ actionGroupUuid }: DeleteActionGroupRequest): Observable<void>
    deleteActionGroup({ actionGroupUuid }: DeleteActionGroupRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>>
    deleteActionGroup({ actionGroupUuid }: DeleteActionGroupRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(actionGroupUuid, 'actionGroupUuid', 'deleteActionGroup');

        return this.request<void>({
            url: '/v1/rules/actionGroups/{actionGroupUuid}'.replace('{actionGroupUuid}', encodeURI(actionGroupUuid)),
            method: 'DELETE',
        }, opts?.responseOpts);
    };

    /**
     * Delete Condition Group
     */
    deleteConditionGroup({ conditionGroupUuid }: DeleteConditionGroupRequest): Observable<void>
    deleteConditionGroup({ conditionGroupUuid }: DeleteConditionGroupRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>>
    deleteConditionGroup({ conditionGroupUuid }: DeleteConditionGroupRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(conditionGroupUuid, 'conditionGroupUuid', 'deleteConditionGroup');

        return this.request<void>({
            url: '/v1/rules/conditionGroups/{conditionGroupUuid}'.replace('{conditionGroupUuid}', encodeURI(conditionGroupUuid)),
            method: 'DELETE',
        }, opts?.responseOpts);
    };

    /**
     * Delete Rule
     */
    deleteRule({ ruleUuid }: DeleteRuleRequest): Observable<void>
    deleteRule({ ruleUuid }: DeleteRuleRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>>
    deleteRule({ ruleUuid }: DeleteRuleRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(ruleUuid, 'ruleUuid', 'deleteRule');

        return this.request<void>({
            url: '/v1/rules/{ruleUuid}'.replace('{ruleUuid}', encodeURI(ruleUuid)),
            method: 'DELETE',
        }, opts?.responseOpts);
    };

    /**
     * Delete Trigger
     */
    deleteTrigger({ triggerUuid }: DeleteTriggerRequest): Observable<void>
    deleteTrigger({ triggerUuid }: DeleteTriggerRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>>
    deleteTrigger({ triggerUuid }: DeleteTriggerRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(triggerUuid, 'triggerUuid', 'deleteTrigger');

        return this.request<void>({
            url: '/v1/rules/triggers/{triggerUuid}'.replace('{triggerUuid}', encodeURI(triggerUuid)),
            method: 'DELETE',
        }, opts?.responseOpts);
    };

    /**
     * Get Action Group Details
     */
    getActionGroup({ actionGroupUuid }: GetActionGroupRequest): Observable<RuleActionGroupDto>
    getActionGroup({ actionGroupUuid }: GetActionGroupRequest, opts?: OperationOpts): Observable<AjaxResponse<RuleActionGroupDto>>
    getActionGroup({ actionGroupUuid }: GetActionGroupRequest, opts?: OperationOpts): Observable<RuleActionGroupDto | AjaxResponse<RuleActionGroupDto>> {
        throwIfNullOrUndefined(actionGroupUuid, 'actionGroupUuid', 'getActionGroup');

        return this.request<RuleActionGroupDto>({
            url: '/v1/rules/actionGroups/{actionGroupUuid}'.replace('{actionGroupUuid}', encodeURI(actionGroupUuid)),
            method: 'GET',
        }, opts?.responseOpts);
    };

    /**
     * Get Condition Group details
     */
    getConditionGroup({ conditionGroupUuid }: GetConditionGroupRequest): Observable<RuleConditionGroupDto>
    getConditionGroup({ conditionGroupUuid }: GetConditionGroupRequest, opts?: OperationOpts): Observable<AjaxResponse<RuleConditionGroupDto>>
    getConditionGroup({ conditionGroupUuid }: GetConditionGroupRequest, opts?: OperationOpts): Observable<RuleConditionGroupDto | AjaxResponse<RuleConditionGroupDto>> {
        throwIfNullOrUndefined(conditionGroupUuid, 'conditionGroupUuid', 'getConditionGroup');

        return this.request<RuleConditionGroupDto>({
            url: '/v1/rules/conditionGroups/{conditionGroupUuid}'.replace('{conditionGroupUuid}', encodeURI(conditionGroupUuid)),
            method: 'GET',
        }, opts?.responseOpts);
    };

    /**
     * Get Rule details
     */
    getRule({ ruleUuid }: GetRuleRequest): Observable<RuleDetailDto>
    getRule({ ruleUuid }: GetRuleRequest, opts?: OperationOpts): Observable<AjaxResponse<RuleDetailDto>>
    getRule({ ruleUuid }: GetRuleRequest, opts?: OperationOpts): Observable<RuleDetailDto | AjaxResponse<RuleDetailDto>> {
        throwIfNullOrUndefined(ruleUuid, 'ruleUuid', 'getRule');

        return this.request<RuleDetailDto>({
            url: '/v1/rules/{ruleUuid}'.replace('{ruleUuid}', encodeURI(ruleUuid)),
            method: 'GET',
        }, opts?.responseOpts);
    };

    /**
     * Get Trigger details
     */
    getTrigger({ triggerUuid }: GetTriggerRequest): Observable<RuleTriggerDetailDto>
    getTrigger({ triggerUuid }: GetTriggerRequest, opts?: OperationOpts): Observable<AjaxResponse<RuleTriggerDetailDto>>
    getTrigger({ triggerUuid }: GetTriggerRequest, opts?: OperationOpts): Observable<RuleTriggerDetailDto | AjaxResponse<RuleTriggerDetailDto>> {
        throwIfNullOrUndefined(triggerUuid, 'triggerUuid', 'getTrigger');

        return this.request<RuleTriggerDetailDto>({
            url: '/v1/rules/triggers/{triggerUuid}'.replace('{triggerUuid}', encodeURI(triggerUuid)),
            method: 'GET',
        }, opts?.responseOpts);
    };

    /**
     * Get Trigger History
     */
    getTriggerHistory({ triggerUuid, triggerObjectUuid }: GetTriggerHistoryRequest): Observable<Array<RuleTriggerHistoryDto>>
    getTriggerHistory({ triggerUuid, triggerObjectUuid }: GetTriggerHistoryRequest, opts?: OperationOpts): Observable<AjaxResponse<Array<RuleTriggerHistoryDto>>>
    getTriggerHistory({ triggerUuid, triggerObjectUuid }: GetTriggerHistoryRequest, opts?: OperationOpts): Observable<Array<RuleTriggerHistoryDto> | AjaxResponse<Array<RuleTriggerHistoryDto>>> {
        throwIfNullOrUndefined(triggerUuid, 'triggerUuid', 'getTriggerHistory');
        throwIfNullOrUndefined(triggerObjectUuid, 'triggerObjectUuid', 'getTriggerHistory');

        return this.request<Array<RuleTriggerHistoryDto>>({
            url: '/v1/rules/triggers/{triggerUuid}/history/{triggerObjectUuid}'.replace('{triggerUuid}', encodeURI(triggerUuid)).replace('{triggerObjectUuid}', encodeURI(triggerObjectUuid)),
            method: 'GET',
        }, opts?.responseOpts);
    };

    /**
     * List Action Groups
     */
    listActionGroups({ resource }: ListActionGroupsRequest): Observable<Array<RuleActionGroupDto>>
    listActionGroups({ resource }: ListActionGroupsRequest, opts?: OperationOpts): Observable<AjaxResponse<Array<RuleActionGroupDto>>>
    listActionGroups({ resource }: ListActionGroupsRequest, opts?: OperationOpts): Observable<Array<RuleActionGroupDto> | AjaxResponse<Array<RuleActionGroupDto>>> {

        const query: HttpQuery = {};

        if (resource != null) { query['resource'] = resource; }

        return this.request<Array<RuleActionGroupDto>>({
            url: '/v1/rules/actionGroups',
            method: 'GET',
            query,
        }, opts?.responseOpts);
    };

    /**
     * List Condition Groups
     */
    listConditionGroups({ resource }: ListConditionGroupsRequest): Observable<Array<RuleConditionGroupDto>>
    listConditionGroups({ resource }: ListConditionGroupsRequest, opts?: OperationOpts): Observable<AjaxResponse<Array<RuleConditionGroupDto>>>
    listConditionGroups({ resource }: ListConditionGroupsRequest, opts?: OperationOpts): Observable<Array<RuleConditionGroupDto> | AjaxResponse<Array<RuleConditionGroupDto>>> {

        const query: HttpQuery = {};

        if (resource != null) { query['resource'] = resource; }

        return this.request<Array<RuleConditionGroupDto>>({
            url: '/v1/rules/conditionGroups',
            method: 'GET',
            query,
        }, opts?.responseOpts);
    };

    /**
     * List Rules
     */
    listRules({ resource }: ListRulesRequest): Observable<Array<RuleDto>>
    listRules({ resource }: ListRulesRequest, opts?: OperationOpts): Observable<AjaxResponse<Array<RuleDto>>>
    listRules({ resource }: ListRulesRequest, opts?: OperationOpts): Observable<Array<RuleDto> | AjaxResponse<Array<RuleDto>>> {

        const query: HttpQuery = {};

        if (resource != null) { query['resource'] = resource; }

        return this.request<Array<RuleDto>>({
            url: '/v1/rules',
            method: 'GET',
            query,
        }, opts?.responseOpts);
    };

    /**
     * List Triggers
     */
    listTriggers({ resource, triggerResource }: ListTriggersRequest): Observable<Array<RuleTriggerDto>>
    listTriggers({ resource, triggerResource }: ListTriggersRequest, opts?: OperationOpts): Observable<AjaxResponse<Array<RuleTriggerDto>>>
    listTriggers({ resource, triggerResource }: ListTriggersRequest, opts?: OperationOpts): Observable<Array<RuleTriggerDto> | AjaxResponse<Array<RuleTriggerDto>>> {

        const query: HttpQuery = {};

        if (resource != null) { query['resource'] = resource; }
        if (triggerResource != null) { query['triggerResource'] = triggerResource; }

        return this.request<Array<RuleTriggerDto>>({
            url: '/v1/rules/triggers',
            method: 'GET',
            query,
        }, opts?.responseOpts);
    };

    /**
     * Update Action Group
     */
    updateActionGroup({ actionGroupUuid, updateRuleActionGroupRequestDto }: UpdateActionGroupRequest): Observable<RuleActionGroupDto>
    updateActionGroup({ actionGroupUuid, updateRuleActionGroupRequestDto }: UpdateActionGroupRequest, opts?: OperationOpts): Observable<AjaxResponse<RuleActionGroupDto>>
    updateActionGroup({ actionGroupUuid, updateRuleActionGroupRequestDto }: UpdateActionGroupRequest, opts?: OperationOpts): Observable<RuleActionGroupDto | AjaxResponse<RuleActionGroupDto>> {
        throwIfNullOrUndefined(actionGroupUuid, 'actionGroupUuid', 'updateActionGroup');
        throwIfNullOrUndefined(updateRuleActionGroupRequestDto, 'updateRuleActionGroupRequestDto', 'updateActionGroup');

        const headers: HttpHeaders = {
            'Content-Type': 'application/json',
        };

        return this.request<RuleActionGroupDto>({
            url: '/v1/rules/actionGroups/{actionGroupUuid}'.replace('{actionGroupUuid}', encodeURI(actionGroupUuid)),
            method: 'PUT',
            headers,
            body: updateRuleActionGroupRequestDto,
        }, opts?.responseOpts);
    };

    /**
     * Update Condition Group
     */
    updateConditionGroup({ conditionGroupUuid, updateRuleConditionGroupRequestDto }: UpdateConditionGroupRequest): Observable<RuleConditionGroupDto>
    updateConditionGroup({ conditionGroupUuid, updateRuleConditionGroupRequestDto }: UpdateConditionGroupRequest, opts?: OperationOpts): Observable<AjaxResponse<RuleConditionGroupDto>>
    updateConditionGroup({ conditionGroupUuid, updateRuleConditionGroupRequestDto }: UpdateConditionGroupRequest, opts?: OperationOpts): Observable<RuleConditionGroupDto | AjaxResponse<RuleConditionGroupDto>> {
        throwIfNullOrUndefined(conditionGroupUuid, 'conditionGroupUuid', 'updateConditionGroup');
        throwIfNullOrUndefined(updateRuleConditionGroupRequestDto, 'updateRuleConditionGroupRequestDto', 'updateConditionGroup');

        const headers: HttpHeaders = {
            'Content-Type': 'application/json',
        };

        return this.request<RuleConditionGroupDto>({
            url: '/v1/rules/conditionGroups/{conditionGroupUuid}'.replace('{conditionGroupUuid}', encodeURI(conditionGroupUuid)),
            method: 'PUT',
            headers,
            body: updateRuleConditionGroupRequestDto,
        }, opts?.responseOpts);
    };

    /**
     * Update Rule
     */
    updateRule({ ruleUuid, updateRuleRequestDto }: UpdateRuleRequest): Observable<RuleDetailDto>
    updateRule({ ruleUuid, updateRuleRequestDto }: UpdateRuleRequest, opts?: OperationOpts): Observable<AjaxResponse<RuleDetailDto>>
    updateRule({ ruleUuid, updateRuleRequestDto }: UpdateRuleRequest, opts?: OperationOpts): Observable<RuleDetailDto | AjaxResponse<RuleDetailDto>> {
        throwIfNullOrUndefined(ruleUuid, 'ruleUuid', 'updateRule');
        throwIfNullOrUndefined(updateRuleRequestDto, 'updateRuleRequestDto', 'updateRule');

        const headers: HttpHeaders = {
            'Content-Type': 'application/json',
        };

        return this.request<RuleDetailDto>({
            url: '/v1/rules/{ruleUuid}'.replace('{ruleUuid}', encodeURI(ruleUuid)),
            method: 'PUT',
            headers,
            body: updateRuleRequestDto,
        }, opts?.responseOpts);
    };

    /**
     * Update Trigger
     */
    updateTrigger({ triggerUuid, updateRuleTriggerRequestDto }: UpdateTriggerRequest): Observable<RuleTriggerDetailDto>
    updateTrigger({ triggerUuid, updateRuleTriggerRequestDto }: UpdateTriggerRequest, opts?: OperationOpts): Observable<AjaxResponse<RuleTriggerDetailDto>>
    updateTrigger({ triggerUuid, updateRuleTriggerRequestDto }: UpdateTriggerRequest, opts?: OperationOpts): Observable<RuleTriggerDetailDto | AjaxResponse<RuleTriggerDetailDto>> {
        throwIfNullOrUndefined(triggerUuid, 'triggerUuid', 'updateTrigger');
        throwIfNullOrUndefined(updateRuleTriggerRequestDto, 'updateRuleTriggerRequestDto', 'updateTrigger');

        const headers: HttpHeaders = {
            'Content-Type': 'application/json',
        };

        return this.request<RuleTriggerDetailDto>({
            url: '/v1/rules/triggers/{triggerUuid}'.replace('{triggerUuid}', encodeURI(triggerUuid)),
            method: 'PUT',
            headers,
            body: updateRuleTriggerRequestDto,
        }, opts?.responseOpts);
    };

}
