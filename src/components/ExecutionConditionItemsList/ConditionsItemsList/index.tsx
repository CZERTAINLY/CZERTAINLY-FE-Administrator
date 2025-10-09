import cx from 'classnames';
import { selectors as enumSelectors } from 'ducks/enums';
import { EntityType, selectors } from 'ducks/filters';
import { selectors as rulesSelectors } from 'ducks/rules';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Spinner } from 'reactstrap';
import { ConditionItemDto, PlatformEnum } from 'types/openapi';
import styles from './conditionsItemsList.module.scss';
import { renderConditionItems } from 'utils/condition-badges';

interface ConditionsTableViewerProps {
    conditionItems: ConditionItemDto[];
    conditionName: string;
    conditionUuid: string;
    smallerBadges?: boolean;
}

const ConditionsItemsList = ({ conditionItems = [], conditionName, conditionUuid, smallerBadges }: ConditionsTableViewerProps) => {
    const searchGroupEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.FilterFieldSource));
    const filterConditionOperatorEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.FilterConditionOperator));
    const availableFilters = useSelector(selectors.availableFilters(EntityType.CONDITIONS));
    const platformEnums = useSelector(enumSelectors.platformEnums);
    const isFetchingConditionDetails = useSelector(rulesSelectors.isFetchingConditionDetails);

    const isFetchingAvailableFiltersConditions = useSelector(selectors.isFetchingFilters(EntityType.CONDITIONS));

    const isLoading = useMemo(
        () => isFetchingAvailableFiltersConditions || isFetchingConditionDetails,
        [isFetchingAvailableFiltersConditions, isFetchingConditionDetails],
    );

    if (isLoading) return <Spinner color="gray" active={isFetchingConditionDetails} />;

    return smallerBadges ? (
        <div>
            <h6 className={cx('text-muted', styles.groupConditionTitle)}>{`${conditionName}'s Condition Items`}</h6>
            <div className="d-flex flex-wrap">
                {renderConditionItems(
                    conditionItems,
                    availableFilters,
                    platformEnums,
                    searchGroupEnum,
                    filterConditionOperatorEnum,
                    styles.groupConditionBadgeOnly,
                    'small',
                )}
            </div>
        </div>
    ) : (
        <div className={styles.groupConditionContainerDiv} key={conditionUuid}>
            <h6 className={cx('text-muted', styles.groupConditionTitle)}>{`${conditionName}`}</h6>
            <div className="ms-3">
                {renderConditionItems(
                    conditionItems,
                    availableFilters,
                    platformEnums,
                    searchGroupEnum,
                    filterConditionOperatorEnum,
                    styles.groupConditionBadge,
                    'badge',
                )}
            </div>
        </div>
    );
};

export default ConditionsItemsList;
