import { ApiClients } from 'api';
import cx from 'classnames';
import FilterWidget from 'components/FilterWidget';
import FilterWidgetRuleAction from 'components/FilterWidgetRuleAction';
import { ActionGroupFormValues } from 'components/_pages/action-groups/form';
import { EntityType, actions as filterActions } from 'ducks/filters';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-final-form';
import { useDispatch } from 'react-redux';
import { Resource } from 'types/openapi';
import { filterToConditionGroup } from 'utils/rules';
import { ConditionGroupFormValues } from '../_pages/condition-groups/form';
import styles from './conditionGroupForm.module.scss';
type FormType = 'conditions' | 'actions';
interface ConditionGroupFormFilterProps {
    resource: Resource;
    formType: FormType;
    includeIgnoreAction?: boolean;
}

const ConditionFormFilter = ({ resource, formType, includeIgnoreAction }: ConditionGroupFormFilterProps) => {
    const form = useForm<ConditionGroupFormValues>();
    const actionGroupForm = useForm<ActionGroupFormValues>();

    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(filterActions.setCurrentFilters({ currentFilters: [], entity: EntityType.CONDITIONS }));
        };
    }, [dispatch]);
    const renderFilterWidget = useMemo(() => {
        return formType === 'actions' ? (
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
                    includeIgnoreAction={includeIgnoreAction}
                    onActionsUpdate={(currentActions) => {
                        // actionGroupForm.change('actions', currentActions);
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
    }, [resource, form, formType, actionGroupForm, includeIgnoreAction]);

    return (
        <>
            <div>{renderFilterWidget}</div>
        </>
    );
};

export default ConditionFormFilter;
