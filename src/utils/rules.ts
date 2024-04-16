import { SearchFilterModel } from 'types/certificate';
import { RuleConditiontModel } from 'types/rules';

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
