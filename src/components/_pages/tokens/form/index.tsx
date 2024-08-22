import AttributeEditor from 'components/Attributes/AttributeEditor';
import TabLayout from 'components/Layout/TabLayout';
import ProgressButton from 'components/ProgressButton';
import Widget from 'components/Widget';

import { actions as alertActions } from 'ducks/alerts';
import { actions as connectorActions } from 'ducks/connectors';
import { actions as customAttributesActions, selectors as customAttributesSelectors } from 'ducks/customAttributes';
import { actions as tokenActions, selectors as tokenSelectors } from 'ducks/tokens';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import Select, { SingleValue } from 'react-select';
import { Form as BootstrapForm, Button, ButtonGroup, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { AttributeDescriptorModel } from 'types/attributes';
import { ConnectorResponseModel } from 'types/connectors';
import { FunctionGroupCode, Resource } from 'types/openapi';
import { TokenDetailResponseDto } from 'types/tokens';

import { mutators } from 'utils/attributes/attributeEditorMutators';
import { collectFormAttributes } from 'utils/attributes/attributes';

import { composeValidators, validateAlphaNumericWithSpecialChars, validateRequired } from 'utils/validators';

interface FormValues {
    name: string | undefined;
    tokenProvider: { value: string; label: string } | undefined;
    storeKind: { value: string; label: string } | undefined;
}

export default function TokenForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();

    const editMode = useMemo(() => !!id, [id]);

    const tokenDetail = useSelector(tokenSelectors.token);
    const tokenProviders = useSelector(tokenSelectors.tokenProviders);
    const tokenProviderAttributeDescriptors = useSelector(tokenSelectors.tokenProviderAttributeDescriptors);
    const resourceCustomAttributes = useSelector(customAttributesSelectors.resourceCustomAttributes);

    const isFetchingTokenDetail = useSelector(tokenSelectors.isFetchingDetail);
    const isFetchingTokenProviders = useSelector(tokenSelectors.isFetchingTokenProviders);
    const isFetchingAttributeDescriptors = useSelector(tokenSelectors.isFetchingTokenProviderAttributeDescriptors);
    const isFetchingResourceCustomAttributes = useSelector(customAttributesSelectors.isFetchingResourceCustomAttributes);
    const isCreating = useSelector(tokenSelectors.isCreating);
    const isUpdating = useSelector(tokenSelectors.isUpdating);

    const [groupAttributesCallbackAttributes, setGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);

    const [token, setToken] = useState<TokenDetailResponseDto>();
    const [tokenProvider, setTokenProvider] = useState<ConnectorResponseModel>();

    const isBusy = useMemo(
        () =>
            isFetchingTokenDetail ||
            isFetchingTokenProviders ||
            isCreating ||
            isUpdating ||
            isFetchingAttributeDescriptors ||
            isFetchingResourceCustomAttributes,
        [
            isFetchingTokenDetail,
            isFetchingTokenProviders,
            isCreating,
            isUpdating,
            isFetchingAttributeDescriptors,
            isFetchingResourceCustomAttributes,
        ],
    );

    useEffect(() => {
        dispatch(tokenActions.resetState());
        dispatch(connectorActions.clearCallbackData());
        dispatch(tokenActions.listTokenProviders());
        dispatch(customAttributesActions.listResourceCustomAttributes(Resource.Tokens));
    }, [dispatch]);

    useEffect(() => {
        if (editMode && (!tokenDetail || tokenDetail.uuid !== id)) {
            dispatch(tokenActions.getTokenDetail({ uuid: id! }));
        }
    }, [dispatch, editMode, tokenDetail, tokenProviders, isFetchingTokenProviders, id]);

    useEffect(() => {
        if (editMode && tokenDetail?.uuid === id) {
            setToken(tokenDetail);
        }
    }, [tokenDetail, editMode, id]);

    useEffect(() => {
        if (!tokenProvider && editMode && tokenDetail?.uuid === id && tokenProviders && tokenProviders.length > 0) {
            if (!tokenDetail!.connectorUuid) {
                dispatch(alertActions.error('Cryptography provider was probably deleted'));
                return;
            }

            const provider = tokenProviders.find((p) => p.uuid === tokenDetail!.connectorUuid);

            if (provider) {
                setTokenProvider(provider);
                dispatch(
                    tokenActions.getTokenProviderAttributesDescriptors({ uuid: tokenDetail!.connectorUuid, kind: tokenDetail!.kind || '' }),
                );
            } else {
                dispatch(alertActions.error('Cryptography provider not found'));
            }
        }
    }, [tokenProvider, dispatch, editMode, tokenDetail, tokenProviders, isFetchingTokenProviders, id]);

    const onTokenProviderChange = useCallback(
        (
            event: SingleValue<{
                label: string | undefined;
                value: string | undefined;
            }>,
        ) => {
            if (!event) return;

            dispatch(tokenActions.clearTokenProviderAttributeDescriptors());
            dispatch(connectorActions.clearCallbackData());
            setGroupAttributesCallbackAttributes([]);

            if (!event.value || !tokenProviders) return;
            const provider = tokenProviders.find((p) => p.uuid === event.value);

            if (!provider) return;
            setTokenProvider(provider);
        },
        [dispatch, tokenProviders],
    );

    const onKindChange = useCallback(
        (
            event: SingleValue<{
                label: string | undefined;
                value: string | undefined;
            }>,
        ) => {
            if (!event || !event.value || !tokenProvider) return;

            dispatch(connectorActions.clearCallbackData());
            setGroupAttributesCallbackAttributes([]);
            dispatch(tokenActions.getTokenProviderAttributesDescriptors({ uuid: tokenProvider.uuid, kind: event.value }));
        },
        [dispatch, tokenProvider],
    );

    const onSubmit = useCallback(
        (values: FormValues, form: any) => {
            if (editMode) {
                dispatch(
                    tokenActions.updateToken({
                        uuid: id!,
                        updateToken: {
                            name: '',
                            kind: '',
                            connectorUuid: '',
                            description: values.name!,
                            attributes: collectFormAttributes(
                                'token',
                                [...(tokenProviderAttributeDescriptors ?? []), ...groupAttributesCallbackAttributes],
                                values,
                            ),
                            customAttributes: collectFormAttributes('customToken', resourceCustomAttributes, values),
                        },
                    }),
                );
            } else {
                dispatch(
                    tokenActions.createToken({
                        name: values.name!,
                        connectorUuid: values.tokenProvider!.value,
                        kind: values.storeKind?.value!,
                        attributes: collectFormAttributes(
                            'token',
                            [...(tokenProviderAttributeDescriptors ?? []), ...groupAttributesCallbackAttributes],
                            values,
                        ),
                        customAttributes: collectFormAttributes('customToken', resourceCustomAttributes, values),
                    }),
                );
            }
        },
        [editMode, dispatch, id, tokenProviderAttributeDescriptors, groupAttributesCallbackAttributes, resourceCustomAttributes],
    );

    const onCancel = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const submitTitle = useMemo(() => (editMode ? 'Save' : 'Create'), [editMode]);

    const inProgressTitle = useMemo(() => (editMode ? 'Saving...' : 'Creating...'), [editMode]);

    const optionsForTokenProviders = useMemo(
        () =>
            tokenProviders?.map((provider) => ({
                label: provider.name,
                value: provider.uuid,
            })),
        [tokenProviders],
    );

    const optionsForKinds = useMemo(
        () =>
            tokenProvider?.functionGroups
                .find((fg) => fg.functionGroupCode === FunctionGroupCode.CryptographyProvider)
                ?.kinds.map((kind) => ({
                    label: kind,
                    value: kind,
                })) ?? [],
        [tokenProvider],
    );

    const defaultValues: FormValues = useMemo(
        () => ({
            name: editMode ? token?.name || undefined : undefined,
            tokenProvider: editMode
                ? token
                    ? { value: token.connectorUuid || '', label: token.connectorName || '' }
                    : undefined
                : undefined,
            // TODO update this to kind
            storeKind: editMode ? (token ? { value: tokenDetail?.kind || '', label: tokenDetail?.kind || '' } : undefined) : undefined,
        }),
        [editMode, token, tokenDetail?.kind],
    );

    const title = useMemo(() => (editMode ? `Edit token ${token?.name}` : 'Create new token'), [editMode, token]);

    const renderCustomAttributeEditor = useMemo(() => {
        if (isBusy) return <></>;
        return <AttributeEditor id="customToken" attributeDescriptors={resourceCustomAttributes} attributes={token?.customAttributes} />;
    }, [resourceCustomAttributes, token?.customAttributes, isBusy]);

    return (
        <Widget title={title} busy={isBusy}>
            <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<FormValues>() }}>
                {({ handleSubmit, pristine, submitting, values, valid, form }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumericWithSpecialChars())}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="name">Token Name</Label>

                                    <Input
                                        id="name"
                                        {...input}
                                        valid={!meta.error && meta.touched}
                                        invalid={!!meta.error && meta.touched}
                                        type="text"
                                        placeholder="Enter the Certification Token Name"
                                        disabled={editMode}
                                    />

                                    <FormFeedback>{meta.error}</FormFeedback>
                                </FormGroup>
                            )}
                        </Field>

                        {!editMode ? (
                            <Field name="tokenProvider" validate={validateRequired()}>
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="tokenProviderSelect">Cryptography Provider</Label>

                                        <Select
                                            {...input}
                                            maxMenuHeight={140}
                                            inputId="tokenProviderSelect"
                                            menuPlacement="auto"
                                            options={optionsForTokenProviders}
                                            placeholder="Select Cryptography Provider"
                                            onChange={(event) => {
                                                onTokenProviderChange(event);
                                                form.mutators.clearAttributes('token');
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
                            <Field name="tokenProvider" format={(value) => (value ? value.label : '')} validate={validateRequired()}>
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="tokenProvider">Cryptography Provider</Label>

                                        <Input
                                            id="tokenProvider"
                                            {...input}
                                            valid={!meta.error && meta.touched}
                                            invalid={!!meta.error && meta.touched}
                                            type="text"
                                            placeholder="Cryptography Provider Name"
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

                        {editMode && tokenDetail?.kind ? (
                            <Field name="storeKind" format={(value) => (value ? value.label : '')}>
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="storeKind">Kind</Label>

                                        <Input
                                            {...input}
                                            valid={!meta.error && meta.touched}
                                            invalid={!!meta.error && meta.touched}
                                            type="text"
                                            placeholder="Token Kind"
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
                                            tokenProvider &&
                                            values.storeKind &&
                                            tokenProviderAttributeDescriptors &&
                                            tokenProviderAttributeDescriptors.length > 0 ? (
                                                <AttributeEditor
                                                    id="token"
                                                    attributeDescriptors={tokenProviderAttributeDescriptors}
                                                    attributes={tokenDetail?.attributes}
                                                    connectorUuid={tokenProvider.uuid}
                                                    functionGroupCode={FunctionGroupCode.CryptographyProvider}
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
