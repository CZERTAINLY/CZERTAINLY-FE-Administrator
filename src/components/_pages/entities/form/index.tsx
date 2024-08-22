import AttributeEditor from 'components/Attributes/AttributeEditor';
import ProgressButton from 'components/ProgressButton';
import Widget from 'components/Widget';

import { actions as alertActions } from 'ducks/alerts';
import { actions as connectorActions } from 'ducks/connectors';
import { actions as entityActions, selectors as entitySelectors } from 'ducks/entities';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import Select from 'react-select';
import { Form as BootstrapForm, Button, ButtonGroup, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { AttributeDescriptorModel } from 'types/attributes';
import { ConnectorResponseModel } from 'types/connectors';
import { EntityResponseModel } from 'types/entities';
import { FunctionGroupCode, Resource } from 'types/openapi';

import { mutators } from 'utils/attributes/attributeEditorMutators';
import { collectFormAttributes } from 'utils/attributes/attributes';

import { composeValidators, validateAlphaNumericWithSpecialChars, validateRequired } from 'utils/validators';
import { actions as customAttributesActions, selectors as customAttributesSelectors } from '../../../../ducks/customAttributes';
import TabLayout from '../../../Layout/TabLayout';

interface FormValues {
    name: string | undefined;
    entityProvider: { value: string; label: string } | undefined;
    storeKind: { value: string; label: string } | undefined;
}

export default function EntityForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();

    const editMode = useMemo(() => !!id, [id]);

    const entitySelector = useSelector(entitySelectors.entity);
    const entityProviders = useSelector(entitySelectors.entityProviders);
    const entityProviderAttributeDescriptors = useSelector(entitySelectors.entityProviderAttributeDescriptors);
    const resourceCustomAttributes = useSelector(customAttributesSelectors.resourceCustomAttributes);

    const isFetchingResourceCustomAttributes = useSelector(customAttributesSelectors.isFetchingResourceCustomAttributes);
    const isFetchingEntityDetail = useSelector(entitySelectors.isFetchingDetail);
    const isFetchingEntityProviders = useSelector(entitySelectors.isFetchingEntityProviders);
    const isFetchingAttributeDescriptors = useSelector(entitySelectors.isFetchingEntityProviderAttributeDescriptors);
    const isCreating = useSelector(entitySelectors.isCreating);
    const isUpdating = useSelector(entitySelectors.isUpdating);

    const [groupAttributesCallbackAttributes, setGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);

    const [entity, setEntity] = useState<EntityResponseModel>();
    const [entityProvider, setEntityProvider] = useState<ConnectorResponseModel>();

    const isBusy = useMemo(
        () =>
            isFetchingEntityDetail ||
            isFetchingEntityProviders ||
            isCreating ||
            isUpdating ||
            isFetchingAttributeDescriptors ||
            isFetchingResourceCustomAttributes,
        [
            isFetchingEntityDetail,
            isFetchingEntityProviders,
            isCreating,
            isUpdating,
            isFetchingAttributeDescriptors,
            isFetchingResourceCustomAttributes,
        ],
    );

    useEffect(() => {
        dispatch(entityActions.resetState());
        dispatch(connectorActions.clearCallbackData());
        dispatch(entityActions.listEntityProviders());
        dispatch(customAttributesActions.listResourceCustomAttributes(Resource.Entities));
    }, [dispatch]);

    useEffect(() => {
        if (editMode && id) {
            dispatch(entityActions.getEntityDetail({ uuid: id }));
        }
    }, [dispatch, editMode, id]);

    useEffect(() => {
        if (editMode && entitySelector?.uuid === id) {
            setEntity(entitySelector);
        }
    }, [dispatch, editMode, id, entitySelector, entityProviders, isFetchingEntityProviders]);

    useEffect(() => {
        if (!entityProvider && editMode && entitySelector?.uuid === id && entityProviders && entityProviders.length > 0) {
            if (!entitySelector!.connectorUuid) {
                dispatch(alertActions.error('Entity provider was probably deleted'));
                return;
            }

            const provider = entityProviders.find((p) => p.uuid === entitySelector!.connectorUuid);

            if (provider) {
                setEntityProvider(provider);
                dispatch(
                    entityActions.getEntityProviderAttributesDescriptors({
                        uuid: entitySelector!.connectorUuid,
                        kind: entitySelector!.kind,
                    }),
                );
            } else {
                dispatch(alertActions.error('Entity provider not found'));
            }
        }
    }, [entityProvider, dispatch, editMode, id, entitySelector, entityProviders, isFetchingEntityProviders]);

    const onEntityProviderChange = useCallback(
        (event: { value: string }) => {
            dispatch(entityActions.clearEntityProviderAttributeDescriptors());
            dispatch(connectorActions.clearCallbackData());
            setGroupAttributesCallbackAttributes([]);

            if (!event.value || !entityProviders) return;
            const provider = entityProviders.find((p) => p.uuid === event.value);

            if (!provider) return;
            setEntityProvider(provider);
        },
        [dispatch, entityProviders],
    );

    const onKindChange = useCallback(
        (event: { value: string }) => {
            if (!event.value || !entityProvider) return;
            dispatch(connectorActions.clearCallbackData());
            setGroupAttributesCallbackAttributes([]);
            dispatch(entityActions.getEntityProviderAttributesDescriptors({ uuid: entityProvider.uuid, kind: event.value }));
        },
        [dispatch, entityProvider],
    );

    const onSubmit = useCallback(
        (values: FormValues, form: any) => {
            if (editMode) {
                dispatch(
                    entityActions.updateEntity({
                        uuid: id!,
                        attributes: collectFormAttributes(
                            'entity',
                            [...(entityProviderAttributeDescriptors ?? []), ...groupAttributesCallbackAttributes],
                            values,
                        ),
                        customAttributes: collectFormAttributes('customEntity', resourceCustomAttributes, values),
                    }),
                );
            } else {
                dispatch(
                    entityActions.addEntity({
                        name: values.name!,
                        connectorUuid: values.entityProvider!.value,
                        kind: values.storeKind?.value!,
                        attributes: collectFormAttributes(
                            'entity',
                            [...(entityProviderAttributeDescriptors ?? []), ...groupAttributesCallbackAttributes],
                            values,
                        ),
                        customAttributes: collectFormAttributes('customEntity', resourceCustomAttributes, values),
                    }),
                );
            }
        },
        [editMode, dispatch, id, entityProviderAttributeDescriptors, groupAttributesCallbackAttributes, resourceCustomAttributes],
    );

    const onCancel = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const submitTitle = useMemo(() => (editMode ? 'Save' : 'Create'), [editMode]);

    const inProgressTitle = useMemo(() => (editMode ? 'Saving...' : 'Creating...'), [editMode]);

    const optionsForEntityProviders = useMemo(
        () =>
            entityProviders?.map((provider) => ({
                label: provider.name,
                value: provider.uuid,
            })),
        [entityProviders],
    );

    const optionsForKinds = useMemo(
        () =>
            entityProvider?.functionGroups
                .find((fg) => fg.functionGroupCode === FunctionGroupCode.EntityProvider)
                ?.kinds.map((kind) => ({
                    label: kind,
                    value: kind,
                })) ?? [],
        [entityProvider],
    );

    const defaultValues: FormValues = useMemo(
        () => ({
            name: editMode ? entity?.name || undefined : undefined,
            entityProvider: editMode ? (entity ? { value: entity.connectorUuid, label: entity.connectorName } : undefined) : undefined,
            storeKind: editMode ? (entity ? { value: entity?.kind, label: entity?.kind } : undefined) : undefined,
        }),
        [editMode, entity],
    );

    const title = useMemo(() => (editMode ? 'Edit Entity' : 'Create Entity'), [editMode]);

    const renderCustomAttributesEditor = useMemo(() => {
        if (isBusy) return <></>;
        return <AttributeEditor id="customEntity" attributeDescriptors={resourceCustomAttributes} attributes={entity?.customAttributes} />;
    }, [isBusy, entity, resourceCustomAttributes]);

    return (
        <Widget title={title} busy={isBusy}>
            <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<FormValues>() }}>
                {({ handleSubmit, pristine, submitting, values, valid, form }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumericWithSpecialChars())}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="name">Entity Name</Label>

                                    <Input
                                        id="name"
                                        {...input}
                                        valid={!meta.error && meta.touched}
                                        invalid={!!meta.error && meta.touched}
                                        type="text"
                                        placeholder="Enter the Entity Name"
                                        disabled={editMode}
                                    />

                                    <FormFeedback>{meta.error}</FormFeedback>
                                </FormGroup>
                            )}
                        </Field>

                        {!editMode ? (
                            <Field name="entityProvider" validate={validateRequired()}>
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="entityProviderSelect">Entity Provider</Label>

                                        <Select
                                            {...input}
                                            inputId="entityProviderSelect"
                                            maxMenuHeight={140}
                                            menuPlacement="auto"
                                            options={optionsForEntityProviders}
                                            placeholder="Select Entity Provider"
                                            onChange={(event) => {
                                                onEntityProviderChange(event);
                                                form.mutators.clearAttributes('entity');
                                                form.mutators.setAttribute('storeKind', undefined);
                                                input.onChange(event);
                                            }}
                                            styles={{
                                                control: (provided) =>
                                                    meta.touched && meta.invalid
                                                        ? { ...provided, border: 'solid 1px red', '&:hover': { border: 'solid 1px red' } }
                                                        : { ...provided },
                                            }}
                                        />

                                        <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: 'block' } : {}}>
                                            {meta.error}
                                        </div>
                                    </FormGroup>
                                )}
                            </Field>
                        ) : (
                            <Field name="entityProvider" format={(value) => (value ? value.label : '')} validate={validateRequired()}>
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="entityProvider">Entity Provider</Label>

                                        <Input
                                            {...input}
                                            valid={!meta.error && meta.touched}
                                            invalid={!!meta.error && meta.touched}
                                            type="text"
                                            placeholder="Entity Provider Name"
                                            disabled={editMode}
                                        />
                                    </FormGroup>
                                )}
                            </Field>
                        )}

                        {!editMode && optionsForKinds?.length ? (
                            <Field name="storeKind" validate={validateRequired()}>
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="storeKindSelect">Kind</Label>

                                        <Select
                                            inputId="storeKindSelect"
                                            {...input}
                                            maxMenuHeight={140}
                                            menuPlacement="auto"
                                            options={optionsForKinds}
                                            placeholder="Select Kind"
                                            onChange={(event) => {
                                                onKindChange(event);
                                                input.onChange(event);
                                            }}
                                            styles={{
                                                control: (provided) =>
                                                    meta.touched && meta.invalid
                                                        ? { ...provided, border: 'solid 1px red', '&:hover': { border: 'solid 1px red' } }
                                                        : { ...provided },
                                            }}
                                        />

                                        <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: 'block' } : {}}>
                                            Required Field
                                        </div>
                                    </FormGroup>
                                )}
                            </Field>
                        ) : null}

                        {editMode && entity?.kind ? (
                            <Field name="storeKind" format={(value) => (value ? value.label : '')}>
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="storeKind">Kind</Label>

                                        <Input
                                            {...input}
                                            valid={!meta.error && meta.touched}
                                            invalid={!!meta.error && meta.touched}
                                            type="text"
                                            placeholder="Entity Kind"
                                            disabled={editMode}
                                        />
                                    </FormGroup>
                                )}
                            </Field>
                        ) : null}

                        <>
                            <br />
                            <TabLayout
                                tabs={[
                                    {
                                        title: 'Connector Attributes',
                                        content:
                                            entityProvider &&
                                            values.storeKind &&
                                            entityProviderAttributeDescriptors &&
                                            entityProviderAttributeDescriptors.length > 0 ? (
                                                <AttributeEditor
                                                    id="entity"
                                                    attributeDescriptors={entityProviderAttributeDescriptors}
                                                    attributes={entity?.attributes}
                                                    connectorUuid={entityProvider.uuid}
                                                    functionGroupCode={FunctionGroupCode.EntityProvider}
                                                    kind={values.storeKind.value}
                                                    groupAttributesCallbackAttributes={groupAttributesCallbackAttributes}
                                                    setGroupAttributesCallbackAttributes={setGroupAttributesCallbackAttributes}
                                                />
                                            ) : (
                                                <></>
                                            ),
                                    },
                                    {
                                        title: 'Custom Attributes',
                                        content: renderCustomAttributesEditor,
                                    },
                                ]}
                            />
                        </>

                        {
                            <div className="d-flex justify-content-end">
                                <ButtonGroup>
                                    <ProgressButton
                                        title={submitTitle}
                                        inProgressTitle={inProgressTitle}
                                        inProgress={submitting}
                                        disabled={(editMode ? pristine : false) || !valid}
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
}
