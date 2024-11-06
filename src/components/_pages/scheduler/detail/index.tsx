import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';

import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions, selectors } from 'ducks/scheduler';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Badge, Container, Input, InputGroup, Button, InputGroupText } from 'reactstrap';
import SwitchField from 'components/Input/SwitchField';
import { PlatformEnum, SchedulerJobExecutionStatus } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';
import { getStrongFromCronExpression } from 'utils/dateUtil';

import SchedulerJobHistory from './SchedulerJobHistory';
import Cron from 'react-cron-generator';

export default function SchedulerJobDetail() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const schedulerJob = useSelector(selectors.schedulerJob);

    const isFetching = useSelector(selectors.isFetchingDetail);
    const isDeleting = useSelector(selectors.isDeleting);
    const isEnabling = useSelector(selectors.isEnabling);
    const isUpdatingCron = useSelector(selectors.isUpdatingCron);

    const schedulerJobExecutionStatusEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.SchedulerJobExecutionStatus));

    const [confirmDelete, setConfirmDelete] = useState(false);
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

    const handleCronSave = useCallback(() => {
        if (schedulerJob && newCronExpression) {
            dispatch(actions.updateSchedulerJobCron({ uuid: schedulerJob.uuid, cronExpression: newCronExpression }));
            setEditCronOpen(false);
        }
    }, [schedulerJob, dispatch, newCronExpression]);

    const openEditCronModal = useCallback(() => {
        if (schedulerJob) {
            setNewCronExpression(schedulerJob.cronExpression);
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
                icon: 'edit',
                disabled: !schedulerJob,
                tooltip: 'Edit CRON Expression',
                onClick: openEditCronModal,
            },
        ],
        [dispatch, schedulerJob, openEditCronModal],
    );

    const detailHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'property',
                content: 'Property',
            },
            {
                id: 'value',
                content: 'Value',
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
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Yes, delete' },
                    { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />
            <Dialog
                isOpen={editCronOpen}
                caption="Edit CRON Expression"
                body={
                    <InputGroup>
                        <Input
                            type="text"
                            value={newCronExpression}
                            onChange={(e) => setNewCronExpression(e.target.value)}
                            placeholder="Enter new CRON expression"
                        />
                        <InputGroupText>
                            <Button color="link" onClick={() => setCronModalOpen(true)}>
                                <i className="fa fa-stopwatch" />
                            </Button>
                        </InputGroupText>
                    </InputGroup>
                }
                toggle={() => setEditCronOpen(false)}
                buttons={[
                    { color: 'primary', onClick: handleCronSave, body: 'Save' },
                    { color: 'secondary', onClick: () => setEditCronOpen(false), body: 'Cancel' },
                ]}
            />
            <Dialog
                isOpen={cronModalOpen}
                caption="Select CRON Expression"
                body={<Cron value={newCronExpression} onChange={(value) => setNewCronExpression(value)} showResultText showResultCron />}
                toggle={() => setCronModalOpen(false)}
                buttons={[
                    {
                        color: 'primary',
                        onClick: () => {
                            handleCronSave();
                            setCronModalOpen(false);
                        },
                        body: 'Ok',
                    },
                    {
                        color: 'secondary',
                        onClick: () => setCronModalOpen(false),
                        body: 'Cancel',
                    },
                ]}
            />
        </Container>
    );
}
