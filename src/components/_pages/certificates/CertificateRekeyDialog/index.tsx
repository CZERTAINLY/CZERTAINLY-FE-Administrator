import AttributeEditor from 'components/Attributes/AttributeEditor';

import ProgressButton from 'components/ProgressButton';
import Widget from 'components/Widget';

import { actions as certificateActions, selectors as certificateSelectors } from 'ducks/certificates';
import { actions as connectorActions } from 'ducks/connectors';
import { actions as keyActions, selectors as keySelectors } from 'ducks/cryptographic-keys';
import { actions as cryptographyOperationActions, selectors as cryptographyOperationSelectors } from 'ducks/cryptographic-operations';
import { actions as tokenProfileActions, selectors as tokenProfileSelectors } from 'ducks/token-profiles';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Field, Form } from 'react-final-form';

import { useDispatch, useSelector } from 'react-redux';

import Select, { SingleValue } from 'react-select';
import { Form as BootstrapForm, Button, ButtonGroup, FormFeedback, FormGroup, Label } from 'reactstrap';
import { AttributeDescriptorModel } from 'types/attributes';
import { CertificateDetailResponseModel } from 'types/certificate';
import { CryptographicKeyPairResponseModel } from 'types/cryptographic-keys';
import { CertificateRequestFormat, KeyType } from 'types/openapi';
import { mutators } from 'utils/attributes/attributeEditorMutators';
import { collectFormAttributes } from 'utils/attributes/attributes';

import { actions as utilsActuatorActions, selectors as utilsActuatorSelectors } from 'ducks/utilsActuator';
import { ParseRequestRequestDtoParseTypeEnum } from 'types/openapi/utils';
import { validateRequired } from 'utils/validators';
import { transformParseRequestResponseDtoToCertificateResponseDetailModel } from '../../../../ducks/transform/utilsCertificateRequest';
import {
    actions as utilsCertificateRequestActions,
    selectors as utilsCertificateRequestSelectors,
} from '../../../../ducks/utilsCertificateRequest';
import CertificateAttributes from '../../../CertificateAttributes';
import FileUpload from '../../../Input/FileUpload/FileUpload';

interface FormValues {
    pkcs10: File | null;
    uploadCsr?: SingleValue<{ label: string; value: boolean }> | null;
    tokenProfile?: SingleValue<{ label: string; value: string }> | null;
    key?: SingleValue<{ label: string; value: CryptographicKeyPairResponseModel }> | null;
}

interface props {
    onCancel: () => void;
    certificate?: CertificateDetailResponseModel;
}

export default function CertificateRekeyDialog({ onCancel, certificate }: props) {
    const dispatch = useDispatch();

    const isFetchingCsrAttributes = useSelector(certificateSelectors.isFetchingIssuanceAttributes);
    const isFetchingSignatureAttributes = useSelector(cryptographyOperationSelectors.isFetchingSignatureAttributes);
    const signatureAttributeDescriptors = useSelector(cryptographyOperationSelectors.signatureAttributeDescriptors);

    const tokenProfiles = useSelector(tokenProfileSelectors.tokenProfiles);

    const keys = useSelector(keySelectors.cryptographicKeyPairs);

    const rekeying = useSelector(certificateSelectors.isRekeying);

    const parsedCertificateRequest = useSelector(utilsCertificateRequestSelectors.parsedCertificateRequest);

    const [signatureAttributesCallbackAttributes, setSignatureAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);
    const [fileContent, setFileContent] = useState<string>('');
    const [certificateRequest, setCertificateRequest] = useState<CertificateDetailResponseModel | undefined>();

    const health = useSelector(utilsActuatorSelectors.health);

    useEffect(() => {
        dispatch(utilsCertificateRequestActions.reset());
        dispatch(utilsActuatorActions.health());
    }, [dispatch]);

    useEffect(() => {
        setCertificateRequest(
            parsedCertificateRequest
                ? transformParseRequestResponseDtoToCertificateResponseDetailModel(parsedCertificateRequest)
                : undefined,
        );
    }, [parsedCertificateRequest]);

    useEffect(() => {
        dispatch(certificateActions.getCsrAttributes());
        dispatch(tokenProfileActions.listTokenProfiles({ enabled: true }));
        if (certificate?.key?.tokenProfileUuid) {
            dispatch(keyActions.listCryptographicKeyPairs({ tokenProfileUuid: certificate.key.tokenProfileUuid }));
        }
        dispatch(connectorActions.clearCallbackData());
    }, [dispatch, certificate?.key?.tokenProfileUuid, certificate?.key]);

    const submitCallback = useCallback(
        (values: FormValues) => {
            if (!certificate) return;
            if (!certificate.raProfile) return;
            if (!values.uploadCsr?.value && !values.tokenProfile) return;
            if (!values.uploadCsr?.value && !values.key) return;
            if (!certificate.raProfile.authorityInstanceUuid) return;
            if (!values.uploadCsr?.value && values.key?.value.uuid === certificate.key?.uuid) return;

            dispatch(
                certificateActions.rekeyCertificate({
                    uuid: certificate.uuid,
                    raProfileUuid: certificate.raProfile.uuid,
                    authorityUuid: certificate.raProfile.authorityInstanceUuid,
                    rekey: {
                        request: fileContent ? fileContent : undefined,
                        format: CertificateRequestFormat.Pkcs10,
                        signatureAttributes: collectFormAttributes('signatureAttributes', signatureAttributeDescriptors, values),
                        keyUuid: values.key?.value.uuid || '',
                        tokenProfileUuid: values.tokenProfile?.value || '',
                    },
                }),
            );
            onCancel();
        },
        [dispatch, certificate, signatureAttributeDescriptors, onCancel, fileContent],
    );

    const onTokenProfileChange = useCallback(
        (event: SingleValue<{ label: string; value: string }>) => {
            if (!event) return;
            dispatch(keyActions.listCryptographicKeyPairs({ tokenProfileUuid: event.value }));
        },
        [dispatch],
    );

    const onKeyChange = useCallback(
        (event: SingleValue<{ label: string; value: CryptographicKeyPairResponseModel }>) => {
            if (!event) return;
            if (!event.value.tokenProfileUuid) return;
            if (!event.value.tokenInstanceUuid) return;
            if (event.value.items.filter((e) => e.type === KeyType.Private).length === 0) return;
            dispatch(cryptographyOperationActions.clearSignatureAttributeDescriptors());
            dispatch(
                cryptographyOperationActions.listSignatureAttributeDescriptors({
                    uuid: event.value.uuid,
                    tokenProfileUuid: event.value.tokenProfileUuid,
                    tokenInstanceUuid: event.value.tokenInstanceUuid,
                    keyItemUuid: event.value.items.filter((e) => e.type === KeyType.Private)[0].uuid,
                    algorithm: event.value.items.filter((e) => e.type === KeyType.Private)[0].keyAlgorithm,
                }),
            );
        },
        [dispatch],
    );

    const tokenProfileOptions = useMemo(
        () =>
            tokenProfiles.map((tokenProfile) => ({
                label: tokenProfile.name,
                value: tokenProfile.uuid,
            })),
        [tokenProfiles],
    );

    const keyOptions = useMemo(
        () =>
            keys.map((key) => ({
                label: key.name,
                value: key,
            })),
        [keys],
    );

    const defaultValues: FormValues = useMemo(
        () => ({
            pkcs10: null,
            key: certificate?.key
                ? {
                      label: certificate.key.name,
                      value: certificate.key,
                  }
                : null,
            tokenProfile: certificate?.key?.tokenProfileUuid
                ? {
                      label: certificate.key.tokenProfileName || '',
                      value: certificate.key.tokenProfileUuid || '',
                  }
                : null,
        }),
        [certificate?.key],
    );

    const inputOptions = useMemo(
        () => [
            { label: 'External', value: true },
            { label: 'Existing Key', value: false },
        ],
        [],
    );

    return (
        <Form initialValues={defaultValues} onSubmit={submitCallback} mutators={{ ...mutators<FormValues>() }}>
            {({ handleSubmit, valid, submitting, values, form }) => (
                <BootstrapForm onSubmit={handleSubmit}>
                    <Widget title="Rekey Certificate" busy={rekeying || isFetchingCsrAttributes || isFetchingSignatureAttributes}>
                        <Field name="uploadCsr">
                            {({ input, meta, onChange }) => (
                                <FormGroup>
                                    <Label for="uploadCsr">Key Source</Label>
                                    <Select
                                        {...input}
                                        id="uploadCsr"
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

                    <Widget title="Request Properties">
                        {values.uploadCsr?.value && certificate?.raProfile ? (
                            <>
                                <FileUpload
                                    fileType={'CSR'}
                                    editable
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

                                {certificateRequest && (
                                    <>
                                        <br />
                                        <CertificateAttributes csr={true} certificate={certificateRequest} />
                                    </>
                                )}
                            </>
                        ) : (
                            <></>
                        )}

                        <br />

                        {values.uploadCsr && !values.uploadCsr?.value ? (
                            <>
                                <Field name="tokenProfile" validate={validateRequired()}>
                                    {({ input, meta, onChange }) => (
                                        <FormGroup>
                                            <Label for="tokenProfile">Token Profile</Label>

                                            <Select
                                                {...input}
                                                id="tokenProfile"
                                                maxMenuHeight={140}
                                                menuPlacement="auto"
                                                options={tokenProfileOptions}
                                                placeholder="Select Token Profile"
                                                onChange={(e) => {
                                                    onTokenProfileChange(e);
                                                    input.onChange(e);
                                                }}
                                            />

                                            <FormFeedback>{meta.error}</FormFeedback>
                                        </FormGroup>
                                    )}
                                </Field>

                                <Field name="key" validate={validateRequired()}>
                                    {({ input, meta, onChange }) => (
                                        <FormGroup>
                                            <Label for="keySelect">Select Key</Label>

                                            <Select
                                                {...input}
                                                id="key"
                                                inputId="keySelect"
                                                maxMenuHeight={140}
                                                menuPlacement="auto"
                                                options={keyOptions}
                                                placeholder="Select Key"
                                                onChange={(e) => {
                                                    onKeyChange(e);
                                                    input.onChange(e);
                                                }}
                                            />

                                            <FormFeedback>{meta.error}</FormFeedback>
                                        </FormGroup>
                                    )}
                                </Field>

                                {values.tokenProfile &&
                                values.key &&
                                !(!values.uploadCsr?.value && values.key?.value.uuid === certificate?.key?.uuid) ? (
                                    <AttributeEditor
                                        id="signatureAttributes"
                                        attributeDescriptors={signatureAttributeDescriptors || []}
                                        groupAttributesCallbackAttributes={signatureAttributesCallbackAttributes}
                                        setGroupAttributesCallbackAttributes={setSignatureAttributesCallbackAttributes}
                                    />
                                ) : (
                                    <></>
                                )}
                            </>
                        ) : (
                            <></>
                        )}

                        <div className="d-flex justify-content-end">
                            <ButtonGroup>
                                <ProgressButton
                                    title="Rekey"
                                    inProgressTitle="Rekeying..."
                                    inProgress={submitting || rekeying}
                                    disabled={!valid || (!values.uploadCsr?.value && values.key?.value.uuid === certificate?.key?.uuid)}
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
    );
}
