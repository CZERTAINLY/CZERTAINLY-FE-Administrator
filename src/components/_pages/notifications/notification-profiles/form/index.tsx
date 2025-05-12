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
import { Form as BootstrapForm, Button, ButtonGroup } from 'reactstrap';
import { mutators } from 'utils/attributes/attributeEditorMutators';
import { isObjectSame } from 'utils/common-utils';
import { validateAlphaNumericWithSpecialChars, validatePositiveInteger, validateRequired, validateNonZeroInteger } from 'utils/validators';
import CustomSelect from 'components/Input/CustomSelect';
import { PlatformEnum, RecipientType } from 'types/openapi';
import SwitchField from 'components/Input/SwitchField';
import { NotificationProfileUpdateRequestModel } from 'types/notification-profiles';
import { LockWidgetNameEnum } from 'types/user-interface';
import DurationField, { getInputStringFromIso8601String, getIso8601StringFromInputString } from 'components/Input/DurationField';

interface OptionType {
    value: string;
    label: string;
}

interface FormValues {
    name?: string;
    recipient?: OptionType;
    recipientType?: OptionType;
    internalNotification?: boolean;
    description?: string;
    frequency?: string;
    repetitions?: number;
    notificationInstance?: OptionType;
}

export default function NotificationProfileForm() {
    const { uuid, version } = useParams();
    const editMode = uuid !== undefined && version !== undefined;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isFetchingDetail = useSelector(selectors.isFetchingDetail);
    const isUpdating = useSelector(selectors.isUpdating);
    const isCreating = useSelector(selectors.isCreating);

    const notificationProfile = useSelector(selectors.notificationProfile);
    const recipientTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.RecipientType));

    const notificationInstances = useSelector(notificationsSelectors.notificationInstances);
    const isFetchingNotificationInstances = useSelector(notificationsSelectors.isFetchingNotificationInstances);

    const isBusy = useMemo(
        () => isFetchingDetail || isFetchingNotificationInstances || isUpdating || isCreating,
        [isFetchingDetail, isFetchingNotificationInstances, isUpdating, isCreating],
    );

    useEffect(() => {
        dispatch(userAction.list());
        dispatch(groupAction.listGroups());
        dispatch(rolesActions.list());
        dispatch(notificationsActions.listNotificationInstances());
    }, [dispatch]);

    useEffect(() => {
        dispatch(actions.resetState());
        if (!uuid || !version) return;
        dispatch(actions.getNotificationProfileDetail({ uuid, version: Number(version) }));
    }, [dispatch, uuid, version]);

    const defaultValues: FormValues = useMemo(() => {
        if (editMode && notificationProfile) {
            return {
                name: notificationProfile.name,
                recipientType: {
                    label: getEnumLabel(recipientTypeEnum, notificationProfile.recipient.type),
                    value: notificationProfile.recipient.type,
                },
                internalNotification: notificationProfile.internalNotification,
                description: notificationProfile.description,
                frequency: notificationProfile.frequency ? getInputStringFromIso8601String(notificationProfile.frequency) : undefined,
                repetitions: notificationProfile.repetitions,
                ...(notificationProfile.recipient.uuid
                    ? {
                          recipient: {
                              label: notificationProfile.recipient.name!,
                              value: notificationProfile.recipient.uuid,
                          },
                      }
                    : {}),
                ...(notificationProfile.notificationInstance
                    ? {
                          notificationInstance: {
                              label: notificationProfile.notificationInstance.name,
                              value: notificationProfile.notificationInstance.uuid,
                          },
                      }
                    : {}),
            };
        } else {
            return {
                recipientType: {
                    label: getEnumLabel(recipientTypeEnum, RecipientType.None),
                    value: RecipientType.None,
                },
                internalNotification: false,
            };
        }
    }, [editMode, notificationProfile, recipientTypeEnum]);
    console.log(defaultValues);

    const onCancel = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const onSubmit = useCallback(
        (values: FormValues) => {
            const recipient = {
                recipientType: (values.recipientType?.value as RecipientType) ?? RecipientType.None,
            };
            switch (values.recipientType?.value) {
                case RecipientType.User:
                case RecipientType.Group:
                case RecipientType.Role:
                    Object.assign(recipient, { recipientUuid: values.recipient?.value });
                    break;
            }
            const updateNotificationProfileRequest: NotificationProfileUpdateRequestModel = {
                description: values.description,
                frequency: values.frequency ? getIso8601StringFromInputString(values.frequency) : undefined,
                repetitions: values.repetitions,
                internalNotification: values.internalNotification ?? false,
                notificationInstanceUuid: values.notificationInstance?.value,
                ...recipient,
            };
            console.log({ updateNotificationProfileRequest });

            if (editMode) {
                dispatch(
                    actions.updateNotificationProfile({
                        uuid,
                        notificationProfileEditRequest: updateNotificationProfileRequest,
                    }),
                );
            } else {
                dispatch(
                    actions.createNotificationProfile({
                        notificationProfileAddRequest: {
                            name: values.name ?? '',
                            ...updateNotificationProfileRequest,
                        },
                    }),
                );
            }
        },
        [dispatch, uuid, editMode],
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

    const notificationInstanceOptions = useMemo(
        () =>
            notificationInstances.map((instance) => ({
                label: instance.name,
                value: instance.uuid,
            })),
        [notificationInstances],
    );

    return (
        <Widget
            title={editMode ? 'Edit Notification Profile' : 'Create Notification Profile'}
            busy={isBusy}
            widgetLockName={LockWidgetNameEnum.NotificationProfileDetails}
        >
            <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<FormValues>() }}>
                {({ handleSubmit, pristine, submitting, values, valid, form }) => {
                    const isNotificationInstanceRequired =
                        values.recipientType?.value === RecipientType.Owner || values.recipientType?.value === RecipientType.None;
                    return (
                        <BootstrapForm onSubmit={handleSubmit}>
                            <TextField
                                label="Profile Name"
                                id="name"
                                validators={[validateAlphaNumericWithSpecialChars()]}
                                disabled={editMode}
                                required={true}
                            />

                            <TextField label="Description" id="description" inputType="textarea" validators={[]} />

                            <RecipientTypeFields />

                            <Field name="notificationInstance" validate={isNotificationInstanceRequired ? validateRequired() : undefined}>
                                {({ input, meta }) => (
                                    <CustomSelect
                                        {...input}
                                        label="Notification Instance"
                                        placeholder="Select Notification Instance"
                                        options={notificationInstanceOptions}
                                        onChange={(e) => form.change('notificationInstance', e as OptionType)}
                                        required={isNotificationInstanceRequired}
                                        error={
                                            meta.error &&
                                            meta.touched &&
                                            'Notification Instance is required if Recipient Type is Owner or None'
                                        }
                                    />
                                )}
                            </Field>

                            <SwitchField id="internalNotification" label="Send internal notifications" />

                            <DurationField
                                label="Frequency"
                                id="frequency"
                                description="Interval between repeated notification, in format: 0d 0h 0m 0s"
                            />
                            <TextField
                                label="Repetitions"
                                id="repetitions"
                                inputType="number"
                                validators={[validatePositiveInteger(), validateNonZeroInteger()]}
                                description="Maximum number of repetitions of the same notification"
                            />

                            <div className="d-flex justify-content-end">
                                <ButtonGroup>
                                    <ProgressButton
                                        title={editMode ? 'Save' : 'Create'}
                                        inProgressTitle={editMode ? 'Saving...' : 'Creating...'}
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

function RecipientTypeFields() {
    const form = useForm<FormValues>();
    const formState = useFormState<FormValues>();

    const recipientTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.RecipientType));

    const users = useSelector(userSelectors.users);
    const roles = useSelector(rolesSelectors.roles);
    const groups = useSelector(groupSelectors.certificateGroups);

    const recipientTypeOptions = useMemo(
        () =>
            Object.values(RecipientType).map((el) => ({
                label: getEnumLabel(recipientTypeEnum, el),
                value: el,
            })),
        [recipientTypeEnum],
    );
    const renderRecipientField = useCallback(() => {
        const recipientType = formState.values.recipientType?.value;
        let props = null;
        switch (recipientType) {
            case RecipientType.User:
                props = {
                    options: users.map((user) => ({ label: user.username, value: user.uuid })),
                    description: 'Selected User will be receiving the notifications.',
                    placeholder: 'Select User',
                };
                break;
            case RecipientType.Group:
                props = {
                    options: groups.map((group) => ({ label: group.name, value: group.uuid })),
                    description: 'Users in the selected Group will be receiving the notifications.',
                    placeholder: 'Select Group',
                };
                break;
            case RecipientType.Role:
                props = {
                    options: roles.map((roles) => ({ label: roles.name, value: roles.uuid })),
                    description: 'Users with the selected Role will be receiving the notifications.',
                    placeholder: 'Select Role',
                };
                break;
        }
        if (!props) return null;
        return (
            <Field name="recipient" validate={validateRequired()}>
                {({ input, meta }) => (
                    <CustomSelect
                        {...input}
                        label="Notification Recipient"
                        value={formState.values.recipient}
                        onChange={(e) => form.change('recipient', e as OptionType)}
                        error={meta.error && meta.touched && 'Recipient is required'}
                        required
                        {...props}
                    />
                )}
            </Field>
        );
    }, [formState.values, form, users, roles, groups]);

    return (
        <>
            <CustomSelect
                id="recipientType"
                inputId="recipientType"
                label="Recipient Type"
                placeholder="Select Recipient Type"
                options={recipientTypeOptions}
                value={formState.values.recipientType}
                onChange={(e) => {
                    form.change('recipientType', e as OptionType);
                    form.resetFieldState('notificationInstance');
                }}
                description="Recipient type of notifications managed by profile."
                required
            />
            {renderRecipientField()}
        </>
    );
}
