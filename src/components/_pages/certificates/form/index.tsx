import AttributeEditor from 'components/Attributes/AttributeEditor';

import ProgressButton from 'components/ProgressButton';
import Widget from 'components/Widget';

import { actions as certificateActions, selectors as certificateSelectors } from 'ducks/certificates';
import { actions as connectorActions } from 'ducks/connectors';
import { actions as keyActions } from 'ducks/cryptographic-keys';
import { selectors as cryptographyOperationSelectors } from 'ducks/cryptographic-operations';
import { actions as raProfileActions, selectors as raProfileSelectors } from 'ducks/ra-profiles';
import { actions as tokenProfileActions, selectors as tokenProfileSelectors } from 'ducks/token-profiles';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Field, Form } from 'react-final-form';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Select, { SingleValue } from 'react-select';
import { Form as BootstrapForm, Button, ButtonGroup, FormFeedback, FormGroup, Label } from 'reactstrap';
import { AttributeDescriptorModel } from 'types/attributes';
import { CryptographicKeyPairResponseModel } from 'types/cryptographic-keys';
import { RaProfileResponseModel } from 'types/ra-profiles';
import { TokenProfileResponseModel } from 'types/token-profiles';
import { mutators } from 'utils/attributes/attributeEditorMutators';
import { collectFormAttributes } from 'utils/attributes/attributes';

import CustomSelectComponent from 'components/CustomSelectComponent';
import TokenProfileForm from 'components/_pages/token-profiles/form';
import { actions as utilsActuatorActions, selectors as utilsActuatorSelectors } from 'ducks/utilsActuator';
import { ParseRequestRequestDtoParseTypeEnum } from 'types/openapi/utils';
import { validateRequired } from 'utils/validators';
import { actions as customAttributesActions, selectors as customAttributesSelectors } from '../../../../ducks/customAttributes';
import { transformParseRequestResponseDtoToCertificateResponseDetailModel } from '../../../../ducks/transform/utilsCertificateRequest';
import { actions as userInterfaceActions } from '../../../../ducks/user-interface';
import {
    actions as utilsCertificateRequestActions,
    selectors as utilsCertificateRequestSelectors,
} from '../../../../ducks/utilsCertificateRequest';
import { CertificateDetailResponseModel } from '../../../../types/certificate';
import { CertificateRequestFormat, Resource } from '../../../../types/openapi';
import CertificateAttributes from '../../../CertificateAttributes';
import FileUpload from '../../../Input/FileUpload/FileUpload';
import TabLayout from '../../../Layout/TabLayout';
import RenderRequestKey from './RenderRequestKey';

export interface FormValues {
    raProfile: SingleValue<{ label: string; value: RaProfileResponseModel }> | null;
    format?: CertificateRequestFormat;
    uploadCsr?: SingleValue<{ label: string; value: boolean }> | null;
    tokenProfile?: SingleValue<{ label: string; value: TokenProfileResponseModel }> | null;
    key?: SingleValue<{ label: string; value: CryptographicKeyPairResponseModel }> | null;
}

export default function CertificateForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const raProfiles = useSelector(raProfileSelectors.raProfiles);
    const issuanceAttributeDescriptors = useSelector(certificateSelectors.issuanceAttributes);
    const resourceCustomAttributes = useSelector(customAttributesSelectors.resourceCustomAttributes);
    const isFetchingResourceCustomAttributes = useSelector(customAttributesSelectors.isFetchingResourceCustomAttributes);
    const csrAttributeDescriptors = useSelector(certificateSelectors.csrAttributeDescriptors);
    const signatureAttributeDescriptors = useSelector(cryptographyOperationSelectors.signatureAttributeDescriptors);

    const tokenProfiles = useSelector(tokenProfileSelectors.tokenProfiles);

    const issuingCertificate = useSelector(certificateSelectors.isIssuing);

    const parsedCertificateRequest = useSelector(utilsCertificateRequestSelectors.parsedCertificateRequest);

    const [groupAttributesCallbackAttributes, setGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);
    const [csrAttributesCallbackAttributes, setCsrAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);
    const [signatureAttributesCallbackAttributes, setSignatureAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);
    const [fileContent, setFileContent] = useState<string>('');

    const [certificate, setCertificate] = useState<CertificateDetailResponseModel | undefined>();
    const health = useSelector(utilsActuatorSelectors.health);

    useEffect(() => {
        dispatch(customAttributesActions.listResourceCustomAttributes(Resource.Certificates));
        dispatch(certificateActions.getCsrAttributes());
        dispatch(raProfileActions.listRaProfiles());
        dispatch(tokenProfileActions.listTokenProfiles({ enabled: true }));
        dispatch(connectorActions.clearCallbackData());
        dispatch(utilsCertificateRequestActions.reset());
        dispatch(utilsActuatorActions.health());
    }, [dispatch]);

    useEffect(() => {
        setCertificate(
            parsedCertificateRequest
                ? transformParseRequestResponseDtoToCertificateResponseDetailModel(parsedCertificateRequest)
                : undefined,
        );
    }, [parsedCertificateRequest]);

    const submitCallback = useCallback(
        (values: FormValues) => {
            if (!values.raProfile) return;

            const attributes = collectFormAttributes(
                'issuance_attributes',
                [...(issuanceAttributeDescriptors[values.raProfile.value.uuid] ?? []), ...groupAttributesCallbackAttributes],
                values,
            );

            dispatch(
                certificateActions.issueCertificate({
                    raProfileUuid: values.raProfile.value.uuid,
                    authorityUuid: values.raProfile.value.authorityInstanceUuid,
                    signRequest: {
                        format: CertificateRequestFormat.Pkcs10,
                        request: fileContent,
                        attributes,
                        csrAttributes: collectFormAttributes('csrAttributes', csrAttributeDescriptors, values),
                        signatureAttributes: collectFormAttributes('signatureAttributes', signatureAttributeDescriptors, values),
                        keyUuid: values.key?.value.uuid,
                        tokenProfileUuid: values.tokenProfile?.value.uuid,
                        customAttributes: collectFormAttributes('customCertificate', resourceCustomAttributes, values),
                    },
                }),
            );
        },
        [
            dispatch,
            issuanceAttributeDescriptors,
            groupAttributesCallbackAttributes,
            resourceCustomAttributes,
            csrAttributeDescriptors,
            signatureAttributeDescriptors,
            fileContent,
        ],
    );

    const onRaProfileChange = useCallback(
        (event: SingleValue<{ label: string; value: RaProfileResponseModel }>) => {
            if (!event) return;
            dispatch(connectorActions.clearCallbackData());
            setGroupAttributesCallbackAttributes([]);
            dispatch(
                certificateActions.getIssuanceAttributes({
                    raProfileUuid: event.value.uuid,
                    authorityUuid: event.value.authorityInstanceUuid,
                }),
            );

            /*setRaProfUuid(event?.value || "");
         dispatch(actions.requestIssuanceAttributes(event?.value || ""));
         */
        },
        [dispatch],
    );

    const onTokenProfileChange = useCallback(
        (event: SingleValue<{ label: string; value: TokenProfileResponseModel }>) => {
            if (!event) return;
            dispatch(keyActions.listCryptographicKeyPairs({ tokenProfileUuid: event.value.uuid }));
        },
        [dispatch],
    );

    const onCancel = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const options = useMemo(
        () =>
            raProfiles.map((raProfile) => ({
                label: raProfile.name,
                value: raProfile,
            })),
        [raProfiles],
    );

    const tokenProfileOptions = useMemo(
        () =>
            tokenProfiles.map((tokenProfile) => ({
                label: tokenProfile.name,
                value: tokenProfile,
            })),
        [tokenProfiles],
    );

    const defaultValues: FormValues = useMemo(
        () => ({
            raProfile: null,
            fileName: '',
            contentType: '',
            file: '',
        }),
        [],
    );

    const inputOptions = useMemo(
        () => [
            { label: 'External', value: true },
            { label: 'Existing Key', value: false },
        ],
        [],
    );

    return (
        <>
            <Form initialValues={defaultValues} onSubmit={submitCallback} mutators={{ ...mutators<FormValues>() }}>
                {({ handleSubmit, valid, submitting, values, form }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        <Widget title="Add new Certificate" busy={issuingCertificate || isFetchingResourceCustomAttributes}>
                            <Field name="raProfile" validate={validateRequired()}>
                                {({ input, meta, onChange }) => (
                                    <FormGroup>
                                        <Label for="raProfileSelect">RA Profile</Label>

                                        <Select
                                            {...input}
                                            id="raProfile"
                                            inputId="raProfileSelect"
                                            maxMenuHeight={140}
                                            menuPlacement="auto"
                                            options={options}
                                            placeholder="Select RA Profile"
                                            onChange={(e) => {
                                                onRaProfileChange(e);
                                                input.onChange(e);
                                            }}
                                        />

                                        <FormFeedback>{meta.error}</FormFeedback>
                                    </FormGroup>
                                )}
                            </Field>

                            <Field name="uploadCsr">
                                {({ input, meta, onChange }) => (
                                    <FormGroup>
                                        <Label for="uploadCsrSelect">Key Source</Label>
                                        <Select
                                            {...input}
                                            id="uploadCsr"
                                            inputId="uploadCsrSelect"
                                            maxMenuHeight={140}
                                            menuPlacement="auto"
                                            options={inputOptions}
                                            placeholder="Select Key Source"
                                            onChange={(e) => {
                                                input.onChange(e);
                                            }}
                                        />

                                        <FormFeedback>{meta.error}</FormFeedback>
                                    </FormGroup>
                                )}
                            </Field>
                        </Widget>

                        <Widget title="Request Properties" busy={issuingCertificate || isFetchingResourceCustomAttributes}>
                            {values.uploadCsr?.value && values.raProfile ? (
                                <>
                                    <FileUpload
                                        editable
                                        fileType={'CSR'}
                                        onFileContentLoaded={(fileContent) => {
                                            setFileContent(fileContent);
                                            if (health) {
                                                dispatch(
                                                    utilsCertificateRequestActions.parseCertificateRequest({
                                                        content: fileContent,
                                                        requestParseType: ParseRequestRequestDtoParseTypeEnum.Basic,
                                                    }),
                                                );
                                            }
                                        }}
                                    />

                                    {certificate && (
                                        <>
                                            <br />
                                            <CertificateAttributes csr={true} certificate={certificate} />
                                        </>
                                    )}
                                </>
                            ) : (
                                <></>
                            )}

                            {values.uploadCsr && !values.uploadCsr?.value && values.raProfile ? (
                                <>
                                    <Field name="tokenProfile" validate={validateRequired()}>
                                        {({ input, meta, onChange }) => (
                                            <FormGroup>
                                                <Label for="tokenProfileSelect">Token Profile</Label>

                                                <Select
                                                    {...input}
                                                    id="tokenProfile"
                                                    inputId="tokenProfileSelect"
                                                    maxMenuHeight={140}
                                                    menuPlacement="auto"
                                                    options={tokenProfileOptions}
                                                    placeholder="Select Token Profile"
                                                    onChange={(e) => {
                                                        onTokenProfileChange(e);
                                                        input.onChange(e);
                                                    }}
                                                    components={{
                                                        Menu: (props) => (
                                                            <CustomSelectComponent
                                                                onAddNew={() => {
                                                                    dispatch(
                                                                        userInterfaceActions.showGlobalModal({
                                                                            content: <TokenProfileForm usesGlobalModal />,
                                                                            isOpen: true,
                                                                            size: 'lg',
                                                                            title: 'Add New Token Profile',
                                                                        }),
                                                                    );
                                                                }}
                                                                {...props}
                                                            />
                                                        ),
                                                    }}
                                                />

                                                <FormFeedback>{meta.error}</FormFeedback>
                                            </FormGroup>
                                        )}
                                    </Field>

                                    <RenderRequestKey values={values} />

                                    {values.tokenProfile && values.key ? (
                                        <TabLayout
                                            tabs={[
                                                {
                                                    title: 'Request Attributes',
                                                    content: (
                                                        <AttributeEditor
                                                            id="csrAttributes"
                                                            attributeDescriptors={csrAttributeDescriptors || []}
                                                            groupAttributesCallbackAttributes={csrAttributesCallbackAttributes}
                                                            setGroupAttributesCallbackAttributes={setCsrAttributesCallbackAttributes}
                                                        />
                                                    ),
                                                },
                                                {
                                                    title: 'Signature Attributes',
                                                    content: (
                                                        <AttributeEditor
                                                            id="signatureAttributes"
                                                            attributeDescriptors={signatureAttributeDescriptors || []}
                                                            groupAttributesCallbackAttributes={signatureAttributesCallbackAttributes}
                                                            setGroupAttributesCallbackAttributes={setSignatureAttributesCallbackAttributes}
                                                        />
                                                    ),
                                                },
                                            ]}
                                        />
                                    ) : (
                                        <></>
                                    )}
                                </>
                            ) : (
                                <></>
                            )}
                        </Widget>

                        <Widget title="Other Properties" busy={issuingCertificate || isFetchingResourceCustomAttributes}>
                            <br />
                            <TabLayout
                                tabs={[
                                    {
                                        title: 'Connector Attributes',
                                        content: (
                                            <AttributeEditor
                                                id="issuance_attributes"
                                                attributeDescriptors={
                                                    issuanceAttributeDescriptors[values.raProfile?.value.uuid || 'unknown'] || []
                                                }
                                                callbackParentUuid={values.raProfile?.value.authorityInstanceUuid}
                                                callbackResource={Resource.RaProfiles}
                                                groupAttributesCallbackAttributes={groupAttributesCallbackAttributes}
                                                setGroupAttributesCallbackAttributes={setGroupAttributesCallbackAttributes}
                                            />
                                        ),
                                    },
                                    {
                                        title: 'Custom Attributes',
                                        content: (
                                            <AttributeEditor
                                                id="customCertificate"
                                                attributeDescriptors={resourceCustomAttributes}
                                                attributes={values.raProfile?.value.customAttributes}
                                            />
                                        ),
                                    },
                                ]}
                            />

                            <br />

                            <div className="d-flex justify-content-end">
                                <ButtonGroup>
                                    <ProgressButton
                                        title="Create"
                                        inProgressTitle="Creating"
                                        inProgress={submitting || issuingCertificate}
                                        disabled={!valid}
                                    />

                                    <Button color="default" onClick={onCancel} disabled={submitting}>
                                        Cancel
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </Widget>
                    </BootstrapForm>
                )}
            </Form>
        </>
    );
}
