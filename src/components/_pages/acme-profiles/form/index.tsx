import AttributeEditor from 'components/Attributes/AttributeEditor';
import TabLayout from 'components/Layout/TabLayout';
import ProgressButton from 'components/ProgressButton';

import Widget from 'components/Widget';

import { actions as acmeProfileActions, selectors as acmeProfileSelectors } from 'ducks/acme-profiles';
import { actions as connectorActions } from 'ducks/connectors';
import { actions as customAttributesActions, selectors as customAttributesSelectors } from 'ducks/customAttributes';
import { actions as raProfileActions, selectors as raProfileSelectors } from 'ducks/ra-profiles';

import { FormApi } from 'final-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { Form as BootstrapForm, Button, ButtonGroup, Col, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap';
import { AcmeProfileAddRequestModel, AcmeProfileEditRequestModel, AcmeProfileResponseModel } from 'types/acme-profiles';
import { AttributeDescriptorModel } from 'types/attributes';
import { RaProfileSimplifiedModel } from 'types/ra-profiles';

import { mutators } from 'utils/attributes/attributeEditorMutators';
import { collectFormAttributes } from 'utils/attributes/attributes';

import {
    composeValidators,
    validateAlphaNumericWithoutAccents,
    validateCustomIp,
    validateCustomUrl,
    validateInteger,
    validateLength,
    validateRequired,
} from 'utils/validators';
import { Resource } from '../../../../types/openapi';

interface FormValues {
    name: string;
    description: string;
    dnsIpAddress: string;
    dnsPort: string;
    retryInterval: string;
    orderValidity: string;
    termsUrl: string;
    webSite: string;
    termsChangeUrl: string;
    disableOrders: boolean;
    requireTermsOfService: boolean;
    requireContact: boolean;
    raProfile: { value: string; label: string } | undefined;
}

export default function AcmeProfileForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();

    const editMode = useMemo(() => !!id, [id]);

    const acmeProfileSelector = useSelector(acmeProfileSelectors.acmeProfile);
    const raProfiles = useSelector(raProfileSelectors.raProfiles);
    const raProfileIssuanceAttrDescs = useSelector(raProfileSelectors.issuanceAttributes);
    const raProfileRevocationAttrDescs = useSelector(raProfileSelectors.revocationAttributes);
    const resourceCustomAttributes = useSelector(customAttributesSelectors.resourceCustomAttributes);

    const isFetchingDetail = useSelector(acmeProfileSelectors.isFetchingDetail);
    const isCreating = useSelector(acmeProfileSelectors.isCreating);
    const isUpdating = useSelector(acmeProfileSelectors.isUpdating);

    const isFetchingRaProfilesList = useSelector(raProfileSelectors.isFetchingList);
    const isFetchingIssuanceAttributes = useSelector(raProfileSelectors.isFetchingIssuanceAttributes);
    const isFetchingRevocationAttributes = useSelector(raProfileSelectors.isFetchingRevocationAttributes);
    const isFetchingResourceCustomAttributes = useSelector(customAttributesSelectors.isFetchingResourceCustomAttributes);

    const [issueGroupAttributesCallbackAttributes, setIssueGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);
    const [revokeGroupAttributesCallbackAttributes, setRevokeGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);

    const [acmeProfile, setAcmeProfile] = useState<AcmeProfileResponseModel>();
    const [raProfile, setRaProfile] = useState<RaProfileSimplifiedModel>();

    const isBusy = useMemo(() => isFetchingDetail || isCreating || isUpdating, [isFetchingDetail, isCreating, isUpdating]);

    useEffect(() => {
        if (editMode && (!acmeProfileSelector || acmeProfileSelector.uuid !== id)) {
            dispatch(acmeProfileActions.getAcmeProfile({ uuid: id! }));
        }

        if (editMode && acmeProfileSelector && acmeProfileSelector.uuid === id) {
            setAcmeProfile(acmeProfileSelector);
            setRaProfile(acmeProfileSelector.raProfile);
        }
    }, [dispatch, id, editMode, acmeProfileSelector]);

    useEffect(() => {
        dispatch(customAttributesActions.listResourceCustomAttributes(Resource.AcmeProfiles));
        dispatch(raProfileActions.listRaProfiles());
    }, [dispatch]);

    useEffect(() => {
        if (raProfile && raProfile.authorityInstanceUuid) {
            dispatch(
                raProfileActions.listIssuanceAttributeDescriptors({ authorityUuid: raProfile.authorityInstanceUuid, uuid: raProfile.uuid }),
            );
            dispatch(
                raProfileActions.listRevocationAttributeDescriptors({
                    authorityUuid: raProfile.authorityInstanceUuid,
                    uuid: raProfile.uuid,
                }),
            );
        }
    }, [dispatch, raProfile]);

    const onSubmit = useCallback(
        (values: FormValues) => {
            const request: AcmeProfileEditRequestModel | AcmeProfileAddRequestModel = {
                ...values,
                dnsResolverIp: values.dnsIpAddress,
                dnsResolverPort: values.dnsPort,
                retryInterval: parseInt(values.retryInterval),
                validity: parseInt(values.orderValidity),
                termsOfServiceUrl: values.termsUrl,
                websiteUrl: values.webSite,
                termsOfServiceChangeUrl: values.termsChangeUrl,
                termsOfServiceChangeDisable: values.disableOrders,
                issueCertificateAttributes: collectFormAttributes(
                    'issuanceAttributes',
                    [...(raProfileIssuanceAttrDescs ?? []), ...issueGroupAttributesCallbackAttributes],
                    values,
                ),
                revokeCertificateAttributes: collectFormAttributes(
                    'revocationAttributes',
                    [...(raProfileRevocationAttrDescs ?? []), ...revokeGroupAttributesCallbackAttributes],
                    values,
                ),
                customAttributes: collectFormAttributes('customAcmeProfile', resourceCustomAttributes, values),
            };
            if (values.raProfile) {
                request.raProfileUuid = values.raProfile.value;
            }
            if (editMode) {
                dispatch(acmeProfileActions.updateAcmeProfile({ uuid: id!, updateAcmeRequest: request }));
            } else {
                dispatch(acmeProfileActions.createAcmeProfile(request as AcmeProfileAddRequestModel));
            }
        },
        [
            dispatch,
            editMode,
            id,
            raProfileIssuanceAttrDescs,
            raProfileRevocationAttrDescs,
            issueGroupAttributesCallbackAttributes,
            revokeGroupAttributesCallbackAttributes,
            resourceCustomAttributes,
        ],
    );

    const onCancelClick = useCallback(() => navigate(-1), [navigate]);

    const onRaProfileChange = useCallback(
        (form: FormApi<FormValues>, value: string) => {
            dispatch(connectorActions.clearCallbackData());
            setIssueGroupAttributesCallbackAttributes([]);
            setRevokeGroupAttributesCallbackAttributes([]);

            if (!value) {
                setRaProfile(undefined);
                dispatch(raProfileActions.clearIssuanceAttributesDescriptors());
                dispatch(raProfileActions.clearRevocationAttributesDescriptors());
                form.mutators.clearAttributes('issuanceAttributes');
                form.mutators.clearAttributes('revocationAttributes');
                return;
            }

            setRaProfile(raProfiles.find((p) => p.uuid === value) || undefined);

            if (acmeProfile) {
                setAcmeProfile({
                    ...acmeProfile,
                    issueCertificateAttributes: [],
                    revokeCertificateAttributes: [],
                });
            }
        },
        [dispatch, raProfiles, acmeProfile],
    );

    const optionsForRaProfiles = useMemo(
        () =>
            raProfiles.map((raProfile) => ({
                value: raProfile.uuid,
                label: raProfile.name,
            })),
        [raProfiles],
    );

    const defaultValues: FormValues = useMemo(
        () => ({
            name: editMode ? acmeProfile?.name || '' : '',
            description: editMode ? acmeProfile?.description || '' : '',
            dnsIpAddress: editMode ? acmeProfile?.dnsResolverIp || '' : '',
            dnsPort: editMode ? acmeProfile?.dnsResolverPort || '' : '',
            retryInterval: editMode ? acmeProfile?.retryInterval?.toString() || '30' : '30',
            orderValidity: editMode ? acmeProfile?.validity?.toString() || '36000' : '36000',
            termsUrl: editMode ? acmeProfile?.termsOfServiceUrl || '' : '',
            webSite: editMode ? acmeProfile?.websiteUrl || '' : '',
            termsChangeUrl: editMode ? acmeProfile?.termsOfServiceChangeUrl || '' : '',
            disableOrders: editMode ? acmeProfile?.termsOfServiceChangeDisable || false : false,
            requireTermsOfService: editMode ? acmeProfile?.requireTermsOfService || false : false,
            requireContact: editMode ? acmeProfile?.requireContact || false : false,
            raProfile: editMode
                ? acmeProfile?.raProfile
                    ? optionsForRaProfiles.find((raProfile) => raProfile.value === acmeProfile.raProfile?.uuid)
                    : undefined
                : undefined,
        }),
        [editMode, acmeProfile, optionsForRaProfiles],
    );

    const title = useMemo(() => (editMode ? 'Edit ACME Profile' : 'Create ACME Profile'), [editMode]);

    const renderCustomAttributeEditor = useMemo(() => {
        if (isBusy) return <></>;
        return (
            <AttributeEditor
                id="customAcmeProfile"
                attributeDescriptors={resourceCustomAttributes}
                attributes={acmeProfile?.customAttributes}
            />
        );
    }, [isBusy, resourceCustomAttributes, acmeProfile?.customAttributes]);

    return (
        <Widget title={title} busy={isBusy}>
            <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<FormValues>() }}>
                {({ handleSubmit, pristine, submitting, valid, form }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumericWithoutAccents())}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="name">ACME Profile Name</Label>

                                    <Input
                                        {...input}
                                        id="name"
                                        type="text"
                                        placeholder="ACME Profile Name"
                                        valid={!meta.error && meta.touched}
                                        invalid={!!meta.error && meta.touched}
                                        disabled={editMode}
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

                        <Widget title="Challenge Configuration">
                            <Row xs="1" sm="1" md="2" lg="2" xl="2">
                                <Col>
                                    <Field name="dnsIpAddress" validate={composeValidators((value: string) => validateCustomIp(value))}>
                                        {({ input, meta }) => (
                                            <FormGroup>
                                                <Label for="dnsIpAddress">DNS Resolver IP address</Label>

                                                <Input
                                                    {...input}
                                                    id="dnsIpAddress"
                                                    type="text"
                                                    placeholder="Enter DNS Resolver IP address. If not provided system default will be used"
                                                    valid={!meta.error && meta.touched}
                                                    invalid={!!meta.error && meta.touched}
                                                />

                                                <FormFeedback>{meta.error}</FormFeedback>
                                            </FormGroup>
                                        )}
                                    </Field>
                                </Col>

                                <Col>
                                    <Field name="dnsPort" validate={composeValidators(validateInteger())}>
                                        {({ input, meta }) => (
                                            <FormGroup>
                                                <Label for="dnsPort">DNS Resolver port number</Label>

                                                <Input
                                                    {...input}
                                                    id="dnsPort"
                                                    type="number"
                                                    placeholder="Enter DNS Resolver port number"
                                                    valid={!meta.error && meta.touched}
                                                    invalid={!!meta.error && meta.touched}
                                                />

                                                <FormFeedback>{meta.error}</FormFeedback>
                                            </FormGroup>
                                        )}
                                    </Field>
                                </Col>
                            </Row>

                            <Row xs="1" sm="1" md="2" lg="2" xl="2">
                                <Col>
                                    <Field name="retryInterval" validate={composeValidators(validateInteger())}>
                                        {({ input, meta }) => (
                                            <FormGroup>
                                                <Label for="retryInterval">Retry Interval (In seconds)</Label>

                                                <Input
                                                    {...input}
                                                    id="retryInterval"
                                                    type="number"
                                                    placeholder="Enter Retry Interval"
                                                    valid={!meta.error && meta.touched}
                                                    invalid={!!meta.error && meta.touched}
                                                />

                                                <FormFeedback>{meta.error}</FormFeedback>
                                            </FormGroup>
                                        )}
                                    </Field>
                                </Col>

                                <Col>
                                    <Field name="orderValidity" validate={composeValidators(validateInteger())}>
                                        {({ input, meta }) => (
                                            <FormGroup>
                                                <Label for="orderValidity">Order Validity (In seconds)</Label>

                                                <Input
                                                    {...input}
                                                    id="orderValidity"
                                                    type="number"
                                                    placeholder="Enter Order Validity"
                                                    valid={!meta.error && meta.touched}
                                                    invalid={!!meta.error && meta.touched}
                                                />

                                                <FormFeedback>{meta.error}</FormFeedback>
                                            </FormGroup>
                                        )}
                                    </Field>
                                </Col>
                            </Row>
                        </Widget>

                        <Widget title="Terms of Service Configuration">
                            <Row xs="1" sm="1" md="2" lg="2" xl="2">
                                <Col>
                                    <Field name="termsUrl" validate={composeValidators((value: string) => validateCustomUrl(value))}>
                                        {({ input, meta }) => (
                                            <FormGroup>
                                                <Label for="termsUrl">Terms of Service URL</Label>

                                                <Input
                                                    {...input}
                                                    id="termsUrl"
                                                    type="text"
                                                    placeholder="Enter Terms of Service URL"
                                                    valid={!meta.error && meta.touched}
                                                    invalid={!!meta.error && meta.touched}
                                                />

                                                <FormFeedback>{meta.error}</FormFeedback>
                                            </FormGroup>
                                        )}
                                    </Field>
                                </Col>

                                <Col>
                                    <Field name="webSite" validate={composeValidators((value: string) => validateCustomUrl(value))}>
                                        {({ input, meta }) => (
                                            <FormGroup>
                                                <Label for="websiteUrl">Website URL</Label>

                                                <Input
                                                    {...input}
                                                    id="websiteUrl"
                                                    type="text"
                                                    placeholder="Enter Website URL"
                                                    valid={!meta.error && meta.touched}
                                                    invalid={!!meta.error && meta.touched}
                                                />

                                                <FormFeedback>{meta.error}</FormFeedback>
                                            </FormGroup>
                                        )}
                                    </Field>
                                </Col>
                            </Row>

                            {!editMode ? (
                                <></>
                            ) : (
                                <Row xs="1" sm="1" md="2" lg="2" xl="2">
                                    <Col>
                                        <Field
                                            name="termsChangeUrl"
                                            validate={composeValidators((value: string) => validateCustomUrl(value))}
                                        >
                                            {({ input, meta }) => (
                                                <FormGroup>
                                                    <Label for="termsChangeUrl">Changes of Terms of Service URL</Label>

                                                    <Input
                                                        {...input}
                                                        id="termsChangeUrl"
                                                        type="text"
                                                        name="termsOfServiceChangeUrl"
                                                        placeholder="Enter Changes of Terms of Service URL"
                                                        valid={!meta.error && meta.touched}
                                                        invalid={!!meta.error && meta.touched}
                                                    />

                                                    <FormFeedback>{meta.error}</FormFeedback>
                                                </FormGroup>
                                            )}
                                        </Field>
                                    </Col>

                                    <Col className="align-items-center">
                                        <Field name="disableOrders" type="checkbox">
                                            {({ input, meta }) => (
                                                <FormGroup>
                                                    <br />
                                                    <br />

                                                    <Input {...input} id="disableOrders" type="checkbox" />

                                                    <Label for="disableOrders">
                                                        &nbsp;Disable new Orders (Changes in Terms of Service)
                                                    </Label>
                                                </FormGroup>
                                            )}
                                        </Field>
                                    </Col>
                                </Row>
                            )}

                            <Field name="requireTermsOfService" type="checkbox">
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Input {...input} id="requireTermsOfService" type="checkbox" />

                                        <Label for="requireTermsOfService">&nbsp;Require agree on Terms Of Service for new account</Label>
                                    </FormGroup>
                                )}
                            </Field>

                            <Field name="requireContact" type="checkbox">
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Input {...input} id="requireContact" type="checkbox" />

                                        <Label for="requireContact">&nbsp;Require contact information for new Accounts</Label>
                                    </FormGroup>
                                )}
                            </Field>
                        </Widget>

                        <Widget
                            title="RA Profile Configuration"
                            busy={
                                isFetchingRaProfilesList ||
                                isFetchingIssuanceAttributes ||
                                isFetchingRevocationAttributes ||
                                isFetchingResourceCustomAttributes
                            }
                        >
                            <Field name="raProfile">
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="raProfileSelect">Default RA Profile</Label>

                                        <Select
                                            {...input}
                                            id="raProfile"
                                            inputId="raProfileSelect"
                                            maxMenuHeight={140}
                                            menuPlacement="auto"
                                            options={optionsForRaProfiles}
                                            placeholder="Select to change RA Profile if needed"
                                            isClearable={true}
                                            onChange={(event: any) => {
                                                onRaProfileChange(form, event ? event.value : undefined);
                                                input.onChange(event);
                                            }}
                                        />
                                    </FormGroup>
                                )}
                            </Field>

                            <TabLayout
                                tabs={[
                                    {
                                        title: 'Issue Attributes',
                                        content:
                                            !raProfile || !raProfileIssuanceAttrDescs || raProfileIssuanceAttrDescs.length === 0 ? (
                                                <></>
                                            ) : (
                                                <FormGroup>
                                                    <AttributeEditor
                                                        id="issuanceAttributes"
                                                        attributeDescriptors={raProfileIssuanceAttrDescs}
                                                        attributes={acmeProfile?.issueCertificateAttributes}
                                                        groupAttributesCallbackAttributes={issueGroupAttributesCallbackAttributes}
                                                        setGroupAttributesCallbackAttributes={setIssueGroupAttributesCallbackAttributes}
                                                    />
                                                </FormGroup>
                                            ),
                                    },
                                    {
                                        title: 'Revocation Attributes',
                                        content:
                                            !raProfile || !raProfileRevocationAttrDescs || raProfileRevocationAttrDescs.length === 0 ? (
                                                <></>
                                            ) : (
                                                <FormGroup>
                                                    <AttributeEditor
                                                        id="revocationAttributes"
                                                        attributeDescriptors={raProfileRevocationAttrDescs}
                                                        attributes={acmeProfile?.revokeCertificateAttributes}
                                                        groupAttributesCallbackAttributes={revokeGroupAttributesCallbackAttributes}
                                                        setGroupAttributesCallbackAttributes={setRevokeGroupAttributesCallbackAttributes}
                                                    />
                                                </FormGroup>
                                            ),
                                    },
                                    {
                                        title: 'Custom Attributes',
                                        content: renderCustomAttributeEditor,
                                    },
                                ]}
                            />
                            {}
                        </Widget>

                        <div className="d-flex justify-content-end">
                            <ButtonGroup>
                                <ProgressButton
                                    title={editMode ? 'Update' : 'Create'}
                                    inProgressTitle={editMode ? 'Updating...' : 'Creating...'}
                                    inProgress={submitting}
                                    disabled={pristine || submitting || !valid}
                                />

                                <Button color="default" onClick={onCancelClick} disabled={submitting}>
                                    Cancel
                                </Button>
                            </ButtonGroup>
                        </div>
                    </BootstrapForm>
                )}
            </Form>
        </Widget>
    );
}
