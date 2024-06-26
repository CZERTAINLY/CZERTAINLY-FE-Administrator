import cx from 'classnames';
import { CustomNode } from 'components/FlowChart';
import style from 'components/FlowChart/CustomFlowNode/customFlowNode.module.scss';
import ProgressButton from 'components/ProgressButton';
import SwitchWidget from 'components/SwitchWidget';
import { actions as alertActions } from 'ducks/alerts';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions as rulesActions, selectors as rulesSelectors } from 'ducks/rules';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
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
    const executions = useSelector(rulesSelectors.executions);
    const conditions = useSelector(rulesSelectors.conditions);
    const { id } = useParams();

    const onUpdateActionsConfirmed = useCallback(
        (newValues: SelectChangeValue[]) => {
            if (!id || !triggerDetails) return;

            const newActionsUuids = newValues.map((newAction) => newAction.value);

            const previousAndNewActionsUuid = triggerDetails?.actions.map((action) => action.uuid);
            const allActionsUuids = [...(previousAndNewActionsUuid || []), ...newActionsUuids];
            dispatch(
                rulesActions.updateTrigger({
                    triggerUuid: id,
                    trigger: {
                        actionsUuids: allActionsUuids,
                        ignoreTrigger: false,
                        resource: triggerDetails.resource,
                        type: triggerDetails.type,
                        rulesUuids: triggerDetails?.rules.map((rule) => rule.uuid) || [],
                        eventResource: triggerDetails.eventResource,
                        description: triggerDetails.description || '',
                        event: (triggerDetails.event as unknown as UpdateTriggerRequestDtoEventEnum) || undefined,
                    },
                }),
            );
        },
        [dispatch, id, triggerDetails],
    );

    const onUpdateRulesConfirmed = useCallback(
        (newValues: SelectChangeValue[]) => {
            if (!id || !triggerDetails) return;

            const newRulesUuids = newValues.map((newRule) => newRule.value);

            const previousAndNewRulesUuid = triggerDetails?.rules.map((rule) => rule.uuid);
            const allRules = [...(previousAndNewRulesUuid || []), ...newRulesUuids];

            dispatch(
                rulesActions.updateTrigger({
                    triggerUuid: id,
                    trigger: {
                        rulesUuids: allRules,
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
        [dispatch, id, triggerDetails],
    );
    const rulesOptions = useMemo(() => {
        const filteredRules = rules?.filter((rule) => !triggerDetails?.rules.find((triggerRule) => triggerRule.uuid === rule.uuid));
        return filteredRules?.map((rule) => ({
            value: rule.uuid,
            label: rule.name,
        }));
    }, [rules, triggerDetails]);
    // log recieved executions and conditions

    const actionOptions = useMemo(() => {
        const filteredActions = actions?.filter(
            (action) => !triggerDetails?.actions.find((triggerAction) => triggerAction.uuid === action.uuid),
        );
        return filteredActions?.map((action) => ({
            value: action.uuid,
            label: action.name,
        }));
    }, [actions, triggerDetails]);

    // use rules and actions show for adding if not attached already to the trigger
    useEffect(() => {
        dispatch(rulesActions.listExecutions({ resource: triggerDetails?.resource }));
        dispatch(rulesActions.listConditions({ resource: triggerDetails?.resource }));
    }, [triggerDetails, dispatch]);

    // Step 1: Create a ref for the target element
    const addNewRuleDiv = useRef<HTMLDivElement>(null);

    // Step 2: Handle the onKeyDown event on the Select component
    const onRuleChange = () => {
        console.log('handle keydown');
        // Check for a specific key if needed, e.g., Enter
        // if (event.key === 'Enter') {
        // Step 3: Programmatically click and focus the element
        const labelElement = addNewRuleDiv.current;
        console.log('labelElement', labelElement);
        if (labelElement) {
            console.log('addLabel', labelElement);
            labelElement.click(); // Simulate a click event

            labelElement.focus(); // Set focus

            console.log('click and focus called');
            // }
        }
    };

    const renderAddButtonContent = useMemo(() => {
        return (
            <div className="w-100">
                <h6 className="text-muted">Update Trigger</h6>
                {/* <Form>
                    <Label> Add Rules</Label>
                    <Select placeholder="Add New Rule Rule" options={rulesOptions} isMulti />
                </Form> */}
                <div
                    className="w-100"
                    // style={{ background: 'red' }}
                    ref={addNewRuleDiv}
                    tabIndex={-1} // Make the div focusable
                >
                    <FormGroup>
                        <Label for="addnewRule">Add Rules</Label>

                        <div className="w-100">
                            <Select
                                className="nodrag"
                                placeholder="Add New Rule"
                                options={rulesOptions}
                                onChange={(event) => {
                                    setNewRules(event?.map((e) => e));
                                    onRuleChange();
                                }}
                                isMulti
                                value={newRules}
                                // onKeyDown={(e) => {
                                //     // e.nativeEvent.getelementById('addNewRuleLabel').focus();
                                //     handleKeyDown(e);

                                //     e.stopPropagation();
                                // }}
                                // onKeyDown={handleKeyDown}
                            />
                        </div>
                    </FormGroup>
                </div>

                <div className="w-100">
                    <FormGroup>
                        <Label for="raProfile">Add Actions</Label>

                        <div className="w-100">
                            <Select
                                className="nodrag"
                                placeholder="Add New Action"
                                options={actionOptions}
                                isMulti
                                value={newActions}
                                // onValueClick
                                onChange={(event) => {
                                    setNewActions(event?.map((e) => e));
                                    // event.stopPropagation();
                                    console.log('event', event);
                                }}
                            />
                        </div>
                    </FormGroup>
                </div>
                <div className="flex">
                    <ProgressButton
                        title={'Update'}
                        inProgress={isUpdatingTrigger}
                        onClick={() => {
                            console.log('newactions', newActions);
                            console.log('newRules', newRules);
                            // dispatch(rulesActions.updateTrigger)
                            // const newActionsUuids = newValues.map((newAction) => newAction.value);
                            // const previousAndNewActionsUuid = triggerDetails?.actions.map((action) => action.uuid);
                            // const allActionsUuids = [...(previousAndNewActionsUuid || []), ...newActionsUuids];
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
                                        ignoreTrigger: false,
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

    // list all available rules and executions

    const otherPropertiesCurrentCertificate: OtherProperties[] = [];

    // calculate the number of rules and actions that the trigger has push it as other properties

    // if (triggerDetails.rules.length) {
    //     triggerDetails.rules.forEach((rule) => {
    //         otherPropertiesCurrentCertificate.push({
    //             propertyName: 'Rule',
    //             propertyValue: rule.name,
    //             // propertyContent: rule.description,
    //         });
    //     });
    // }

    // if (triggerDetails?.description) {
    //     otherPropertiesCurrentCertificate.push({
    //         propertyName: 'Description',
    //         propertyValue: triggerDetails.description,
    //     });
    // }
    // if (triggerDetails?.ignoreTrigger) {
    otherPropertiesCurrentCertificate.push({
        // propertyName: 'Ignore Trigger',
        // propertyContent: <Container>,
        // propertyValue: triggerDetails.ignoreTrigger ? 'Yes' : 'No',
        // propertyContent: <div>hi</div>,
        propertyContent: (
            <div className={cx('d-flex align-items-center ')}>
                <h6 className={cx('m-0', style.entityLabel)}>Ignore Trigger :</h6>
                <div className="ms-1">
                    <SwitchWidget
                        checked={triggerDetails.ignoreTrigger}
                        onClick={() => {
                            if (triggerDetails?.ignoreTrigger) {
                                dispatch(alertActions.info('Please add actions from the actions node'));
                                // triggerHighlight();
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
        // entityLabel: getEnumLabel(resourceTypeEnum, Resource.Triggers),
    });

    if (triggerDetails?.eventResource) {
        otherPropertiesCurrentCertificate.push({
            propertyName: 'Event Resource',
            propertyValue: getEnumLabel(resourceTypeEnum, triggerDetails.eventResource),
            // entityLabel: getEnumLabel(resourceTypeEnum, Resource.Triggers),
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
        // width: defaultNodeWidth,
        // height: defaultNodeHeight,
        data: {
            customNodeCardTitle: triggerDetails.name,
            entityLabel: getEnumLabel(resourceTypeEnum, Resource.Triggers),
            icon: 'fa fa-rocket',
            isMainNode: true,
            // redirectUrl: triggerDetails.uuid ? `/triggers/detail/${triggerDetails.uuid}` : undefined,
            description: triggerDetails.description,
            expandedByDefault: false,
            // addButtonContent: () => {},
            addButtonContent: renderAddButtonContent,
            // certificateNodeStatus: triggerDetails.state,
            // certificateNodeValidationStatus: triggerDetails.validationStatus,
            // otherProperties: otherPropertiesCurrentCertificate,
            otherProperties: otherPropertiesCurrentCertificate,
        },
    });

    if (triggerDetails.rules.length) {
        // use above code for reference

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
                // width: nodeWidth,
                // // height: nodeHeight,
                data: {
                    customNodeCardTitle: `Rule ${index + 1}`,
                    // redirectUrl: rule?.uuid ? `/certificates/detail/${rule.uuid}` : undefined,
                    entityLabel: rule.name,
                    icon: 'fa fa-book',
                    group: 'rules',
                    deleteAction: () => {
                        // console.log('delete action');
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
                    // isMainNode: true,
                    // certificateNodeData: {
                    //     certificateNodeStatus: chain.state,
                    //     certificateNodeValidationStatus: chain.validationStatus,
                    // },
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
                // width: nodeWidth,
                // // height: nodeHeight,
                data: {
                    customNodeCardTitle: `Action ${index + 1}`,
                    // redirectUrl: rule?.uuid ? `/certificates/detail/${rule.uuid}` : undefined,
                    entityLabel: action.name,
                    // description: action.description,
                    icon: 'fa fa-bolt',
                    group: 'actions',
                    deleteAction: () => {
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
                    },
                    // isMainNode: true,
                    // certificateNodeData: {
                    //     certificateNodeStatus: chain.state,
                    //     certificateNodeValidationStatus: chain.validationStatus,
                    // },
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
        });
    }

    return { nodes, edges };
}
