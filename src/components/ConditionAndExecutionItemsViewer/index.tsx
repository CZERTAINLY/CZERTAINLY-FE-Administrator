import { ApiClients } from 'api';
import FilterWidget from 'components/FilterWidget';
import FilterWidgetRuleAction from 'components/FilterWidgetRuleAction';
import { EntityType, actions as filterActions } from 'ducks/filters';
import { actions as rulesActions, selectors as rulesSelectors } from 'ducks/rules';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Resource } from 'types/openapi';
import { conditionGroupToFilter, filterToConditionItems } from 'utils/rules';
type FormType = 'condtionItems' | 'executionItems';

interface ConditionGroupFormFilterProps {
    resource: Resource;
    formType: FormType;
}

const ConditionAndExecutionItemsViewer = ({ resource, formType }: ConditionGroupFormFilterProps) => {
    const { id } = useParams();
    const editMode = useMemo(() => !!id, [id]);

    const conditionDetails = useSelector(rulesSelectors.conditionDetails);
    const isFetchingConditionDetails = useSelector(rulesSelectors.isFetchingConditionDetails);
    const isUpdatingCondition = useSelector(rulesSelectors.isUpdatingCondition);

    // const ruleDetails = useSelector(rulesSelectors.ruleDetails);
    // const isFetchingRuleDetails = useSelector(rulesSelectors.isFetchingRuleDetails);
    // const isUpdatingRule = useSelector(rulesSelectors.isUpdatingRule);

    const executionDetails = useSelector(rulesSelectors.executionDetails);
    const isFetchingExecutionDetails = useSelector(rulesSelectors.isFetchingExecutionDetails);
    const isUpdatingExecution = useSelector(rulesSelectors.isUpdatingExecution);

    // const trigerDetails = useSelector(rulesSelectors.triggerDetails);
    // const isFetchingTriggerDetail = useSelector(rulesSelectors.isFetchingTriggerDetail);
    // const isUpdatingTrigger = useSelector(rulesSelectors.isUpdatingTrigger);

    const [hasEffectRun, setHasEffectRun] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(filterActions.setCurrentFilters({ currentFilters: [], entity: EntityType.CONDITIONS }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!id) return;
        // if (formType === 'rules' && id !== ruleDetails?.uuid) {
        //     dispatch(rulesActions.getRule({ ruleUuid: id }));
        // }
        if (formType === 'condtionItems' && id !== conditionDetails?.uuid) {
            dispatch(rulesActions.getCondition({ conditionUuid: id }));
        }

        if (formType === 'executionItems' && id !== executionDetails?.uuid) {
            dispatch(rulesActions.getExecution({ executionUuid: id }));
        }

        // if (formType === 'actionGroup' && id !== actionGroupDetails?.uuid) {
        //     dispatch(rulesActions.getActionGroup({ actionGroupUuid: id }));
        // }

        // if (formType === 'trigger' && id !== trigerDetails?.uuid) {
        //     dispatch(rulesActions.getTrigger({ triggerUuid: id }));
        // }
    }, [
        id,
        dispatch,
        formType,
        conditionDetails?.uuid,
        executionDetails?.uuid,

        // ruleDetails?.uuid,

        //  actionGroupDetails?.uuid,
        //   trigerDetails?.uuid
    ]);

    useEffect(() => {
        if (!hasEffectRun && editMode && id) {
            // let currentConditions = [];

            // if (formType === 'rules') {
            //     if (ruleDetails?.uuid !== id) return;
            //     currentConditions = ruleDetails?.conditions || [];
            // } else {
            //     if (conditionGroupsDetails?.uuid !== id) return;
            //     currentConditions = conditionGroupsDetails?.conditions || [];
            // }
            if (formType == 'condtionItems') {
                if (conditionDetails?.uuid !== id) return;
                const currentConditions = conditionDetails?.items || [];

                const currentFilters = conditionGroupToFilter(currentConditions);
                setHasEffectRun(true);
                dispatch(filterActions.setCurrentFilters({ currentFilters: currentFilters, entity: EntityType.CONDITIONS }));
            }

            // else {
            //     if (executionDetails?.uuid !== id) return;
            //     currentConditions = executionDetails?.items || [];
            // }
        }
    }, [
        editMode,

        // ruleDetails,

        conditionDetails,

        hasEffectRun,
        dispatch,
        formType,
        id,
    ]);

    useEffect(() => {
        return () => {
            dispatch(filterActions.setCurrentFilters({ currentFilters: [], entity: EntityType.CONDITIONS }));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // const renderAppendContent = useMemo(() => {
    //     if (formType === 'rules' && ruleDetails?.conditionGroups && ruleDetails?.conditionGroups?.length > 0) {
    //         if (isFetchingRuleDetails || isUpdatingRule) return <></>;
    //         return <ConditionsGroupsList ruleConditions={ruleDetails?.conditionGroups} />;
    //     }

    //     if (formType === 'trigger' && trigerDetails?.actionGroups && trigerDetails?.actionGroups?.length > 0) {
    //         if (isFetchingTriggerDetail || isUpdatingTrigger) return <></>;
    //         return <ConditionsGroupsList actionGroups={trigerDetails.actionGroups} />;
    //     } else {
    //         return <></>;
    //     }
    // }, [ruleDetails, formType, trigerDetails, isFetchingRuleDetails, isFetchingTriggerDetail, isUpdatingRule, isUpdatingTrigger]);

    // const renderFilterWidgetForRules = useMemo(() => {
    //     if (formType !== 'rules' || !id || !ruleDetails) return null;
    //     const disableBadgeRemove =
    //         (ruleDetails.conditions.length === 1 && ruleDetails.conditionGroups.length === 0) || isFetchingRuleDetails || isUpdatingRule;

    //     const isBusy = isFetchingRuleDetails || isUpdatingRule;

    //     return (
    //         <FilterWidget
    //             appendInWidgetContent={renderAppendContent}
    //             entity={EntityType.CONDITIONS}
    //             title={'Conditions'}
    //             busyBadges={isBusy}
    //             getAvailableFiltersApi={(apiClients: ApiClients) =>
    //                 apiClients.resources.listResourceRuleFilterFields({
    //                     resource,
    //                 })
    //             }
    //             disableBadgeRemove={disableBadgeRemove}
    //             onFilterUpdate={(currentFilters) => {
    //                 const currentCondition = filterToConditionItems(currentFilters);
    //                 dispatch(
    //                     rulesActions.updateRule({
    //                         ruleUuid: id,
    //                         rule: {
    //                             conditions: currentCondition,
    //                             conditionGroupsUuids: ruleDetails.conditionGroups.map((cg) => cg.uuid),
    //                             description: ruleDetails.description || '',
    //                         },
    //                     }),
    //                 );
    //             }}
    //         />
    //     );
    // }, [resource, dispatch, formType, id, ruleDetails, renderAppendContent, isFetchingRuleDetails, isUpdatingRule]);

    const renderFilterWidgetForConditionItems = useMemo(() => {
        if (formType !== 'condtionItems' || !id || !conditionDetails) return null;
        const disableBadgeRemove = conditionDetails.items.length === 1 || isFetchingConditionDetails || isUpdatingCondition;
        const isBusy = isFetchingConditionDetails || isUpdatingCondition;
        return (
            <div>
                <FilterWidget
                    busyBadges={isBusy}
                    entity={EntityType.CONDITIONS}
                    title={'Conditions'}
                    getAvailableFiltersApi={(apiClients: ApiClients) =>
                        apiClients.resources.listResourceRuleFilterFields({
                            resource,
                        })
                    }
                    disableBadgeRemove={disableBadgeRemove}
                    onFilterUpdate={(currentFilters) => {
                        const currentCondition = filterToConditionItems(currentFilters);
                        dispatch(
                            rulesActions.updateCondition({
                                conditionUuid: id,
                                condition: {
                                    items: currentCondition,
                                    description: conditionDetails.description || '',
                                },
                            }),
                        );
                    }}
                />
            </div>
        );
    }, [resource, dispatch, formType, id, conditionDetails, isFetchingConditionDetails, isUpdatingCondition]);

    const renderFilterWidgetForExecutionItems = useMemo(() => {
        if (formType !== 'executionItems' || !id || !executionDetails) return null;
        const disableBadgeRemove = executionDetails.items.length === 1 || isFetchingExecutionDetails || isUpdatingExecution;

        const isBusy = isFetchingExecutionDetails || isUpdatingExecution;
        return (
            <div>
                {
                    <FilterWidgetRuleAction
                        entity={EntityType.ACTIONS}
                        title={'Actions'}
                        busyBadges={isBusy}
                        disableBadgeRemove={disableBadgeRemove}
                        getAvailableFiltersApi={(apiClients: ApiClients) =>
                            apiClients.resources.listResourceRuleFilterFields({
                                resource,
                                settable: true,
                            })
                        }
                        // actionsList={actionGroupDetails.actions}
                        ExecutionsList={executionDetails.items}
                        onActionsUpdate={(currentExecutionItems) => {
                            dispatch(
                                rulesActions.updateExecution({
                                    executionUuid: id,
                                    execution: {
                                        items: currentExecutionItems,
                                        description: executionDetails.description,
                                    },
                                }),
                            );
                        }}
                    />
                }
            </div>
        );
    }, [resource, dispatch, formType, id, executionDetails, isFetchingExecutionDetails, isUpdatingExecution]);

    // const renderFilterWidgetForTrigger = useMemo(() => {
    //     if (formType !== 'trigger' || !id || !trigerDetails) return null;
    //     const isActionOnlyOne = trigerDetails.actions.length === 1;
    //     // const isActionGroupEmpty = trigerDetails.actionGroups.length === 0;

    //     // const disableBadgeRemove = isActionOnlyOne && isActionGroupEmpty;
    //     const isBusy = isFetchingTriggerDetail || isUpdatingTrigger;

    //     return (
    //         <div>
    //             {/* <FilterWidgetRuleAction
    //                 includeIgnoreAction
    //                 entity={EntityType.ACTIONS}
    //                 title={'Actions'}
    //                 busyBadges={isBusy}
    //                 disableBadgeRemove={disableBadgeRemove}
    //                 appendInWidgetContent={renderAppendContent}
    //                 getAvailableFiltersApi={(apiClients: ApiClients) =>
    //                     apiClients.resources.listResourceRuleFilterFields({
    //                         resource,
    //                         settable: true,
    //                     })
    //                 }
    //                 ExecutionsList={trigerDetails.actions}
    //                 onActionsUpdate={(currentActions) => {
    //                     dispatch(
    //                         rulesActions.updateTrigger({
    //                             triggerUuid: id,
    //                             trigger: {
    //                                 actions: currentActions,
    //                                 description: trigerDetails.description,
    //                                 triggerType: trigerDetails.triggerType,
    //                                 rulesUuids: trigerDetails.rules.map((r) => r.uuid),
    //                                 actionGroupsUuids: trigerDetails.actionGroups.map((ag) => ag.uuid),
    //                             },
    //                         }),
    //                     );
    //                 }}
    //             /> */}
    //         </div>
    //     );
    // }, [
    //     resource,
    //     dispatch,
    //     formType,
    //     id,
    //     trigerDetails,

    //     // renderAppendContent,

    //     isFetchingTriggerDetail,
    //     isUpdatingTrigger,
    // ]);

    const renderWidgetConditionViewer = useMemo(() => {
        switch (formType) {
            case 'condtionItems':
                return renderFilterWidgetForConditionItems;
            // case 'rules':
            //     return renderFilterWidgetForRules;

            case 'executionItems':
                return renderFilterWidgetForExecutionItems;

            // case 'trigger':
            //     return renderFilterWidgetForTrigger;
            default:
                return null;
        }
    }, [
        formType,
        renderFilterWidgetForConditionItems,
        // renderFilterWidgetForRules,
        renderFilterWidgetForExecutionItems,
        // renderFilterWidgetForTrigger,
    ]);

    return <div>{renderWidgetConditionViewer}</div>;
};

export default ConditionAndExecutionItemsViewer;
