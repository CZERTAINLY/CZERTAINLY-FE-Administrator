import { ApiClients } from 'api';
import cx from 'classnames';
import ConditionsItemsList from 'components/ExecutionConditionItemsList/ConditionsItemsList';
import ExecutionsItemsList from 'components/ExecutionConditionItemsList/ExecutionsItemsList';
import { CustomNode } from 'components/FlowChart';
import style from 'components/FlowChart/CustomFlowNode/customFlowNode.module.scss';
import ProgressButton from 'components/ProgressButton';
import SwitchWidget from 'components/SwitchWidget';
import { actions as alertActions } from 'ducks/alerts';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { EntityType, actions as filterActions } from 'ducks/filters';
import { actions as rulesActions, selectors as rulesSelectors } from 'ducks/rules';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Edge, MarkerType } from 'reactflow';
import { FormGroup, Label } from 'reactstrap';
import { OtherProperties } from 'types/flowchart';
import { PlatformEnum, Resource, UpdateTriggerRequestDtoEventEnum } from 'types/openapi';
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
    TriggerHistoryObjectSummaryDto,
    TriggerHistoryObjectSummaryModel,
    TriggerHistoryObjectTriggerSummaryDto,
    TriggerHistoryObjectTriggerSummaryModel,
    TriggerHistoryRecordDto,
    TriggerHistoryRecordModel,
    TriggerHistorySummaryDto,
    TriggerHistorySummaryModel,
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
        conditions: ruleDetailDto.conditions?.map(transformConditionDtoToModel),
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
        rules: triggerDetailDto.rules.map(transformRuleDetailDtoToModel),
        actions: triggerDetailDto.actions.map(transformActionDetailDtoToModel),
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

export function transformTriggerHistoryObjectTriggerSummaryDtoToModel(
    triggerHistoryObjectTriggerSummaryDto: TriggerHistoryObjectTriggerSummaryDto,
): TriggerHistoryObjectTriggerSummaryModel {
    return {
        ...triggerHistoryObjectTriggerSummaryDto,
        records: triggerHistoryObjectTriggerSummaryDto.records.map(transformTriggerHistoryRecordDtoToModel),
    };
}

export function transformTriggerHistoryObjectSummaryDtoToModel(
    triggerHistoryObjectSummaryDto: TriggerHistoryObjectSummaryDto,
): TriggerHistoryObjectSummaryModel {
    return {
        ...triggerHistoryObjectSummaryDto,
        triggers: triggerHistoryObjectSummaryDto.triggers.map(transformTriggerHistoryObjectTriggerSummaryDtoToModel),
    };
}

export function transformTriggerHistorySummaryDtoToModel(triggerHistorySummaryDto: TriggerHistorySummaryDto): TriggerHistorySummaryModel {
    return {
        ...triggerHistorySummaryDto,
        objects: triggerHistorySummaryDto.objects.map(transformTriggerHistoryObjectSummaryDtoToModel),
    };
}

interface SelectChangeValue {
    value: string;
    label: string;
}

export function useTransformTriggerObjectToNodesAndEdges(
    triggerDetails?: TriggerDetailModel,
    rules?: RuleModel[],
    actions?: ActionModel[],
): { nodes: CustomNode[]; edges: Edge[] } {
    const nodes: CustomNode[] = [];
    const edges: Edge[] = [];
    const [newActions, setNewActions] = useState<SelectChangeValue[]>([]);
    const [newRules, setNewRules] = useState<SelectChangeValue[]>([]);
    const resourceTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const eventNameEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ResourceEvent));
    const triggerTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.TriggerType));
    const dispatch = useDispatch();
    const isUpdatingTrigger = useSelector(rulesSelectors.isUpdatingTrigger);
    // const flowChartNodesState = useSelector(userInterfaceSelectors.flowChartNodes);
    const rulesOptions = useMemo(() => {
        const filteredRules = rules?.filter((rule) => !triggerDetails?.rules.find((triggerRule) => triggerRule.uuid === rule.uuid));
        return filteredRules?.map((rule) => ({
            value: rule.uuid,
            label: rule.name,
        }));
    }, [rules, triggerDetails]);

    const actionOptions = useMemo(() => {
        const filteredActions = actions?.filter(
            (action) => !triggerDetails?.actions.find((triggerAction) => triggerAction.uuid === action.uuid),
        );
        return filteredActions?.map((action) => ({
            value: action.uuid,
            label: action.name,
        }));
    }, [actions, triggerDetails]);

    useEffect(() => {
        dispatch(rulesActions.listExecutions({ resource: triggerDetails?.resource }));
        dispatch(rulesActions.listConditions({ resource: triggerDetails?.resource }));
    }, [triggerDetails, dispatch]);

    const renderAddButtonContent = useMemo(() => {
        return (
            <div className="w-100">
                <h6 className="text-muted">Update Trigger</h6>
                <div className="w-100" tabIndex={-1}>
                    <FormGroup>
                        <Label for="addnewRuleSelect">Add Rules</Label>

                        <div className="w-100">
                            <Select
                                inputId="addnewRuleSelect"
                                className="nodrag"
                                placeholder="Add New Rule"
                                options={rulesOptions}
                                onChange={(event) => {
                                    setNewRules(event?.map((e) => e));
                                }}
                                isMulti
                                value={newRules}
                            />
                        </div>
                    </FormGroup>
                </div>

                <div className="w-100">
                    <FormGroup>
                        <Label for="raProfileSelect">Add Actions</Label>

                        <div className="w-100">
                            <Select
                                inputId="raProfileSelect"
                                className="nodrag"
                                placeholder="Add New Action"
                                options={actionOptions}
                                isMulti
                                value={newActions}
                                onChange={(event) => {
                                    setNewActions(event?.map((e) => e));
                                }}
                            />
                        </div>
                    </FormGroup>
                </div>
                <div className="flex">
                    <ProgressButton
                        title="Update"
                        inProgress={isUpdatingTrigger}
                        disabled={isUpdatingTrigger || (!newActions.length && !newRules.length)}
                        onClick={() => {
                            if (!triggerDetails) return;
                            const newActionsUuids = newActions.map((newAction) => newAction.value);
                            const newRulesUuids = newRules.map((newRule) => newRule.value);

                            const previousAndNewActionsUuid = triggerDetails?.actions.map((action) => action.uuid);
                            const previousAndNewRulesUuid = triggerDetails?.rules.map((rule) => rule.uuid);

                            const allActionsUuids = [...(previousAndNewActionsUuid || []), ...newActionsUuids];
                            const allRulesUuids = [...(previousAndNewRulesUuid || []), ...newRulesUuids];

                            dispatch(
                                rulesActions.updateTrigger({
                                    triggerUuid: triggerDetails?.uuid,
                                    trigger: {
                                        actionsUuids: allActionsUuids,
                                        rulesUuids: allRulesUuids,
                                        ignoreTrigger: allActionsUuids.length === 0 ? true : false,
                                        resource: triggerDetails.resource,
                                        type: triggerDetails.type,
                                        eventResource: triggerDetails.eventResource,
                                        description: triggerDetails.description || '',
                                        event: (triggerDetails.event as unknown as UpdateTriggerRequestDtoEventEnum) || undefined,
                                    },
                                }),
                            );
                            setNewActions([]);
                            setNewRules([]);
                        }}
                    />
                </div>
            </div>
        );
    }, [rulesOptions, actionOptions, isUpdatingTrigger, newActions, newRules, triggerDetails, dispatch]);

    if (!triggerDetails) {
        return { nodes, edges };
    }

    const otherPropertiesCurrentCertificate: OtherProperties[] = [];

    otherPropertiesCurrentCertificate.push({
        propertyContent: (
            <div className={cx('d-flex align-items-center ')}>
                <h6 className={cx('m-0', style.entityLabel)}>Ignore Trigger :</h6>
                <div className="ms-1">
                    <SwitchWidget
                        checked={triggerDetails.ignoreTrigger}
                        onClick={() => {
                            if (triggerDetails?.ignoreTrigger) {
                                dispatch(alertActions.info('Please add actions from the Add Actions dropdown'));
                            } else {
                                dispatch(
                                    rulesActions.updateTrigger({
                                        triggerUuid: triggerDetails.uuid,
                                        trigger: {
                                            ignoreTrigger: true,
                                            description: triggerDetails.description || '',
                                            rulesUuids: triggerDetails?.rules.map((rule) => rule.uuid) || [],
                                            resource: triggerDetails.resource,
                                            type: triggerDetails.type,
                                            actionsUuids: [],
                                            eventResource: triggerDetails.eventResource,
                                            event: (triggerDetails.event as unknown as UpdateTriggerRequestDtoEventEnum) || undefined,
                                        },
                                    }),
                                );
                            }
                        }}
                    />
                </div>
            </div>
        ),
    });
    // }

    otherPropertiesCurrentCertificate.push({
        propertyName: 'Resource',
        propertyValue: getEnumLabel(resourceTypeEnum, triggerDetails.resource),
    });

    if (triggerDetails?.eventResource) {
        otherPropertiesCurrentCertificate.push({
            propertyName: 'Event Resource',
            propertyValue: getEnumLabel(resourceTypeEnum, triggerDetails.eventResource),
        });
    }

    otherPropertiesCurrentCertificate.push({
        propertyName: 'Type',
        propertyValue: getEnumLabel(triggerTypeEnum, triggerDetails.type),
    });

    if (triggerDetails?.event) {
        otherPropertiesCurrentCertificate.push({
            propertyName: 'Event',
            propertyValue: getEnumLabel(eventNameEnum, triggerDetails.event),
        });
    }

    nodes.push({
        id: '1',
        type: 'customFlowNode',
        position: { x: 0, y: 0 },
        data: {
            customNodeCardTitle: triggerDetails.name,
            entityLabel: getEnumLabel(resourceTypeEnum, Resource.Triggers),
            icon: 'fa fa-rocket',
            isMainNode: true,
            description: triggerDetails.description,
            expandedByDefault: false,
            addButtonContent: renderAddButtonContent,
            otherProperties: otherPropertiesCurrentCertificate,
        },
    });

    if (triggerDetails.rules.length) {
        triggerDetails.rules.forEach((rule, index) => {
            const otherProperties: OtherProperties[] = [
                {
                    propertyName: 'Rule Name',
                    propertyValue: rule.name,
                    copyable: true,
                },
                {
                    propertyName: 'Rule Description',
                    propertyValue: rule.description,
                    // copyable: true,
                },
            ];

            nodes.push({
                id: `rule-${rule.uuid}`,
                type: 'customFlowNode',
                position: { x: 0, y: 0 },
                data: {
                    customNodeCardTitle: `Rule ${index + 1}`,
                    entityLabel: rule.name,
                    redirectUrl: `../rules/detail/${rule.uuid}`,
                    icon: 'fa fa-book',
                    group: 'rules',
                    deleteAction: {
                        action: () => {
                            dispatch(
                                rulesActions.updateTrigger({
                                    triggerUuid: triggerDetails.uuid,
                                    trigger: {
                                        rulesUuids: triggerDetails.rules.filter((r) => r.uuid !== rule.uuid).map((r) => r.uuid),
                                        ignoreTrigger: triggerDetails.ignoreTrigger,
                                        resource: triggerDetails.resource,
                                        type: triggerDetails.type,
                                        actionsUuids: triggerDetails?.actions.map((action) => action.uuid) || [],
                                        eventResource: triggerDetails.eventResource,
                                        description: triggerDetails.description || '',
                                        event: (triggerDetails.event as unknown as UpdateTriggerRequestDtoEventEnum) || undefined,
                                    },
                                }),
                            );
                        },
                    },
                    otherProperties: otherProperties,
                },
            });

            edges.push({
                id: `e1-rule-${rule.uuid}`,
                source: `rule-${rule.uuid}`,
                target: '1',
                type: 'floating',
                markerEnd: { type: MarkerType.Arrow },
            });

            if (rule.conditions.length) {
                rule.conditions.forEach((condition, index) => {
                    nodes.push({
                        id: `condition-${condition.uuid}-rule-${rule.uuid}`,
                        type: 'customFlowNode',
                        hidden: true,
                        parentId: `rule-${rule.uuid}`,
                        position: { x: 0, y: 0 },
                        data: {
                            redirectUrl: `/conditions/detail/${condition.uuid}`,
                            customNodeCardTitle: `Condition ${index + 1}`,
                            entityLabel: condition.name,
                            icon: 'fa fa-filter',
                            description: condition.description,
                            deleteAction: {
                                disableCondition: 'SingleChild',
                                disabledMessage: 'The rule must have at least one condition',
                                action: () => {
                                    dispatch(
                                        rulesActions.updateRule({
                                            ruleUuid: rule.uuid,
                                            noRedirect: true,
                                            rule: {
                                                description: rule.description,
                                                conditionsUuids: rule.conditions
                                                    .filter((c) => c.uuid !== condition.uuid)
                                                    .map((c) => c.uuid),
                                            },
                                        }),
                                    );
                                    dispatch(
                                        rulesActions.getTrigger({
                                            triggerUuid: triggerDetails.uuid,
                                        }),
                                    );
                                },
                            },
                            expandAction: () => {
                                dispatch(
                                    filterActions.getAvailableFilters({
                                        entity: EntityType.CONDITIONS,
                                        getAvailableFiltersApi: (apiClients: ApiClients) => {
                                            return apiClients.resources.listResourceRuleFilterFields({
                                                resource: triggerDetails.resource,
                                            });
                                        },
                                    }),
                                );
                            },
                            otherProperties: [
                                {
                                    propertyName: 'Condition Name',
                                    propertyValue: condition.name,
                                    copyable: true,
                                },
                                {
                                    propertyName: 'Condition Description',
                                    propertyValue: condition.description,
                                },
                                {
                                    propertyName: 'Condition Items',
                                    propertyContent: (
                                        <ConditionsItemsList
                                            conditionName={condition.name}
                                            conditionUuid={condition.uuid}
                                            conditionItems={condition.items}
                                            key={condition.uuid}
                                            smallerBadges
                                        />
                                    ),
                                },
                            ],
                        },
                    });

                    edges.push({
                        id: `e1-condition-${condition.uuid}-rule-${rule.uuid}`,
                        source: `condition-${condition.uuid}-rule-${rule.uuid}`,
                        target: `rule-${rule.uuid}`,
                        type: 'floating',
                        markerEnd: { type: MarkerType.Arrow },
                    });
                });
            }
        });
    }

    if (triggerDetails.actions.length) {
        triggerDetails.actions.forEach((action, index) => {
            const otherProperties: OtherProperties[] = [
                {
                    propertyName: 'Action Name',
                    propertyValue: action.name,
                    copyable: true,
                },
                {
                    propertyName: 'Action Description',
                    propertyValue: action.description,
                    // copyable: true,
                },
            ];

            nodes.push({
                id: `action-${action.uuid}`,
                type: 'customFlowNode',
                position: { x: 0, y: 0 },
                data: {
                    customNodeCardTitle: `Action ${index + 1}`,
                    entityLabel: action.name,
                    redirectUrl: `../actions/detail/${action.uuid}`,
                    icon: 'fa fa-bolt',
                    group: 'actions',

                    deleteAction: {
                        disabledMessage: 'The Trigger must have at least one action if it is not ignored',
                        action: () => {
                            dispatch(
                                rulesActions.updateTrigger({
                                    triggerUuid: triggerDetails.uuid,
                                    trigger: {
                                        actionsUuids: triggerDetails.actions.filter((a) => a.uuid !== action.uuid).map((a) => a.uuid),
                                        ignoreTrigger: triggerDetails.ignoreTrigger,
                                        resource: triggerDetails.resource,
                                        type: triggerDetails.type,
                                        rulesUuids: triggerDetails?.rules.map((rule) => rule.uuid) || [],
                                        eventResource: triggerDetails.eventResource,
                                        description: triggerDetails.description || '',
                                        event: (triggerDetails.event as unknown as UpdateTriggerRequestDtoEventEnum) || undefined,
                                    },
                                }),
                            );
                            dispatch(
                                rulesActions.getTrigger({
                                    triggerUuid: triggerDetails.uuid,
                                }),
                            );
                        },
                    },
                    otherProperties: otherProperties,
                },
            });

            edges.push({
                id: `e1-action-${action.uuid}`,
                source: `action-${action.uuid}`,
                target: '1',
                type: 'floating',
                markerEnd: { type: MarkerType.Arrow },
            });

            if (action.executions.length) {
                action.executions.forEach((execution, index) => {
                    nodes.push({
                        id: `execution-${execution.uuid}-action-${action.uuid}`,
                        type: 'customFlowNode',
                        hidden: true,
                        parentId: `action-${action.uuid}`,
                        position: { x: 0, y: 0 },
                        data: {
                            customNodeCardTitle: `Execution ${index + 1}`,
                            redirectUrl: `/executions/detail/${execution.uuid}`,
                            entityLabel: execution.name,
                            icon: 'fa fa-cogs',
                            description: execution.description,
                            expandAction: () => {
                                dispatch(
                                    filterActions.getAvailableFilters({
                                        entity: EntityType.ACTIONS,
                                        getAvailableFiltersApi: (apiClients: ApiClients) => {
                                            return apiClients.resources.listResourceRuleFilterFields({
                                                resource: triggerDetails.resource,
                                                settable: true,
                                            });
                                        },
                                    }),
                                );
                            },
                            deleteAction: {
                                disableCondition: 'SingleChild',
                                disabledMessage: 'The action must have at least one execution',
                                action: () => {
                                    dispatch(
                                        rulesActions.updateAction({
                                            actionUuid: action.uuid,
                                            noRedirect: true,
                                            action: {
                                                description: action.description,
                                                executionsUuids: action.executions
                                                    .filter((e) => e.uuid !== execution.uuid)
                                                    .map((e) => e.uuid),
                                            },
                                        }),
                                    );
                                    dispatch(
                                        rulesActions.getTrigger({
                                            triggerUuid: triggerDetails.uuid,
                                        }),
                                    );
                                },
                            },
                            otherProperties: [
                                {
                                    propertyName: 'Execution Name',
                                    propertyValue: execution.name,
                                    copyable: true,
                                },
                                {
                                    propertyName: 'Execution Description',
                                    propertyValue: execution.description,
                                    // copyable: true,
                                },
                                {
                                    propertyName: 'Execution Items',
                                    propertyContent: (
                                        <ExecutionsItemsList
                                            executionItems={execution.items}
                                            key={execution.uuid}
                                            executionName={execution.name}
                                            executionUuid={execution.uuid}
                                            smallerBadges
                                        />
                                    ),
                                },
                            ],
                        },
                    });

                    edges.push({
                        id: `e1-execution-${execution.uuid}-action-${action.uuid}`,
                        source: `execution-${execution.uuid}-action-${action.uuid}`,
                        target: `action-${action.uuid}`,
                        type: 'floating',
                        markerEnd: { type: MarkerType.Arrow },
                    });
                });
            }
        });
    }

    return { nodes, edges };
}
