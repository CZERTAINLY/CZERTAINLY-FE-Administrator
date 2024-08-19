import AttributeEditor from 'components/Attributes/AttributeEditor';
import SwitchField from 'components/Input/SwitchField';
import TextField from 'components/Input/TextField';
import TabLayout from 'components/Layout/TabLayout';
import ProgressButton from 'components/ProgressButton';

import Widget from 'components/Widget';

import { actions as connectorActions } from 'ducks/connectors';
import { actions as customAttributesActions, selectors as customAttributesSelectors } from 'ducks/customAttributes';
import { actions as raProfileActions, selectors as raProfileSelectors } from 'ducks/ra-profiles';
import { actions as scepProfileActions, selectors as scepProfileSelectors } from 'ducks/scep-profiles';

import { FormApi } from 'final-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { Form as BootstrapForm, Button, ButtonGroup, FormGroup, Label } from 'reactstrap';
import { AttributeDescriptorModel } from 'types/attributes';
import { RaProfileSimplifiedModel } from 'types/ra-profiles';
import { ScepProfileAddRequestModel, ScepProfileEditRequestModel, ScepProfileResponseModel } from 'types/scep-profiles';

import { mutators } from 'utils/attributes/attributeEditorMutators';
import { collectFormAttributes } from 'utils/attributes/attributes';

import { validateAlphaNumericWithoutAccents, validateInteger, validateLength, validateRequired } from 'utils/validators';
import { KeyAlgorithm, Resource } from '../../../../types/openapi';
import CertificateField from '../CertificateField';

interface FormValues {
    name: string;
    description: string;
    renewalThreshold: number;
    includeCaCertificate: boolean;
    includeCaCertificateChain: boolean;
    challengePassword?: string;
    enableIntune: boolean;
    intuneTenant: string;
    intuneApplicationId: string;
    intuneApplicationKey: string;
    raProfile: { value: string; label: string } | undefined;
    certificate: { value: string; label: string } | undefined;
}

export default function ScepProfileForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();

    const editMode = useMemo(() => !!id, [id]);

    const scepProfileSelector = useSelector(scepProfileSelectors.scepProfile);

    const raProfiles = useSelector(raProfileSelectors.raProfiles);
    const raProfileIssuanceAttrDescs = useSelector(raProfileSelectors.issuanceAttributes);
    const resourceCustomAttributes = useSelector(customAttributesSelectors.resourceCustomAttributes);
    const certificates = useSelector(scepProfileSelectors.caCertificates);

    const isFetchingDetail = useSelector(scepProfileSelectors.isFetchingDetail);
    const isCreating = useSelector(scepProfileSelectors.isCreating);
    const isUpdating = useSelector(scepProfileSelectors.isUpdating);

    const isFetchingRaProfilesList = useSelector(raProfileSelectors.isFetchingList);
    const isFetchingIssuanceAttributes = useSelector(raProfileSelectors.isFetchingIssuanceAttributes);
    const isFetchingResourceCustomAttributes = useSelector(customAttributesSelectors.isFetchingResourceCustomAttributes);

    const [issueGroupAttributesCallbackAttributes, setIssueGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);

    const [scepProfile, setScepProfile] = useState<ScepProfileResponseModel>();
    const [raProfile, setRaProfile] = useState<RaProfileSimplifiedModel>();
    const [intune, setIntune] = useState(false);

    const isBusy = useMemo(() => isFetchingDetail || isCreating || isUpdating, [isFetchingDetail, isCreating, isUpdating]);

    useEffect(() => {
        if (editMode && (!scepProfileSelector || scepProfileSelector.uuid !== id)) {
            dispatch(scepProfileActions.getScepProfile({ uuid: id! }));
        }

        if (editMode && scepProfileSelector && scepProfileSelector.uuid === id) {
            setIntune(scepProfileSelector.enableIntune ?? false);
            setScepProfile(scepProfileSelector);
            setRaProfile(scepProfileSelector.raProfile);
        }
    }, [dispatch, id, editMode, scepProfileSelector]);

    useEffect(() => {
        dispatch(customAttributesActions.listResourceCustomAttributes(Resource.ScepProfiles));
        dispatch(raProfileActions.listRaProfiles());
    }, [dispatch]);

    useEffect(() => {
        dispatch(scepProfileActions.listScepCaCertificates(intune));
    }, [dispatch, intune]);

    useEffect(() => {
        if (raProfile && raProfile.authorityInstanceUuid) {
            dispatch(
                raProfileActions.listIssuanceAttributeDescriptors({ authorityUuid: raProfile.authorityInstanceUuid, uuid: raProfile.uuid }),
            );
        }
    }, [dispatch, raProfile]);

    const onSubmit = useCallback(
        (values: FormValues) => {
            const scepRequest: ScepProfileEditRequestModel | ScepProfileAddRequestModel = {
                ...values,
                caCertificateUuid: values.certificate!.value,
                issueCertificateAttributes: collectFormAttributes(
                    'issuanceAttributes',
                    [...(raProfileIssuanceAttrDescs ?? []), ...issueGroupAttributesCallbackAttributes],
                    values,
                ),
                customAttributes: collectFormAttributes('customScepProfile', resourceCustomAttributes, values),
            };
            if (values.raProfile) {
                scepRequest.raProfileUuid = values.raProfile.value;
            }
            if (editMode) {
                dispatch(
                    scepProfileActions.updateScepProfile({
                        uuid: id!,
                        updateScepRequest: scepRequest,
                    }),
                );
            } else {
                dispatch(scepProfileActions.createScepProfile(scepRequest as ScepProfileAddRequestModel));
            }
        },
        [dispatch, editMode, id, raProfileIssuanceAttrDescs, issueGroupAttributesCallbackAttributes, resourceCustomAttributes],
    );

    const onCancelClick = useCallback(() => navigate(-1), [navigate]);

    const onRaProfileChange = useCallback(
        (form: FormApi<FormValues>, value: string) => {
            dispatch(connectorActions.clearCallbackData());
            setIssueGroupAttributesCallbackAttributes([]);

            if (!value) {
                setRaProfile(undefined);
                dispatch(raProfileActions.clearIssuanceAttributesDescriptors());
                form.mutators.clearAttributes('issuanceAttributes');
                return;
            }

            setRaProfile(raProfiles.find((p) => p.uuid === value) || undefined);

            if (scepProfile) {
                setScepProfile({
                    ...scepProfile,
                    issueCertificateAttributes: [],
                });
            }
        },
        [dispatch, raProfiles, scepProfile],
    );

    const optionsForRaProfiles = useMemo(
        () =>
            raProfiles.map((raProfile) => ({
                value: raProfile.uuid,
                label: raProfile.name,
            })),
        [raProfiles],
    );

    const defaultValues = useMemo(
        () => ({
            name: editMode ? scepProfileSelector?.name || '' : '',
            description: editMode ? scepProfileSelector?.description || '' : '',
            renewalThreshold: editMode ? scepProfileSelector?.renewThreshold || 0 : 0,
            includeCaCertificate: editMode ? scepProfileSelector?.includeCaCertificate || false : false,
            includeCaCertificateChain: editMode ? scepProfileSelector?.includeCaCertificateChain || false : false,
            enableIntune: editMode ? (scepProfileSelector?.enableIntune ?? false) : false,
            intuneTenant: editMode ? (scepProfileSelector?.intuneTenant ?? '') : '',
            intuneApplicationId: editMode ? (scepProfileSelector?.intuneApplicationId ?? '') : '',
            intuneApplicationKey: '',
            raProfile: editMode
                ? scepProfileSelector?.raProfile
                    ? optionsForRaProfiles.find((raProfile) => raProfile.value === scepProfileSelector.raProfile?.uuid)
                    : undefined
                : undefined,
            certificate:
                editMode && scepProfileSelector?.caCertificate
                    ? {
                          label: `${scepProfileSelector.caCertificate.commonName} (${scepProfileSelector.caCertificate.serialNumber})`,
                          value: scepProfileSelector.caCertificate.uuid,
                      }
                    : undefined,
        }),
        [editMode, scepProfileSelector, optionsForRaProfiles],
    );

    const title = useMemo(() => (editMode ? 'Edit SCEP Profile' : 'Create SCEP Profile'), [editMode]);

    return (
        <Widget title={title} busy={isBusy}>
            <Form
                initialValues={defaultValues}
                onSubmit={onSubmit}
                mutators={{ ...mutators<FormValues>() }}
                validate={(values) => {
                    const errors: {
                        intuneTenant?: string;
                        intuneApplicationId?: string;
                        intuneApplicationKey?: string;
                        challengePassword?: string;
                    } = {};
                    if (values.enableIntune) {
                        if (!values.intuneTenant) {
                            errors.intuneTenant = 'Required Field';
                        }
                        if (!values.intuneApplicationId) {
                            errors.intuneApplicationId = 'Required Field';
                        }
                        if (!values.intuneApplicationKey) {
                            errors.intuneApplicationKey = 'Required Field';
                        }
                    }
                    if (
                        certificates?.find((c) => c.uuid === values.certificate?.value)?.publicKeyAlgorithm === KeyAlgorithm.Ecdsa &&
                        !values.challengePassword
                    ) {
                        errors.challengePassword = 'Required Field';
                    }
                    return errors;
                }}
            >
                {({ handleSubmit, pristine, submitting, valid, form }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        <TextField
                            id="name"
                            label="SCEP Profile Name"
                            validators={[validateRequired(), validateAlphaNumericWithoutAccents()]}
                            disabled={editMode}
                        />
                        <TextField id="description" label="Description" validators={[validateLength(0, 300)]} />
                        <TextField id="challengePassword" label="Challenge Password" inputType={'password'} validators={[]} />
                        <TextField
                            id="renewalThreshold"
                            label="Renewal Threshold"
                            description="Minimum expiry days to allow renewal of certificate."
                            validators={[validateInteger()]}
                        />
                        <SwitchField id="includeCaCertificate" label="Include CA Certificate" />
                        <SwitchField id="includeCaCertificateChain" label="Include CA Certificate Chain" />
                        <SwitchField id="enableIntune" label="Enable Intune" onChange={(e) => setIntune(e)} />
                        <TextField id="intuneTenant" label="Intune Tenant" validators={[]} disabled={!intune} />
                        <TextField id="intuneApplicationId" label="Intune Application ID" validators={[]} disabled={!intune} />
                        <TextField id="intuneApplicationKey" label="Intune Application Key" validators={[]} disabled={!intune} />

                        <CertificateField certificates={certificates} />

                        <Widget
                            title="RA Profile Configuration"
                            busy={isFetchingRaProfilesList || isFetchingIssuanceAttributes || isFetchingResourceCustomAttributes}
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
                                                        attributes={scepProfile?.issueCertificateAttributes}
                                                        groupAttributesCallbackAttributes={issueGroupAttributesCallbackAttributes}
                                                        setGroupAttributesCallbackAttributes={setIssueGroupAttributesCallbackAttributes}
                                                    />
                                                </FormGroup>
                                            ),
                                    },
                                    {
                                        title: 'Custom Attributes',
                                        content: (
                                            <AttributeEditor
                                                id="customScepProfile"
                                                attributeDescriptors={resourceCustomAttributes}
                                                attributes={scepProfile?.customAttributes}
                                            />
                                        ),
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
