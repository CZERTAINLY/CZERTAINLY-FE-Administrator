import { ApiClients } from 'api';
import FilterWidget from 'components/FilterWidget';
import { EntityType, actions as filterActions } from 'ducks/filters';
import { actions as rulesActions, selectors as rulesSelectors } from 'ducks/rules';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Resource } from 'types/openapi';
import { conditionGroupToFilter, filterToConditionGroup } from 'utils/rules';
type FormType = 'rules' | 'conditionGroup';

interface ConditionGroupFormFilterProps {
    resource: Resource;
    formType: FormType;
}

const ConditionsViewer = ({ resource, formType }: ConditionGroupFormFilterProps) => {
    const { id } = useParams();
    const editMode = useMemo(() => !!id, [id]);
    const [hasEffectRun, setHasEffectRun] = useState(false);

    const conditionGroupsDetails = useSelector(rulesSelectors.conditionGroupDetails);
    const ruleDetails = useSelector(rulesSelectors.ruleDetails);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!id) return;
        if (formType === 'rules') {
            dispatch(rulesActions.getRule({ ruleUuid: id }));
        } else {
            dispatch(rulesActions.getConditionGroup({ conditionGroupUuid: id }));
        }
    }, [id, dispatch, formType]);

    useEffect(() => {
        if (!hasEffectRun && editMode) {
            let currentConditions = [];

            if (formType === 'rules') {
                if (!ruleDetails) return;
                currentConditions = ruleDetails?.conditions || [];
            } else {
                if (!conditionGroupsDetails) return;
                currentConditions = conditionGroupsDetails?.conditions || [];
            }

            const currentFilters = conditionGroupToFilter(currentConditions);
            setHasEffectRun(true);
            dispatch(filterActions.setCurrentFilters({ currentFilters: currentFilters, entity: EntityType.CONDITIONS }));
        }
    }, [editMode, ruleDetails, conditionGroupsDetails, hasEffectRun, dispatch, formType]);

    useEffect(() => {
        return () => {
            dispatch(filterActions.setCurrentFilters({ currentFilters: [], entity: EntityType.CONDITIONS }));
        };
    }, [dispatch]);

    const renderFilterWidgetForRules = useMemo(() => {
        if (formType !== 'rules' || !id || !ruleDetails) return null;

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
            </div>
        );
    }, [resource, dispatch, formType, id, ruleDetails]);

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

    const renderWidgetConditionViewer = useCallback(() => {
        switch (formType) {
            case 'conditionGroup':
                return renderFilterWidgetForConditionGroups;
            case 'rules':
                return renderFilterWidgetForRules;
            default:
                return null;
        }
    }, [formType, renderFilterWidgetForConditionGroups, renderFilterWidgetForRules]);

    return <div>{renderWidgetConditionViewer()}</div>;
};

export default ConditionsViewer;
