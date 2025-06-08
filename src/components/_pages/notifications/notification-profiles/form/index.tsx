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
import { PlatformEnum, RecipientType } from 'types/openapi';
import SwitchField from 'components/Input/SwitchField';
import { NotificationProfileUpdateRequestModel } from 'types/notification-profiles';
import { LockWidgetNameEnum } from 'types/user-interface';
import { getInputStringFromIso8601String, getIso8601StringFromInputString } from 'utils/duration';

interface OptionType {
    value: string;
    label: string;
}

interface FormValues {
    name?: string;
    recipients?: OptionType[];
    recipientType?: OptionType;
    internalNotification?: boolean;
    description?: string;
    frequency?: string;
    repetitions?: number;
    notificationInstance?: OptionType;
}

export default function NotificationProfileForm() {
    const { id, version } = useParams();
    const editMode = id !== undefined && version !== undefined;

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
        if (!id || !version) return;
        dispatch(actions.getNotificationProfileDetail({ uuid: id, version: Number(version) }));
    }, [dispatch, id, version]);

    const defaultValues: FormValues = useMemo(() => {
        if (editMode && notificationProfile) {
            return {
                name: notificationProfile.name,
                recipientType: {
                    label: getEnumLabel(recipientTypeEnum, notificationProfile.recipientType),
                    value: notificationProfile.recipientType,
                },
                recipients: [],
                internalNotification: notificationProfile.internalNotification,
                description: notificationProfile.description,
                frequency: notificationProfile.frequency ? getInputStringFromIso8601String(notificationProfile.frequency) : undefined,
                repetitions: notificationProfile.repetitions,
                ...(notificationProfile.recipients
                    ? {
                          recipients: notificationProfile.recipients.map((recipient) => ({
                              label: recipient.name,
                              value: recipient.uuid,
                          })),
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
                recipients: [],
                internalNotification: false,
            };
        }
    }, [editMode, notificationProfile, recipientTypeEnum]);

    const onCancel = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const onSubmit = useCallback(
        (values: FormValues) => {
            const recipients = {
                recipientType: (values.recipientType?.value as RecipientType) ?? RecipientType.None,
            };
            switch (values.recipientType?.value) {
                case RecipientType.User:
                case RecipientType.Group:
                case RecipientType.Role:
                    Object.assign(recipients, { recipientUuids: values.recipients?.map((recipient) => recipient.value) });
                    break;
            }
            const updateNotificationProfileRequest: NotificationProfileUpdateRequestModel = {
                description: values.description,
                frequency: values.frequency ? getIso8601StringFromInputString(values.frequency) : undefined,
                repetitions: values.repetitions,
                internalNotification: values.internalNotification ?? false,
                notificationInstanceUuid: values.notificationInstance?.value,
                ...recipients,
            };

            if (editMode) {
                dispatch(
                    actions.updateNotificationProfile({
                        uuid: id,
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
        [dispatch, id, editMode],
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
                    const type = values.recipientType?.value;
                    const isNotificationInstanceRequired =
                        type === RecipientType.Owner ||
                        type === RecipientType.None ||
                        ((type === RecipientType.User || type === RecipientType.Role || type === RecipientType.Group) &&
                            !values.internalNotification);
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
                                        isClearable
                                        label="Notification Instance"
                                        placeholder="Select Notification Instance"
                                        options={notificationInstanceOptions}
                                        onChange={(e) => form.change('notificationInstance', e as OptionType)}
                                        required={isNotificationInstanceRequired}
                                        error={
                                            meta.error &&
                                            meta.touched &&
                                            'Notification Instance is required if Recipient Type is Owner or None, or if the send internal notifications is false'
                                        }
                                    />
                                )}
                            </Field>

                            <SwitchField
                                id="internalNotification"
                                label="Send internal notifications"
                                disabled={type === RecipientType.Owner || type === RecipientType.None}
                            />

                            <Field name="frequency" validate={validateDuration()}>
                                {({ input, meta }) => {
                                    const isInvalid = !!meta.error && meta.touched;
                                    return (
                                        <FormGroup>
                                            <Label for="frequency">Frequency</Label>
                                            <InputGroup>
                                                <Input
                                                    {...input}
                                                    type="text"
                                                    valid={!meta.error && meta.touched}
                                                    invalid={isInvalid}
                                                    placeholder="ex: 5d 45m"
                                                />
                                            </InputGroup>
                                            {!isInvalid && <FormText>Enter duration in format: 0d 0h 0m 0s</FormText>}
                                            <FormFeedback className={isInvalid ? 'd-block' : ''}>{meta.error}</FormFeedback>
                                        </FormGroup>
                                    );
                                }}
                            </Field>
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
                    description: 'Selected Users will be receiving the notifications.',
                    placeholder: 'Select Users',
                };
                break;
            case RecipientType.Group:
                props = {
                    options: groups.map((group) => ({ label: group.name, value: group.uuid })),
                    description: 'Users in the selected Groups will be receiving the notifications.',
                    placeholder: 'Select Groups',
                };
                break;
            case RecipientType.Role:
                props = {
                    options: roles.map((roles) => ({ label: roles.name, value: roles.uuid })),
                    description: 'Users with the selected Roles will be receiving the notifications.',
                    placeholder: 'Select Roles',
                };
                break;
        }
        if (!props) return null;
        return (
            <Field name="recipients" validate={validateRequired()}>
                {({ input, meta }) => (
                    <CustomSelect
                        {...input}
                        label="Notification Recipients"
                        onChange={(e) => form.change('recipients', e as OptionType[])}
                        error={meta.error && meta.touched && 'At least one recipient is required'}
                        closeMenuOnSelect={false}
                        isMulti
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
                    form.change('recipients');
                    form.resetFieldState('notificationInstance');
                    switch ((e as OptionType).value) {
                        case RecipientType.None:
                        case RecipientType.Owner:
                            form.change('internalNotification', false);
                    }
                }}
                description="Recipient type of notifications managed by profile."
                required
            />
            {renderRecipientField()}
        </>
    );
}
