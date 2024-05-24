import { EntityType, actions as filterActions } from 'ducks/filters';
import { selectors as rulesSelectors } from 'ducks/rules';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Resource } from 'types/openapi';
type FormType = 'rules' | 'conditionGroup' | 'actionGroup' | 'trigger';

interface ConditionGroupFormFilterProps {
    resource: Resource;
    formType: FormType;
}

const ConditionsViewer = ({ resource, formType }: ConditionGroupFormFilterProps) => {
    const { id } = useParams();
    const editMode = useMemo(() => !!id, [id]);

    // const conditionGroupsDetails = useSelector(rulesSelectors.conditionGroupDetails);
    // const isFetchingConditionGroup = useSelector(rulesSelectors.isFetchingConditionGroup);
    // const isUpdatingConditionGroup = useSelector(rulesSelectors.isUpdatingConditionGroup);

    // const ruleDetails = useSelector(rulesSelectors.ruleDetails);
    // const isFetchingRuleDetail = useSelector(rulesSelectors.isFetchingRuleDetail);
    // const isUpdatingRule = useSelector(rulesSelectors.isUpdatingRule);

    // const actionGroupDetails = useSelector(rulesSelectors.actionGroupDetails);
    // const isFetchingActionGroup = useSelector(rulesSelectors.isFetchingActionGroup);
    // const isUpdatingActionGroup = useSelector(rulesSelectors.isUpdatingActionGroup);

    const trigerDetails = useSelector(rulesSelectors.triggerDetails);
    const isFetchingTriggerDetail = useSelector(rulesSelectors.isFetchingTriggerDetail);
    const isUpdatingTrigger = useSelector(rulesSelectors.isUpdatingTrigger);

    const [hasEffectRun, setHasEffectRun] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(filterActions.setCurrentFilters({ currentFilters: [], entity: EntityType.CONDITIONS }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // useEffect(() => {
    //     if (!id) return;
    //     if (formType === 'rules' && id !== ruleDetails?.uuid) {
    //         dispatch(rulesActions.getRule({ ruleUuid: id }));
    //     }
    //     if (formType === 'conditionGroup' && id !== conditionGroupsDetails?.uuid) {
    //         dispatch(rulesActions.getConditionGroup({ conditionGroupUuid: id }));
    //     }

    //     if (formType === 'actionGroup' && id !== actionGroupDetails?.uuid) {
    //         dispatch(rulesActions.getActionGroup({ actionGroupUuid: id }));
    //     }

    //     if (formType === 'trigger' && id !== trigerDetails?.uuid) {
    //         dispatch(rulesActions.getTrigger({ triggerUuid: id }));
    //     }
    // }, [id, dispatch, formType, ruleDetails?.uuid, conditionGroupsDetails?.uuid, actionGroupDetails?.uuid, trigerDetails?.uuid]);

    // useEffect(() => {
    //     if (!hasEffectRun && editMode && id) {
    //         let currentConditions = [];

    //         if (formType === 'rules') {
    //             if (ruleDetails?.uuid !== id) return;
    //             currentConditions = ruleDetails?.conditions || [];
    //         } else {
    //             if (conditionGroupsDetails?.uuid !== id) return;
    //             currentConditions = conditionGroupsDetails?.conditions || [];
    //         }

    //         const currentFilters = conditionGroupToFilter(currentConditions);
    //         setHasEffectRun(true);
    //         dispatch(filterActions.setCurrentFilters({ currentFilters: currentFilters, entity: EntityType.CONDITIONS }));
    //     }
    // }, [editMode, ruleDetails, conditionGroupsDetails, hasEffectRun, dispatch, formType, id]);

    useEffect(() => {
        return () => {
            dispatch(filterActions.setCurrentFilters({ currentFilters: [], entity: EntityType.CONDITIONS }));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // const renderAppendContent = useMemo(() => {
    //     if (formType === 'rules' && ruleDetails?.conditionGroups && ruleDetails?.conditionGroups?.length > 0) {
    //         if (isFetchingRuleDetail || isUpdatingRule) return <></>;
    //         return <ConditionsGroupsList ruleConditions={ruleDetails?.conditionGroups} />;
    //     }

    //     if (formType === 'trigger' && trigerDetails?.actionGroups && trigerDetails?.actionGroups?.length > 0) {
    //         if (isFetchingTriggerDetail || isUpdatingTrigger) return <></>;
    //         return <ConditionsGroupsList actionGroups={trigerDetails.actionGroups} />;
    //     } else {
    //         return <></>;
    //     }
    // }, [ruleDetails, formType, trigerDetails, isFetchingRuleDetail, isFetchingTriggerDetail, isUpdatingRule, isUpdatingTrigger]);

    // const renderFilterWidgetForRules = useMemo(() => {
    //     if (formType !== 'rules' || !id || !ruleDetails) return null;
    //     const disableBadgeRemove =
    //         (ruleDetails.conditions.length === 1 && ruleDetails.conditionGroups.length === 0) || isFetchingRuleDetail || isUpdatingRule;

    //     const isBusy = isFetchingRuleDetail || isUpdatingRule;

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
    //                 const currentCondition = filterToConditionGroup(currentFilters);
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
    // }, [resource, dispatch, formType, id, ruleDetails, renderAppendContent, isFetchingRuleDetail, isUpdatingRule]);

    // const renderFilterWidgetForConditionGroups = useMemo(() => {
    //     if (formType !== 'conditionGroup' || !id || !conditionGroupsDetails) return null;
    //     const disableBadgeRemove = conditionGroupsDetails.conditions.length === 1 || isFetchingConditionGroup || isUpdatingConditionGroup;
    //     const isBusy = isFetchingConditionGroup || isUpdatingConditionGroup;
    //     return (
    //         <div>
    //             <FilterWidget
    //                 busyBadges={isBusy}
    //                 entity={EntityType.CONDITIONS}
    //                 title={'Conditions'}
    //                 getAvailableFiltersApi={(apiClients: ApiClients) =>
    //                     apiClients.resources.listResourceRuleFilterFields({
    //                         resource,
    //                     })
    //                 }
    //                 disableBadgeRemove={disableBadgeRemove}
    //                 onFilterUpdate={(currentFilters) => {
    //                     const currentCondition = filterToConditionGroup(currentFilters);
    //                     dispatch(
    //                         rulesActions.updateConditionGroup({
    //                             conditionGroupUuid: id,
    //                             conditionGroup: {
    //                                 conditions: currentCondition,
    //                             },
    //                         }),
    //                     );
    //                 }}
    //             />
    //         </div>
    //     );
    // }, [resource, dispatch, formType, id, conditionGroupsDetails, isFetchingConditionGroup, isUpdatingConditionGroup]);

    // const renderFilterWidgetForActionGroup = useMemo(() => {
    //     if (formType !== 'actionGroup' || !id || !actionGroupDetails) return null;
    // const disableBadgeRemove = actionGroupDetails.actions.length === 1 || isFetchingActionGroup || isUpdatingActionGroup;

    // const isBusy = isFetchingActionGroup || isUpdatingActionGroup;
    // return (
    // <div>
    // {
    /* <FilterWidgetRuleAction
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
                    actionsList={actionGroupDetails.actions}
                    onActionsUpdate={(currentActions) => {
                        dispatch(
                            rulesActions.updateActionGroup({
                                actionGroupUuid: id,
                                actionGroup: {
                                    actions: currentActions,
                                },
                            }),
                        );
                    }}
                /> */
    // }
    // </div>
    //     );
    // }, [resource, dispatch, formType, id, actionGroupDetails, isFetchingActionGroup, isUpdatingActionGroup]);

    const renderFilterWidgetForTrigger = useMemo(() => {
        if (formType !== 'trigger' || !id || !trigerDetails) return null;
        const isActionOnlyOne = trigerDetails.actions.length === 1;
        // const isActionGroupEmpty = trigerDetails.actionGroups.length === 0;

        // const disableBadgeRemove = isActionOnlyOne && isActionGroupEmpty;
        const isBusy = isFetchingTriggerDetail || isUpdatingTrigger;

        return (
            <div>
                {/* <FilterWidgetRuleAction
                    includeIgnoreAction
                    entity={EntityType.ACTIONS}
                    title={'Actions'}
                    busyBadges={isBusy}
                    disableBadgeRemove={disableBadgeRemove}
                    appendInWidgetContent={renderAppendContent}
                    getAvailableFiltersApi={(apiClients: ApiClients) =>
                        apiClients.resources.listResourceRuleFilterFields({
                            resource,
                            settable: true,
                        })
                    }
                    ExecutionsList={trigerDetails.actions}
                    onActionsUpdate={(currentActions) => {
                        dispatch(
                            rulesActions.updateTrigger({
                                triggerUuid: id,
                                trigger: {
                                    actions: currentActions,
                                    description: trigerDetails.description,
                                    triggerType: trigerDetails.triggerType,
                                    rulesUuids: trigerDetails.rules.map((r) => r.uuid),
                                    actionGroupsUuids: trigerDetails.actionGroups.map((ag) => ag.uuid),
                                },
                            }),
                        );
                    }}
                /> */}
            </div>
        );
    }, [
        resource,
        dispatch,
        formType,
        id,
        trigerDetails,

        // renderAppendContent,

        isFetchingTriggerDetail,
        isUpdatingTrigger,
    ]);

    const renderWidgetConditionViewer = useMemo(() => {
        switch (formType) {
            // case 'conditionGroup':
            //     return renderFilterWidgetForConditionGroups;
            // case 'rules':
            //     return renderFilterWidgetForRules;

            // case 'actionGroup':
            //     return renderFilterWidgetForActionGroup;

            // case 'trigger':
            //     return renderFilterWidgetForTrigger;
            default:
                return null;
        }
    }, [
        formType,
        // renderFilterWidgetForConditionGroups,
        // renderFilterWidgetForRules,
        // renderFilterWidgetForActionGroup,
        renderFilterWidgetForTrigger,
    ]);

    return <div>{renderWidgetConditionViewer}</div>;
};

export default ConditionsViewer;
