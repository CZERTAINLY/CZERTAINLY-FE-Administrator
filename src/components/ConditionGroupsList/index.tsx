import { EntityType, selectors } from 'ducks/filters';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ConditionModel, ExecutionModel } from 'types/rules';
import styles from './conditionGroupsList.module.scss';

interface ConditionsTableViewerProps {
    ruleConditions?: ConditionModel[];
    actionGroups?: ExecutionModel[];
}

const ConditionsGroupsList = ({ ruleConditions, actionGroups }: ConditionsTableViewerProps) => {
    const isFetchingAvailableFiltersConditions = useSelector(selectors.isFetchingFilters(EntityType.CONDITIONS));
    const isFetchingAvailableFiltersActions = useSelector(selectors.isFetchingFilters(EntityType.ACTIONS));

    const renderListData = useMemo(() => {
        if (isFetchingAvailableFiltersConditions || isFetchingAvailableFiltersActions) return <></>;

        if (ruleConditions?.length) {
            return ruleConditions.map((conditionGroup, i) => (
                <React.Fragment key={conditionGroup.uuid}>
                    <hr className={styles.conditionListHr} />
                    {/* <GroupConditionsViewer
                        conditionGroupName={conditionGroup.name}
                        conditionGroupUuid={conditionGroup.uuid}
                        groupConditions={conditionGroup.items}
                        key={conditionGroup.uuid}
                    /> */}
                </React.Fragment>
            ));
        } else if (actionGroups?.length) {
            return actionGroups.map((actionGroup, i) => (
                <React.Fragment key={actionGroup.uuid}>
                    <hr className={styles.conditionListHr} />
                    {/* <GroupActionsViewer
                        conditionGroupName={actionGroup.name}
                        conditionGroupUuid={actionGroup.uuid}
                        groupActions={actionGroup.actions}
                        key={actionGroup.uuid}
                    /> */}
                </React.Fragment>
            ));
        } else return <></>;
    }, [ruleConditions, actionGroups, isFetchingAvailableFiltersConditions, isFetchingAvailableFiltersActions]);

    return <>{renderListData}</>;
};

export default ConditionsGroupsList;
