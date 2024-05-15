import cx from 'classnames';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { EntityType, selectors } from 'ducks/filters';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Badge } from 'reactstrap';
import { PlatformEnum } from 'types/openapi';
import { ActionRuleModel } from 'types/rules';
import styles from './groupActionsViewer.module.scss';

interface ConditionsTableViewerProps {
    groupActions: ActionRuleModel[];
    conditionGroupName: string;
    conditionGroupUuid: string;
}

const GroupActionsViewer = ({ groupActions = [], conditionGroupName, conditionGroupUuid }: ConditionsTableViewerProps) => {
    const searchGroupEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.FilterFieldSource));
    const availableFilters = useSelector(selectors.availableFilters(EntityType.ACTIONS));
    const RuleActionTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.RuleActionType));

    const renderActionBadges = useMemo(() => {
        if (!groupActions) return null;

        return groupActions.map((f, i) => {
            const field = availableFilters
                .find((a) => a.filterFieldSource === f.fieldSource)
                ?.searchFieldData?.find((s) => s.fieldIdentifier === f.fieldIdentifier);

            const label = field ? field.fieldLabel : f.fieldIdentifier;

            let value = '';

            if (Array.isArray(field?.value)) {
                if (Array.isArray(f.actionData)) {
                    const actionDataValue = f.actionData[0];
                    const coincideValue = field?.value.find((v) => v.uuid === actionDataValue);
                    value = coincideValue?.name || '';
                }
            } else {
                if (typeof f.actionData === 'string') {
                    value = f.actionData;
                }
                if (typeof f.actionData === 'object') {
                    value = JSON.stringify(f.actionData);
                }
            }

            return (
                <Badge className={styles.groupConditionBadge} key={i}>
                    {getEnumLabel(RuleActionTypeEnum, f.actionType)}&nbsp;
                    <>
                        <b>{f?.fieldSource && getEnumLabel(searchGroupEnum, f?.fieldSource)}&nbsp;</b>'{label}
                        '&nbsp;to&nbsp;
                        {value}
                    </>
                </Badge>
            );
        });
    }, [groupActions, availableFilters, RuleActionTypeEnum, searchGroupEnum]);

    return (
        <div className={styles.groupConditionContainerDiv} key={conditionGroupUuid}>
            <h6 className={cx('text-muted', styles.groupConditionTitle)}>{`${conditionGroupName}`}</h6>
            <div className="ms-3">{renderActionBadges}</div>
        </div>
    );
};

export default GroupActionsViewer;
