// import ProgressButton from "components/ProgressButton";
import ProgressButton from "components/ProgressButton";
import Widget from "components/Widget";
import { actions as enumActions, selectors as enumSelectors } from "ducks/enums";
import { actions as notificationsActions, selectors as notificationsSelectors } from "ducks/notifications";
import { actions as settingsActions, selectors as settingsSelectors } from "ducks/settings";
import { useEffect, useMemo } from "react";
import { Field, Form } from "react-final-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Form as BootstrapForm, ButtonGroup, Col, Container, FormGroup, Label, Row } from "reactstrap";

const NotificationsSetting = () => {
    const dispatch = useDispatch();
    const notificationsSettings = useSelector(settingsSelectors.notificationsSettings);
    const isUpdatingNotificationsSetting = useSelector(settingsSelectors.isUpdatingNotificationsSetting);
    const { NotificationType } = useSelector(enumSelectors.platformEnums);
    const platformEnums = useSelector(enumSelectors.platformEnums);
    const notificationInstances = useSelector(notificationsSelectors.notificationInstances);
    const isFetchingInstances = useSelector(notificationsSelectors.isFetchingNotificationInstances);

    useEffect(() => {
        dispatch(settingsActions.getNotificationsSettings());
        dispatch(enumActions.getPlatformEnums());
        dispatch(notificationsActions.listNotificationInstances());
    }, []);

    const isBusy = useMemo(() => isFetchingInstances, [isFetchingInstances]);

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

    const onSubmit = (values: any) => {
        if (!values?.notificationsMapping) return;

        const filteredValues = Object.entries(values.notificationsMapping)
            .filter(([key, value]) => value && typeof value === "object" && "value" in value && value.value !== null)
            .reduce((acc, [key, value]) => {
                acc[key] = (value as { value: unknown }).value?.toString() ?? "";
                return acc;
            }, {} as { [key: string]: string });

        const submitValues = Object.entries(filteredValues).reduce((acc, [key, value]) => {
            acc[key] = value.toString();
            return acc;
        }, {} as { [key: string]: string });

        dispatch(settingsActions.updateNotificationsSettings({ notificationsMapping: submitValues }));
    };

    console.log("initialValues", initialValues);

    return (
        <Container>
            <Widget title="Notifications Setting" titleSize="larger" busy={isBusy}>
                <Form initialValues={initialValues} onSubmit={onSubmit}>
                    {({ handleSubmit, pristine, submitting, valid, values }) => (
                        <BootstrapForm onSubmit={handleSubmit}>
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
                                            disabled={pristine || submitting || !valid}
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
        </Container>
    );
};

export default NotificationsSetting;
