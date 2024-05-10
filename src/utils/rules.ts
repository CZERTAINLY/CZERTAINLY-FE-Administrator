import { getEnumLabel } from 'ducks/enums';
import { actions as resourceActions } from 'ducks/resource';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchFilterModel } from 'types/certificate';
import { RuleConditiontModel } from 'types/rules';
// import { EntityType, actions as filterActions } from 'ducks/filters';
import { selectors as enumSelectors } from 'ducks/enums';

import { selectors as resourceSelectors } from 'ducks/resource';

import { PlatformEnum } from 'types/openapi';

export const filterToConditionGroup = (filter: SearchFilterModel[]): RuleConditiontModel[] => {
    return filter.map((filter) => ({
        fieldIdentifier: filter.fieldIdentifier,
        operator: filter.condition,
        value: filter.value,
        fieldSource: filter.fieldSource,
    }));
};

export const conditionGroupToFilter = (conditionGroup: RuleConditiontModel[]): SearchFilterModel[] => {
    return conditionGroup.map((condition) => ({
        fieldIdentifier: condition.fieldIdentifier,
        condition: condition.operator,
        value: condition.value,
        fieldSource: condition.fieldSource,
    }));
};

export const useResourceOptions = () => {
    const resourceList = useSelector(resourceSelectors.resourceslist);
    const resourceTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(resourceActions.listResources());
    }, [dispatch]);

    const resourceOptions = useMemo(() => {
        if (!resourceList.length) return [];
        return resourceList.map((resource) => {
            return { value: resource.resource, label: getEnumLabel(resourceTypeEnum, resource.resource) };
        });
    }, [resourceList, resourceTypeEnum]);

    return resourceOptions;
};
