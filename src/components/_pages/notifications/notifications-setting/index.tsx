import TabLayout from 'components/Layout/TabLayout';
import ProgressButton from 'components/ProgressButton';
import Widget from 'components/Widget';
import { selectors as enumSelectors } from 'ducks/enums';
import { actions as notificationActions, selectors as notificationsSelectors } from 'ducks/notifications';
import { actions as settingsActions, selectors as settingsSelectors } from 'ducks/settings';
import { useCallback, useEffect, useMemo } from 'react';
import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Form as BootstrapForm, ButtonGroup, Col, Container, FormGroup, Label, Row } from 'reactstrap';
import { PlatformEnum } from 'types/openapi';
import { isObjectSame, removeNullValues } from 'utils/common-utils';
import NotificationInstanceList from '../notifications-instances';

type FormValues = {
    notificationsMapping: {
        [key: string]: {
            value: string;
        };
    };
};

const NotificationsSetting = () => {
    const dispatch = useDispatch();

    const notificationsSettings = useSelector(settingsSelectors.notificationsSettings);
    const isUpdatingNotificationsSetting = useSelector(settingsSelectors.isUpdatingNotificationsSetting);
    const notificationType = useSelector(enumSelectors.platformEnum(PlatformEnum.NotificationType));
    const notificationInstances = useSelector(notificationsSelectors.notificationInstances);
    const isFetchingInstances = useSelector(notificationsSelectors.isFetchingNotificationInstances);
    const isFetchingNotificationsSetting = useSelector(settingsSelectors.isFetchingNotificationsSetting);

    const getFreshNotificationSettings = useCallback(() => {
        dispatch(settingsActions.getNotificationsSettings());
    }, [dispatch]);

    useEffect(() => {
        getFreshNotificationSettings();
    }, [getFreshNotificationSettings]);

    useEffect(() => {
        dispatch(notificationActions.listNotificationInstances());
    }, [dispatch]);

    const isBusy = useMemo(
        () => isFetchingInstances || isUpdatingNotificationsSetting || isFetchingNotificationsSetting,
        [isFetchingInstances, isUpdatingNotificationsSetting, isFetchingNotificationsSetting],
    );

    const notificationsSelects = useMemo(() => {
        if (notificationType) {
            return Object.values(notificationType);
        }
        return [];
    }, [notificationType]);

    const notificationsOptions = useMemo(() => {
        if (notificationInstances) {
            return notificationInstances.map((instance) => ({
                value: instance.uuid,
                label: instance.name,
            }));
        }
        return [];
    }, [notificationInstances]);

    const initialValues = useMemo(() => {
        if (!notificationsSettings) return {};
        const notificationsMapping = Object.entries(notificationsSettings.notificationsMapping)
            .filter(([key, value]) => notificationsOptions.find((option) => option.value === value)?.label !== undefined)
            .reduce(
                (acc, [key, value]) => {
                    const option = notificationsOptions.find((option) => option.value === value);
                    acc[key] = { value, label: option?.label ?? '' };
                    return acc;
                },
                {} as { [key: string]: { value: string; label: string } },
            );

        return { notificationsMapping };
    }, [notificationsSettings, notificationsOptions]);

    const onSubmit = useCallback(
        (values: FormValues) => {
            if (!values?.notificationsMapping) return;

            const filteredValues = Object.entries(values.notificationsMapping)
                .filter(([key, value]) => value?.value != null)
                .reduce(
                    (acc, [key, value]) => {
                        acc[key] = value.value;
                        return acc;
                    },
                    {} as { [key: string]: string },
                );

            const submitValues = Object.entries(filteredValues).reduce(
                (acc, [key, value]) => {
                    acc[key] = value.toString();
                    return acc;
                },
                {} as { [key: string]: string },
            );

            dispatch(settingsActions.updateNotificationsSettings({ notificationsMapping: submitValues }));
        },
        [dispatch],
    );

    const areDefaultValuesSame = useCallback(
        (values: FormValues) => {
            const nonNullValues = removeNullValues(values);
            const areValuesSame = isObjectSame(nonNullValues, initialValues);
            return areValuesSame;
        },
        [initialValues],
    );

    return (
        <Container className="themed-container" fluid>
            <TabLayout
                tabs={[
                    {
                        title: 'Notification Instances',
                        content: <NotificationInstanceList />,
                    },
                    {
                        title: 'Configuration',
                        content: (
                            <Widget
                                refreshAction={getFreshNotificationSettings}
                                title="Notifications Instances Settings"
                                titleSize="larger"
                                busy={isBusy}
                            >
                                <br />
                                <Form initialValues={initialValues} onSubmit={onSubmit}>
                                    {({ handleSubmit, pristine, submitting, valid, values }) => (
                                        <BootstrapForm onSubmit={handleSubmit} className="mt-2">
                                            <Row>
                                                {notificationsSelects.map((notificationSelect) => (
                                                    <Col key={notificationSelect.code} md={6}>
                                                        <Field name={`notificationsMapping[${notificationSelect.code}]`}>
                                                            {({ input, meta }) => (
                                                                <FormGroup>
                                                                    <Label for={`notificationInstance${notificationSelect.code}Select`}>
                                                                        {notificationSelect.label}
                                                                    </Label>
                                                                    <Select
                                                                        {...input}
                                                                        id={`notificationInstance${notificationSelect.code}`}
                                                                        inputId={`notificationInstance${notificationSelect.code}Select`}
                                                                        maxMenuHeight={140}
                                                                        menuPlacement="auto"
                                                                        options={notificationsOptions}
                                                                        placeholder={`Select Notification Instance`}
                                                                        isClearable={true}
                                                                    />
                                                                    <small className="form-text text-dark">
                                                                        {notificationSelect?.description}
                                                                    </small>
                                                                </FormGroup>
                                                            )}
                                                        </Field>
                                                    </Col>
                                                ))}
                                            </Row>
                                            {
                                                <div className="d-flex justify-content-end">
                                                    <ButtonGroup>
                                                        <ProgressButton
                                                            title={'Apply'}
                                                            inProgressTitle={'Applying..'}
                                                            disabled={
                                                                submitting || isUpdatingNotificationsSetting || areDefaultValuesSame(values)
                                                            }
                                                            inProgress={submitting || isUpdatingNotificationsSetting}
                                                            type="submit"
                                                        />
                                                    </ButtonGroup>
                                                </div>
                                            }
                                        </BootstrapForm>
                                    )}
                                </Form>
                            </Widget>
                        ),
                    },
                ]}
            />
        </Container>
    );
};

export default NotificationsSetting;
