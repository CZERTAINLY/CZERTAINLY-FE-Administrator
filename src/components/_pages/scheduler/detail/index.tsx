import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";

import Widget from "components/Widget";
import { WidgetButtonProps } from "components/WidgetButtons";

import { selectors as enumSelectors, getEnumLabel } from "ducks/enums";
import { actions, selectors } from "ducks/scheduler";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { Badge, Container } from "reactstrap";

import StatusBadge from "components/StatusBadge";
import StatusCircle from "components/StatusCircle";
import { PlatformEnum, SchedulerJobExecutionStatus } from "types/openapi";
import SchedulerJobHistory from "./SchedulerJobHistory";
import { LockWidgetNameEnum } from "types/widget-locks";

export default function SchedulerJobDetail() {
    const dispatch = useDispatch();

    const { id } = useParams();

    const schedulerJob = useSelector(selectors.schedulerJob);

    const isFetching = useSelector(selectors.isFetchingDetail);
    const isDeleting = useSelector(selectors.isDeleting);
    const isEnabling = useSelector(selectors.isEnabling);

    const schedulerJobExecutionStatusEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.SchedulerJobExecutionStatus));

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    const isBusy = useMemo(() => isFetching || isDeleting || isEnabling, [isFetching, isDeleting, isEnabling]);

    const getFreshSchedulerJobDetails = useCallback(() => {
        if (!id) return;
        dispatch(actions.getSchedulerJobDetail({ uuid: id }));
    }, [id, dispatch]);

    useEffect(() => {
        getFreshSchedulerJobDetails();
    }, [id, getFreshSchedulerJobDetails]);

    const onDeleteConfirmed = useCallback(() => {
        if (!schedulerJob) return;

        dispatch(actions.deleteSchedulerJob({ uuid: schedulerJob.uuid }));
        setConfirmDelete(false);
    }, [schedulerJob, dispatch]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: "trash",
                disabled: schedulerJob?.system ?? true,
                tooltip: "Delete",
                onClick: () => {
                    setConfirmDelete(true);
                },
            },
            {
                icon: "check",
                disabled: schedulerJob?.enabled ?? true,
                tooltip: "Enable",
                onClick: () => {
                    dispatch(actions.enableSchedulerJob({ uuid: schedulerJob!.uuid }));
                },
            },
            {
                icon: "times",
                disabled: schedulerJob?.enabled === false ?? true,
                tooltip: "Disable",
                onClick: () => {
                    dispatch(actions.disableSchedulerJob({ uuid: schedulerJob!.uuid }));
                },
            },
        ],
        [dispatch, schedulerJob],
    );

    const detailHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: "property",
                content: "Property",
            },
            {
                id: "value",
                content: "Value",
            },
        ],
        [],
    );

    const detailData: TableDataRow[] = useMemo(
        () =>
            !schedulerJob
                ? []
                : [
                      {
                          id: "uuid",
                          columns: ["UUID", schedulerJob.uuid],
                      },
                      {
                          id: "name",
                          columns: ["Name", schedulerJob.jobName],
                      },
                      {
                          id: "className",
                          columns: ["Class Name", schedulerJob.jobClassName ?? ""],
                      },
                      {
                          id: "oneShot",
                          columns: ["One Shot Only", <StatusCircle status={schedulerJob.oneShotOnly} />],
                      },
                      {
                          id: "system",
                          columns: ["System Job", <StatusCircle status={schedulerJob.system} />],
                      },
                      {
                          id: "enabled",
                          columns: ["Enabled", <StatusBadge enabled={schedulerJob.enabled} />],
                      },
                      {
                          id: "status",
                          columns: [
                              "Last Execution Status",
                              <Badge
                                  color={
                                      schedulerJob.lastExecutionStatus === SchedulerJobExecutionStatus.Failed
                                          ? "danger"
                                          : schedulerJob.lastExecutionStatus === SchedulerJobExecutionStatus.Succeeded
                                          ? "success"
                                          : "primary"
                                  }
                              >
                                  {getEnumLabel(schedulerJobExecutionStatusEnum, schedulerJob.lastExecutionStatus)}
                              </Badge>,
                          ],
                      },
                      {
                          id: "cron",
                          columns: ["Cron Expression", schedulerJob.cronExpression],
                      },
                  ],
        [schedulerJob, schedulerJobExecutionStatusEnum],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget
                title="Scheduled Job Details"
                busy={isBusy}
                widgetButtons={buttons}
                titleSize="large"
                refreshAction={getFreshSchedulerJobDetails}
                widgetLockName={LockWidgetNameEnum.SchedulerJobDetail}
            >
                <br />

                <CustomTable headers={detailHeaders} data={detailData} />
            </Widget>

            {id && <SchedulerJobHistory uuid={id} />}

            <Dialog
                isOpen={confirmDelete}
                caption="Delete Scheduled Job"
                body="You are about to delete Scheduled Job. Is this what you want to do?"
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
                    { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
                ]}
            />
        </Container>
    );
}
