import TabLayout from "components/Layout/TabLayout";
import ProgressButton from "components/ProgressButton";
import Widget from "components/Widget";
import { actions as enumActions, selectors as enumSelectors } from "ducks/enums";
import { actions as notificationsActions, selectors as notificationsSelectors } from "ducks/notifications";
import { actions as settingsActions, selectors as settingsSelectors } from "ducks/settings";
import { useCallback, useEffect, useMemo } from "react";
import { Field, Form } from "react-final-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { Form as BootstrapForm, Button, ButtonGroup, Col, Container, FormGroup, Label, Row } from "reactstrap";
import NotificationInstanceList from "../notifications-instances";

type FormValues = {
    notificationsMapping: {
        [key: string]: {
            value: string;
        };
    };
};

const NotificationsSetting = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const notificationsSettings = useSelector(settingsSelectors.notificationsSettings);
    const isUpdatingNotificationsSetting = useSelector(settingsSelectors.isUpdatingNotificationsSetting);
    const { NotificationType } = useSelector(enumSelectors.platformEnums);
    const notificationInstances = useSelector(notificationsSelectors.notificationInstances);
    const isFetchingInstances = useSelector(notificationsSelectors.isFetchingNotificationInstances);
    useEffect(() => {
        dispatch(settingsActions.getNotificationsSettings());
        dispatch(enumActions.getPlatformEnums());
        dispatch(notificationsActions.listNotificationInstances());
    }, []);
    const onCancelClick = useCallback(() => navigate(-1), [navigate]);

    const isBusy = useMemo(
        () => isFetchingInstances || isUpdatingNotificationsSetting,
        [isFetchingInstances, isUpdatingNotificationsSetting],
    );

    const notificationsSelects = useMemo(() => {
        if (NotificationType) {
            return Object.values(NotificationType);
        }
        return [];
    }, [NotificationType]);

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
        const notificationsMapping = Object.entries(notificationsSettings.notificationsMapping).reduce((acc, [key, value]) => {
            acc[key] = { value, label: notificationsOptions.find((option) => option.value === value)?.label ?? "" };
            return acc;
        }, {} as { [key: string]: { value: string; label: string } });
        return { notificationsMapping };
    }, [notificationsSettings, notificationsOptions]);

    const onSubmit = useCallback(
        (values: FormValues) => {
            if (!values?.notificationsMapping) return;

            const filteredValues = Object.entries(values.notificationsMapping)
                .filter(([key, value]) => value?.value != null)
                .reduce((acc, [key, value]) => {
                    acc[key] = value.value;
                    return acc;
                }, {} as { [key: string]: string });

            const submitValues = Object.entries(filteredValues).reduce((acc, [key, value]) => {
                acc[key] = value.toString();
                return acc;
            }, {} as { [key: string]: string });

            dispatch(settingsActions.updateNotificationsSettings({ notificationsMapping: submitValues }));
        },
        [dispatch],
    );

    return (
        <Container>
            <Widget busy={isBusy}>
                <TabLayout
                    tabs={[
                        {
                            title: "Notification Instances",
                            content: <NotificationInstanceList />,
                        },
                        {
                            title: "Setting",
                            content: (
                                <Widget title="Notifications Instances Settings">
                                    <Form initialValues={initialValues} onSubmit={onSubmit}>
                                        {({ handleSubmit, pristine, submitting, valid, values }) => (
                                            <BootstrapForm onSubmit={handleSubmit} className="mt-2">
                                                <Row>
                                                    {notificationsSelects.map((notificationSelect) => (
                                                        <Col key={notificationSelect.code} md={6}>
                                                            <Field name={`notificationsMapping[${notificationSelect.code}]`}>
                                                                {({ input, meta }) => (
                                                                    <FormGroup>
                                                                        <Label for="raProfile">{notificationSelect.label}</Label>
                                                                        <Select
                                                                            {...input}
                                                                            id="raProfile"
                                                                            maxMenuHeight={140}
                                                                            menuPlacement="auto"
                                                                            options={notificationsOptions}
                                                                            placeholder={`Select to change ${notificationSelect.label}`}
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
                                                                title={"Submit"}
                                                                inProgressTitle={"Submitting"}
                                                                disabled={submitting || isUpdatingNotificationsSetting}
                                                                inProgress={submitting || isUpdatingNotificationsSetting}
                                                                type="submit"
                                                            />
                                                        </ButtonGroup>
                                                        <Button color="default" onClick={onCancelClick} disabled={submitting}>
                                                            Cancel
                                                        </Button>
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
            </Widget>
        </Container>
    );
};

export default NotificationsSetting;
