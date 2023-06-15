import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectors as enumSelectors, getEnumLabel } from "ducks/enums";
import { actions, selectors } from "ducks/scheduler";

import { TableDataRow, TableHeader } from "components/CustomTable";
import PagedList from "components/PagedList/PagedList";
import { EntityType } from "ducks/filters";
import { Badge } from "reactstrap";
import { SearchRequestModel } from "types/certificate";
import { PlatformEnum, SchedulerJobExecutionStatus } from "types/openapi";
import { LockWidgetNameEnum } from "types/widget-locks";
import { dateFormatter } from "utils/dateUtil";

interface Props {
    uuid: string;
}

function SchedulerJobHistory({ uuid }: Props) {
    const dispatch = useDispatch();

    const schedulerJobHistory = useSelector(selectors.schedulerJobHistory);
    const schedulerJobExecutionStatusEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.SchedulerJobExecutionStatus));

    const schedulerJobHistoryRowHeaders: TableHeader[] = useMemo(
        () => [
            {
                content: "Start",
                sortable: true,
                id: "start",
                width: "auto",
            },
            {
                content: "End",
                sortable: true,
                id: "end",
                width: "auto",
            },
            {
                content: "Status",
                sortable: true,
                id: "status",
                width: "auto",
            },
            {
                content: "Error Message",
                id: "status",
                width: "auto",
            },
        ],
        [],
    );

    const schedulerJobHistoryData: TableDataRow[] = useMemo(
        () =>
            schedulerJobHistory.map((history) => ({
                id: history.jobUuid ?? "",
                columns: [
                    dateFormatter(history.startTime) ?? "",
                    dateFormatter(history.endTime) ?? "",
                    <Badge
                        color={
                            history.status === SchedulerJobExecutionStatus.Failed
                                ? "danger"
                                : history.status === SchedulerJobExecutionStatus.Succeeded
                                ? "success"
                                : "primary"
                        }
                    >
                        {getEnumLabel(schedulerJobExecutionStatusEnum, history.status)}
                    </Badge>,
                    history.errorMessage ?? "",
                ],
            })),
        [schedulerJobHistory, schedulerJobExecutionStatusEnum],
    );

    const onListCallback = useCallback(
        (pagination: SearchRequestModel) => dispatch(actions.listSchedulerJobHistory({ uuid, pagination })),
        [dispatch, uuid],
    );

    return (
        <PagedList
            entity={EntityType.SCHEDULER_HISTORY}
            onListCallback={onListCallback}
            headers={schedulerJobHistoryRowHeaders}
            data={schedulerJobHistoryData}
            title="Scheduled Job History"
            pageWidgetLockName={LockWidgetNameEnum.ListOfSchedulerHistory}
            hideWidgetButtons={true}
        />
    );
}

export default SchedulerJobHistory;
