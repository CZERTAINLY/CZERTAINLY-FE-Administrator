import {
    ActionRuleDto,
    ActionRuleGroupDetailDto,
    ActionRuleGroupDetailModel,
    ActionRuleGroupDto,
    ActionRuleGroupModel,
    ActionRuleGroupRequestDto,
    ActionRuleGroupRequestModel,
    ActionRuleModel,
    ActionRuleRequestDto,
    ActionRuleRequestModel,
    ConditionRuleDto,
    ConditionRuleGroupDetailDto,
    ConditionRuleGroupDetailModel,
    ConditionRuleGroupDto,
    ConditionRuleGroupModel,
    ConditionRuleGroupRequestDto,
    ConditionRuleGroupRequestModel,
    ConditionRuleModel,
    ConditionRuleRequestDto,
    DetailRuleDto,
    DetailRuleModel,
    DtoRule,
    RequestRuleDto,
    RequestRuleModel,
    RuleConditiontModel,
    RuleModel,
    RuleTriggerUpdateRequestDto,
    RuleTriggerUpdateRequestModel,
    RuleUpdateRequestDto,
    RuleUpdateRequestModel,
    TriggerRuleDetailDto,
    TriggerRuleDetailModel,
    TriggerRuleDto,
    TriggerRuleModel,
    TriggerRuleRequestDto,
    TriggerRuleRequestModel,
    UpdateGroupRuleConditionRequestDto,
    UpdateGroupRuleConditionRequestModel,
} from 'types/rules';
import { transformAttributeResponseDtoToModel } from './attributes';

// export function transformSearchFilterModelRuleConditionDto(searchFilterModel: SearchFilterModel): RuleConditionGroupRequestDto {
//     return {
//         ...searchFilterModel,
//         condition: searchFilterModel.condition,
//         fieldIdentifier: searchFilterModel.fieldIdentifier,
//         fieldSource: searchFilterModel.fieldSource,
//         value: searchFilterModel.value,
//     };
// }

export function transformRuleActionRequestDtoToModel(ruleActionRequestDto: ActionRuleRequestDto): ActionRuleRequestModel {
    return { ...ruleActionRequestDto };
}

export function transformRuleActionRequestModelToDto(ruleActionRequestModel: ActionRuleRequestModel): ActionRuleRequestDto {
    return { ...ruleActionRequestModel };
}

export function tranformRuleActionGroupRequestModelToDto(actionGroup: ActionRuleGroupRequestModel): ActionRuleGroupRequestDto {
    return {
        ...actionGroup,
        actions: actionGroup.actions.map(transformRuleActionRequestModelToDto),
    };
}

export function transformDtoRuleToModel(rule: DtoRule): RuleModel {
    return {
        ...rule,
        attributes: rule.attributes.map(transformAttributeResponseDtoToModel),
    };
}

export function transformRuleActionGroupDtoToModel(actionGroup: ActionRuleGroupDto): ActionRuleGroupModel {
    return {
        ...actionGroup,
    };
}

export function transformConditionRuleGroupDtoToModel(conditionGroup: ConditionRuleGroupDto): ConditionRuleGroupModel {
    return {
        ...conditionGroup,
    };
}

export function transformTriggerRuleDtoToModel(ruleTrigger: TriggerRuleDto): TriggerRuleModel {
    return { ...ruleTrigger };
}

export function transformRuleActionDtoToModel(actionRule: ActionRuleDto): ActionRuleModel {
    return { ...actionRule };
}

export function transformRuleActionGroupDetailDtoToModel(actionGroupDetail: ActionRuleGroupDetailDto): ActionRuleGroupDetailModel {
    return {
        ...actionGroupDetail,
        actions: actionGroupDetail.actions.map(transformRuleActionDtoToModel),
    };
}

export function transformRuleConditionGroupDetailDtoToModel(conditionGroup: ConditionRuleGroupDetailDto): ConditionRuleGroupDetailModel {
    return {
        ...conditionGroup,
    };
}

export function transformConditionRuleDtoToModel(condition: ConditionRuleDto): ConditionRuleModel {
    return { ...condition };
}

export function transformDetailRuleDtoToModel(rule: DetailRuleDto): DetailRuleModel {
    return {
        ...rule,
        attributes: rule.attributes.map(transformAttributeResponseDtoToModel),
        conditions: rule.conditions.map(transformConditionRuleDtoToModel),
        conditionGroups: rule.conditionGroups.map(transformConditionRuleGroupDtoToModel),
    };
}

export function transformRuleConditiontModelToModelDto(conditionGroup: RuleConditiontModel): ConditionRuleRequestDto {
    return {
        ...conditionGroup,
    };
}

export function transformConditionRuleGroupRequestModelToDto(conditionGroup: ConditionRuleGroupRequestModel): ConditionRuleGroupRequestDto {
    return {
        ...conditionGroup,
        conditions: conditionGroup.conditions.map(transformRuleConditiontModelToModelDto),
    };
}

export function transformRuleRequestModelToDto(ruleRequest: RequestRuleModel): RequestRuleDto {
    return {
        ...ruleRequest,
        conditions: ruleRequest.conditions?.length ? ruleRequest.conditions.map(transformRuleConditiontModelToModelDto) : [],
        conditionGroups: ruleRequest.conditionGroups?.length
            ? ruleRequest.conditionGroups.map(transformConditionRuleGroupRequestModelToDto)
            : [],
    };
}

export function transformTriggerRuleRequestModelToDto(ruleTriggerRequest: TriggerRuleRequestModel): TriggerRuleRequestDto {
    return {
        ...ruleTriggerRequest,
        rules: ruleTriggerRequest.rules?.length ? ruleTriggerRequest.rules.map(transformRuleRequestModelToDto) : [],
        actionGroups: ruleTriggerRequest.actionGroups?.length
            ? ruleTriggerRequest.actionGroups.map(tranformRuleActionGroupRequestModelToDto)
            : [],
        actions: ruleTriggerRequest.actions?.length ? ruleTriggerRequest.actions.map(transformRuleActionRequestModelToDto) : [],
    };
}

export function transformTriggerRuleDetailDtoToModel(ruleTriggerDetail: TriggerRuleDetailDto): TriggerRuleDetailModel {
    return {
        ...ruleTriggerDetail,
        rules: ruleTriggerDetail.rules.map(transformDtoRuleToModel),
        actionGroups: ruleTriggerDetail.actionGroups.map(transformRuleActionGroupDtoToModel),
        actions: ruleTriggerDetail.actions.map(transformRuleActionDtoToModel),
    };
}

export function transformUpdateGroupRuleConditionRequestModelToDto(
    conditionGroup: UpdateGroupRuleConditionRequestModel,
): UpdateGroupRuleConditionRequestDto {
    return {
        ...conditionGroup,
        conditions: conditionGroup.conditions.map(transformRuleConditiontModelToModelDto),
    };
}

export function transformRuleUpdateRequestModelToDto(ruleUpdateRequest: RuleUpdateRequestModel): RuleUpdateRequestDto {
    return {
        ...ruleUpdateRequest,
        conditions: ruleUpdateRequest.conditions?.length ? ruleUpdateRequest.conditions.map(transformRuleConditiontModelToModelDto) : [],
        conditionGroups: ruleUpdateRequest.conditionGroups?.length
            ? ruleUpdateRequest.conditionGroups.map(transformConditionRuleGroupRequestModelToDto)
            : [],
    };
}

export function transformRuleTriggerUpdateRequestModelToDto(
    ruleTriggerUpdateRequest: RuleTriggerUpdateRequestModel,
): RuleTriggerUpdateRequestDto {
    return {
        ...ruleTriggerUpdateRequest,
        rules: ruleTriggerUpdateRequest.rules.map(transformRuleRequestModelToDto),
        actionGroups: ruleTriggerUpdateRequest.actionGroups.map(tranformRuleActionGroupRequestModelToDto),
        actions: ruleTriggerUpdateRequest.actions.map(transformRuleActionRequestModelToDto),
    };
}
