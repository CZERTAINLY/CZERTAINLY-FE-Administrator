import {
    ActionDetailDto,
    ActionDetailModel,
    ActionDto,
    ActionModel,
    ActionRequestDto,
    ActionRequestModel,
    ConditionDto,
    ConditionItemDto,
    ConditionItemModel,
    ConditionItemRequestDto,
    ConditionItemRequestModel,
    ConditionModel,
    ConditionRequestDto,
    ConditionRequestModel,
    ExecutionDto,
    ExecutionItemDto,
    ExecutionItemModel,
    ExecutionItemRequestDto,
    ExecutionItemRequestModel,
    ExecutionModel,
    ExecutionRequestDto,
    ExecutionRequestModel,
    RuleDetailDto,
    RuleDetailModel,
    RuleDto,
    RuleModel,
    RuleRequestDto,
    RuleRequestModel,
    TriggerDetailDto,
    TriggerDetailModel,
    TriggerDto,
    TriggerHistoryDto,
    TriggerHistoryModel,
    TriggerHistoryRecordDto,
    TriggerHistoryRecordModel,
    TriggerModel,
    TriggerRequestDto,
    TriggerRequestModel,
    UpdateActionRequestDto,
    UpdateActionRequestModel,
    UpdateConditionRequestDto,
    UpdateConditionRequestModel,
    UpdateExecutionRequestDto,
    UpdateExecutionRequestModel,
    UpdateRuleRequestDto,
    UpdateRuleRequestModel,
    UpdateTriggerRequestDto,
    UpdateTriggerRequestModel,
} from 'types/rules';

export function transformTriggerHistoryRecordDtoToModel(ruleTriggerHistory: TriggerHistoryRecordDto): TriggerHistoryRecordModel {
    return {
        ...ruleTriggerHistory,
    };
}

export function transformTriggerHistoryDtoToModel(ruleTriggerHistory: TriggerHistoryDto): TriggerHistoryModel {
    return {
        ...ruleTriggerHistory,
        records: ruleTriggerHistory?.records?.length ? ruleTriggerHistory.records.map(transformTriggerHistoryRecordDtoToModel) : [],
    };
}

export function transformExecutionItemRequestModelToDto(executionItemRequestModel: ExecutionItemRequestModel): ExecutionItemRequestDto {
    return {
        ...executionItemRequestModel,
    };
}
export function transformUpdateExecutionRequestModelToDto(
    updateExecutionRequestModel: UpdateExecutionRequestModel,
): UpdateExecutionRequestDto {
    return {
        ...updateExecutionRequestModel,
        items: updateExecutionRequestModel.items.map(transformExecutionItemRequestModelToDto),
    };
}

export function tranformExecutionRequestModelToDto(executionRequestModel: ExecutionRequestModel): ExecutionRequestDto {
    return {
        ...executionRequestModel,
        items: executionRequestModel.items.map(transformExecutionItemRequestModelToDto),
    };
}

export function transformExecutionItemDtoToModel(executionItemDto: ExecutionItemDto): ExecutionItemModel {
    return {
        ...executionItemDto,
    };
}

export function transformExecutionDtoToModel(executionDto: ExecutionDto): ExecutionModel {
    return {
        ...executionDto,
        items: executionDto.items.map(transformExecutionItemDtoToModel),
    };
}

export function transformTriggerDtoToModel(triggerDto: TriggerDto): TriggerModel {
    return { ...triggerDto };
}

export function transformRuleDtoToModel(ruleDto: RuleDto): RuleModel {
    return { ...ruleDto };
}

export function transformConditionItemDtoToModel(conditionItemDto: ConditionItemDto): ConditionItemModel {
    return {
        ...conditionItemDto,
    };
}

export function transformConditionDtoToModel(conditionDto: ConditionDto): ConditionModel {
    return {
        ...conditionDto,
        items: conditionDto.items.map(transformConditionItemDtoToModel),
    };
}

export function transformRuleDetailDtoToModel(ruleDetailDto: RuleDetailDto): RuleDetailModel {
    return {
        ...ruleDetailDto,
        conditions: ruleDetailDto.conditions.map(transformConditionDtoToModel),
    };
}

export function transformConditionItemModelDto(conditionItemModel: ConditionItemModel): ConditionItemDto {
    return {
        ...conditionItemModel,
    };
}

export function transformConditionItemRequestModelDto(conditionItemRequestModel: ConditionItemRequestModel): ConditionItemRequestDto {
    return {
        ...conditionItemRequestModel,
    };
}

export function transformConditionRequestModelToDto(conditionRequestModel: ConditionRequestModel): ConditionRequestDto {
    return {
        ...conditionRequestModel,
        items: conditionRequestModel.items.map(transformConditionItemRequestModelDto),
    };
}

export function transformRuleRequestModelToDto(ruleRequestModel: RuleRequestModel): RuleRequestDto {
    return {
        ...ruleRequestModel,
    };
}

export function transformTriggerRequestModelToDto(triggerRequestModel: TriggerRequestModel): TriggerRequestDto {
    return {
        ...triggerRequestModel,
    };
}

export function transformActionDtoToModel(actionDto: ActionDto): ActionModel {
    return {
        ...actionDto,
    };
}

export function transformTriggerDetailDtoToModel(triggerDetailDto: TriggerDetailDto): TriggerDetailModel {
    return {
        ...triggerDetailDto,
        rules: triggerDetailDto.rules.map(transformRuleDtoToModel),
        actions: triggerDetailDto.actions.map(transformActionDtoToModel),
    };
}

export function transformConditionItemRequestModelToDto(conditionItemRequestModel: ConditionItemRequestModel): ConditionItemRequestDto {
    return {
        ...conditionItemRequestModel,
    };
}

export function transformUpdateConditionRequestModelToDto(
    updateConditionRequestModel: UpdateConditionRequestModel,
): UpdateConditionRequestDto {
    return {
        ...updateConditionRequestModel,
        items: updateConditionRequestModel.items.map(transformConditionItemRequestModelToDto),
    };
}

export function transformUpdateTriggerRequestModelToDto(updateTriggerRequestModel: UpdateTriggerRequestModel): UpdateTriggerRequestDto {
    return {
        ...updateTriggerRequestModel,
    };
}

export function transformUpdateRuleRequestModelToDto(updateRuleRequestModel: UpdateRuleRequestModel): UpdateRuleRequestDto {
    return {
        ...updateRuleRequestModel,
    };
}

export function transformActionRequestModelToDto(actionRequestModel: ActionRequestModel): ActionRequestDto {
    return {
        ...actionRequestModel,
    };
}

export function transformActionDetailDtoToModel(actionDetailDto: ActionDetailDto): ActionDetailModel {
    return {
        ...actionDetailDto,
    };
}

export function transformUpdateActionRequestModelToDto(updateActionRequestModel: UpdateActionRequestModel): UpdateActionRequestDto {
    return {
        ...updateActionRequestModel,
    };
}
