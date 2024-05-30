import cx from 'classnames';
import { useCallback, useMemo } from 'react';
import { TriggerHistoryObjectSummaryModel, TriggerHistoryObjectTriggerSummaryModel } from 'types/rules';
import styles from './triggerHistorySummaryViewer.module.scss';
interface TriggerHistorySummaryProps {
    triggerHistoryObjectSummary: TriggerHistoryObjectSummaryModel;
}

import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import TabLayout from 'components/Layout/TabLayout';
import Widget from 'components/Widget';
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
                width: '15%',
            },
            {
                id: 'name',
                content: 'Name',
                width: '15%',
            },
            {
                id: 'message',
                content: 'Message',
                width: '70%',
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
                          r.message || '',
                      ],
                  }))
                : [];
            return (
                <Widget>
                    <CustomTable headers={triggerHistoryHeaders} data={recordData} />
                </Widget>
            );
        },
        [triggerHistoryHeaders],
    );

    const onIconClick = useCallback(() => {
        const triggers = triggerHistoryObjectSummary.triggers;
        dispatch(
            userInterfaceActions.showGlobalModal({
                isOpen: true,
                size: 'xl',
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
                title: 'Trigger History Summary Details',
                showCloseButton: true,
            }),
        );
    }, [triggerHistoryObjectSummary, dispatch, getTriggerHistoryTable]);

    // check if there are some records are present atleast in one trigger object of trigger array

    const hasRecords = useMemo(() => {
        return triggerHistoryObjectSummary.triggers.some((trigger) => trigger.records.length);
    }, [triggerHistoryObjectSummary.triggers]);

    const getIcon = useMemo(() => {
        if (!triggerHistoryObjectSummary.matched) {
            return <i className={cx('fa', 'fa-close', styles.closeIcon)} title="Not Matched" />;
        } else if (triggerHistoryObjectSummary.matched && !triggerHistoryObjectSummary.ignored) {
            return <i className={cx('fa', 'fa-check', styles.checkIcon)} title="Matched" />;
        } else {
            return <i className={cx('fa', 'fa-ban', styles.banIcon)} title="Ignored" />;
        }
    }, [triggerHistoryObjectSummary.matched, triggerHistoryObjectSummary.ignored]);
    return (
        <div className="d-flex justify-content-start" style={{ marginBottom: '4px' }}>
            <div className="p-2">{getIcon}</div>
            {hasRecords && (
                <Button className="btn btn-link" onClick={onIconClick}>
                    <i className={cx('fa', 'fa-info', styles.infoIcon)} />
                </Button>
            )}
        </div>
    );
};

export default TriggerHistorySummaryViewer;
