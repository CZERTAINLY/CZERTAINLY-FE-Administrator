import AttributeEditor from "components/Attributes/AttributeEditor";
import SwitchField from "components/Input/SwitchField";
import TextField from "components/Input/TextField";
import TabLayout from "components/Layout/TabLayout";
import ProgressButton from "components/ProgressButton";

import Widget from "components/Widget";

import { actions as connectorActions } from "ducks/connectors";
import { actions as customAttributesActions, selectors as customAttributesSelectors } from "ducks/customAttributes";
import { actions as raProfileActions, selectors as raProfileSelectors } from "ducks/ra-profiles";
import { actions as scepProfileActions, selectors as scepProfileSelectors } from "ducks/scep-profiles";

import { FormApi } from "final-form";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Field, Form } from "react-final-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { Form as BootstrapForm, Button, ButtonGroup, FormGroup, Label } from "reactstrap";
import { AttributeDescriptorModel } from "types/attributes";
import { RaProfileResponseModel } from "types/ra-profiles";
import { ScepProfileResponseModel } from "types/scep-profiles";

import { mutators } from "utils/attributes/attributeEditorMutators";
import { collectFormAttributes } from "utils/attributes/attributes";

import { validateAlphaNumeric, validateInteger, validateRequired } from "utils/validators";
import { Resource } from "../../../../types/openapi";

interface FormValues {
    name: string;
    description: string;
    requireManualApproval: boolean;
    renewalThreshold: number;
    includeCaCertificate: boolean;
    includeCaCertificateChain: boolean;
    challengePassword: string;
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
    const [raProfile, setRaProfile] = useState<RaProfileResponseModel>();
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
        if (raProfile) {
            dispatch(
                raProfileActions.listIssuanceAttributeDescriptors({ authorityUuid: raProfile.authorityInstanceUuid, uuid: raProfile.uuid }),
            );
        }
    }, [dispatch, raProfile]);

    const onSubmit = useCallback(
        (values: FormValues) => {
            const scepRequest = {
                ...values,
                raProfileUuid: values.raProfile ? values.raProfile.value : "NONE",
                caCertificateUuid: values.certificate ? values.certificate.value : "NONE",
                issueCertificateAttributes: collectFormAttributes(
                    "issuanceAttributes",
                    [...(raProfileIssuanceAttrDescs ?? []), ...issueGroupAttributesCallbackAttributes],
                    values,
                ),
                customAttributes: collectFormAttributes("customScepProfile", resourceCustomAttributes, values),
            };
            if (editMode) {
                dispatch(
                    scepProfileActions.updateScepProfile({
                        uuid: id!,
                        updateScepRequest: scepRequest,
                    }),
                );
            } else {
                dispatch(scepProfileActions.createScepProfile(scepRequest));
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
                form.mutators.clearAttributes("issuanceAttributes");
                return;
            }

            setRaProfile(raProfiles.find((p) => p.uuid === value) || undefined);

            dispatch(
                raProfileActions.listIssuanceAttributeDescriptors({ authorityUuid: raProfile?.authorityInstanceUuid || "", uuid: value }),
            );

            if (scepProfile) {
                setScepProfile({
                    ...scepProfile,
                    issueCertificateAttributes: [],
                });
            }
        },
        [dispatch, raProfiles, scepProfile, raProfile?.authorityInstanceUuid],
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
            name: editMode ? scepProfile?.name || "" : "",
            description: editMode ? scepProfile?.description || "" : "",
            requireManualApproval: editMode ? scepProfile?.requireManualApproval || false : false,
            renewalThreshold: editMode ? scepProfile?.renewThreshold || 0 : 0,
            includeCaCertificate: editMode ? scepProfile?.includeCaCertificate || false : false,
            includeCaCertificateChain: editMode ? scepProfile?.includeCaCertificateChain || false : false,
            challengePassword: "",
            enableIntune: editMode ? scepProfile?.enableIntune ?? false : false,
            intuneTenant: editMode ? scepProfile?.intuneTenant ?? "" : "",
            intuneApplicationId: editMode ? scepProfile?.intuneApplicationId ?? "" : "",
            intuneApplicationKey: "",
            raProfile: editMode
                ? scepProfile?.raProfile
                    ? optionsForRaProfiles.find((raProfile) => raProfile.value === scepProfile.raProfile?.uuid)
                    : undefined
                : undefined,
            certificate: undefined,
        }),
        [editMode, scepProfile, optionsForRaProfiles],
    );

    const optionsForCertificates = useMemo(() => {
        const options = certificates?.map((certificate) => ({
            value: certificate.uuid,
            label: `${certificate.commonName} (${certificate.serialNumber})`,
        }));
        defaultValues.certificate = editMode
            ? scepProfile?.caCertificate
                ? options?.find((certificate) => certificate.value === scepProfile.caCertificate?.uuid)
                : undefined
            : undefined;
        return options;
    }, [certificates, defaultValues, editMode, scepProfile?.caCertificate]);

    const title = useMemo(() => (editMode ? "Edit SCEP Profile" : "Create SCEP Profile"), [editMode]);

    return (
        <Widget title={title} busy={isBusy}>
            <Form
                initialValues={defaultValues}
                onSubmit={onSubmit}
                mutators={{ ...mutators<FormValues>() }}
                validate={(values) => {
                    const errors: { intuneTenant?: string; intuneApplicationId?: string; intuneApplicationKey?: string } = {};
                    if (values.enableIntune) {
                        if (!values.intuneTenant) {
                            errors.intuneTenant = "Required Field";
                        }
                        if (!values.intuneApplicationId) {
                            errors.intuneApplicationId = "Required Field";
                        }
                        if (!values.intuneApplicationKey) {
                            errors.intuneApplicationKey = "Required Field";
                        }
                    }
                    return errors;
                }}
            >
                {({ handleSubmit, pristine, submitting, valid, form }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        <TextField
                            id="name"
                            label="SCEP Profile Name"
                            validators={[validateRequired(), validateAlphaNumeric()]}
                            disabled={editMode}
                        />
                        <TextField id="description" label="Description" validators={[validateAlphaNumeric()]} />
                        <TextField id="challengePassword" label="Challenge Password" inputType={"password"} validators={[]} />
                        <TextField
                            id="renewalThreshold"
                            label="Renewal Threshold"
                            description="Minimum expiry days to allow renewal of certificate."
                            validators={[validateInteger()]}
                        />
                        <SwitchField id="requireManualApproval" label="Require Manual Approval" />
                        <SwitchField id="includeCaCertificate" label="Include CA Certificate" />
                        <SwitchField id="includeCaCertificateChain" label="Include CA Certificate Chain" />
                        <SwitchField id="enableIntune" label="Enable Intune" onChange={(e) => setIntune(e)} />
                        <TextField id="intuneTenant" label="Intune Tenant" validators={[]} disabled={!intune} />
                        <TextField id="intuneApplicationId" label="Intune Application ID" validators={[]} disabled={!intune} />
                        <TextField id="intuneApplicationKey" label="Intune Application Key" validators={[]} disabled={!intune} />

                        <Field name="certificate" validate={validateRequired()}>
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="certificate">CA Certificate</Label>
                                    <Select
                                        {...input}
                                        id="certificate"
                                        maxMenuHeight={140}
                                        menuPlacement="auto"
                                        options={optionsForCertificates}
                                        placeholder="Select to change CA Certificate if needed"
                                        isClearable={true}
                                    />
                                </FormGroup>
                            )}
                        </Field>

                        <Widget
                            title="RA Profile Configuration"
                            busy={isFetchingRaProfilesList || isFetchingIssuanceAttributes || isFetchingResourceCustomAttributes}
                        >
                            <Field name="raProfile">
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="raProfile">Default RA Profile</Label>

                                        <Select
                                            {...input}
                                            id="raProfile"
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
                                        title: "Issue Attributes",
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
                                        title: "Custom Attributes",
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
                                    title={editMode ? "Update" : "Create"}
                                    inProgressTitle={editMode ? "Updating..." : "Creating..."}
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
