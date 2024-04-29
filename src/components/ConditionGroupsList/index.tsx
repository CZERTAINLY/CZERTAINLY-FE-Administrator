import React, { useMemo } from 'react';
import { ConditionRuleGroupModel } from 'types/rules';
import GroupConditionsViewer from './GroupConditionsViewer';
import styles from './conditionGroupsList.module.scss';
interface ConditionsTableViewerProps {
    ruleConditions: ConditionRuleGroupModel[];
}

const ConditionsGroupsList = ({ ruleConditions }: ConditionsTableViewerProps) => {
    const renderRuleConditions = useMemo(
        () =>
            ruleConditions.map((conditionGroup, i) => (
                <React.Fragment key={conditionGroup.uuid}>
                    <hr className={styles.conditionListHr} />
                    <GroupConditionsViewer
                        conditionGroupName={conditionGroup.name}
                        conditionGroupUuid={conditionGroup.uuid}
                        groupConditions={conditionGroup.conditions}
                        key={conditionGroup.uuid}
                    />
                </React.Fragment>
            )),
        [ruleConditions],
    );

    return ruleConditions?.length ? <div className={styles.conditionGroupList}>{renderRuleConditions}</div> : null;
};

export default ConditionsGroupsList;
