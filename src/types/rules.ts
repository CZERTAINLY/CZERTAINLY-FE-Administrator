import { AttributeResponseModel } from './attributes';
import type {
    RuleActionDto,
    // RuleActionGroupDto,
    RuleActionGroupDto,
    RuleActionGroupRequestDto,
    RuleActionRequestDto,
    RuleConditionDto,
    // RuleConditionGroupDetailDto,
    RuleConditionGroupDto,
    RuleConditionGroupRequestDto,
    RuleConditionRequestDto,
    RuleDetailDto,
    RuleDto,
    RuleRequestDto,
    RuleTriggerDetailDto,
    RuleTriggerDto,
    RuleTriggerRequestDto,
    SearchFieldDataByGroupDto,
    UpdateRuleActionGroupRequestDto,
    UpdateRuleConditionGroupRequestDto,
    UpdateRuleRequestDto,
    UpdateRuleTriggerRequestDto,
} from './openapi';

export type FieldSearchDataByGroupDto = SearchFieldDataByGroupDto;
export type FieldSearchDataByGroupModel = FieldSearchDataByGroupDto;

export type ActionRuleDto = RuleActionDto;
export type ActionRuleModel = ActionRuleDto;

// export type ActionRuleGroupDetailDto = RuleActionGroupDetailDto;
// export type ActionRuleGroupDetailModel = Omit<ActionRuleGroupDetailDto, 'actions'> & {
//     actions: Array<ActionRuleModel>;
// };

export type ActionGroupDto = RuleActionGroupDto;
export type ActionGroupModel = ActionGroupDto;

export type ActionRuleRequestDto = RuleActionRequestDto;
export type ActionRuleRequestModel = ActionRuleRequestDto;

export type ActionRuleGroupRequestDto = RuleActionGroupRequestDto;
export type ActionRuleGroupRequestModel = Omit<ActionRuleGroupRequestDto, 'actions'> & {
    actions: Array<ActionRuleRequestModel>;
};

export type ConditionRuleDto = RuleConditionDto;
export type ConditionRuleModel = ConditionRuleDto;

export type ConditionRuleGroupDto = RuleConditionGroupDto;
export type ConditionRuleGroupModel = Omit<ConditionRuleGroupDto, 'conditions'> & {
    conditions: Array<ConditionRuleModel>;
};

export type ConditionRuleRequestDto = RuleConditionRequestDto;
export type RuleConditiontModel = ConditionRuleRequestDto;

export type ConditionRuleGroupRequestDto = RuleConditionGroupRequestDto;
export type ConditionRuleGroupRequestModel = Omit<ConditionRuleGroupRequestDto, 'conditions'> & {
    conditions: Array<RuleConditiontModel>;
};

export type DetailRuleDto = RuleDetailDto;
export type DetailRuleModel = Omit<DetailRuleDto, 'attributes | conditions | conditionGroups'> & {
    attributes: Array<AttributeResponseModel>;
    conditions: Array<ConditionRuleModel>;
    conditionGroups: Array<ConditionRuleGroupModel>;
};

export type DtoRule = RuleDto;
export type RuleModel = Omit<DtoRule, 'attributes'> & {
    attributes: Array<AttributeResponseModel>;
};

export type RequestRuleDto = RuleRequestDto;
export type RequestRuleModel = Omit<RequestRuleDto, 'conditions | conditionGroups | conditionGroupsUuids'> & {
    conditions?: Array<RuleConditiontModel>;
    conditionGroupsUuids?: Array<string>;
};

export type TriggerRuleDetailDto = RuleTriggerDetailDto;
export type TriggerRuleDetailModel = Omit<TriggerRuleDetailDto, 'rules | actionGroups | actions'> & {
    rules: Array<RuleModel>;
    actionGroups: Array<ActionGroupModel>;
    actions: Array<ActionRuleModel>;
};

export type TriggerRuleDto = RuleTriggerDto;
export type TriggerRuleModel = TriggerRuleDto;

export type TriggerRuleRequestDto = RuleTriggerRequestDto;
export type TriggerRuleRequestModel = Omit<TriggerRuleRequestDto, 'rules | actionGroups | actions'> & {
    actions?: Array<ActionRuleRequestModel>;
    actionGroupsUuids?: Array<string>;
    rulesUuids?: Array<string>;
};

export type UpdateActionGroupRequestDto = UpdateRuleActionGroupRequestDto;
export type UpdateActionGroupRequestModel = Omit<UpdateActionGroupRequestDto, 'actions'> & {
    actions: Array<ActionRuleRequestModel>;
};

export type UpdateGroupRuleConditionRequestDto = UpdateRuleConditionGroupRequestDto;
export type UpdateGroupRuleConditionRequestModel = Omit<UpdateGroupRuleConditionRequestDto, 'conditions'> & {
    conditions: Array<RuleConditiontModel>;
};

export type RuleUpdateRequestDto = UpdateRuleRequestDto;
export type RuleUpdateRequestModel = Omit<RuleUpdateRequestDto, 'conditions | conditionGroups | conditionGroupsUuids'> & {
    conditions?: Array<RuleConditiontModel>;
    conditionGroupsUuids?: Array<string>;
};

export type RuleTriggerUpdateRequestDto = UpdateRuleTriggerRequestDto;
export type RuleTriggerUpdateRequestModel = Omit<RuleTriggerUpdateRequestDto, 'rules | actionGroups | actions'> & {
    actions: Array<ActionRuleRequestModel>;
    rulesUuids?: Array<string>;
    actionGroupsUuids?: Array<string>;
};
