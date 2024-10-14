import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';

import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';

import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions, selectors } from 'ducks/scheduler';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Badge, Container, Button, Modal, ModalFooter, ModalHeader, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap';

import SwitchField from 'components/Input/SwitchField';
import { PlatformEnum, SchedulerJobExecutionStatus } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';
import { getStrongFromCronExpression } from 'utils/dateUtil';

import SchedulerJobHistory from './SchedulerJobHistory';

export default function SchedulerJobDetail() {
    const dispatch = useDispatch();

    const { id } = useParams();

    const schedulerJob = useSelector(selectors.schedulerJob);

    const isFetching = useSelector(selectors.isFetchingDetail);
    const isDeleting = useSelector(selectors.isDeleting);
    const isEnabling = useSelector(selectors.isEnabling);

    const schedulerJobExecutionStatusEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.SchedulerJobExecutionStatus));

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [Editmodel, setEditmodel] = useState<boolean>(false);

    const isBusy = useMemo(() => isFetching || isDeleting || isEnabling, [isFetching, isDeleting, isEnabling]);

    const getFreshSchedulerJobDetails = useCallback(() => {
        if (!id) return;
        dispatch(actions.getSchedulerJobDetail({ uuid: id }));
    }, [id, dispatch]);
    const [CronExpression, setCronExpression] = useState(schedulerJob?.cronExpression);

    const [CronError, setCronError] = useState<string | null>(null);


    useEffect(() => {
        getFreshSchedulerJobDetails();
    }, [id, getFreshSchedulerJobDetails]);

    const editSchedulejob = () => {
        setEditmodel(true);
        setCronExpression(schedulerJob?.cronExpression);
    };
    const saveEditedJob = useCallback(() => {
        console.log("In", schedulerJob)
        if (!schedulerJob) return;
        console.log("out", schedulerJob)
    
        dispatch(actions.updateSchedulerJob({
            uuid: schedulerJob.uuid, 
            updateScheduledJob: {                
                jobName: schedulerJob.jobName,
                cronExpression: CronExpression,
            }
          }));
        
         setEditmodel(false)
    },[CronExpression])
    
  
    const isValidCronExpression = (expression: string) => {
         const cronRegex = /^([0-5]?[0-9]\/[1-9][0-9]*)\*{3}\?(\*)$/;
        return cronRegex.test(expression);
    };
    const handlecronchage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const validexp = isValidCronExpression;
        console.log(validexp);
        setCronExpression(value);
        if (!validexp) {
            // setCronExpression(value)
            // setCronError(null);
        }
        else {
            // setCronError("Error")
        }

    }

    const onDeleteConfirmed = useCallback(() => {
        if (!schedulerJob) return;

        dispatch(actions.deleteSchedulerJob({ uuid: schedulerJob.uuid, redirect: true }));
        setConfirmDelete(false);
    }, [schedulerJob, dispatch]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'edit',
                disabled: schedulerJob?.system ?? true,
                tooltip: 'Edit',
                onClick: () => {
                    editSchedulejob();
                },
            },
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
        ],
        [dispatch, schedulerJob],
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
            <Modal isOpen={Editmodel} toggle={editSchedulejob} modalTransition={{ timeout: 2000 }}>
                <Form onSubmit={saveEditedJob}>
                    <ModalHeader toggle={editSchedulejob}>Edit Scheduled Job</ModalHeader>

                    <ModalBody>
                        <FormGroup>
                            <Label for="UUID">UUID</Label>
                            <Input
                                type="text"
                                id="UUID"
                                value={schedulerJob?.uuid}
                           
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="CronExpression">CronExpression</Label>
                            <Input
                                type="text"
                                id="CronExpression"
                                value={CronExpression}
                                onChange={handlecronchage}
                     
                            />
                            <p className='text-danger'> {CronError}</p>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary">Save Changes</Button>{' '}
                        <Button color="secondary" onClick={() => setEditmodel(false)}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>
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
        </Container>
    );
}
