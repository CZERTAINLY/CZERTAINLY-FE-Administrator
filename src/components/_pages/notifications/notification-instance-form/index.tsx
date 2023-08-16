import AttributeEditor from "components/Attributes/AttributeEditor";
import ProgressButton from "components/ProgressButton";
import Widget from "components/Widget";
import { selectors as notificationSelectors, actions as notificationsActions } from "ducks/notifications";
import { FormApi } from "final-form";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Field, Form } from "react-final-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { Form as BootstrapForm, Button, ButtonGroup, FormFeedback, FormGroup, Input, Label } from "reactstrap";
import { AttributeDescriptorModel } from "types/attributes";
import { NotificationInstanceRequestModel } from "types/notifications";
import { FunctionGroupCode } from "types/openapi";
import { mutators } from "utils/attributes/attributeEditorMutators";
import { collectFormAttributes } from "utils/attributes/attributes";
import { composeValidators, validateAlphaNumeric, validateAlphaNumericWithoutAccents, validateRequired } from "utils/validators";

interface SelectChangeValue {
    value: string;
    label: string;
}

const NotificationInstanceForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const notificationInstanceProviders = useSelector(notificationSelectors.notificationInstanceProviders);
    const [selectedNotificationInstanceProvider, setSelectedNotificationInstanceProvider] = useState<SelectChangeValue | null>(null);
    const [selectedKind, setSelectedKind] = useState<SelectChangeValue | null>(null);
    const [groupAttributesCallbackAttributes, setGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);
    const notificationProviderAttributesDescriptors = useSelector(notificationSelectors.notificationProviderAttributesDescriptors);
    const notificationDetails = useSelector(notificationSelectors.notificationInstanceDetail);

    const isCreatingNotificationInstance = useSelector(notificationSelectors.isCreatingNotificationInstance);
    const editMode = useMemo(() => !!id, [id]);

    useEffect(() => {
        dispatch(notificationsActions.listNotificationProviders());
    }, []);

    useEffect(() => {
        if (!id) return;
        dispatch(notificationsActions.getNotificationInstance({ uuid: id }));
    }, [id]);

    const onSubmit = (values: NotificationInstanceRequestModel) => {
        const attributes = collectFormAttributes(
            "notification",
            [...(notificationProviderAttributesDescriptors ?? []), ...groupAttributesCallbackAttributes],
            values,
        );

        if (editMode && id) {
            dispatch(
                notificationsActions.editNotificationInstance({
                    notificationInstance: {
                        ...values,
                        attributes,
                        attributeMappings: [],
                    },
                    uuid: id,
                }),
            );
        } else {
            dispatch(
                notificationsActions.createNotificationInstance({
                    ...values,
                    attributes,
                    attributeMappings: [],
                }),
            );
        }
    };

    const onCancel = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const optionsForNotificationProviders = useMemo(
        () =>
            notificationInstanceProviders?.map((provider) => ({
                label: provider.name,
                value: provider.uuid,
            })),
        [notificationInstanceProviders],
    );

    const kindOptions = useMemo(() => {
        const selectedProvider = notificationInstanceProviders?.find(
            (provider) => provider.uuid === selectedNotificationInstanceProvider?.value,
        );
        const kindOptions =
            selectedProvider?.functionGroups
                .find((fg) => fg.functionGroupCode === FunctionGroupCode.NotificationProvider)
                ?.kinds.map((kind) => ({
                    label: kind,
                    value: kind,
                })) ?? [];

        return kindOptions;
    }, [selectedNotificationInstanceProvider, notificationInstanceProviders]);

    const onInstanceNotificationProviderChange = (
        changedValue: SelectChangeValue | null,
        form: FormApi<NotificationInstanceRequestModel>,
    ) => {
        if (changedValue?.value === selectedNotificationInstanceProvider?.value) {
            return;
        }
        form.change("connectorUuid", changedValue?.value);
        setSelectedNotificationInstanceProvider(changedValue);
        setSelectedKind(null);
    };

    const onNotificationInstanceKindChange = (changedValue: SelectChangeValue | null, form: FormApi<NotificationInstanceRequestModel>) => {
        if (!changedValue?.value) return;
        setSelectedKind(changedValue);
        form.change("kind", changedValue?.value);
    };

    useEffect(() => {
        if (!selectedNotificationInstanceProvider?.value || !selectedKind?.value) return;
        dispatch(
            notificationsActions.getNotificationAttributesDescriptors({
                kind: selectedKind?.value,
                uuid: selectedNotificationInstanceProvider?.value,
            }),
        );
    }, [selectedKind]);

    const defaultValues: NotificationInstanceRequestModel = useMemo(() => {
        if (editMode && notificationDetails) {
            return {
                ...notificationDetails,
                attributeMappings: [],
                attributes: notificationDetails.attributes.map((attribute) => ({
                    name: attribute.name,
                    content: attribute.content ?? [],
                })),
                selectedNotificationInstanceProvider: { value: notificationDetails.connectorUuid },
            };
        } else {
            return {
                attributes: [],
                attributeMappings: [],
                connectorUuid: "",
                description: "",
                kind: "",
                name: "",
                connectorName: "",
            };
        }
    }, [editMode, notificationDetails]);

    useEffect(() => {
        if (!editMode) return;

        if (optionsForNotificationProviders && !selectedNotificationInstanceProvider) {
            const initialProvider = optionsForNotificationProviders.find(
                (provider) => provider.value === notificationDetails?.connectorUuid,
            );
            if (initialProvider) {
                setSelectedNotificationInstanceProvider(initialProvider);
            }
        }

        if (kindOptions && !selectedKind) {
            const initialKind = kindOptions.find((kind) => kind.value === notificationDetails?.kind);
            if (initialKind) {
                setSelectedKind(initialKind);
            }
        }
    }, [selectedKind, selectedNotificationInstanceProvider, notificationDetails, , optionsForNotificationProviders, kindOptions, editMode]);

    const widgetTitle = useMemo(() => (editMode ? "Update Notification Instance" : "Add Notification Instance"), [editMode]);

    return (
        <Widget title={widgetTitle} titleSize="larger">
            <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<NotificationInstanceRequestModel>() }}>
                {({ handleSubmit, pristine, submitting, valid, form, values }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumericWithoutAccents())}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="name">Notification Instance Name</Label>

                                    <Input
                                        disabled={editMode}
                                        {...input}
                                        id="name"
                                        type="text"
                                        placeholder="Notification Instance Name"
                                        valid={!meta.error && meta.touched}
                                        invalid={!!meta.error && meta.touched}
                                    />

                                    <FormFeedback>{meta.error}</FormFeedback>
                                </FormGroup>
                            )}
                        </Field>

                        <Field name="description" validate={composeValidators(validateRequired(), validateAlphaNumeric())}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="description">Description</Label>

                                    <Input
                                        {...input}
                                        id="description"
                                        type="textarea"
                                        placeholder="Enter Description / Comment"
                                        valid={!meta.error && meta.touched}
                                        invalid={!!meta.error && meta.touched}
                                    />

                                    <FormFeedback>{meta.error}</FormFeedback>
                                </FormGroup>
                            )}
                        </Field>
                        <Field name="selectedNotificationInstanceProvider" validate={validateRequired()}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="selectedNotificationInstanceProvider">Notification Instance Provider</Label>

                                    <Select
                                        {...input}
                                        id="selectedNotificationInstanceProvider"
                                        maxMenuHeight={140}
                                        menuPlacement="auto"
                                        options={optionsForNotificationProviders}
                                        placeholder="Select Notification Instance Provider"
                                        isClearable={true}
                                        isSearchable={false}
                                        onChange={(e) => {
                                            input.onChange(e);
                                            onInstanceNotificationProviderChange(e, form);
                                        }}
                                        value={selectedNotificationInstanceProvider}
                                    />
                                </FormGroup>
                            )}
                        </Field>
                        <Field name="kind" validate={validateRequired()}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="kind">Notification Instance Kind</Label>
                                    <Select
                                        {...input}
                                        id="kind"
                                        maxMenuHeight={140}
                                        menuPlacement="auto"
                                        options={kindOptions}
                                        placeholder="Select Notification Instance Kind"
                                        isClearable={true}
                                        isSearchable={false}
                                        onChange={(e) => {
                                            input.onChange(e);
                                            onNotificationInstanceKindChange(e, form);
                                        }}
                                        value={selectedKind}
                                    />
                                </FormGroup>
                            )}
                        </Field>

                        {notificationProviderAttributesDescriptors?.length && values?.kind ? (
                            <AttributeEditor
                                id="notification"
                                attributeDescriptors={notificationProviderAttributesDescriptors}
                                connectorUuid={selectedNotificationInstanceProvider?.value}
                                functionGroupCode={FunctionGroupCode.NotificationProvider}
                                kind={values.kind}
                                attributes={editMode ? notificationDetails?.attributes : undefined}
                                groupAttributesCallbackAttributes={groupAttributesCallbackAttributes}
                                setGroupAttributesCallbackAttributes={setGroupAttributesCallbackAttributes}
                            />
                        ) : (
                            <></>
                        )}

                        {
                            <div className="d-flex justify-content-end">
                                <ButtonGroup>
                                    <ProgressButton
                                        title={"Submit"}
                                        inProgress={submitting}
                                        disabled={!valid || isCreatingNotificationInstance}
                                    />
                                    <Button color="default" onClick={onCancel} disabled={submitting}>
                                        Cancel
                                    </Button>
                                </ButtonGroup>
                            </div>
                        }
                    </BootstrapForm>
                )}
            </Form>
        </Widget>
    );
};

export default NotificationInstanceForm;
