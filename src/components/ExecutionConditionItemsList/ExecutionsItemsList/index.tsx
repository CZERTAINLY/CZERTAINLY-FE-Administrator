import cx from 'classnames';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { EntityType, selectors } from 'ducks/filters';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Badge } from 'reactstrap';
import { PlatformEnum } from 'types/openapi';
import { ExecutionItemModel } from 'types/rules';
import styles from './executionsItemsList.module.scss';

interface ExecutionsItemsListProps {
    executionItems: ExecutionItemModel[];
    executionName: string;
    executionUuid: string;
}

const ExecutionsItemsList = ({ executionItems = [], executionName, executionUuid }: ExecutionsItemsListProps) => {
    const searchGroupEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.FilterFieldSource));
    const availableFilters = useSelector(selectors.availableFilters(EntityType.ACTIONS));
    const executionTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ExecutionType));

    const renderActionBadges = useMemo(() => {
        if (!executionItems) return null;

        return executionItems.map((f, i) => {
            const field = availableFilters
                .find((a) => a.filterFieldSource === f.fieldSource)
                ?.searchFieldData?.find((s) => s.fieldIdentifier === f.fieldIdentifier);

            const label = field ? field.fieldLabel : f.fieldIdentifier;

            let value = '';

            if (Array.isArray(field?.value)) {
                if (Array.isArray(f.data)) {
                    const actionDataValue = f.data[0];
                    const coincideValue = field?.value.find((v) => v.uuid === actionDataValue);
                    value = coincideValue?.name || '';
                }
            } else {
                if (typeof f.data === 'string') {
                    value = f.data;
                }
                if (typeof f.data === 'object') {
                    value = JSON.stringify(f.data);
                }
            }

            return (
                <Badge className={styles.groupConditionBadge} key={i}>
                    <>
                        <b>{f?.fieldSource && getEnumLabel(searchGroupEnum, f?.fieldSource)}&nbsp;</b>'{label}
                        '&nbsp;to&nbsp;
                        {value}
                    </>
                </Badge>
            );
        });
    }, [executionItems, availableFilters, searchGroupEnum]);

    return (
        <div className={styles.groupConditionContainerDiv} key={executionUuid}>
            <h6 className={cx('text-muted', styles.groupConditionTitle)}>{`${executionName}`}</h6>
            <div className="ms-3">{renderActionBadges}</div>
        </div>
    );
};

export default ExecutionsItemsList;
