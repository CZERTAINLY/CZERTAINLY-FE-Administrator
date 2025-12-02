import AttributeEditor from 'components/Attributes/AttributeEditor';

import ProgressButton from 'components/ProgressButton';
import Widget from 'components/Widget';

import { actions as certificateActions, selectors as certificateSelectors } from 'ducks/certificates';
import { actions as connectorActions } from 'ducks/connectors';
import { selectors as cryptographyOperationSelectors } from 'ducks/cryptographic-operations';
import { actions as raProfileActions, selectors as raProfileSelectors } from 'ducks/ra-profiles';
import { actions as tokenProfileActions } from 'ducks/token-profiles';
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import Button from 'components/Button';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';

import { AttributeDescriptorModel } from 'types/attributes';
import { CertificateDetailResponseModel } from '../../../../types/certificate';
import { CertificateRequestFormat, Resource } from '../../../../types/openapi';
import { collectFormAttributes } from 'utils/attributes/attributes';

import { actions as utilsActuatorActions, selectors as utilsActuatorSelectors } from 'ducks/utilsActuator';
import { ParseRequestRequestDtoParseTypeEnum } from 'types/openapi/utils';
import { actions as customAttributesActions, selectors as customAttributesSelectors } from '../../../../ducks/customAttributes';
import { transformParseRequestResponseDtoToCertificateResponseDetailModel } from '../../../../ducks/transform/utilsCertificateRequest';
import {
    actions as utilsCertificateRequestActions,
    selectors as utilsCertificateRequestSelectors,
} from '../../../../ducks/utilsCertificateRequest';

import CertificateAttributes from '../../../CertificateAttributes';
import FileUpload from '../../../Input/FileUpload/FileUpload';
import TabLayout from '../../../Layout/TabLayout';
import RenderRequestKey from './RenderRequestKey';
import RenderTokenProfile from 'components/_pages/certificates/form/RenderTokenProfile';
import Select from 'components/Select';
import Switch from 'components/Switch';
import Container from 'components/Container';
import Label from 'components/Label';

type CertificateFormValues = {
    raProfileUuid: string;
    uploadCsrSource?: 'external' | 'existing';
    includeAltKey: boolean;
    tokenProfileUuid?: string;
    altTokenProfileUuid?: string;
    keyUuid?: string;
    altKeyUuid?: string;
};

const useDescriptorState = () => useState<AttributeDescriptorModel[]>(() => []);

interface CertificateFormProps {
    onCancel?: () => void;
}

export default function CertificateForm({ onCancel }: CertificateFormProps = {}) {
    const dispatch = useDispatch();

    const raProfiles = useSelector(raProfileSelectors.raProfiles);
    const issuanceAttributeDescriptors = useSelector(certificateSelectors.issuanceAttributes);
    const resourceCustomAttributes = useSelector(customAttributesSelectors.resourceCustomAttributes);
    const isFetchingResourceCustomAttributes = useSelector(customAttributesSelectors.isFetchingResourceCustomAttributes);
    const csrAttributeDescriptors = useSelector(certificateSelectors.csrAttributeDescriptors);
    const signatureAttributeDescriptors = useSelector(cryptographyOperationSelectors.signatureAttributeDescriptors);
    const altSignatureAttributeDescriptors = useSelector(cryptographyOperationSelectors.altSignatureAttributeDescriptors);

    const issuingCertificate = useSelector(certificateSelectors.isIssuing);
    const parsedCertificateRequest = useSelector(utilsCertificateRequestSelectors.parsedCertificateRequest);
    const health = useSelector(utilsActuatorSelectors.health);

    const [groupAttributesCallbackAttributes, setGroupAttributesCallbackAttributes] = useDescriptorState();
    const [csrAttributesCallbackAttributes, setCsrAttributesCallbackAttributes] = useDescriptorState();
    const [signatureAttributesCallbackAttributes, setSignatureAttributesCallbackAttributes] = useDescriptorState();
    const [altSignatureAttributesCallbackAttributes, setAltSignatureAttributesCallbackAttributes] = useDescriptorState();
    const [fileContent, setFileContent] = useState<string>('');
    const [certificate, setCertificate] = useState<CertificateDetailResponseModel | undefined>();

    const [attributeValuesMap, setAttributeValuesMap] = useState<Record<string, Record<string, any>>>({});
    const attributeValuesRef = useRef<Record<string, any>>({});

    const methods = useForm<CertificateFormValues>({
        defaultValues: {
            raProfileUuid: '',
            includeAltKey: false,
        },
    });

    const { control, handleSubmit, setValue } = methods;

    const combinedAttributeValues = useMemo(
        () =>
            Object.values(attributeValuesMap).reduce<Record<string, any>>((acc, current) => {
                return { ...acc, ...current };
            }, {}),
        [attributeValuesMap],
    );

    useEffect(() => {
        attributeValuesRef.current = combinedAttributeValues;
    }, [combinedAttributeValues]);

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

    const selectedRaProfileUuid = useWatch({ control, name: 'raProfileUuid' });
    const selectedRaProfile = useMemo(
        () => raProfiles.find((profile) => profile.uuid === selectedRaProfileUuid),
        [raProfiles, selectedRaProfileUuid],
    );
    const uploadCsrSource = useWatch({ control, name: 'uploadCsrSource' });
    const includeAltKey = useWatch({ control, name: 'includeAltKey' });
    const tokenProfileUuid = useWatch({ control, name: 'tokenProfileUuid' });
    const altTokenProfileUuid = useWatch({ control, name: 'altTokenProfileUuid' });

    useEffect(() => {
        if (!selectedRaProfileUuid) {
            setValue('tokenProfileUuid', undefined);
            setValue('keyUuid', undefined);
            setValue('includeAltKey', false);
            setValue('altTokenProfileUuid', undefined);
            setValue('altKeyUuid', undefined);
        }
    }, [selectedRaProfileUuid, setValue]);

    useEffect(() => {
        setValue('keyUuid', undefined);
    }, [tokenProfileUuid, setValue]);

    useEffect(() => {
        setValue('altKeyUuid', undefined);
    }, [altTokenProfileUuid, setValue]);

    const onRaProfileChange = useCallback(
        (raProfileUuid: string) => {
            const profile = raProfiles.find((p) => p.uuid === raProfileUuid);
            if (!profile?.authorityInstanceUuid) return;
            dispatch(connectorActions.clearCallbackData());
            setGroupAttributesCallbackAttributes([]);
            dispatch(
                certificateActions.getIssuanceAttributes({
                    raProfileUuid: profile.uuid,
                    authorityUuid: profile.authorityInstanceUuid,
                }),
            );
        },
        [dispatch, raProfiles, setGroupAttributesCallbackAttributes],
    );

    const raProfileOptions = useMemo(
        () =>
            raProfiles
                .filter((profile) => profile.authorityInstanceUuid)
                .map((profile) => ({
                    label: profile.name,
                    value: profile.uuid,
                })),
        [raProfiles],
    );

    const keySourceOptions = useMemo(
        () => [
            { label: 'External', value: 'external' },
            { label: 'Existing Key', value: 'existing' },
        ],
        [],
    );

    const isExternalSource = uploadCsrSource === 'external';
    const isExistingKeySource = uploadCsrSource === 'existing';

    const submitCallback = useCallback(
        (formValues: CertificateFormValues) => {
            const profile = raProfiles.find((p) => p.uuid === formValues.raProfileUuid);
            if (!profile?.authorityInstanceUuid) return;

            const combinedValues = {
                ...formValues,
                ...attributeValuesRef.current,
            };

            const issuanceAttributes = collectFormAttributes(
                'issuance_attributes',
                [...(issuanceAttributeDescriptors[profile.uuid] ?? []), ...groupAttributesCallbackAttributes],
                combinedValues,
            );

            const csrAttrs = collectFormAttributes('csrAttributes', csrAttributeDescriptors, combinedValues);
            const signatureAttrs = collectFormAttributes('signatureAttributes', signatureAttributeDescriptors, combinedValues);
            const customAttrs = collectFormAttributes('customCertificate', resourceCustomAttributes, combinedValues);

            const payload: Parameters<typeof certificateActions.issueCertificate>[0]['signRequest'] = {
                format: CertificateRequestFormat.Pkcs10,
                request: fileContent,
                attributes: issuanceAttributes,
                csrAttributes: csrAttrs,
                signatureAttributes: signatureAttrs,
                keyUuid: formValues.keyUuid,
                tokenProfileUuid: formValues.tokenProfileUuid,
                customAttributes: customAttrs,
            };

            if (formValues.includeAltKey) {
                payload.altKeyUuid = formValues.altKeyUuid;
                payload.altTokenProfileUuid = formValues.altTokenProfileUuid;
                payload.altSignatureAttributes = collectFormAttributes(
                    'altSignatureAttributes',
                    altSignatureAttributeDescriptors,
                    combinedValues,
                );
            }

            dispatch(
                certificateActions.issueCertificate({
                    raProfileUuid: profile.uuid,
                    authorityUuid: profile.authorityInstanceUuid,
                    signRequest: payload,
                }),
            );
        },
        [
            altSignatureAttributeDescriptors,
            csrAttributeDescriptors,
            dispatch,
            fileContent,
            groupAttributesCallbackAttributes,
            issuanceAttributeDescriptors,
            raProfiles,
            resourceCustomAttributes,
            signatureAttributeDescriptors,
        ],
    );

    const handleAttributeValuesChange = useCallback((editorId: string, values: Record<string, any> | null) => {
        setAttributeValuesMap((prev) => {
            const next = { ...prev };
            if (values === null) {
                delete next[editorId];
            } else {
                next[editorId] = values;
            }
            return next;
        });
    }, []);

    const onSubmit = useCallback(
        (values: CertificateFormValues) => {
            submitCallback(values);
        },
        [submitCallback],
    );

    const submitHandler = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleSubmit(onSubmit)(event);
        },
        [handleSubmit, onSubmit],
    );

    return (
        <FormProvider {...methods}>
            <form onSubmit={submitHandler} noValidate>
                <div className="space-y-4">
                    <Widget noBorder busy={issuingCertificate || isFetchingResourceCustomAttributes}>
                        <div className="space-y-4">
                            <Controller
                                control={control}
                                name="raProfileUuid"
                                rules={{ required: true }}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <Select
                                        id="raProfile"
                                        options={raProfileOptions}
                                        placeholder="Select RA Profile"
                                        value={value ?? ''}
                                        label="RA Profile"
                                        onChange={(selected) => {
                                            const uuid = (selected ?? '') as string;
                                            onChange(uuid);
                                            onRaProfileChange(uuid);
                                            setValue('tokenProfileUuid', undefined);
                                            setValue('keyUuid', undefined);
                                            setValue('includeAltKey', false);
                                            setValue('altTokenProfileUuid', undefined);
                                            setValue('altKeyUuid', undefined);
                                        }}
                                        error={error && 'RA Profile is required'}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="uploadCsrSource"
                                rules={{ required: true }}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <Select
                                        id="uploadCsr"
                                        options={keySourceOptions}
                                        placeholder="Select Key Source"
                                        value={value ?? ''}
                                        label="Key Source"
                                        required
                                        onChange={(selected) => {
                                            const source = (selected ?? '') as 'external' | 'existing';
                                            onChange(source);
                                            if (source === 'external') {
                                                setValue('tokenProfileUuid', undefined);
                                                setValue('keyUuid', undefined);
                                                setValue('includeAltKey', false);
                                                setValue('altTokenProfileUuid', undefined);
                                                setValue('altKeyUuid', undefined);
                                            }
                                        }}
                                        error={error && 'Key Source is required'}
                                    />
                                )}
                            />
                        </div>
                    </Widget>

                    <Widget title="Request Properties" busy={issuingCertificate || isFetchingResourceCustomAttributes}>
                        {isExternalSource && selectedRaProfile ? (
                            <>
                                <FileUpload
                                    editable
                                    fileType={'CSR'}
                                    onFileContentLoaded={(uploadedContent) => {
                                        setFileContent(uploadedContent);
                                        if (health) {
                                            dispatch(
                                                utilsCertificateRequestActions.parseCertificateRequest({
                                                    content: uploadedContent,
                                                    requestParseType: ParseRequestRequestDtoParseTypeEnum.Basic,
                                                }),
                                            );
                                        }
                                    }}
                                />

                                {certificate && <CertificateAttributes csr certificate={certificate} />}
                            </>
                        ) : null}

                        {isExistingKeySource && selectedRaProfile ? (
                            <div className="space-y-4">
                                <RenderTokenProfile type="normal" name="tokenProfileUuid" />
                                <RenderRequestKey type="normal" name="keyUuid" tokenProfileField="tokenProfileUuid" />

                                {tokenProfileUuid ? (
                                    <Controller
                                        control={control}
                                        name="includeAltKey"
                                        render={({ field: { value, onChange } }) => (
                                            <Switch
                                                id="includeAltKey"
                                                label="Include Alternative Key"
                                                checked={value ?? false}
                                                onChange={(checked) => {
                                                    onChange(checked);
                                                    if (!checked) {
                                                        setValue('altTokenProfileUuid', undefined);
                                                        setValue('altKeyUuid', undefined);
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                ) : null}

                                {includeAltKey ? (
                                    <>
                                        <RenderTokenProfile type="alt" name="altTokenProfileUuid" />
                                        <RenderRequestKey type="alt" name="altKeyUuid" tokenProfileField="altTokenProfileUuid" />
                                    </>
                                ) : null}

                                {tokenProfileUuid ? (
                                    <TabLayout
                                        tabs={[
                                            {
                                                title: 'Request Attributes',
                                                content: (
                                                    <AttributeEditor
                                                        id="csrAttributes"
                                                        attributeDescriptors={csrAttributeDescriptors ?? []}
                                                        groupAttributesCallbackAttributes={csrAttributesCallbackAttributes}
                                                        setGroupAttributesCallbackAttributes={setCsrAttributesCallbackAttributes}
                                                        onValuesChange={(values) => handleAttributeValuesChange('csrAttributes', values)}
                                                    />
                                                ),
                                            },
                                            {
                                                title: 'Signature Attributes',
                                                content: (
                                                    <AttributeEditor
                                                        id="signatureAttributes"
                                                        attributeDescriptors={signatureAttributeDescriptors ?? []}
                                                        groupAttributesCallbackAttributes={signatureAttributesCallbackAttributes}
                                                        setGroupAttributesCallbackAttributes={setSignatureAttributesCallbackAttributes}
                                                        onValuesChange={(values) =>
                                                            handleAttributeValuesChange('signatureAttributes', values)
                                                        }
                                                    />
                                                ),
                                            },
                                            ...(includeAltKey && altTokenProfileUuid
                                                ? [
                                                      {
                                                          title: 'Alternative Signature Attributes',
                                                          content: (
                                                              <AttributeEditor
                                                                  id="altSignatureAttributes"
                                                                  attributeDescriptors={altSignatureAttributeDescriptors ?? []}
                                                                  groupAttributesCallbackAttributes={
                                                                      altSignatureAttributesCallbackAttributes
                                                                  }
                                                                  setGroupAttributesCallbackAttributes={
                                                                      setAltSignatureAttributesCallbackAttributes
                                                                  }
                                                                  onValuesChange={(values) =>
                                                                      handleAttributeValuesChange('altSignatureAttributes', values)
                                                                  }
                                                              />
                                                          ),
                                                      },
                                                  ]
                                                : []),
                                        ]}
                                    />
                                ) : null}
                            </div>
                        ) : null}
                    </Widget>

                    <Widget noBorder busy={issuingCertificate || isFetchingResourceCustomAttributes}>
                        <TabLayout
                            noBorder
                            tabs={[
                                {
                                    title: 'Connector Attributes',
                                    content: (
                                        <AttributeEditor
                                            id="issuance_attributes"
                                            attributeDescriptors={issuanceAttributeDescriptors[selectedRaProfileUuid || ''] || []}
                                            callbackParentUuid={selectedRaProfile?.authorityInstanceUuid}
                                            callbackResource={Resource.RaProfiles}
                                            groupAttributesCallbackAttributes={groupAttributesCallbackAttributes}
                                            setGroupAttributesCallbackAttributes={setGroupAttributesCallbackAttributes}
                                            onValuesChange={(values) => handleAttributeValuesChange('issuance_attributes', values)}
                                        />
                                    ),
                                },
                                {
                                    title: 'Custom Attributes',
                                    content: (
                                        <AttributeEditor
                                            id="customCertificate"
                                            attributeDescriptors={resourceCustomAttributes}
                                            attributes={selectedRaProfile?.customAttributes}
                                            onValuesChange={(values) => handleAttributeValuesChange('customCertificate', values)}
                                        />
                                    ),
                                },
                            ]}
                        />
                    </Widget>
                    <Container className="flex-row justify-end modal-footer" gap={4}>
                        <div className="flex gap-2">
                            {onCancel && (
                                <Button variant="outline" onClick={onCancel} disabled={issuingCertificate} type="button">
                                    Cancel
                                </Button>
                            )}
                            <ProgressButton title="Create" inProgressTitle="Creating" inProgress={issuingCertificate} />
                        </div>
                    </Container>
                </div>
            </form>
        </FormProvider>
    );
}
