import { AttributeResponseModel } from './attributes';
import type {
    RuleActionDto,
    RuleActionGroupDetailDto,
    RuleActionGroupDto,
    RuleActionGroupRequestDto,
    RuleActionRequestDto,
    RuleConditionDto,
    RuleConditionGroupDetailDto,
    RuleConditionGroupDto,
    RuleConditionGroupRequestDto,
    RuleConditionRequestDto,
    RuleDetailDto,
    RuleDto,
    RuleRequestDto,
    RuleTriggerDetailDto,
    RuleTriggerDto,
    RuleTriggerRequestDto,
    UpdateRuleActionGroupRequestDto,
    UpdateRuleConditionGroupRequestDto,
    UpdateRuleRequestDto,
    UpdateRuleTriggerRequestDto,
} from './openapi';

export type ActionRuleDto = RuleActionDto;
export type ActionRuleModel = ActionRuleDto;

export type ActionRuleGroupDetailDto = RuleActionGroupDetailDto;
export type ActionRuleGroupDetailModel = Omit<ActionRuleGroupDetailDto, 'actions'> & {
    actions: Array<ActionRuleModel>;
};

export type ActionRuleGroupDto = RuleActionGroupDto;
export type ActionRuleGroupModel = ActionRuleGroupDto;

export type ActionRuleRequestDto = RuleActionRequestDto;
export type ActionRuleRequestModel = ActionRuleRequestDto;

export type ActionRuleGroupRequestDto = RuleActionGroupRequestDto;
export type ActionRuleGroupRequestModel = Omit<ActionRuleGroupRequestDto, 'actions'> & {
    actions: Array<ActionRuleRequestModel>;
};

export type ConditionRuleDto = RuleConditionDto;
export type ConditionRuleModel = ConditionRuleDto;

export type ConditionRuleGroupDetailDto = RuleConditionGroupDetailDto;
export type ConditionRuleGroupDetailModel = Omit<ConditionRuleGroupDetailDto, 'conditions'> & {
    conditions: Array<ConditionRuleModel>;
};

export type ConditionRuleGroupDto = RuleConditionGroupDto;
export type ConditionRuleGroupModel = ConditionRuleGroupDto;

export type ConditionRuleRequestDto = RuleConditionRequestDto;
export type ConditionRuleRequestModel = ConditionRuleRequestDto;

export type ConditionRuleGroupRequestDto = RuleConditionGroupRequestDto;
export type ConditionRuleGroupRequestModel = Omit<ConditionRuleGroupRequestDto, 'conditions'> & {
    conditions: Array<ConditionRuleRequestModel>;
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
export type RequestRuleModel = Omit<RequestRuleDto, 'conditions | conditionGroups'> & {
    conditions: Array<ConditionRuleRequestModel>;
    conditionGroups: Array<ConditionRuleGroupRequestModel>;
};

export type TriggerRuleDetailDto = RuleTriggerDetailDto;
export type TriggerRuleDetailModel = Omit<TriggerRuleDetailDto, 'rules | actionGroups | actions'> & {
    rules: Array<RuleModel>;
    actionGroups: Array<ActionRuleGroupModel>;
    actions: Array<ActionRuleModel>;
};

export type TriggerRuleDto = RuleTriggerDto;
export type TriggerRuleModel = TriggerRuleDto;

export type TriggerRuleRequestDto = RuleTriggerRequestDto;
export type TriggerRuleRequestModel = Omit<TriggerRuleRequestDto, 'rules | actionGroups | actions'> & {
    rules: Array<RequestRuleModel>;
    actionGroups: Array<ActionRuleGroupRequestModel>;
    actions: Array<ActionRuleRequestModel>;
};

export type UpdateGroupRuleActionRequestDto = UpdateRuleActionGroupRequestDto;
export type UpdateGroupRuleActionRequestModel = Omit<UpdateGroupRuleActionRequestDto, 'actions'> & {
    actions: Array<ActionRuleRequestModel>;
};

export type UpdateGroupRuleConditionRequestDto = UpdateRuleConditionGroupRequestDto;
export type UpdateGroupRuleConditionRequestModel = Omit<UpdateGroupRuleConditionRequestDto, 'conditions'> & {
    conditions: Array<ConditionRuleRequestModel>;
};

export type RuleUpdateRequestDto = UpdateRuleRequestDto;
export type RuleUpdateRequestModel = Omit<RuleUpdateRequestDto, 'conditions | conditionGroups'> & {
    conditions: Array<ConditionRuleRequestModel>;
    conditionGroups: Array<ConditionRuleGroupRequestModel>;
};

export type RuleTriggerUpdateRequestDto = UpdateRuleTriggerRequestDto;
export type RuleTriggerUpdateRequestModel = Omit<RuleTriggerUpdateRequestDto, 'rules | actionGroups | actions'> & {
    rules: Array<RequestRuleModel>;
    actionGroups: Array<ActionRuleGroupRequestModel>;
    actions: Array<ActionRuleRequestModel>;
};
