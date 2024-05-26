import cx from 'classnames';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { EntityType, selectors } from 'ducks/filters';
import { selectors as rulesSelectors } from 'ducks/rules';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Badge, Spinner } from 'reactstrap';
import { ConditionItemDto, PlatformEnum } from 'types/openapi';
import styles from './groupConditionsViewer.module.scss';

interface ConditionsTableViewerProps {
    groupConditions: ConditionItemDto[];
    conditionGroupName: string;
    conditionGroupUuid: string;
}

const GroupConditionsViewer = ({ groupConditions = [], conditionGroupName, conditionGroupUuid }: ConditionsTableViewerProps) => {
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

    const renderConditionsBadges = () => {
        return groupConditions.map((condition, i) => {
            const field = availableFilters
                .find((a) => a.filterFieldSource === condition.fieldSource)
                ?.searchFieldData?.find((s) => s.fieldIdentifier === condition.fieldIdentifier);

            const label = field ? field.fieldLabel : condition.fieldIdentifier;
            let value = '';

            if (Array.isArray(field?.value)) {
                if (Array.isArray(condition.value)) {
                    const conditionValue = condition.value[0];
                    const coincideValue = field?.value.find((v) => v.uuid === conditionValue.uuid);
                    value = coincideValue?.name || '';
                }
            } else {
                if (typeof condition.value === 'string') {
                    value = condition.value;
                }
                if (typeof condition.value === 'object') {
                    value = JSON.stringify(condition.value);
                }
            }

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
    };

    if (isFetchingConditionDetails) return <Spinner active={isFetchingConditionDetails} />;

    return (
        <div className={styles.groupConditionContainerDiv} key={conditionGroupUuid}>
            <h6 className={cx('text-muted', styles.groupConditionTitle)}>{`${conditionGroupName}`}</h6>
            <div className="ms-3">{renderConditionsBadges()}</div>
        </div>
    );
};

export default GroupConditionsViewer;
