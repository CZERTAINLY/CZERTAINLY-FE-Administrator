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
import TabLayout from 'components/Layout/TabLayout';
import SwitchField from 'components/Input/SwitchField';
import { isObjectSame } from 'utils/common-utils';

interface FormValues {
    pkcs10: File | null;
    uploadCsr?: SingleValue<{ label: string; value: boolean }> | null;
    includeAltKey?: boolean;
    tokenProfile?: SingleValue<{ label: string; value: string }> | null;
    altTokenProfile?: SingleValue<{ label: string; value: string }> | null;
    key?: SingleValue<{ label: string; value: CryptographicKeyPairResponseModel }> | null;
    altKey?: SingleValue<{ label: string; value: CryptographicKeyPairResponseModel }> | null;
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
    const altSignatureAttributeDescriptors = useSelector(cryptographyOperationSelectors.altSignatureAttributeDescriptors);

    const tokenProfiles = useSelector(tokenProfileSelectors.tokenProfiles);

    const keys = useSelector(keySelectors.cryptographicKeyPairs);
    const altKeys = useSelector(keySelectors.altCryptographicKeyPairs);

    const rekeying = useSelector(certificateSelectors.isRekeying);

    const parsedCertificateRequest = useSelector(utilsCertificateRequestSelectors.parsedCertificateRequest);

    const [signatureAttributesCallbackAttributes, setSignatureAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);
    const [altSignatureAttributesCallbackAttributes, setAltSignatureAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>(
        [],
    );
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
            if (
                !values.uploadCsr?.value &&
                values.key?.value.uuid === certificate.key?.uuid &&
                values.altKey?.value.uuid === certificate.altKey?.uuid
            )
                return;

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
                        ...(values.includeAltKey
                            ? {
                                  altKeyUuid: values.altKey?.value.uuid,
                                  altTokenProfileUuid: values.altTokenProfile?.value,
                                  altSignatureAttributes: collectFormAttributes(
                                      'altSignatureAttributes',
                                      altSignatureAttributeDescriptors,
                                      values,
                                  ),
                              }
                            : {}),
                    },
                }),
            );
            onCancel();
        },
        [certificate, dispatch, fileContent, signatureAttributeDescriptors, altSignatureAttributeDescriptors, onCancel],
    );

    const onTokenProfileChange = useCallback(
        (event: SingleValue<{ label: string; value: string }>, type: 'alt' | 'normal') => {
            if (!event) return;
            dispatch(keyActions.listCryptographicKeyPairs({ tokenProfileUuid: event.value, store: type }));
        },
        [dispatch],
    );

    const onKeyChange = useCallback(
        (event: SingleValue<{ label: string; value: CryptographicKeyPairResponseModel }>, type: 'alt' | 'normal') => {
            if (!event) return;
            if (!event.value.tokenProfileUuid) return;
            if (!event.value.tokenInstanceUuid) return;
            if (event.value.items.filter((e) => e.type === KeyType.Private).length === 0) return;
            dispatch(cryptographyOperationActions.clearSignatureAttributeDescriptors(type));
            dispatch(
                cryptographyOperationActions.listSignatureAttributeDescriptors({
                    uuid: event.value.uuid,
                    tokenProfileUuid: event.value.tokenProfileUuid,
                    tokenInstanceUuid: event.value.tokenInstanceUuid,
                    keyItemUuid: event.value.items.filter((e) => e.type === KeyType.Private)[0].uuid,
                    algorithm: event.value.items.filter((e) => e.type === KeyType.Private)[0].keyAlgorithm,
                    store: type,
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

    const altKeyOptions = useMemo(
        () =>
            altKeys.map((key) => ({
                label: key.name,
                value: key,
            })),
        [altKeys],
    );

    const defaultValues: FormValues = useMemo(
        () => ({
            pkcs10: null,
            includeAltKey: !!certificate?.altKey,
            key: certificate?.key
                ? {
                      label: certificate.key.name,
                      value: certificate.key,
                  }
                : null,
            tokenProfile: certificate?.key?.tokenProfileUuid
                ? {
                      label: certificate.key.tokenProfileName ?? '',
                      value: certificate.key.tokenProfileUuid ?? '',
                  }
                : null,
            altKey: certificate?.altKey
                ? {
                      label: certificate.altKey.name,
                      value: certificate.altKey,
                  }
                : null,
            altTokenProfile: certificate?.altKey?.tokenProfileUuid
                ? {
                      label: certificate.altKey.tokenProfileName ?? '',
                      value: certificate.altKey.tokenProfileUuid ?? '',
                  }
                : null,
        }),
        [certificate?.key, certificate?.altKey],
    );

    useEffect(() => {
        if (defaultValues.altTokenProfile) {
            onTokenProfileChange(defaultValues.altTokenProfile, 'alt');
        }
        if (defaultValues.tokenProfile) {
            onTokenProfileChange(defaultValues.tokenProfile, 'normal');
        }
    }, [defaultValues, onTokenProfileChange]);

    const inputOptions = useMemo(
        () => [
            { label: 'External', value: true },
            { label: 'Existing Key', value: false },
        ],
        [],
    );

    const isRekeyAllowed = useCallback(
        (values: FormValues) => {
            const areValuesSame =
                !isObjectSame(values.key as unknown as Record<string, unknown>, defaultValues.key as unknown as Record<string, unknown>) ||
                !isObjectSame(
                    values.altKey as unknown as Record<string, unknown>,
                    defaultValues.altKey as unknown as Record<string, unknown>,
                );

            return areValuesSame;
        },
        [defaultValues],
    );

    const getSignatureAttributesTabs = useCallback(
        (values: FormValues) => {
            return !values.uploadCsr?.value
                ? [
                      ...(values.key?.value.uuid !== certificate?.key?.uuid
                          ? [
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
                            ]
                          : []),
                      ...(values.includeAltKey && values.altKey?.value.uuid !== certificate?.altKey?.uuid
                          ? [
                                {
                                    title: 'Alternative Signature Attributes',
                                    content: (
                                        <AttributeEditor
                                            id="altSignatureAttributes"
                                            attributeDescriptors={altSignatureAttributeDescriptors ?? []}
                                            groupAttributesCallbackAttributes={altSignatureAttributesCallbackAttributes}
                                            setGroupAttributesCallbackAttributes={setAltSignatureAttributesCallbackAttributes}
                                        />
                                    ),
                                },
                            ]
                          : []),
                  ]
                : [];
        },
        [
            certificate?.altKey?.uuid,
            certificate?.key?.uuid,
            signatureAttributeDescriptors,
            signatureAttributesCallbackAttributes,
            altSignatureAttributeDescriptors,
            altSignatureAttributesCallbackAttributes,
        ],
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
                                                    onTokenProfileChange(e, 'normal');
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
                                                    onKeyChange(e, 'normal');
                                                    input.onChange(e);
                                                }}
                                            />

                                            <FormFeedback>{meta.error}</FormFeedback>
                                        </FormGroup>
                                    )}
                                </Field>

                                {values.key && <SwitchField id="includeAltKey" label="Include Alternative Key" disabled />}

                                {values.includeAltKey && (
                                    <>
                                        <Field name="altTokenProfile" validate={validateRequired()}>
                                            {({ input, meta, onChange }) => (
                                                <FormGroup>
                                                    <Label for="altTokenProfileSelect">Alternative Token Profile</Label>

                                                    <Select
                                                        {...input}
                                                        id="altTokenProfile"
                                                        inputId="altTokenProfileSelect"
                                                        maxMenuHeight={140}
                                                        menuPlacement="auto"
                                                        options={tokenProfileOptions}
                                                        placeholder="Select Alternative Token Profile"
                                                        onChange={(e) => {
                                                            onTokenProfileChange(e, 'alt');
                                                            input.onChange(e);
                                                        }}
                                                    />

                                                    <FormFeedback>{meta.error}</FormFeedback>
                                                </FormGroup>
                                            )}
                                        </Field>

                                        <Field name="altKey" validate={validateRequired()}>
                                            {({ input, meta, onChange }) => (
                                                <FormGroup>
                                                    <Label for="altKeySelect">Select Alternative Key</Label>

                                                    <Select
                                                        {...input}
                                                        id="altKey"
                                                        inputId="altKeySelect"
                                                        maxMenuHeight={140}
                                                        menuPlacement="auto"
                                                        options={
                                                            values.tokenProfile?.value === values.altTokenProfile?.value &&
                                                            altKeyOptions.length === 0
                                                                ? keyOptions
                                                                : altKeyOptions
                                                        }
                                                        placeholder="Select Alternative Key"
                                                        onChange={(e) => {
                                                            onKeyChange(e, 'alt');
                                                            input.onChange(e);
                                                        }}
                                                    />

                                                    <FormFeedback>{meta.error}</FormFeedback>
                                                </FormGroup>
                                            )}
                                        </Field>
                                    </>
                                )}

                                {getSignatureAttributesTabs(values).length ? (
                                    <TabLayout tabs={getSignatureAttributesTabs(values)} />
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
                                    disabled={!valid || !isRekeyAllowed(values)}
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
