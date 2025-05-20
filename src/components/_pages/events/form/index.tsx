import TextField from 'components/Input/TextField';
import ProgressButton from 'components/ProgressButton';
import Widget from 'components/Widget';
import { actions, selectors } from 'ducks/notification-profiles';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions as groupAction, selectors as groupSelectors } from 'ducks/certificateGroups';
import { actions as rolesActions, selectors as rolesSelectors } from 'ducks/roles';
import { actions as userAction, selectors as userSelectors } from 'ducks/users';
import { actions as notificationsActions, selectors as notificationsSelectors } from 'ducks/notifications';
import { useCallback, useEffect, useMemo } from 'react';
import { Field, Form, useForm, useFormState } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { Form as BootstrapForm, Button, ButtonGroup, FormFeedback, FormGroup, FormText, Input, InputGroup, Label } from 'reactstrap';
import { mutators } from 'utils/attributes/attributeEditorMutators';
import { isObjectSame } from 'utils/common-utils';
import {
    validateAlphaNumericWithSpecialChars,
    validatePositiveInteger,
    validateRequired,
    validateNonZeroInteger,
    validateDuration,
} from 'utils/validators';
import CustomSelect from 'components/Input/CustomSelect';
import { PlatformEnum, RecipientType, Resource } from 'types/openapi';
import SwitchField from 'components/Input/SwitchField';
import { NotificationProfileUpdateRequestModel } from 'types/notification-profiles';
import { LockWidgetNameEnum } from 'types/user-interface';
import { getInputStringFromIso8601String, getIso8601StringFromInputString } from 'utils/duration';
import TriggerEditorWidget from 'components/TriggerEditorWidget';
import { TriggerDto } from 'types/rules';

interface OptionType {
    value: string;
    label: string;
}

interface FormValues {
    name?: string;
    resource?: OptionType;
    triggers?: TriggerDto[];
}

export default function EventForm() {
    const { id } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isFetchingDetail = useSelector(selectors.isFetchingDetail);
    const isUpdating = useSelector(selectors.isUpdating);
    const isCreating = useSelector(selectors.isCreating);

    const eventDetails = useMemo(
        () => ({
            uuid: '1',
            name: 'Event1',
            resource: Resource.Certificates,
        }),
        [],
    );

    const resourcesEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));

    const isBusy = useMemo(() => isFetchingDetail || isUpdating || isCreating, [isFetchingDetail, isUpdating, isCreating]);

    useEffect(() => {
        dispatch(userAction.list());
        dispatch(groupAction.listGroups());
        dispatch(rolesActions.list());
        dispatch(notificationsActions.listNotificationInstances());
    }, [dispatch]);

    useEffect(() => {
        dispatch(actions.resetState());
        if (!id) return;
        dispatch(actions.getNotificationProfileDetail({ uuid: id, version: 1 }));
    }, [dispatch, id]);

    const defaultValues: FormValues = useMemo(() => {
        return {
            name: eventDetails?.name,
            resource: {
                label: getEnumLabel(resourcesEnum, eventDetails?.resource ?? Resource.None),
                value: eventDetails?.resource,
            },
        };
    }, [eventDetails, resourcesEnum]);

    const onCancel = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const onSubmit = useCallback(
        (values: FormValues) => {
            console.log('trig', values.triggers);
            // const recipient = {
            //     recipientType: (values.recipientType?.value as RecipientType) ?? RecipientType.None,
            // };
            // switch (values.recipientType?.value) {
            //     case RecipientType.User:
            //     case RecipientType.Group:
            //     case RecipientType.Role:
            //         Object.assign(recipient, { recipientUuid: values.recipient?.value });
            //         break;
            // }
            // const updateNotificationProfileRequest: NotificationProfileUpdateRequestModel = {
            //     description: values.description,
            //     frequency: values.frequency ? getIso8601StringFromInputString(values.frequency) : undefined,
            //     repetitions: values.repetitions,
            //     internalNotification: values.internalNotification ?? false,
            //     notificationInstanceUuid: values.notificationInstance?.value,
            //     ...recipient,
            // };
            // console.log({ updateNotificationProfileRequest });
            // if (editMode) {
            //     dispatch(
            //         actions.updateNotificationProfile({
            //             uuid: id,
            //             notificationProfileEditRequest: updateNotificationProfileRequest,
            //         }),
            //     );
            // } else {
            //     dispatch(
            //         actions.createNotificationProfile({
            //             notificationProfileAddRequest: {
            //                 name: values.name ?? '',
            //                 ...updateNotificationProfileRequest,
            //             },
            //         }),
            //     );
            // }
        },
        [],
        // [dispatch, id],
    );

    const areDefaultValuesSame = useCallback(
        (values: FormValues) => {
            const areValuesSame = isObjectSame(
                values as unknown as Record<string, unknown>,
                defaultValues as unknown as Record<string, unknown>,
            );
            return areValuesSame;
        },
        [defaultValues],
    );

    return (
        <Widget title={'Edit Event'} busy={isBusy} widgetLockName={LockWidgetNameEnum.EventDetails}>
            <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<FormValues>() }}>
                {({ handleSubmit, pristine, submitting, values, valid, form }) => {
                    return (
                        <BootstrapForm onSubmit={handleSubmit}>
                            <TextField label="Event Name" id="name" validators={[validateAlphaNumericWithSpecialChars()]} disabled />
                            <CustomSelect label="Resource" id="resource" isDisabled value={values.resource} />
                            <TriggerEditorWidget
                                resource={values.resource?.value as Resource | undefined}
                                selectedTriggers={values.triggers ?? []}
                                onSelectedTriggersChange={(newTriggers) => {
                                    form.change('triggers', newTriggers);
                                }}
                            />

                            <div className="d-flex justify-content-end">
                                <ButtonGroup>
                                    <ProgressButton
                                        title={'Save'}
                                        inProgressTitle={'Saving...'}
                                        inProgress={submitting}
                                        disabled={areDefaultValuesSame(values) || isBusy}
                                    />

                                    <Button color="default" onClick={onCancel} disabled={submitting}>
                                        Cancel
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </BootstrapForm>
                    );
                }}
            </Form>
        </Widget>
    );
}
