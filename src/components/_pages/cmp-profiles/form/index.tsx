import AttributeEditor from 'components/Attributes/AttributeEditor';
import TabLayout from 'components/Layout/TabLayout';
import ProgressButton from 'components/ProgressButton';
import Widget from 'components/Widget';
import { actions as cmpProfileActions, selectors as cmpProfileSelectors } from 'ducks/cmp-profiles';
import { actions as connectorActions } from 'ducks/connectors';
import { actions as customAttributesActions, selectors as customAttributesSelectors } from 'ducks/customAttributes';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions as raProfileActions, selectors as raProfileSelectors } from 'ducks/ra-profiles';
import { FormApi } from 'final-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { Form as BootstrapForm, Button, ButtonGroup, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { AttributeDescriptorModel } from 'types/attributes';
import { CmpProfileEditRequestModel, CmpProfileRequestModel } from 'types/cmp-profiles';
import {
    CmpProfileEditRequestDtoVariantEnum,
    CmpProfileRequestDtoVariantEnum,
    PlatformEnum,
    ProtectionMethod,
    Resource,
} from 'types/openapi';
import { RaProfileSimplifiedModel } from 'types/ra-profiles';
import { mutators } from 'utils/attributes/attributeEditorMutators';
import { collectFormAttributes } from 'utils/attributes/attributes';
import { isObjectSame } from 'utils/common-utils';
import { composeValidators, validateAlphaNumericWithoutAccents, validateLength, validateRequired } from 'utils/validators';
import styles from './cmpForm.module.scss';

interface SelectChangeValue {
    value: string;
    label: string;
}

interface SelectedRaProfileValue {
    value: RaProfileSimplifiedModel;
    label: string;
}

interface FormValues extends CmpProfileRequestModel {
    selectedVariant?: SelectChangeValue | undefined;
    selectedRaProfile?: SelectedRaProfileValue | undefined;
    selectedSigningCertificate?: SelectChangeValue | undefined;
    selectedRequestProtectionMethod?: SelectChangeValue | undefined;
    selectedResponseProtectionMethod?: SelectChangeValue | undefined;
}
export default function CmpProfileForm() {
    const { id } = useParams();
    const dispatch = useDispatch();

    const editMode = useMemo(() => !!id, [id]);
    const navigate = useNavigate();

    const onCancelClick = useCallback(() => navigate(-1), [navigate]);

    const cmpProfile = useSelector(cmpProfileSelectors.cmpProfile);
    const cmpSigningCertificates = useSelector(cmpProfileSelectors.cmpSigningCertificates);
    const resourceCustomAttributes = useSelector(customAttributesSelectors.resourceCustomAttributes);
    const raProfileIssuanceAttrDescs = useSelector(raProfileSelectors.issuanceAttributes);
    const raProfileRevocationAttrDescs = useSelector(raProfileSelectors.revocationAttributes);
    // const raProfile = useSelector(raProfileSelectors.raProfile);
    const raProfiles = useSelector(raProfileSelectors.raProfiles);

    const isFetchingCmpCertificates = useSelector(cmpProfileSelectors.isFetchingCertificates);
    const isFetchingDetail = useSelector(cmpProfileSelectors.isFetchingDetail);
    const isCreating = useSelector(cmpProfileSelectors.isCreating);
    const isUpdating = useSelector(cmpProfileSelectors.isUpdating);
    const isFetchingRaProfilesList = useSelector(raProfileSelectors.isFetchingList);
    const isFetchingIssuanceAttributes = useSelector(raProfileSelectors.isFetchingIssuanceAttributes);
    const isFetchingRevocationAttributes = useSelector(raProfileSelectors.isFetchingRevocationAttributes);
    const isFetchingResourceCustomAttributes = useSelector(customAttributesSelectors.isFetchingResourceCustomAttributes);
    const protectionMethodEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ProtectionMethod));
    const cmpCmpProfileVariantEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.CmpProfileVariant));

    const [issueGroupAttributesCallbackAttributes, setIssueGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);
    const [revokeGroupAttributesCallbackAttributes, setRevokeGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);
    const raProfilesOptions = useMemo(
        () =>
            raProfiles.map((raProfile) => ({
                value: raProfile,
                label: raProfile.name,
            })),
        [raProfiles],
    );

    const protectionMethodOptions = useMemo(
        () => [
            { value: ProtectionMethod.SharedSecret, label: getEnumLabel(protectionMethodEnum, ProtectionMethod.SharedSecret) },
            { value: ProtectionMethod.Signature, label: getEnumLabel(protectionMethodEnum, ProtectionMethod.Signature) },
        ],
        [protectionMethodEnum],
    );

    const cmpProfileVariantOptions = useMemo(
        () => [
            {
                value: CmpProfileRequestDtoVariantEnum.V2,
                label: getEnumLabel(cmpCmpProfileVariantEnum, CmpProfileRequestDtoVariantEnum.V2),
            },
            {
                value: CmpProfileRequestDtoVariantEnum.V3,
                label: getEnumLabel(cmpCmpProfileVariantEnum, CmpProfileRequestDtoVariantEnum.V3),
            },
            {
                value: CmpProfileRequestDtoVariantEnum.V23gpp,
                label: getEnumLabel(cmpCmpProfileVariantEnum, CmpProfileRequestDtoVariantEnum.V23gpp),
            },
        ],
        [cmpCmpProfileVariantEnum],
    );

    const signingCertificateOptions = useMemo(
        () =>
            cmpSigningCertificates?.map((certificate) => ({
                value: certificate.uuid,
                label: `${certificate.commonName} (${certificate.serialNumber})`,
            })),
        [cmpSigningCertificates],
    );

    useEffect(() => {
        dispatch(customAttributesActions.listResourceCustomAttributes(Resource.CmpProfiles));
        dispatch(raProfileActions.listRaProfiles());
        // dispatch(cmpProfileActions.listCmpSigningCertificates());
    }, [dispatch]);

    const title = useMemo(() => (editMode ? 'Edit CMP Profile' : 'Create CMP Profile'), [editMode]);
    const isBusy = useMemo(
        () => isFetchingDetail || isCreating || isUpdating || isFetchingCmpCertificates,
        [isFetchingDetail, isCreating, isUpdating, isFetchingCmpCertificates],
    );

    useEffect(() => {
        if (id) dispatch(cmpProfileActions.getCmpProfile({ uuid: id }));
        else dispatch(cmpProfileActions.resetCmpProfile());
    }, [id, dispatch]);

    const onSubmit = useCallback(
        (values: FormValues) => {
            if (editMode && cmpProfile && cmpProfile?.uuid === id) {
                const valuesToSubmit: CmpProfileEditRequestModel = {
                    name: values.name,
                    description: values.description,
                    variant: values.selectedVariant?.value as CmpProfileEditRequestDtoVariantEnum,
                    requestProtectionMethod: values.selectedRequestProtectionMethod?.value as ProtectionMethod,
                    responseProtectionMethod: values.selectedResponseProtectionMethod?.value as ProtectionMethod,
                    raProfileUuid: values.selectedRaProfile?.value?.uuid,
                    sharedSecret:
                        values?.selectedRequestProtectionMethod?.value === ProtectionMethod.SharedSecret ? values.sharedSecret : undefined,
                    signingCertificateUuid:
                        values?.selectedResponseProtectionMethod?.value === ProtectionMethod.Signature
                            ? values.selectedSigningCertificate?.value
                            : undefined,

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
                    customAttributes: collectFormAttributes('customCmpProfile', resourceCustomAttributes, values),
                };
                dispatch(cmpProfileActions.updateCmpProfile({ uuid: cmpProfile.uuid, updateCmpRequest: valuesToSubmit }));
            } else {
                const valuesToSubmit: CmpProfileRequestModel = {
                    name: values.name,
                    description: values.description,
                    variant: values.selectedVariant?.value as CmpProfileRequestDtoVariantEnum,
                    requestProtectionMethod: values.selectedRequestProtectionMethod?.value as ProtectionMethod,
                    responseProtectionMethod: values.selectedResponseProtectionMethod?.value as ProtectionMethod,
                    raProfileUuid: values.selectedRaProfile?.value?.uuid,
                    sharedSecret:
                        values?.selectedRequestProtectionMethod?.value === ProtectionMethod.SharedSecret ? values.sharedSecret : undefined,
                    signingCertificateUuid:
                        values?.selectedResponseProtectionMethod?.value === ProtectionMethod.Signature
                            ? values.selectedSigningCertificate?.value
                            : undefined,

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
                    customAttributes: collectFormAttributes('customCmpProfile', resourceCustomAttributes, values),
                };

                dispatch(cmpProfileActions.createCmpProfile(valuesToSubmit));
            }
        },
        [
            id,
            cmpProfile,
            dispatch,
            editMode,
            issueGroupAttributesCallbackAttributes,
            raProfileIssuanceAttrDescs,
            raProfileRevocationAttrDescs,
            resourceCustomAttributes,
            revokeGroupAttributesCallbackAttributes,
        ],
    );

    useEffect(() => {
        if (cmpProfile?.raProfile?.authorityInstanceUuid) {
            dispatch(
                raProfileActions.listIssuanceAttributeDescriptors({
                    authorityUuid: cmpProfile.raProfile.authorityInstanceUuid,
                    uuid: cmpProfile.raProfile.uuid,
                }),
            );
            dispatch(
                raProfileActions.listRevocationAttributeDescriptors({
                    authorityUuid: cmpProfile.raProfile.authorityInstanceUuid,
                    uuid: cmpProfile.raProfile.uuid,
                }),
            );
        }

        if (cmpProfile?.responseProtectionMethod === ProtectionMethod.Signature) {
            dispatch(cmpProfileActions.listCmpSigningCertificates());
        }
    }, [dispatch, cmpProfile]);

    const defaultValues: FormValues = useMemo(() => {
        if (editMode && cmpProfile) {
            return {
                name: cmpProfile?.name || '',
                description: cmpProfile?.description || '',
                selectedRaProfile: cmpProfile?.raProfile
                    ? {
                          label: cmpProfile.raProfile.name,
                          value: cmpProfile.raProfile,
                      }
                    : undefined,
                raProfileUuid: cmpProfile?.raProfile?.uuid,
                selectedSigningCertificate: cmpProfile?.signingCertificate
                    ? {
                          label: `${cmpProfile.signingCertificate.commonName} (${cmpProfile.signingCertificate.serialNumber})`,
                          value: cmpProfile.signingCertificate.uuid,
                      }
                    : undefined,
                signingCertificateUuid: cmpProfile?.signingCertificate?.uuid,
                selectedRequestProtectionMethod: cmpProfile?.requestProtectionMethod
                    ? {
                          value: cmpProfile?.requestProtectionMethod,
                          label: getEnumLabel(protectionMethodEnum, cmpProfile?.requestProtectionMethod),
                      }
                    : undefined,
                requestProtectionMethod: cmpProfile?.requestProtectionMethod || (undefined as any),
                selectedResponseProtectionMethod: cmpProfile?.responseProtectionMethod
                    ? {
                          value: cmpProfile?.responseProtectionMethod,
                          label: getEnumLabel(protectionMethodEnum, cmpProfile?.responseProtectionMethod),
                      }
                    : undefined,
                responseProtectionMethod: cmpProfile?.responseProtectionMethod || (undefined as any),
                sharedSecret: undefined,
                selectedVariant: cmpProfile?.variant
                    ? {
                          value: cmpProfile?.variant,
                          label: getEnumLabel(cmpCmpProfileVariantEnum, cmpProfile.variant),
                      }
                    : undefined,
                variant: (cmpProfile?.variant as unknown as CmpProfileRequestDtoVariantEnum) || (undefined as any),
            };
        } else {
            return {
                name: '',
                description: undefined,
                selectedRaProfile: undefined,
                selectedSigningCertificate: undefined,
                selectedRequestProtectionMethod: undefined,
                requestProtectionMethod: undefined as any,
                selectedResponseProtectionMethod: undefined,
                responseProtectionMethod: undefined as any,
                customAttributes: undefined,
                issueCertificateAttributes: undefined,
                revokeCertificateAttributes: undefined,
                signingCertificateUuid: undefined,
                raProfileUuid: undefined,
                sharedSecret: undefined,
                selectedVariant: undefined,
                variant: undefined as any,
            };
        }
    }, [editMode, cmpProfile, cmpCmpProfileVariantEnum, protectionMethodEnum]);

    const onRaProfileChange = useCallback(
        (form: FormApi<FormValues>, value?: string) => {
            dispatch(connectorActions.clearCallbackData());
            setIssueGroupAttributesCallbackAttributes([]);
            setRevokeGroupAttributesCallbackAttributes([]);

            if (!value) {
                form.mutators.clearAttributes('issueCertificateAttributes');
                form.mutators.clearAttributes('revokeCertificateAttributes');
                form.change('raProfileUuid', undefined);
                return;
            }
            const selectedRaProfile = raProfilesOptions.find((raProfile) => raProfile.value.uuid === value);

            if (selectedRaProfile?.value?.authorityInstanceUuid) {
                dispatch(
                    raProfileActions.listIssuanceAttributeDescriptors({
                        authorityUuid: selectedRaProfile?.value?.authorityInstanceUuid,
                        uuid: selectedRaProfile?.value?.uuid,
                    }),
                );
                dispatch(
                    raProfileActions.listRevocationAttributeDescriptors({
                        authorityUuid: selectedRaProfile?.value?.authorityInstanceUuid,
                        uuid: selectedRaProfile?.value?.uuid,
                    }),
                );
            }
            if (cmpProfile) {
                form.mutators.clearAttributes('issuanceAttributes');
                form.mutators.clearAttributes('revocationAttributes');
            }
        },
        [dispatch, cmpProfile, raProfilesOptions],
    );

    const renderCustomAttributeEditor = useMemo(() => {
        // if (isBusy) return <></>;
        return (
            <AttributeEditor
                id="customCmpProfile"
                attributeDescriptors={resourceCustomAttributes}
                attributes={cmpProfile?.customAttributes}
            />
        );
    }, [resourceCustomAttributes, cmpProfile?.customAttributes]);

    const renderIssuanceAttributes = useMemo(() => {
        // if (isBusy || !raProfileIssuanceAttrDescs) return <></>;
        if (!raProfileIssuanceAttrDescs) return <></>;
        return (
            <FormGroup>
                <AttributeEditor
                    id="issuanceAttributes"
                    attributeDescriptors={raProfileIssuanceAttrDescs}
                    attributes={cmpProfile?.issueCertificateAttributes}
                    groupAttributesCallbackAttributes={issueGroupAttributesCallbackAttributes}
                    setGroupAttributesCallbackAttributes={setIssueGroupAttributesCallbackAttributes}
                />
            </FormGroup>
        );
    }, [raProfileIssuanceAttrDescs, cmpProfile?.issueCertificateAttributes, issueGroupAttributesCallbackAttributes]);

    const areDefaultValuesSame = useCallback(
        (values: FormValues) => {
            const areValuesSame = isObjectSame(
                values as unknown as Record<string, unknown>,
                defaultValues as unknown as Record<string, unknown>,
            );

            return areValuesSame;
        },
        [defaultValues],
    );

    return (
        <Widget title={title} busy={isBusy}>
            {!isFetchingDetail && (
                <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<FormValues>() }}>
                    {({ handleSubmit, pristine, submitting, valid, form, values }) => {
                        return (
                            <BootstrapForm onSubmit={handleSubmit}>
                                <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumericWithoutAccents())}>
                                    {({ input, meta }) => (
                                        <FormGroup>
                                            <Label for="name">Name</Label>
                                            <Input
                                                {...input}
                                                id="name"
                                                type="text"
                                                placeholder="CMP Profile Name"
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
                                            <Input {...input} id="description" type="textarea" placeholder="Enter Description" />
                                        </FormGroup>
                                    )}
                                </Field>
                                <Widget title="CMP Variant Configuration">
                                    <Field name="selectedVariant" validate={composeValidators(validateRequired())} type="radio">
                                        {({ input, meta }) => (
                                            <FormGroup>
                                                {/* <Label for="selectedVariant">Variant</Label>
                                                <Select
                                                    {...input}
                                                    id="selectedVariant"
                                                    maxMenuHeight={140}
                                                    menuPlacement="auto"
                                                    options={cmpProfileVariantOptions}
                                                    placeholder="Select Variant"
                                                    isClearable={true}
                                                />
                                                <FormFeedback>{meta.error}</FormFeedback> */}
                                                {cmpProfileVariantOptions.map((option, index) => {
                                                    return (
                                                        <FormGroup check inline key={index} className={styles.radioFormGroup}>
                                                            <Label check>
                                                                <Input
                                                                    type="radio"
                                                                    name="selectedVariant"
                                                                    value={option.value}
                                                                    onChange={(event) => {
                                                                        input.onChange({ value: option.value, label: option.label });
                                                                    }}
                                                                    checked={values?.selectedVariant?.value === option.value}
                                                                    className={styles.radioFormInput}
                                                                />
                                                                {option.label}
                                                            </Label>
                                                        </FormGroup>
                                                    );
                                                })}
                                            </FormGroup>
                                        )}
                                    </Field>
                                </Widget>
                                <Widget title="Request Configuration">
                                    <Field name="selectedRequestProtectionMethod">
                                        {({ input, meta }) => (
                                            <FormGroup>
                                                <Label for="selectedRequestProtectionMethodSelect">Requested Protection Method</Label>
                                                <Select
                                                    {...input}
                                                    inputId="selectedRequestProtectionMethodSelect"
                                                    id="selectedRequestProtectionMethod"
                                                    maxMenuHeight={140}
                                                    menuPlacement="auto"
                                                    options={protectionMethodOptions}
                                                    placeholder="Select Requested Protection Method"
                                                    isClearable={true}
                                                    onChange={(event) => {
                                                        input.onChange(event);
                                                        form.change('sharedSecret', undefined);
                                                    }}
                                                />
                                            </FormGroup>
                                        )}
                                    </Field>
                                    {values?.selectedRequestProtectionMethod?.value === ProtectionMethod.SharedSecret && (
                                        <Field name="sharedSecret" validate={composeValidators(validateRequired())}>
                                            {({ input, meta }) => (
                                                <FormGroup>
                                                    <Label for="sharedSecret">Shared Secret</Label>
                                                    <Input
                                                        {...input}
                                                        id="sharedSecret"
                                                        type="password"
                                                        placeholder="Shared Secret"
                                                        valid={!meta.error && meta.touched}
                                                        invalid={!!meta.error && meta.touched}
                                                    />
                                                    <FormFeedback>{meta.error}</FormFeedback>
                                                </FormGroup>
                                            )}
                                        </Field>
                                    )}
                                </Widget>

                                <Widget title="Response Configuration">
                                    <Field name="selectedResponseProtectionMethod">
                                        {({ input, meta }) => (
                                            <FormGroup>
                                                <Label for="selectedResponseProtectionMethodSelect">Response Protection Method</Label>
                                                <Select
                                                    {...input}
                                                    inputId="selectedResponseProtectionMethodSelect"
                                                    id="selectedResponseProtectionMethod"
                                                    maxMenuHeight={140}
                                                    menuPlacement="auto"
                                                    options={protectionMethodOptions}
                                                    placeholder="Select Response Protection Method"
                                                    isClearable={true}
                                                    onChange={(event) => {
                                                        input.onChange(event);
                                                        form.change('selectedSigningCertificate', undefined);
                                                        if (event?.value === ProtectionMethod.Signature) {
                                                            if (!cmpSigningCertificates || cmpSigningCertificates.length === 0)
                                                                dispatch(cmpProfileActions.listCmpSigningCertificates());
                                                        }
                                                    }}
                                                />
                                            </FormGroup>
                                        )}
                                    </Field>

                                    {values?.selectedResponseProtectionMethod?.value === ProtectionMethod.Signature && (
                                        <Field name="selectedSigningCertificate" validate={composeValidators(validateRequired())}>
                                            {({ input, meta }) => (
                                                <FormGroup>
                                                    <Label for="selectedSigningCertificate">Signing Certificate</Label>
                                                    <Select
                                                        {...input}
                                                        id="selectedSigningCertificate"
                                                        maxMenuHeight={140}
                                                        menuPlacement="auto"
                                                        options={signingCertificateOptions}
                                                        placeholder="Select Signing Certificate"
                                                        isClearable={true}
                                                    />

                                                    <FormFeedback>{meta.error}</FormFeedback>
                                                </FormGroup>
                                            )}
                                        </Field>
                                    )}
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
                                    <Field name="selectedRaProfile">
                                        {({ input, meta }) => (
                                            <FormGroup>
                                                <Label for="selectedRaProfileSelect">Default RA Profile</Label>

                                                <Select
                                                    {...input}
                                                    inputId="selectedRaProfileSelect"
                                                    id="selectedRaProfile"
                                                    maxMenuHeight={140}
                                                    menuPlacement="auto"
                                                    options={raProfilesOptions}
                                                    placeholder="Select to change RA Profile if needed"
                                                    isClearable={true}
                                                    onChange={(event) => {
                                                        input.onChange(event);
                                                        if (event?.value) {
                                                            onRaProfileChange(form, event.value.uuid);
                                                        } else {
                                                            onRaProfileChange(form, undefined);
                                                        }
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
                                                    !values?.selectedRaProfile?.value ||
                                                    !raProfileIssuanceAttrDescs ||
                                                    raProfileIssuanceAttrDescs.length === 0 ? (
                                                        <></>
                                                    ) : (
                                                        renderIssuanceAttributes
                                                    ),
                                            },
                                            {
                                                title: 'Revocation Attributes',
                                                content:
                                                    !values?.selectedRaProfile?.value ||
                                                    !raProfileRevocationAttrDescs ||
                                                    raProfileRevocationAttrDescs.length === 0 ? (
                                                        <></>
                                                    ) : (
                                                        <FormGroup>
                                                            <AttributeEditor
                                                                id="revocationAttributes"
                                                                attributeDescriptors={raProfileRevocationAttrDescs}
                                                                attributes={cmpProfile?.revokeCertificateAttributes}
                                                                groupAttributesCallbackAttributes={revokeGroupAttributesCallbackAttributes}
                                                                setGroupAttributesCallbackAttributes={
                                                                    setRevokeGroupAttributesCallbackAttributes
                                                                }
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
                                </Widget>
                                <div className="d-flex justify-content-end">
                                    <ButtonGroup>
                                        <ProgressButton
                                            title={editMode ? 'Update' : 'Create'}
                                            inProgressTitle={editMode ? 'Updating...' : 'Creating...'}
                                            inProgress={submitting}
                                            disabled={
                                                pristine ||
                                                submitting ||
                                                !valid ||
                                                isBusy ||
                                                !values.selectedRequestProtectionMethod ||
                                                !values.selectedResponseProtectionMethod ||
                                                areDefaultValuesSame(values)
                                            }
                                        />

                                        <Button color="default" onClick={onCancelClick} disabled={submitting}>
                                            Cancel
                                        </Button>
                                    </ButtonGroup>
                                </div>
                            </BootstrapForm>
                        );
                    }}
                </Form>
            )}
        </Widget>
    );
}
