import cx from 'classnames';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { EntityType, selectors } from 'ducks/filters';
import { selectors as rulesSelectors } from 'ducks/rules';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Badge, Spinner } from 'reactstrap';
import { FilterFieldType, PlatformEnum, RuleConditionDto } from 'types/openapi';
import styles from './groupConditionsViewer.module.scss';

interface ConditionsTableViewerProps {
    groupConditions: RuleConditionDto[];
    conditionGroupName: string;
    conditionGroupUuid: string;
}

const GroupConditionsViewer = ({ groupConditions = [], conditionGroupName, conditionGroupUuid }: ConditionsTableViewerProps) => {
    const searchGroupEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.FilterFieldSource));
    const FilterConditionOperatorEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.FilterConditionOperator));
    const availableFilters = useSelector(selectors.availableFilters(EntityType.CONDITIONS));
    const platformEnums = useSelector(enumSelectors.platformEnums);
    const isFetchingConditionGroup = useSelector(rulesSelectors.isFetchingConditionGroup);
    console.log('platformEnums', platformEnums);
    console.log('availableFilters', availableFilters);
    const booleanOptions = useMemo(
        () => [
            { label: 'True', value: true },
            { label: 'False', value: false },
        ],
        [],
    );

    const renderConditionsBadges = () => {
        return groupConditions.map((condition) => {
            const filterConditionSource = availableFilters.find((a) => a.filterFieldSource === condition.fieldSource);
            const foundField = filterConditionSource?.searchFieldData?.find((s) => s.fieldIdentifier === condition.fieldIdentifier);
            const field = availableFilters
                .find((a) => a.filterFieldSource === condition.fieldSource)
                ?.searchFieldData?.find((s) => s.fieldIdentifier === condition.fieldIdentifier);
            const label = field ? field.fieldLabel : condition.fieldIdentifier;
            console.log('condition.fieldIdentifier', condition.fieldIdentifier);
            console.log('filterConditionSource', filterConditionSource);
            console.log('foundField', foundField);
            console.log('label', label);
            console.log('field', field);
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
                <Badge
                    key={condition.uuid}
                    title={`${getEnumLabel(searchGroupEnum, condition.fieldSource)} ${label} ${getEnumLabel(
                        FilterConditionOperatorEnum,
                        condition.operator,
                    )} ${value}`}
                    className={styles.groupConditionBadge}
                >
                    <b>{getEnumLabel(searchGroupEnum, condition.fieldSource)}&nbsp;</b>'{label}'&nbsp;
                    {getEnumLabel(FilterConditionOperatorEnum, condition.operator)}&nbsp;
                    {value}
                </Badge>
            );
        });
    };

    if (isFetchingConditionGroup) return <Spinner active={isFetchingConditionGroup} />;

    return (
        <div className={styles.groupConditionContainerDiv} key={conditionGroupUuid}>
            <h6 className={cx('text-muted', styles.groupConditionTitle)}>{`${conditionGroupName}`}</h6>
            <div className="ms-3">{renderConditionsBadges()}</div>
        </div>
    );
};

export default GroupConditionsViewer;
