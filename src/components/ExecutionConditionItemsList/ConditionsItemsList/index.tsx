import cx from 'classnames';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { EntityType, selectors } from 'ducks/filters';
import { selectors as rulesSelectors } from 'ducks/rules';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Badge, Spinner } from 'reactstrap';
import { AttributeContentType, ConditionItemDto, FilterFieldType, PlatformEnum, SearchFieldDataDto } from 'types/openapi';
import { getFormattedDateTime } from 'utils/dateUtil';
import styles from './conditionsItemsList.module.scss';

interface ConditionsTableViewerProps {
    conditionItems: ConditionItemDto[];
    conditionName: string;
    conditionUuid: string;
}

const ConditionsItemsList = ({ conditionItems = [], conditionName, conditionUuid }: ConditionsTableViewerProps) => {
    const searchGroupEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.FilterFieldSource));
    const FilterConditionOperatorEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.FilterConditionOperator));
    const availableFilters = useSelector(selectors.availableFilters(EntityType.CONDITIONS));
    const platformEnums = useSelector(enumSelectors.platformEnums);
    const isFetchingConditionDetails = useSelector(rulesSelectors.isFetchingConditionDetails);

    const booleanOptions = useMemo(
        () => [
            { label: 'True', value: true },
            { label: 'False', value: false },
        ],
        [],
    );
    const checkIfFieldIsDate = useCallback((field: SearchFieldDataDto) => {
        if (
            field.attributeContentType === AttributeContentType.Date ||
            field.attributeContentType === AttributeContentType.Time ||
            field.attributeContentType === AttributeContentType.Datetime
        ) {
            return true;
        } else {
            return false;
        }
    }, []);

    const renderConditionsBadges = useMemo(() => {
        return conditionItems.map((condition, i) => {
            const field = availableFilters
                .find((a) => a.filterFieldSource === condition.fieldSource)
                ?.searchFieldData?.find((s) => s.fieldIdentifier === condition.fieldIdentifier);

            const label = field ? field.fieldLabel : condition.fieldIdentifier;

            let value = '';
            let coincideValueToShow = '';

            if (Array.isArray(field?.value)) {
                if (Array.isArray(condition.value)) {
                    const conditionValue = condition.value[0];
                    const coincideValue = field?.value.find((v) => v.uuid === conditionValue.uuid);
                    coincideValueToShow = coincideValue?.name || '';
                }
            }

            value = coincideValueToShow.length
                ? coincideValueToShow
                : field && field.type === FilterFieldType.Boolean
                  ? `'${booleanOptions.find((b) => !!condition.value === b.value)?.label}'`
                  : Array.isArray(condition.value)
                    ? `${condition.value
                          .map(
                              (v) =>
                                  `'${
                                      field?.platformEnum
                                          ? platformEnums[field.platformEnum][v]?.label
                                          : v?.name
                                            ? v.name
                                            : field && checkIfFieldIsDate(field)
                                              ? getFormattedDateTime(v)
                                              : v
                                  }'`,
                          )
                          .join(' OR ')}`
                    : condition.value
                      ? `'${
                            field?.platformEnum
                                ? platformEnums[field.platformEnum][condition.value as unknown as string]?.label
                                : field && checkIfFieldIsDate(field)
                                  ? getFormattedDateTime(condition.value as unknown as string)
                                  : condition.value
                        }'`
                      : '';

            return (
                <Badge
                    key={i}
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
    }, [FilterConditionOperatorEnum, availableFilters, booleanOptions, checkIfFieldIsDate, conditionItems, platformEnums, searchGroupEnum]);

    if (isFetchingConditionDetails) return <Spinner active={isFetchingConditionDetails} />;

    return (
        <div className={styles.groupConditionContainerDiv} key={conditionUuid}>
            <h6 className={cx('text-muted', styles.groupConditionTitle)}>{`${conditionName}`}</h6>
            <div className="ms-3">{renderConditionsBadges}</div>
        </div>
    );
};

export default ConditionsItemsList;
