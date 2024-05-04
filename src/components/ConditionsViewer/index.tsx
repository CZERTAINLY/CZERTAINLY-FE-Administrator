import { ApiClients } from 'api';
import ConditionsGroupsList from 'components/ConditionGroupsList';
import FilterWidget from 'components/FilterWidget';
import FilterWidgetRuleAction from 'components/FilterWidgetRuleAction';
import { EntityType, actions as filterActions } from 'ducks/filters';
import { actions as rulesActions, selectors as rulesSelectors } from 'ducks/rules';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Resource } from 'types/openapi';
import { conditionGroupToFilter, filterToConditionGroup } from 'utils/rules';
type FormType = 'rules' | 'conditionGroup' | 'actionGroup';

interface ConditionGroupFormFilterProps {
    resource: Resource;
    formType: FormType;
}

const ConditionsViewer = ({ resource, formType }: ConditionGroupFormFilterProps) => {
    const { id } = useParams();
    const editMode = useMemo(() => !!id, [id]);

    const conditionGroupsDetails = useSelector(rulesSelectors.conditionGroupDetails);
    const ruleDetails = useSelector(rulesSelectors.ruleDetails);
    const actionGroupDetails = useSelector(rulesSelectors.actionGroupDetails);

    const [hasEffectRun, setHasEffectRun] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(filterActions.setCurrentFilters({ currentFilters: [], entity: EntityType.CONDITIONS }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!id) return;
        if (formType === 'rules' && id !== ruleDetails?.uuid) {
            dispatch(rulesActions.getRule({ ruleUuid: id }));
        }
        if (formType === 'conditionGroup' && id !== conditionGroupsDetails?.uuid) {
            dispatch(rulesActions.getConditionGroup({ conditionGroupUuid: id }));
        }

        if (formType === 'actionGroup' && id !== actionGroupDetails?.uuid) {
            dispatch(rulesActions.getActionGroup({ actionGroupUuid: id }));
        }
    }, [id, dispatch, formType, ruleDetails?.uuid, conditionGroupsDetails?.uuid, actionGroupDetails?.uuid]);

    useEffect(() => {
        if (!hasEffectRun && editMode && id) {
            let currentConditions = [];

            if (formType === 'rules') {
                if (ruleDetails?.uuid !== id) return;
                currentConditions = ruleDetails?.conditions || [];
            } else {
                if (conditionGroupsDetails?.uuid !== id) return;
                currentConditions = conditionGroupsDetails?.conditions || [];
            }

            const currentFilters = conditionGroupToFilter(currentConditions);
            setHasEffectRun(true);
            dispatch(filterActions.setCurrentFilters({ currentFilters: currentFilters, entity: EntityType.CONDITIONS }));
        }
    }, [editMode, ruleDetails, conditionGroupsDetails, hasEffectRun, dispatch, formType, id]);

    useEffect(() => {
        return () => {
            dispatch(filterActions.setCurrentFilters({ currentFilters: [], entity: EntityType.CONDITIONS }));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderAppendContent = useMemo(() => {
        if (formType === 'rules' && ruleDetails?.conditionGroups && ruleDetails?.conditionGroups?.length > 0) {
            return <ConditionsGroupsList ruleConditions={ruleDetails?.conditionGroups} />;
        } else {
            return null;
        }
    }, [ruleDetails, formType]);

    const renderFilterWidgetForRules = useMemo(() => {
        if (formType !== 'rules' || !id || !ruleDetails) return null;

        return (
            <FilterWidget
                appendInWidgetContent={renderAppendContent}
                entity={EntityType.CONDITIONS}
                title={'Conditions'}
                getAvailableFiltersApi={(apiClients: ApiClients) =>
                    apiClients.resources.listResourceRuleFilterFields({
                        resource,
                    })
                }
                onFilterUpdate={(currentFilters) => {
                    const currentCondition = filterToConditionGroup(currentFilters);
                    dispatch(
                        rulesActions.updateRule({
                            ruleUuid: id,
                            rule: {
                                conditions: currentCondition,
                                conditionGroupsUuids: ruleDetails.conditionGroups.map((cg) => cg.uuid),
                            },
                        }),
                    );
                }}
            />
        );
    }, [resource, dispatch, formType, id, ruleDetails, renderAppendContent]);

    const renderFilterWidgetForConditionGroups = useMemo(() => {
        if (formType !== 'conditionGroup' || !id || !conditionGroupsDetails) return null;

        return (
            <div>
                <FilterWidget
                    entity={EntityType.CONDITIONS}
                    title={'Conditions'}
                    getAvailableFiltersApi={(apiClients: ApiClients) =>
                        apiClients.resources.listResourceRuleFilterFields({
                            resource,
                        })
                    }
                    onFilterUpdate={(currentFilters) => {
                        const currentCondition = filterToConditionGroup(currentFilters);
                        dispatch(
                            rulesActions.updateConditionGroup({
                                conditionGroupUuid: id,
                                conditionGroup: {
                                    conditions: currentCondition,
                                },
                            }),
                        );
                    }}
                />
            </div>
        );
    }, [resource, dispatch, formType, id, conditionGroupsDetails]);

    const renderFilterWidgetForActionGroup = useMemo(() => {
        if (formType !== 'actionGroup' || !id || !actionGroupDetails) return null;

        return (
            <div>
                <FilterWidgetRuleAction
                    entity={EntityType.ACTIONS}
                    title={'Actions'}
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
                />
            </div>
        );
    }, [resource, dispatch, formType, id, actionGroupDetails]);

    const renderWidgetConditionViewer = useMemo(() => {
        switch (formType) {
            case 'conditionGroup':
                return renderFilterWidgetForConditionGroups;
            case 'rules':
                return renderFilterWidgetForRules;

            case 'actionGroup':
                return renderFilterWidgetForActionGroup;
            default:
                return null;
        }
    }, [formType, renderFilterWidgetForConditionGroups, renderFilterWidgetForRules, renderFilterWidgetForActionGroup]);

    return <div>{renderWidgetConditionViewer}</div>;
};

export default ConditionsViewer;
