import AttributeEditor from 'components/Attributes/AttributeEditor';
import TabLayout from 'components/Layout/TabLayout';
import ProgressButton from 'components/ProgressButton';
import Widget from 'components/Widget';

import { actions as alertActions } from 'ducks/alerts';
import { actions as authorityActions, selectors as authoritySelectors } from 'ducks/authorities';
import { actions as connectorActions } from 'ducks/connectors';
import { actions as customAttributesActions, selectors as customAttributesSelectors } from 'ducks/customAttributes';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import Select, { SingleValue } from 'react-select';
import { Form as BootstrapForm, Button, ButtonGroup, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { AttributeDescriptorModel } from 'types/attributes';
import { AuthorityResponseModel } from 'types/authorities';
import { ConnectorResponseModel } from 'types/connectors';
import { FunctionGroupCode, Resource } from 'types/openapi';

import { mutators } from 'utils/attributes/attributeEditorMutators';
import { collectFormAttributes } from 'utils/attributes/attributes';

import { composeValidators, validateAlphaNumericWithSpecialChars, validateRequired } from 'utils/validators';

interface FormValues {
    name: string | undefined;
    authorityProvider: { value: string; label: string } | undefined;
    storeKind: { value: string; label: string } | undefined;
}

export default function AuthorityForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();

    const editMode = useMemo(() => !!id, [id]);

    const authoritySelector = useSelector(authoritySelectors.authority);
    const authorityProviders = useSelector(authoritySelectors.authorityProviders);
    const authorityProviderAttributeDescriptors = useSelector(authoritySelectors.authorityProviderAttributeDescriptors);
    const resourceCustomAttributes = useSelector(customAttributesSelectors.resourceCustomAttributes);

    const isFetchingAuthorityDetail = useSelector(authoritySelectors.isFetchingDetail);
    const isFetchingAuthorityProviders = useSelector(authoritySelectors.isFetchingAuthorityProviders);
    const isFetchingAttributeDescriptors = useSelector(authoritySelectors.isFetchingAuthorityProviderAttributeDescriptors);
    const isFetchingResourceCustomAttributes = useSelector(customAttributesSelectors.isFetchingResourceCustomAttributes);
    const isCreating = useSelector(authoritySelectors.isCreating);
    const isUpdating = useSelector(authoritySelectors.isUpdating);

    const [groupAttributesCallbackAttributes, setGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);

    const [authority, setAuthority] = useState<AuthorityResponseModel>();
    const [authorityProvider, setAuthorityProvider] = useState<ConnectorResponseModel>();

    const isBusy = useMemo(
        () =>
            isFetchingAuthorityDetail ||
            isFetchingAuthorityProviders ||
            isCreating ||
            isUpdating ||
            isFetchingAttributeDescriptors ||
            isFetchingResourceCustomAttributes,
        [
            isFetchingAuthorityDetail,
            isFetchingAuthorityProviders,
            isCreating,
            isUpdating,
            isFetchingAttributeDescriptors,
            isFetchingResourceCustomAttributes,
        ],
    );

    useEffect(() => {
        dispatch(authorityActions.resetState());
        dispatch(connectorActions.clearCallbackData());
        dispatch(authorityActions.listAuthorityProviders());
        dispatch(customAttributesActions.listResourceCustomAttributes(Resource.Authorities));
    }, [dispatch]);

    useEffect(() => {
        if (editMode && id) {
            dispatch(authorityActions.getAuthorityDetail({ uuid: id }));
        }
    }, [dispatch, editMode, id]);

    useEffect(() => {
        if (editMode && authoritySelector?.uuid === id) {
            setAuthority(authoritySelector);
        }
    }, [authoritySelector, editMode, id]);

    useEffect(() => {
        if (!authorityProvider && editMode && authoritySelector?.uuid === id && authorityProviders && authorityProviders.length > 0) {
            if (!authoritySelector!.connectorUuid) {
                dispatch(alertActions.error('Authority provider was probably deleted'));
                return;
            }

            const provider = authorityProviders.find((p) => p.uuid === authoritySelector!.connectorUuid);

            if (provider) {
                setAuthorityProvider(provider);
                const functionGroup = provider.functionGroups[0].functionGroupCode;
                dispatch(
                    authorityActions.getAuthorityProviderAttributesDescriptors({
                        uuid: authoritySelector!.connectorUuid,
                        kind: authoritySelector!.kind,
                        functionGroup,
                    }),
                );
            } else {
                dispatch(alertActions.error('Authority provider not found'));
            }
        }
    }, [authorityProvider, dispatch, editMode, authoritySelector, authorityProviders, isFetchingAuthorityProviders, id]);

    const onAuthorityProviderChange = useCallback(
        (
            event: SingleValue<{
                label: string | undefined;
                value: string | undefined;
            }>,
        ) => {
            if (!event) return;

            dispatch(authorityActions.clearAuthorityProviderAttributeDescriptors());
            dispatch(connectorActions.clearCallbackData());
            setGroupAttributesCallbackAttributes([]);

            if (!event.value || !authorityProviders) return;
            const provider = authorityProviders.find((p) => p.uuid === event.value);

            if (!provider) return;
            setAuthorityProvider(provider);
        },
        [dispatch, authorityProviders],
    );

    const onKindChange = useCallback(
        (
            event: SingleValue<{
                label: string | undefined;
                value: string | undefined;
            }>,
        ) => {
            if (!event || !event.value || !authorityProvider) return;

            dispatch(connectorActions.clearCallbackData());
            setGroupAttributesCallbackAttributes([]);
            const functionGroup = authorityProvider.functionGroups[0].functionGroupCode;
            dispatch(
                authorityActions.getAuthorityProviderAttributesDescriptors({
                    uuid: authorityProvider.uuid,
                    kind: event.value,
                    functionGroup,
                }),
            );
        },
        [dispatch, authorityProvider],
    );

    const onSubmit = useCallback(
        (values: FormValues, form: any) => {
            if (editMode) {
                dispatch(
                    authorityActions.updateAuthority({
                        uuid: id!,
                        updateAuthority: {
                            attributes: collectFormAttributes(
                                'authority',
                                [...(authorityProviderAttributeDescriptors ?? []), ...groupAttributesCallbackAttributes],
                                values,
                            ),
                            customAttributes: collectFormAttributes('customAuthority', resourceCustomAttributes, values),
                        },
                    }),
                );
            } else {
                dispatch(
                    authorityActions.createAuthority({
                        name: values.name!,
                        connectorUuid: values.authorityProvider!.value,
                        kind: values.storeKind?.value!,
                        attributes: collectFormAttributes(
                            'authority',
                            [...(authorityProviderAttributeDescriptors ?? []), ...groupAttributesCallbackAttributes],
                            values,
                        ),
                        customAttributes: collectFormAttributes('customAuthority', resourceCustomAttributes, values),
                    }),
                );
            }
        },
        [editMode, dispatch, id, authorityProviderAttributeDescriptors, groupAttributesCallbackAttributes, resourceCustomAttributes],
    );

    const onCancel = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const submitTitle = useMemo(() => (editMode ? 'Save' : 'Create'), [editMode]);

    const inProgressTitle = useMemo(() => (editMode ? 'Saving...' : 'Creating...'), [editMode]);

    const optionsForAuthorityProviders = useMemo(
        () =>
            authorityProviders?.map((provider) => ({
                label: provider.name,
                value: provider.uuid,
            })),
        [authorityProviders],
    );

    const optionsForKinds = useMemo(
        () =>
            authorityProvider?.functionGroups
                .find(
                    (fg) =>
                        fg.functionGroupCode === FunctionGroupCode.AuthorityProvider ||
                        fg.functionGroupCode === FunctionGroupCode.LegacyAuthorityProvider,
                )
                ?.kinds.map((kind) => ({
                    label: kind,
                    value: kind,
                })) ?? [],
        [authorityProvider],
    );

    const defaultValues: FormValues = useMemo(
        () => ({
            name: editMode ? authority?.name || undefined : undefined,
            authorityProvider: editMode
                ? authority
                    ? { value: authority.connectorUuid, label: authority.connectorName }
                    : undefined
                : undefined,
            storeKind: editMode ? (authority ? { value: authority?.kind, label: authority?.kind } : undefined) : undefined,
        }),
        [editMode, authority],
    );

    const title = useMemo(() => (editMode ? `Edit authority ${authority?.name}` : 'Create new authority'), [editMode, authority]);

    const renderCustomAttributeEditor = useMemo(() => {
        if (isBusy) return <></>;
        return (
            <AttributeEditor
                id="customAuthority"
                attributeDescriptors={resourceCustomAttributes}
                attributes={authority?.customAttributes}
            />
        );
    }, [resourceCustomAttributes, authority, isBusy]);

    return (
        <Widget title={title} busy={isBusy}>
            <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<FormValues>() }}>
                {({ handleSubmit, pristine, submitting, values, valid, form }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumericWithSpecialChars())}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="name">Certification Authority Name</Label>

                                    <Input
                                        {...input}
                                        id="name"
                                        valid={!meta.error && meta.touched}
                                        invalid={!!meta.error && meta.touched}
                                        type="text"
                                        placeholder="Enter the Certification Authority Name"
                                        disabled={editMode}
                                    />

                                    <FormFeedback>{meta.error}</FormFeedback>
                                </FormGroup>
                            )}
                        </Field>

                        {!editMode ? (
                            <Field name="authorityProvider" validate={validateRequired()}>
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="authorityProviderSelect">Authority Provider</Label>

                                        <Select
                                            {...input}
                                            inputId="authorityProviderSelect"
                                            maxMenuHeight={140}
                                            menuPlacement="auto"
                                            options={optionsForAuthorityProviders}
                                            placeholder="Select Authority Provider"
                                            onChange={(event) => {
                                                onAuthorityProviderChange(event);
                                                form.mutators.clearAttributes('authority');
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
                            <Field name="authorityProvider" format={(value) => (value ? value.label : '')} validate={validateRequired()}>
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="authorityProvider">Authority Provider</Label>

                                        <Input
                                            {...input}
                                            valid={!meta.error && meta.touched}
                                            invalid={!!meta.error && meta.touched}
                                            type="text"
                                            placeholder="Authority Provider Name"
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
                                            {...input}
                                            inputId="storeKindSelect"
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

                        {editMode && authority?.kind ? (
                            <Field name="storeKind" format={(value) => (value ? value.label : '')}>
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="storeKind">Kind</Label>

                                        <Input
                                            {...input}
                                            valid={!meta.error && meta.touched}
                                            invalid={!!meta.error && meta.touched}
                                            type="text"
                                            placeholder="Authority Kind"
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
                                            authorityProvider &&
                                            values.storeKind &&
                                            authorityProviderAttributeDescriptors &&
                                            authorityProviderAttributeDescriptors.length > 0 ? (
                                                <AttributeEditor
                                                    id="authority"
                                                    attributeDescriptors={authorityProviderAttributeDescriptors}
                                                    attributes={authority?.attributes}
                                                    connectorUuid={authorityProvider.uuid}
                                                    functionGroupCode={FunctionGroupCode.AuthorityProvider}
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
                                        content: renderCustomAttributeEditor,
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
