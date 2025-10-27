import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions, selectors } from 'ducks/scheduler';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Badge from 'components/Badge';
import SwitchField from 'components/Input/SwitchField';
import { PlatformEnum, Resource, SchedulerJobExecutionStatus } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';
import { getStrongFromCronExpression } from 'utils/dateUtil';
import Cron from 'react-cron-generator';
import { validateQuartzCronExpression, validateRequired } from 'utils/validators';
import TextField from 'components/Input/TextField';
import { Form } from 'react-final-form';
import SchedulerJobHistory from './SchedulerJobHistory';
import { createWidgetDetailHeaders } from 'utils/widget';
import Breadcrumb from 'components/Breadcrumb';
import Container from 'components/Container';

interface EditFormValues {
    cronExpression: string | undefined;
}

export default function SchedulerJobDetail() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const schedulerJob = useSelector(selectors.schedulerJob);
    const isFetching = useSelector(selectors.isFetchingDetail);
    const isDeleting = useSelector(selectors.isDeleting);
    const isEnabling = useSelector(selectors.isEnabling);
    const isUpdatingCron = useSelector(selectors.isUpdatingCron);
    const [originalCronExpression, setOriginalCronExpression] = useState<string>('');
    const schedulerJobExecutionStatusEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.SchedulerJobExecutionStatus));
    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [editCronOpen, setEditCronOpen] = useState(false);
    const [newCronExpression, setNewCronExpression] = useState('');
    const [cronModalOpen, setCronModalOpen] = useState(false);

    const isBusy = useMemo(
        () => isFetching || isDeleting || isEnabling || isUpdatingCron,
        [isFetching, isDeleting, isEnabling, isUpdatingCron],
    );

    const getFreshSchedulerJobDetails = useCallback(() => {
        if (!id) return;
        dispatch(actions.getSchedulerJobDetail({ uuid: id }));
    }, [id, dispatch]);

    useEffect(() => {
        getFreshSchedulerJobDetails();
    }, [id, getFreshSchedulerJobDetails]);

    const onDeleteConfirmed = useCallback(() => {
        if (!schedulerJob) return;
        dispatch(actions.deleteSchedulerJob({ uuid: schedulerJob.uuid, redirect: true }));
        setConfirmDelete(false);
    }, [schedulerJob, dispatch]);

    const handleCronSave = useCallback(
        (values: EditFormValues) => {
            if (schedulerJob && values.cronExpression) {
                dispatch(actions.updateSchedulerJobCron({ uuid: schedulerJob.uuid, cronExpression: values.cronExpression }));
                setEditCronOpen(false);
            }
        },
        [schedulerJob, dispatch],
    );

    const handleCronSelectChange = (value: string) => {
        setNewCronExpression(value);
    };

    const openEditCronModal = useCallback(() => {
        if (schedulerJob) {
            setNewCronExpression(schedulerJob.cronExpression);
            setOriginalCronExpression(schedulerJob.cronExpression);
        }
        setEditCronOpen(true);
    }, [schedulerJob]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'trash',
                disabled: schedulerJob?.system ?? true,
                tooltip: 'Delete',
                onClick: () => {
                    setConfirmDelete(true);
                },
            },
            {
                icon: 'check',
                disabled: schedulerJob?.enabled ?? true,
                tooltip: 'Enable',
                onClick: () => {
                    dispatch(actions.enableSchedulerJob({ uuid: schedulerJob!.uuid }));
                },
            },
            {
                icon: 'times',
                disabled: !Boolean(schedulerJob?.enabled),
                tooltip: 'Disable',
                onClick: () => {
                    dispatch(actions.disableSchedulerJob({ uuid: schedulerJob!.uuid }));
                },
            },
            {
                icon: 'pencil',
                disabled: !schedulerJob,
                tooltip: 'Edit CRON Expression',
                onClick: openEditCronModal,
            },
        ],
        [dispatch, schedulerJob, openEditCronModal],
    );

    const detailHeaders: TableHeader[] = useMemo(() => createWidgetDetailHeaders(), []);

    const detailData: TableDataRow[] = useMemo(
        () =>
            !schedulerJob
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', schedulerJob.uuid],
                      },
                      {
                          id: 'name',
                          columns: ['Name', schedulerJob.jobName],
                      },
                      {
                          id: 'jobType',
                          columns: ['Job Type', schedulerJob.jobType ?? ''],
                      },
                      {
                          id: 'oneTime',
                          columns: ['One Time Only', <SwitchField label="" viewOnly={{ checked: schedulerJob.oneTime }} id="oneTime" />],
                      },
                      {
                          id: 'system',
                          columns: ['System Job', <SwitchField label="" viewOnly={{ checked: schedulerJob.system }} id="system" />],
                      },
                      {
                          id: 'enabled',
                          columns: ['Enabled', <SwitchField label="" viewOnly={{ checked: schedulerJob.enabled }} id="enabled" />],
                      },
                      {
                          id: 'status',
                          columns: [
                              'Last Execution Status',
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
                          ],
                      },
                      {
                          id: 'cron',
                          columns: [
                              'Cron Expression',
                              <>
                                  {schedulerJob.cronExpression}&nbsp;
                                  <i className="fa fa-info-circle" title={getStrongFromCronExpression(schedulerJob.cronExpression)}></i>
                              </>,
                          ],
                      },
                  ],
        [schedulerJob, schedulerJobExecutionStatusEnum],
    );

    return (
        <div>
            <Breadcrumb
                items={[
                    { label: `${getEnumLabel(resourceEnum, Resource.Jobs)} Inventory`, href: '/jobs' },
                    { label: schedulerJob?.jobName || 'Scheduled Job Details', href: '' },
                ]}
            />
            <Container>
                <Widget
                    title="Scheduled Job Details"
                    busy={isBusy}
                    widgetButtons={buttons}
                    titleSize="large"
                    refreshAction={getFreshSchedulerJobDetails}
                    widgetLockName={LockWidgetNameEnum.SchedulerJobDetail}
                >
                    <CustomTable headers={detailHeaders} data={detailData} />
                </Widget>
                {id && <SchedulerJobHistory uuid={id} />}

                <Dialog
                    isOpen={confirmDelete}
                    caption="Delete Scheduled Job"
                    body="You are about to delete Scheduled Job. Is this what you want to do?"
                    toggle={() => setConfirmDelete(false)}
                    buttons={[
                        { color: 'danger', onClick: onDeleteConfirmed, body: 'Yes, delete' },
                        { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                    ]}
                />
                <Dialog
                    size="lg"
                    isOpen={editCronOpen}
                    caption="Edit CRON Expression"
                    body={
                        <Form
                            onSubmit={handleCronSave}
                            initialValues={{ cronExpression: newCronExpression }}
                            render={({ handleSubmit, values }) => (
                                <form onSubmit={handleSubmit}>
                                    <TextField
                                        id="cronExpression"
                                        label="Cron Expression"
                                        validators={[validateRequired(), validateQuartzCronExpression(values.cronExpression)]}
                                        description={getStrongFromCronExpression(values.cronExpression)}
                                        inputGroupIcon={{
                                            icon: 'fa fa-stopwatch',
                                            onClick: () => setCronModalOpen(true),
                                        }}
                                    />
                                    <div className="d-flex justify-content-between mt-3">
                                        <button type="submit" className="btn btn-primary">
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => {
                                                setNewCronExpression(originalCronExpression);
                                                setEditCronOpen(false);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        />
                    }
                    toggle={() => setEditCronOpen(false)}
                />

                <Dialog
                    size="lg"
                    isOpen={cronModalOpen}
                    caption="Select CRON Expression"
                    body={
                        <div className="d-flex justify-content-center">
                            <Cron value={newCronExpression} onChange={handleCronSelectChange} showResultText showResultCron />
                        </div>
                    }
                    toggle={() => setCronModalOpen(false)}
                    buttons={[
                        {
                            color: 'primary',
                            onClick: () => {
                                setCronModalOpen(false);
                            },
                            body: 'Ok',
                        },
                        {
                            color: 'secondary',
                            onClick: () => {
                                setNewCronExpression(originalCronExpression);
                                setCronModalOpen(false);
                            },
                            body: 'Cancel',
                        },
                    ]}
                />
            </Container>
        </div>
    );
}
