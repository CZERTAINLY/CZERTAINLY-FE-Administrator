import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { EntityType, selectors } from 'ducks/filters';
import { actions as rulesActions, selectors as rulesSelectors } from 'ducks/rules';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Badge, Spinner } from 'reactstrap';
import { FilterFieldType, PlatformEnum } from 'types/openapi';
type FormType = 'rules' | 'conditionGroup';

interface ConditionsTableViewerProps {
    conditionGroupId: string;
}

const ConditionsTableViewer = ({ conditionGroupId }: ConditionsTableViewerProps) => {
    const searchGroupEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.FilterFieldSource));
    const FilterConditionOperatorEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.FilterConditionOperator));
    const availableFilters = useSelector(selectors.availableFilters(EntityType.CONDITIONS));
    const platformEnums = useSelector(enumSelectors.platformEnums);
    const isFetchingConditionGroup = useSelector(rulesSelectors.isFetchingConditionGroup);
    const conditionGroupsDetails = useSelector(rulesSelectors.conditionGroupDetails);

    const dispatch = useDispatch();
    const booleanOptions = useMemo(
        () => [
            { label: 'True', value: true },
            { label: 'False', value: false },
        ],
        [],
    );
    useEffect(() => {
        if (!conditionGroupId) return;
        dispatch(rulesActions.getConditionGroup({ conditionGroupUuid: conditionGroupId }));
    }, [conditionGroupId, dispatch]);

    const renderConditionsBadges = () => {
        if (!conditionGroupsDetails) return null;
        return conditionGroupsDetails.conditions.map((condition) => {
            const field = availableFilters
                .find((a) => a.filterFieldSource === condition.fieldSource)
                ?.searchFieldData?.find((s) => s.fieldIdentifier === condition.fieldIdentifier);
            const label = field ? field.fieldLabel : condition.fieldIdentifier;

            const value =
                field && field.type === FilterFieldType.Boolean
                    ? `'${booleanOptions.find((b) => !!condition.value === b.value)?.label}'`
                    : Array.isArray(condition.value) && condition.value.length > 1
                      ? `(${condition.value
                            .map((v) => `'${field?.platformEnum ? platformEnums[field.platformEnum][v]?.label : v}'`)
                            .join(' OR ')})`
                      : condition.value
                        ? `'${
                              field?.platformEnum
                                  ? platformEnums[field.platformEnum][condition.value as unknown as string]?.label
                                  : condition.value
                          }'`
                        : '';
            return (
                <div>
                    <Badge
                        title={`${getEnumLabel(searchGroupEnum, condition.fieldSource)} ${label} ${getEnumLabel(
                            FilterConditionOperatorEnum,
                            condition.operator,
                        )} ${value}`}
                        className="my-1"
                    >
                        <b>{getEnumLabel(searchGroupEnum, condition.fieldSource)}&nbsp;</b>'{label}'&nbsp;
                        {getEnumLabel(FilterConditionOperatorEnum, condition.operator)}&nbsp;
                        {value}
                    </Badge>
                </div>
            );
        });
    };

    if (isFetchingConditionGroup) return <Spinner active={isFetchingConditionGroup} />;

    return <div>{renderConditionsBadges()}</div>;
};

export default ConditionsTableViewer;
