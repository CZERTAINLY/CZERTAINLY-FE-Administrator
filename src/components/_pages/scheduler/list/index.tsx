import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Badge, Container } from 'reactstrap';

import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { EntityType } from 'ducks/filters';
import { selectors as pagingSelectors } from 'ducks/paging';
import { actions, selectors } from 'ducks/scheduler';

import BooleanBadge from 'components/BooleanBadge/BooleanBadge';
import { TableDataRow, TableHeader } from 'components/CustomTable';
import PagedList from 'components/PagedList/PagedList';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { SearchRequestModel } from 'types/certificate';
import { PlatformEnum, SchedulerJobExecutionStatus } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';

function SchedulerJobsList() {
    const dispatch = useDispatch();

    const schedulerJobs = useSelector(selectors.schedulerJobs);
    const isDeleting = useSelector(selectors.isDeleting);
    const isEnabling = useSelector(selectors.isEnabling);
    const isBusy = isDeleting || isEnabling;

    const schedulerJobExecutionStatusEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.SchedulerJobExecutionStatus));

    const checkedRows = useSelector(pagingSelectors.checkedRows(EntityType.SCHEDULER));

    const onEnableClick = useCallback(() => {
        dispatch(actions.bulkEnableSchedulerJobs({ uuids: checkedRows }));
    }, [checkedRows, dispatch]);

    const onDisableClick = useCallback(() => {
        dispatch(actions.bulkDisableSchedulerJobs({ uuids: checkedRows }));
    }, [checkedRows, dispatch]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'check',
                disabled: checkedRows.length === 0,
                tooltip: 'Enable',
                onClick: () => {
                    onEnableClick();
                },
            },
            {
                icon: 'times',
                disabled: checkedRows.length === 0,
                tooltip: 'Disable',
                onClick: () => {
                    onDisableClick();
                },
            },
        ],
        [checkedRows.length, onDisableClick, onEnableClick],
    );

    const schedulerJobsRowHeaders: TableHeader[] = useMemo(
        () => [
            {
                content: 'Name',
                sortable: true,
                sort: 'asc',
                id: 'name',
                width: 'auto',
            },
            {
                content: 'Job Type',
                sortable: true,
                sort: 'asc',
                id: 'jobtype',
                width: 'auto',
            },
            {
                content: 'Cron Expression',
                id: 'cron',
                width: '60%',
            },
            {
                content: 'Last Execution Status',
                sortable: true,
                sort: 'asc',
                id: 'status',
                width: 'auto',
            },
            {
                content: 'System',
                sortable: true,
                sort: 'asc',
                id: 'system',
                width: 'auto',
            },
            {
                content: 'One Time Only',
                sortable: true,
                sort: 'asc',
                id: 'onetime',
                width: 'auto',
            },
            {
                content: 'Enabled',
                sortable: true,
                sort: 'asc',
                id: 'enabled',
                width: 'auto',
            },
        ],
        [],
    );

    const schedulerJobList: TableDataRow[] = useMemo(
        () =>
            schedulerJobs.map((schedulerJob) => ({
                id: schedulerJob.uuid,
                columns: [
                    <Link to={`./detail/${schedulerJob.uuid}`}>{schedulerJob.jobName}</Link>,
                    schedulerJob.jobType,
                    schedulerJob.cronExpression,
                    <Badge
                        color={
                            schedulerJob.lastExecutionStatus === SchedulerJobExecutionStatus.Failed
                                ? 'danger'
                                : schedulerJob.lastExecutionStatus === SchedulerJobExecutionStatus.Succeeded
                                  ? 'success'
                                  : 'primary'
                        }
                    >
                        {getEnumLabel(schedulerJobExecutionStatusEnum, schedulerJob.lastExecutionStatus)}
                    </Badge>,
                    <BooleanBadge value={schedulerJob.system} />,
                    <BooleanBadge value={schedulerJob.oneTime} />,
                    <BooleanBadge value={schedulerJob.enabled} />,
                ],
            })),
        [schedulerJobs, schedulerJobExecutionStatusEnum],
    );

    const onListCallback = useCallback((pagination: SearchRequestModel) => dispatch(actions.listSchedulerJobs(pagination)), [dispatch]);

    return (
        <Container className="themed-container" fluid>
            <PagedList
                entity={EntityType.SCHEDULER}
                onListCallback={onListCallback}
                onDeleteCallback={(uuids) => uuids.forEach((uuid) => dispatch(actions.deleteSchedulerJob({ uuid, redirect: false })))}
                headers={schedulerJobsRowHeaders}
                data={schedulerJobList}
                isBusy={isBusy}
                addHidden={true}
                title="Scheduled Jobs Store"
                entityNameSingular="a Scheduled Job"
                entityNamePlural="Scheduled Jobs"
                pageWidgetLockName={LockWidgetNameEnum.ListOfScheduler}
                additionalButtons={buttons}
            />
        </Container>
    );
}

export default SchedulerJobsList;
