import cx from 'classnames';
import { useCallback, useMemo } from 'react';
import { TriggerHistoryObjectSummaryModel } from 'types/rules';
import styles from './triggerHistorySummaryViewer.module.scss';
interface TriggerHistorySummaryProps {
    triggerHistoryObjectSummary: TriggerHistoryObjectSummaryModel;
}

import CustomTable, { TableHeader } from 'components/CustomTable';
import TabLayout from 'components/Layout/TabLayout';
import { actions as userInterfaceActions } from 'ducks/user-interface';
import { useDispatch } from 'react-redux';
import { Button } from 'reactstrap';

const TriggerHistorySummaryViewer = ({ triggerHistoryObjectSummary }: TriggerHistorySummaryProps) => {
    const dispatch = useDispatch();

    const detailHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'property',
                content: 'Property',
                width: '50%',
            },
            {
                id: 'value',
                content: 'Value',
                width: '50%',
            },
        ],
        [],
    );

    const onIconClick = useCallback(() => {
        console.log('triggerHistoryObjectSummary', triggerHistoryObjectSummary);

        //         each trigger results should be on own tab in a table with 3 columns
        // Fail source - Condition if condition is not null or Execution otherwise
        // Name - name from object above that is present in DTO
        // Message

        const triggers = triggerHistoryObjectSummary.triggers;
        console.log('triggerResults', triggers);

        // <TabLayout
        //     tabs={[
        //         { title: 'All', onClick: () => setNewlyDiscovered(undefined), content: pagedTable },
        //         { title: 'New', onClick: () => setNewlyDiscovered(true), content: pagedTable },
        //         { title: 'Existing', onClick: () => setNewlyDiscovered(false), content: pagedTable },
        //     ]}
        //     onlyActiveTabContent={true}
        // />;
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
                                          content: (
                                              <CustomTable
                                                  headers={detailHeaders}
                                                  data={[
                                                      {
                                                          id: 'objectName',
                                                          columns: ['Object Name', trigger.triggerName],
                                                      },
                                                      {
                                                          id: 'message',
                                                          columns: ['Message', ''],
                                                      },

                                                      //   {},
                                                  ]}
                                              />
                                          ),
                                          title: `Trigger ${i + 1}`,
                                          onClick: () => {},
                                      }))
                                    : []
                            }
                        />
                    </div>
                ),
                title: 'Trigger History Details',
            }),
        );
    }, [triggerHistoryObjectSummary, dispatch]);

    console.log('triggerHistoryObjectSummary', triggerHistoryObjectSummary);
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
