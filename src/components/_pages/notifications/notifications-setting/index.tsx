import Widget from "components/Widget";
import { actions as enumActions, selectors as enumSelectors } from "ducks/enums";
import { actions as notificationsActions, selectors as notificationsSelectors } from "ducks/notifications";
import { actions as settingsActions, selectors as settingsSelectors } from "ducks/settings";
import { useEffect, useMemo } from "react";
import { Field, Form } from "react-final-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Form as BootstrapForm, Container, FormGroup, Label } from "reactstrap";

const NotificationsSetting = () => {
    const dispatch = useDispatch();
    const notificationsSettings = useSelector(settingsSelectors.notificationsSettings);
    const { NotificationType } = useSelector(enumSelectors.platformEnums);
    const platformEnums = useSelector(enumSelectors.platformEnums);
    const notificationInstances = useSelector(notificationsSelectors.notificationInstances);
    console.log("platformEnums", platformEnums);
    console.log("not", { notificationsSettings, NotificationType, notificationInstances });
    useEffect(() => {
        dispatch(settingsActions.getNotificationsSettings());
        dispatch(enumActions.getPlatformEnums());
        dispatch(notificationsActions.listNotificationInstances());
    }, []);

    const notificationsSelects = useMemo(() => {
        if (NotificationType) {
            return Object.values(NotificationType);
        }
        return [];
    }, [NotificationType]);
    console.log("notificationsSelects", notificationsSelects);

    const onSubmit = (values: any) => {
        console.log("values", values);
        // dispatch(settingsActions.updateNotificationsSettings(values));
    };

    return (
        <Container>
            <Widget title="Notifications Setting" titleSize="larger"></Widget>

            <Form
                initialValues={notificationsSettings}
                onSubmit={onSubmit}
                // mutators={{ ...mutators<FormValues>()}}
            >
                {({ handleSubmit, pristine, submitting, valid, form }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        {/* <div className="d-flex justify-content-end">
                            <Field name="raProfile">
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="raProfile">Default RA Profile</Label>

                                        <Select
                                            {...input}
                                            id="raProfile"
                                            maxMenuHeight={140}
                                            menuPlacement="auto"
                                            options={notificationsSelects}
                                            placeholder="Select to change RA Profile if needed"
                                            isClearable={true}
                                            onChange={(event: any) => {
                                                // onRaProfileChange(form, event ? event.value : undefined);
                                                // input.onChange(event);
                                                console.log("event", event);
                                            }}
                                        />
                                    </FormGroup>
                                )}
                            </Field>
                            {}
                        </div> */}
                        {notificationsSelects.map((notificationSelect) => (
                            <Field name={notificationSelect.code}>
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="raProfile">{notificationSelect.label}</Label>

                                        <Select
                                            {...input}
                                            id="raProfile"
                                            maxMenuHeight={140}
                                            menuPlacement="auto"
                                            options={[]}
                                            placeholder="Select to change RA Profile if needed"
                                            isClearable={true}
                                            onChange={(event: any) => {
                                                // onRaProfileChange(form, event ? event.value : undefined);
                                                // input.onChange(event);
                                                console.log("event", event);
                                            }}
                                        />
                                    </FormGroup>
                                )}
                            </Field>
                        ))}
                    </BootstrapForm>
                )}
            </Form>
        </Container>
    );
};

export default NotificationsSetting;
