import React, { useMemo } from 'react';
import { ActionGroupModel, ConditionRuleGroupModel } from 'types/rules';
import GroupActionsViewer from './GroupActionsViewer';
import GroupConditionsViewer from './GroupConditionsViewer';
import styles from './conditionGroupsList.module.scss';
interface ConditionsTableViewerProps {
    ruleConditions?: ConditionRuleGroupModel[];
    actionGroups?: ActionGroupModel[];
}

const ConditionsGroupsList = ({ ruleConditions, actionGroups }: ConditionsTableViewerProps) => {
    const renderListData = useMemo(() => {
        if (ruleConditions?.length) {
            return ruleConditions.map((conditionGroup, i) => (
                <React.Fragment key={conditionGroup.uuid}>
                    <hr className={styles.conditionListHr} />
                    <GroupConditionsViewer
                        conditionGroupName={conditionGroup.name}
                        conditionGroupUuid={conditionGroup.uuid}
                        groupConditions={conditionGroup.conditions}
                        key={conditionGroup.uuid}
                    />
                </React.Fragment>
            ));
        } else if (actionGroups?.length) {
            return actionGroups.map((actionGroup, i) => (
                <React.Fragment key={actionGroup.uuid}>
                    <hr className={styles.conditionListHr} />
                    <GroupActionsViewer
                        conditionGroupName={actionGroup.name}
                        conditionGroupUuid={actionGroup.uuid}
                        groupActions={actionGroup.actions}
                        key={actionGroup.uuid}
                    />
                </React.Fragment>
            ));
        } else return <></>;
    }, [ruleConditions, actionGroups]);

    return <>{renderListData}</>;
};

export default ConditionsGroupsList;
