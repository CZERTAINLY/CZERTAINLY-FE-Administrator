import { ApiClients } from 'api';
import FilterWidget from 'components/FilterWidget';
import { EntityType, selectors as filterSelectors } from 'ducks/filters';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-final-form';
import { useSelector } from 'react-redux';
import { Resource } from 'types/openapi';
import { ConditionRuleRequestModel } from 'types/rules';

interface ConditionGroupFormFilterProps {
    resource: Resource;
}

const ConditionGroupFormFilter = ({ resource }: ConditionGroupFormFilterProps) => {
    // const renderFilterWidget =
    const form = useForm();
    const currentFilters = useSelector(filterSelectors.currentFilters(EntityType.RESOURCE));

    //RuleConditionRequestDto
    // const setConditions = (conditions: RuleConditionRequestDto[]) => {
    //     console.log('conditions', conditions);
    //     form.change('conditions', conditions);
    // };

    useEffect(() => {
        const currentConditionGroups: ConditionRuleRequestModel[] = currentFilters.map((filter) => ({
            fieldIdentifier: filter.fieldIdentifier,
            operator: filter.condition,
            values: filter.value,
            fieldSource: filter.fieldSource,
        }));
        form.change('conditions', currentConditionGroups);
    }, [currentFilters]);

    const setConditions = useCallback(
        (conditions: ConditionRuleRequestModel[]) => {
            console.log('conditions', conditions);
            form.change('conditions', conditions);
        },
        [form],
    );

    const renderFilterWidget = useMemo(() => {
        return (
            <FilterWidget
                entity={EntityType.RESOURCE}
                title={'Condition Group'}
                getAvailableFiltersApi={(apiClients: ApiClients) =>
                    apiClients.resources.listResourceRuleFilterFields({
                        resource,
                    })
                }

                // setConditionGroupFormValue={(value) => {
                //     console.log('passed value', value);
                //     setConditions(value);
                // }}
            />
        );
    }, [resource, setConditions]);

    return (
        <div>
            {/* <FilterWidget
                entity={EntityType.RESOURCE}
                title={'Condition Group'}
                getAvailableFiltersApi={(apiClients: ApiClients) =>
                    apiClients.resources.listResourceRuleFilterFields({
                        resource,
                    })
                }
                setFormValue={(value) => {
                    // setConditions(conditions);
                    // form.change('conditions', conditions);
                    console.log('passed value', value);
                    setConditions(value);
                }}
            /> */}
            {renderFilterWidget}
        </div>
    );
};

export default ConditionGroupFormFilter;
