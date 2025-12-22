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
import Switch from 'components/Switch';
import { PlatformEnum, Resource, SchedulerJobExecutionStatus } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';
import { getStrongFromCronExpression } from 'utils/dateUtil';
import Cron from 'react-cron-generator';
import { validateQuartzCronExpression, validateRequired } from 'utils/validators';
import { buildValidationRules } from 'utils/validators-helper';
import TextInput from 'components/TextInput';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { Clock, Info } from 'lucide-react';
import SchedulerJobHistory from './SchedulerJobHistory';
import { createWidgetDetailHeaders } from 'utils/widget';
import Breadcrumb from 'components/Breadcrumb';
import Container from 'components/Container';
import Button from 'components/Button';

interface EditFormValues {
    cronExpression: string | undefined;
}

const CronExpressionForm = ({
    newCronExpression,
    originalCronExpression,
    onSave,
    onCancel,
    onOpenCronModal,
}: {
    newCronExpression: string;
    originalCronExpression: string;
    onSave: (values: EditFormValues) => void;
    onCancel: () => void;
    onOpenCronModal: () => void;
}) => {
    const methods = useForm<EditFormValues>({
        mode: 'onTouched',
        defaultValues: { cronExpression: newCronExpression },
    });

    const { handleSubmit, formState, reset, control } = methods;
    const cronExpressionValue = useWatch({ control, name: 'cronExpression' });

    useEffect(() => {
        reset({ cronExpression: newCronExpression });
    }, [newCronExpression, reset]);

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSave)}>
                <Controller
                    name="cronExpression"
                    control={control}
                    rules={buildValidationRules([validateRequired(), validateQuartzCronExpression(cronExpressionValue)])}
                    render={({ field, fieldState }) => (
                        <div className="mb-4 space-y-4">
                            <TextInput
                                id="cronExpression"
                                label="Cron Expression"
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                invalid={!!fieldState.error && fieldState.isTouched}
                                error={fieldState.error?.message}
                                required
                                buttonRight={
                                    <button type="button" onClick={onOpenCronModal}>
                                        <Clock size={16} />
                                    </button>
                                }
                            />
                            {getStrongFromCronExpression(cronExpressionValue) && (
                                <p className="mt-1 text-sm color-gray-600">{getStrongFromCronExpression(cronExpressionValue)}</p>
                            )}
                        </div>
                    )}
                />
                <Container className="flex-row justify-end modal-footer" gap={4}>
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={formState.isSubmitting || !formState.isValid}>
                        Save
                    </Button>
                </Container>
            </form>
        </FormProvider>
    );
};

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
                          columns: ['One Time Only', <Switch checked={schedulerJob.oneTime} onChange={() => {}} id="oneTime" disabled />],
                      },
                      {
                          id: 'system',
                          columns: ['System Job', <Switch checked={schedulerJob.system} onChange={() => {}} id="system" disabled />],
                      },
                      {
                          id: 'enabled',
                          columns: ['Enabled', <Switch checked={schedulerJob.enabled} onChange={() => {}} id="enabled" disabled />],
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
                                  <span title={getStrongFromCronExpression(schedulerJob.cronExpression)}>
                                      <Info size={16} className="inline-block" />
                                  </span>
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
                    icon="delete"
                    buttons={[
                        { color: 'secondary', variant: 'outline', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                        { color: 'danger', onClick: onDeleteConfirmed, body: 'Delete' },
                    ]}
                />
                <Dialog
                    size="xl"
                    isOpen={editCronOpen}
                    caption="Edit CRON Expression"
                    body={
                        <CronExpressionForm
                            newCronExpression={newCronExpression}
                            originalCronExpression={originalCronExpression}
                            onSave={handleCronSave}
                            onCancel={() => {
                                setNewCronExpression(originalCronExpression);
                                setEditCronOpen(false);
                            }}
                            onOpenCronModal={() => setCronModalOpen(true)}
                        />
                    }
                    toggle={() => setEditCronOpen(false)}
                />

                <Dialog
                    size="xl"
                    isOpen={cronModalOpen}
                    caption="Select CRON Expression"
                    body={
                        <div className="preline-cron-wrapper">
                            <Cron value={newCronExpression} onChange={handleCronSelectChange} showResultText showResultCron />
                        </div>
                    }
                    toggle={() => setCronModalOpen(false)}
                    buttons={[
                        {
                            color: 'secondary',
                            variant: 'outline',
                            onClick: () => {
                                setNewCronExpression(originalCronExpression);
                                setCronModalOpen(false);
                            },
                            body: 'Cancel',
                        },
                        {
                            color: 'primary',
                            onClick: () => {
                                setCronModalOpen(false);
                            },
                            body: 'Ok',
                        },
                    ]}
                />
            </Container>
        </div>
    );
}
