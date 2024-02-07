import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions, selectors } from 'ducks/scheduler';

import { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import PagedList from 'components/PagedList/PagedList';
import { EntityType } from 'ducks/filters';
import { useNavigate } from 'react-router-dom';
import { Badge, Button } from 'reactstrap';
import { SearchRequestModel } from 'types/certificate';
import { PlatformEnum, SchedulerJobExecutionStatus } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';
import { dateFormatter, timeFormatter } from 'utils/dateUtil';

interface Props {
    uuid: string;
}

function SchedulerJobHistory({ uuid }: Props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const schedulerJobHistory = useSelector(selectors.schedulerJobHistory);
    const schedulerJobExecutionStatusEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.SchedulerJobExecutionStatus));

    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [message, setMessage] = useState<string>();

    const schedulerJobHistoryRowHeaders: TableHeader[] = useMemo(
        () => [
            {
                content: 'Start',
                sortable: true,
                id: 'start',
                width: 'auto',
            },
            {
                content: 'End',
                sortable: true,
                id: 'end',
                width: 'auto',
            },
            {
                content: 'Duration',
                sortable: true,
                id: 'duration',
                width: 'auto',
            },
            {
                content: 'Status',
                sortable: true,
                id: 'status',
                width: 'auto',
            },
        ],
        [],
    );

    const schedulerJobHistoryData: TableDataRow[] = useMemo(
        () =>
            schedulerJobHistory.map((history) => ({
                id: history.jobUuid ?? '',
                columns: [
                    history.startTime ? dateFormatter(history.startTime) : '',
                    history.endTime ? dateFormatter(history.endTime) : '',
                    history.startTime && history.endTime
                        ? timeFormatter(new Date(history.endTime).valueOf() - new Date(history.startTime).valueOf())
                        : '',
                    <>
                        <Badge
                            color={
                                history.status === SchedulerJobExecutionStatus.Failed
                                    ? 'danger'
                                    : history.status === SchedulerJobExecutionStatus.Succeeded
                                      ? 'success'
                                      : 'primary'
                            }
                        >
                            {getEnumLabel(schedulerJobExecutionStatusEnum, history.status)}
                        </Badge>
                        {history.resultMessage && (
                            <Button
                                color="white"
                                size="sm"
                                className="p-1"
                                onClick={() => {
                                    setMessage(history.resultMessage ?? '');
                                    setShowMessage(true);
                                }}
                            >
                                <i className="fa fa-info-circle"></i>
                            </Button>
                        )}
                        {history.resultObjectType && history.resultObjectIdentification ? (
                            <Button
                                color="white"
                                size="sm"
                                className={history.resultMessage ? 'p-0' : 'p-1'}
                                onClick={() => {
                                    navigate(
                                        `../../${history.resultObjectType}/detail/${history.resultObjectIdentification?.reduce(
                                            (prev, curr) => prev + '/' + curr,
                                        )}`,
                                    );
                                }}
                            >
                                <i className="fa fa-circle-arrow-right"></i>
                            </Button>
                        ) : (
                            ''
                        )}
                    </>,
                ],
            })),
        [schedulerJobHistory, schedulerJobExecutionStatusEnum, navigate],
    );

    const onListCallback = useCallback(
        (pagination: SearchRequestModel) => dispatch(actions.listSchedulerJobHistory({ uuid, pagination })),
        [dispatch, uuid],
    );

    return (
        <>
            <PagedList
                entity={EntityType.SCHEDULER_HISTORY}
                onListCallback={onListCallback}
                headers={schedulerJobHistoryRowHeaders}
                data={schedulerJobHistoryData}
                title="Scheduled Job History"
                pageWidgetLockName={LockWidgetNameEnum.ListOfSchedulerHistory}
                hideWidgetButtons={true}
                hasCheckboxes={false}
            />
            <Dialog
                isOpen={showMessage}
                size={'lg'}
                caption="Result Message"
                body={message}
                toggle={() => setShowMessage(false)}
                buttons={[{ color: 'primary', onClick: () => setShowMessage(false), body: 'Close' }]}
            />
        </>
    );
}

export default SchedulerJobHistory;
