import { ApiClients } from '../../api';
import cn from 'classnames';
import FilterWidget from 'components/FilterWidget';
import FilterWidgetRuleAction from 'components/FilterWidgetRuleAction';
import { ExecutionFormValues } from 'components/_pages/executions/form';
import { EntityType, actions as filterActions } from 'ducks/filters';
import { useCallback, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Resource } from 'types/openapi';
import { filterToConditionItems } from 'utils/rules';
import { ConditionFormValues } from '../_pages/conditions/form';
type FormType = 'conditionItem' | 'executionItem';
interface ConditionGroupFormFilterProps {
    resource: Resource;
    formType: FormType;
    includeIgnoreAction?: boolean;
}

const ConditionFormFilter = ({ resource, formType, includeIgnoreAction }: ConditionGroupFormFilterProps) => {
    const form = useFormContext<ConditionFormValues>();
    const actionGroupForm = useFormContext<ExecutionFormValues>();

    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(filterActions.setCurrentFilters({ currentFilters: [], entity: EntityType.CONDITIONS }));
        };
    }, [dispatch]);

    const getAvailableFiltersApi = useCallback(
        (apiClients: ApiClients) =>
            apiClients.resources.listResourceRuleFilterFields({
                resource,
                ...(formType === 'executionItem' ? { settable: true } : {}),
            }),
        [resource, formType],
    );

    const renderFilterWidget = useMemo(() => {
        return formType === 'executionItem' ? (
            <div>
                <FilterWidgetRuleAction
                    entity={EntityType.ACTIONS}
                    title="Execution Items"
                    getAvailableFiltersApi={getAvailableFiltersApi}
                    includeIgnoreAction={includeIgnoreAction}
                    onActionsUpdate={(currentActions) => {
                        actionGroupForm.setValue('items', currentActions);
                    }}
                />
            </div>
        ) : (
            <div>
                <FilterWidget
                    entity={EntityType.CONDITIONS}
                    title={'Condition Items'}
                    getAvailableFiltersApi={getAvailableFiltersApi}
                    onFilterUpdate={(currentFilters) => {
                        const currentConditionItems = filterToConditionItems(currentFilters);
                        form.setValue('items', currentConditionItems);
                    }}
                />
            </div>
        );
    }, [form, formType, actionGroupForm, includeIgnoreAction, getAvailableFiltersApi]);

    return <div data-testid="condition-form-filter">{renderFilterWidget}</div>;
};

export default ConditionFormFilter;
