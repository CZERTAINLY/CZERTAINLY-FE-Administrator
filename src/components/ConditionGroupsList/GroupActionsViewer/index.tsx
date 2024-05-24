import cx from 'classnames';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { EntityType, selectors } from 'ducks/filters';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Badge } from 'reactstrap';
import { PlatformEnum } from 'types/openapi';
import { ExecutionItemModel } from 'types/rules';
import styles from './groupActionsViewer.module.scss';

interface ConditionsTableViewerProps {
    groupActions: ExecutionItemModel[];
    conditionGroupName: string;
    conditionGroupUuid: string;
}

const GroupActionsViewer = ({ groupActions = [], conditionGroupName, conditionGroupUuid }: ConditionsTableViewerProps) => {
    const searchGroupEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.FilterFieldSource));
    const availableFilters = useSelector(selectors.availableFilters(EntityType.ACTIONS));
    const executionTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ExecutionType));

    const renderActionBadges = useMemo(() => {
        if (!groupActions) return null;

        return groupActions.map((f, i) => {
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
                    {/* {getEnumLabel(executionTypeEnum, f.actionType)}&nbsp; */}
                    <>
                        <b>{f?.fieldSource && getEnumLabel(searchGroupEnum, f?.fieldSource)}&nbsp;</b>'{label}
                        '&nbsp;to&nbsp;
                        {value}
                    </>
                </Badge>
            );
        });
    }, [groupActions, availableFilters, executionTypeEnum, searchGroupEnum]);

    return (
        <div className={styles.groupConditionContainerDiv} key={conditionGroupUuid}>
            <h6 className={cx('text-muted', styles.groupConditionTitle)}>{`${conditionGroupName}`}</h6>
            <div className="ms-3">{renderActionBadges}</div>
        </div>
    );
};

export default GroupActionsViewer;
