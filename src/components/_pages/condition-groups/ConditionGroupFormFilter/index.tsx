import { ApiClients } from 'api';
import cx from 'classnames';
import FilterWidget from 'components/FilterWidget';
import { EntityType, actions as filterActions } from 'ducks/filters';
import { selectors as rulesSelectors } from 'ducks/rules';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Resource } from 'types/openapi';
import { conditionGroupToFilter, filterToConditionGroup } from 'utils/rules';
import { ConditionGroupFormValues } from '../form';
import styles from './conditionGroupForm.module.scss';

interface ConditionGroupFormFilterProps {
    resource: Resource;
}

const ConditionGroupFormFilter = ({ resource }: ConditionGroupFormFilterProps) => {
    const { id } = useParams();
    const editMode = useMemo(() => !!id, [id]);
    const [hasEffectRun, setHasEffectRun] = useState(false);

    const form = useForm<ConditionGroupFormValues>();
    const conditionGroupsDetails = useSelector(rulesSelectors.conditionGroupDetails);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!hasEffectRun && editMode && conditionGroupsDetails) {
            const currentConditions = conditionGroupsDetails.conditions;
            const currentFilters = conditionGroupToFilter(currentConditions);
            setHasEffectRun(true);
            dispatch(filterActions.setCurrentFilters({ currentFilters: currentFilters, entity: EntityType.CONDITION_GROUP }));
        }
    }, [editMode, conditionGroupsDetails, hasEffectRun, dispatch]);

    const renderFilterWidget = useMemo(() => {
        return (
            <div className={cx({ [styles.disabled]: resource === Resource.None })}>
                <FilterWidget
                    entity={EntityType.CONDITION_GROUP}
                    title={'Condition Group'}
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
    }, [resource, form]);

    return <div>{renderFilterWidget}</div>;
};

export default ConditionGroupFormFilter;
