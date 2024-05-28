import cx from 'classnames';
import { useCallback, useMemo } from 'react';
import { TriggerHistoryObjectSummaryModel, TriggerHistoryObjectTriggerSummaryModel } from 'types/rules';
import styles from './triggerHistorySummaryViewer.module.scss';
interface TriggerHistorySummaryProps {
    triggerHistoryObjectSummary: TriggerHistoryObjectSummaryModel;
}

import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import TabLayout from 'components/Layout/TabLayout';
import { actions as userInterfaceActions } from 'ducks/user-interface';
import { useDispatch } from 'react-redux';
import { Button } from 'reactstrap';

const TriggerHistorySummaryViewer = ({ triggerHistoryObjectSummary }: TriggerHistorySummaryProps) => {
    const dispatch = useDispatch();

    const triggerHistoryHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'failSource',
                content: 'Fail Source',
            },
            {
                id: 'name',
                content: 'Name',
            },
            {
                id: 'message',
                content: 'Message',
            },
        ],
        [],
    );

    const getTriggerHistoryTable = useCallback(
        (trigger: TriggerHistoryObjectTriggerSummaryModel) => {
            const recordData: TableDataRow[] = trigger?.records?.length
                ? trigger.records.map((r, i) => ({
                      id: i,
                      columns: [
                          r?.condition ? 'Condition' : r?.execution ? 'Execution' : '',
                          r.condition?.name || r.execution?.name || '',
                          <div className={styles.messageDataCell}>{r.message}</div> || '',
                      ],
                  }))
                : [];
            return <CustomTable headers={triggerHistoryHeaders} data={recordData} />;
        },
        [triggerHistoryHeaders],
    );

    const onIconClick = useCallback(() => {
        const triggers = triggerHistoryObjectSummary.triggers;
        // if (!triggers.length) return;

        dispatch(
            userInterfaceActions.showGlobalModal({
                isOpen: true,
                size: 'lg',
                content: (
                    <div>
                        <TabLayout
                            tabs={
                                triggers.length
                                    ? triggers.map((trigger, i) => ({
                                          content: getTriggerHistoryTable(trigger),
                                          title: trigger.triggerName,
                                          onClick: () => {},
                                      }))
                                    : []
                            }
                        />
                    </div>
                ),
                title: 'Trigger History Details',
                showCloseButton: true,
            }),
        );
    }, [triggerHistoryObjectSummary, dispatch, getTriggerHistoryTable]);

    const getIcon = useMemo(() => {
        if (!triggerHistoryObjectSummary.matched) {
            return <i className={cx('fa', 'fa-close', styles.closeIcon)} />;
        } else if (triggerHistoryObjectSummary.matched && !triggerHistoryObjectSummary.ignored) {
            return <i className={cx('fa', 'fa-check', styles.checkIcon)} />;
        } else {
            return <i className={cx('fa', 'fa-ban', styles.banIcon)} />;
        }
    }, [triggerHistoryObjectSummary.matched, triggerHistoryObjectSummary.ignored]);
    return (
        <div className="d-flex justify-content-center">
            <div className="p-2">{getIcon}</div>
            <Button className="btn btn-link" onClick={onIconClick}>
                <i className={cx('fa', 'fa-info', styles.infoIcon)} />
            </Button>
        </div>
    );
};

export default TriggerHistorySummaryViewer;
