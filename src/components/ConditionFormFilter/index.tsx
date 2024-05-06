import { ApiClients } from 'api';
import cx from 'classnames';
import FilterWidget from 'components/FilterWidget';
import FilterWidgetRuleAction from 'components/FilterWidgetRuleAction';
import { ActionGroupFormValues } from 'components/_pages/action-groups/form';
import { EntityType, actions as filterActions } from 'ducks/filters';
import { actions as rulesActions, selectors as rulesSelectors } from 'ducks/rules';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Resource } from 'types/openapi';
import { conditionGroupToFilter, filterToConditionGroup } from 'utils/rules';
import { ConditionGroupFormValues } from '../_pages/condition-groups/form';
import styles from './conditionGroupForm.module.scss';
type FormType = 'rules' | 'conditionGroup' | 'actionGroup';
interface ConditionGroupFormFilterProps {
    resource: Resource;
    formType: FormType;
}

const ConditionFormFilter = ({ resource, formType }: ConditionGroupFormFilterProps) => {
    const { id } = useParams();
    const editMode = useMemo(() => !!id, [id]);
    const [hasEffectRun, setHasEffectRun] = useState(false);

    const form = useForm<ConditionGroupFormValues>();
    const actionGroupForm = useForm<ActionGroupFormValues>();
    const conditionGroupsDetails = useSelector(rulesSelectors.conditionGroupDetails);
    const ruleDetails = useSelector(rulesSelectors.ruleDetails);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!id) return;
        if (formType === 'rules') {
            dispatch(rulesActions.getRule({ ruleUuid: id }));
        }

        if (formType === 'conditionGroup') {
            dispatch(rulesActions.getConditionGroup({ conditionGroupUuid: id }));
        }

        if (formType === 'actionGroup') {
            dispatch(rulesActions.getActionGroup({ actionGroupUuid: id }));
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
    }, [editMode, formType, ruleDetails, conditionGroupsDetails, hasEffectRun, dispatch]);

    useEffect(() => {
        return () => {
            dispatch(filterActions.setCurrentFilters({ currentFilters: [], entity: EntityType.CONDITIONS }));
        };
    }, [dispatch]);
    const renderFilterWidget = useMemo(() => {
        return formType === 'actionGroup' ? (
            <div className={cx({ [styles.disabled]: resource === Resource.None })}>
                <FilterWidgetRuleAction
                    entity={EntityType.ACTIONS}
                    title={'Actions'}
                    getAvailableFiltersApi={(apiClients: ApiClients) =>
                        apiClients.resources.listResourceRuleFilterFields({
                            resource,
                            settable: true,
                        })
                    }
                    onActionsUpdate={(currentActions) => {
                        actionGroupForm.change('actions', currentActions);
                    }}
                />
            </div>
        ) : (
            <div className={cx({ [styles.disabled]: resource === Resource.None })}>
                <FilterWidget
                    entity={EntityType.CONDITIONS}
                    title={'Conditions'}
                    getAvailableFiltersApi={(apiClients: ApiClients) =>
                        apiClients.resources.listResourceRuleFilterFields({
                            resource,
                        })
                    }
                    onFilterUpdate={(currentFilters) => {
                        const currentConditionGroups = filterToConditionGroup(currentFilters);
                        form.change('conditions', currentConditionGroups);
                    }}
                />
            </div>
        );
    }, [resource, form, formType, actionGroupForm]);

    return (
        <>
            <div>{renderFilterWidget}</div>
        </>
    );
};

export default ConditionFormFilter;
