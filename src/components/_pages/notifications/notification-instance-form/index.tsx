import AttributeEditor from 'components/Attributes/AttributeEditor';
import TabLayout from 'components/Layout/TabLayout';
import ProgressButton from 'components/ProgressButton';
import Widget from 'components/Widget';
import { selectors as customAttributesSelectors } from 'ducks/customAttributes';
import { selectors as notificationSelectors, actions as notificationsActions } from 'ducks/notifications';
import { FormApi } from 'final-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { Form as BootstrapForm, Button, ButtonGroup, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { AttributeDescriptorModel, AttributeMappingModel } from 'types/attributes';
import { NotificationInstanceRequestModel } from 'types/notifications';
import { AttributeContentType, FunctionGroupCode } from 'types/openapi';
import { mutators } from 'utils/attributes/attributeEditorMutators';
import { collectFormAttributes } from 'utils/attributes/attributes';
import { composeValidators, validateAlphaNumericWithoutAccents, validateLength, validateRequired } from 'utils/validators';

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
    const customAttributes = useSelector(customAttributesSelectors.customAttributes);
    const mappingAttributes = useSelector(notificationSelectors.mappingAttributes);
    const [selectedCustomAttributes, setSelectedCustomAttributes] = useState<SelectChangeValue[]>([]);
    const [attributeMappingValues, setAttributeMappingValues] = useState<AttributeMappingModel[]>([]);
    const isFetchingNotificationInstanceDetail = useSelector(notificationSelectors.isFetchingNotificationInstanceDetail);
    const isEditingNotificationInstance = useSelector(notificationSelectors.isEditingNotificationInstance);
    const isCreatingNotificationInstance = useSelector(notificationSelectors.isCreatingNotificationInstance);

    const editMode = useMemo(() => !!id, [id]);
    const submitTitle = useMemo(() => (editMode ? 'Save' : 'Create'), [editMode]);

    const isBusy = useMemo(
        () => isCreatingNotificationInstance || isFetchingNotificationInstanceDetail,
        [isCreatingNotificationInstance, isFetchingNotificationInstanceDetail],
    );

    const clearNotificationInstanceDetail = useCallback(() => {
        dispatch(notificationsActions.clearNotificationInstanceDetail());
    }, [dispatch]);

    useEffect(() => {
        clearNotificationInstanceDetail();
        return clearNotificationInstanceDetail;
    }, [clearNotificationInstanceDetail]);

    useEffect(() => {
        if (!selectedNotificationInstanceProvider?.value || !selectedKind?.value) return;

        dispatch(
            notificationsActions.listMappingAttributes({
                connectorUuid: selectedNotificationInstanceProvider?.value,
                kind: selectedKind?.value,
            }),
        );
    }, [selectedKind, selectedNotificationInstanceProvider, dispatch]);

    useEffect(() => {
        if (notificationProviderAttributesDescriptors) return;
        dispatch(notificationsActions.listNotificationProviders());
    }, [notificationProviderAttributesDescriptors, dispatch]);

    const getContentTypeOptions = useCallback(
        (contentType: AttributeContentType) => {
            const contentTypeCustomAttributes = customAttributes.filter((customAttribute) => customAttribute.contentType === contentType);
            return contentTypeCustomAttributes.map((contentTypeCustomAttribute) => ({
                label: contentTypeCustomAttribute.name,
                value: contentTypeCustomAttribute.uuid,
            }));
        },
        [customAttributes],
    );

    useEffect(() => {
        if (id) {
            dispatch(notificationsActions.getNotificationInstance({ uuid: id }));
        } else {
            dispatch(notificationsActions.clearNotificationInstanceDetail());
        }
    }, [id, dispatch]);

    const onSubmit = (values: NotificationInstanceRequestModel) => {
        const attributes = collectFormAttributes(
            'notification',
            [...(notificationProviderAttributesDescriptors ?? []), ...groupAttributesCallbackAttributes],
            values,
        );

        if (editMode && id) {
            dispatch(
                notificationsActions.editNotificationInstance({
                    notificationInstance: {
                        ...values,
                        attributes,
                        attributeMappings: attributeMappingValues,
                    },
                    uuid: id,
                }),
            );
        } else {
            dispatch(
                notificationsActions.createNotificationInstance({
                    ...values,
                    attributes,
                    attributeMappings: attributeMappingValues,
                }),
            );
        }
    };

    const onCancel = useCallback(() => {
        clearNotificationInstanceDetail();
        navigate(-1);
    }, [navigate, clearNotificationInstanceDetail]);

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
        form.change('connectorUuid', changedValue?.value);
        setSelectedNotificationInstanceProvider(changedValue);
        setSelectedKind(null);
    };

    const onNotificationInstanceKindChange = (changedValue: SelectChangeValue | null, form: FormApi<NotificationInstanceRequestModel>) => {
        if (!changedValue?.value) return;
        setSelectedKind(changedValue);
        form.change('kind', changedValue?.value);
    };

    useEffect(() => {
        if (!selectedNotificationInstanceProvider?.value || !selectedKind?.value) return;
        dispatch(
            notificationsActions.getNotificationAttributesDescriptors({
                kind: selectedKind?.value,
                uuid: selectedNotificationInstanceProvider?.value,
            }),
        );
    }, [selectedKind, selectedNotificationInstanceProvider, dispatch]);

    useEffect(() => {
        if (!editMode || !notificationDetails || !optionsForNotificationProviders || !kindOptions) return;

        const initialProvider = optionsForNotificationProviders.find((provider) => provider.value === notificationDetails.connectorUuid);
        if (!initialProvider) return;
        setSelectedNotificationInstanceProvider(initialProvider);

        const initialKind = kindOptions.find((kind) => kind.value === notificationDetails.kind);
        if (!initialKind) return;
        setSelectedKind(initialKind);

        if (notificationDetails?.attributeMappings) {
            setAttributeMappingValues(notificationDetails.attributeMappings);
            const selectedCustomAttributesFetched = notificationDetails.attributeMappings.map((attributeMapping) => {
                return {
                    value: attributeMapping.customAttributeUuid,
                    label: attributeMapping.customAttributeLabel,
                };
            });
            setSelectedCustomAttributes(selectedCustomAttributesFetched);
        }
    }, [notificationDetails, optionsForNotificationProviders, kindOptions, editMode]);

    const defaultValues: NotificationInstanceRequestModel = useMemo(() => {
        if (editMode && notificationDetails) {
            return {
                ...notificationDetails,
                attributeMappings: [],
                attributes: notificationDetails.attributes.map((attribute) => ({
                    name: attribute.name,
                    content: attribute.content ?? [],
                    uuid: attribute.uuid ?? '',
                    contentType: attribute.contentType,
                })),
                selectedNotificationInstanceProvider: { value: notificationDetails.connectorUuid },
            };
        } else {
            return {
                attributes: [],
                attributeMappings: [],
                connectorUuid: '',
                description: '',
                kind: '',
                name: '',
                connectorName: '',
            };
        }
    }, [editMode, notificationDetails]);

    const widgetTitle = useMemo(() => (editMode ? 'Update Notification Instance' : 'Add Notification Instance'), [editMode]);

    const handleMappingAttributeChange = (
        event: SelectChangeValue | null,
        i: number,
        mappingAttributeUuid: string,
        mappingAttributeName: string,
    ) => {
        if (!event) return;

        const newAttributeMappingValues = {
            customAttributeLabel: event.label,
            customAttributeUuid: event.value,
            mappingAttributeUuid,
            mappingAttributeName,
        };
        const newAttributeMappingValuesArray = [...attributeMappingValues];
        newAttributeMappingValuesArray[i] = newAttributeMappingValues;
        setAttributeMappingValues(newAttributeMappingValuesArray);
        const newSelectedCustomAttribute = [...selectedCustomAttributes];
        newSelectedCustomAttribute[i] = event;
        setSelectedCustomAttributes(newSelectedCustomAttribute);
    };

    const renderAttributeEditor = useCallback(
        (kind: string | undefined) => {
            if (!notificationProviderAttributesDescriptors || !selectedNotificationInstanceProvider) return <></>;

            return (
                <AttributeEditor
                    id="notification"
                    attributeDescriptors={notificationProviderAttributesDescriptors}
                    connectorUuid={selectedNotificationInstanceProvider.value}
                    functionGroupCode={FunctionGroupCode.NotificationProvider}
                    kind={kind}
                    attributes={editMode && notificationDetails?.attributes ? notificationDetails.attributes : undefined}
                    groupAttributesCallbackAttributes={groupAttributesCallbackAttributes}
                    setGroupAttributesCallbackAttributes={setGroupAttributesCallbackAttributes}
                />
            );
        },
        [
            notificationProviderAttributesDescriptors,
            editMode,
            groupAttributesCallbackAttributes,
            notificationDetails,
            selectedNotificationInstanceProvider,
        ],
    );

    return (
        <Widget title={widgetTitle} busy={isBusy}>
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

                        <Field name="description" validate={composeValidators(validateLength(0, 300))}>
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
                                    <Label for="notificationInstanceProviderSelect">Notification Instance Provider</Label>

                                    <Select
                                        {...input}
                                        inputId="notificationInstanceProviderSelect"
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
                                        isDisabled={editMode}
                                        value={selectedNotificationInstanceProvider}
                                    />
                                </FormGroup>
                            )}
                        </Field>
                        <Field name="kind" validate={validateRequired()}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="kindSelect">Notification Instance Kind</Label>
                                    <Select
                                        {...input}
                                        id="kind"
                                        inputId="kindSelect"
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
                                        isDisabled={editMode}
                                        value={selectedKind}
                                    />
                                </FormGroup>
                            )}
                        </Field>
                        <TabLayout
                            tabs={[
                                {
                                    title: 'Connector Attributes',
                                    content: renderAttributeEditor(selectedKind?.value),
                                },
                                {
                                    title: 'Attribute Mappings',
                                    content: mappingAttributes?.length ? (
                                        <Widget>
                                            {mappingAttributes.map((mappingAttribute, i) => (
                                                <Field key={mappingAttribute.uuid} name={`attributeMappings[${i}].customAttributeUuid`}>
                                                    {({ input, meta }) => (
                                                        <FormGroup>
                                                            <Label for={`attributeMappings[${i}].${mappingAttribute.name}`}>
                                                                {mappingAttribute.name} {`(${mappingAttribute.contentType})`}
                                                            </Label>
                                                            <Select
                                                                {...input}
                                                                id={`attributeMappings[i].${mappingAttribute.name}`}
                                                                maxMenuHeight={140}
                                                                menuPlacement="auto"
                                                                options={
                                                                    getContentTypeOptions(mappingAttribute.contentType) as readonly {
                                                                        label: string;
                                                                        value: string;
                                                                    }[]
                                                                }
                                                                onChange={(event) => {
                                                                    handleMappingAttributeChange(
                                                                        event,
                                                                        i,
                                                                        mappingAttribute.uuid,
                                                                        mappingAttribute.name,
                                                                    );
                                                                }}
                                                                value={selectedCustomAttributes?.[i] || null}
                                                                placeholder={`Select Custom Attribute for ${mappingAttribute.name}`}
                                                            />
                                                            <small className="form-text text-dark">{mappingAttribute?.description}</small>
                                                        </FormGroup>
                                                    )}
                                                </Field>
                                            ))}
                                        </Widget>
                                    ) : (
                                        <></>
                                    ),
                                },
                            ]}
                        />

                        {
                            <div className="d-flex justify-content-end">
                                <ButtonGroup>
                                    <ProgressButton
                                        title={submitTitle}
                                        inProgress={submitting}
                                        disabled={!valid || isCreatingNotificationInstance || submitting || isEditingNotificationInstance}
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
