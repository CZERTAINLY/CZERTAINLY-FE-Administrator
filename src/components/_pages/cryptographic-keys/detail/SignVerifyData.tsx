import AttributeEditor from 'components/Attributes/AttributeEditor';
import Spinner from 'components/Spinner';

import { actions, selectors } from 'ducks/cryptographic-operations';
import { useCallback, useEffect, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { Form as BootstrapForm, Button, ButtonGroup, FormGroup, Label } from 'reactstrap';
import { AttributeDescriptorModel, AttributeRequestModel } from 'types/attributes';
import { KeyAlgorithm } from 'types/openapi';

import { mutators } from 'utils/attributes/attributeEditorMutators';
import { collectFormAttributes } from 'utils/attributes/attributes';
import FileUpload from '../../../Input/FileUpload/FileUpload';
import TabLayout from '../../../Layout/TabLayout';

interface Props {
    tokenUuid?: string;
    tokenProfileUuid?: string;
    keyUuid?: string;
    keyItemUuid?: string;
    algorithm?: KeyAlgorithm;
    visible: boolean;
    action: 'sign' | 'verify';
    onClose: () => void;
}

export default function SignVerifyData({ tokenUuid, tokenProfileUuid, keyUuid, keyItemUuid, algorithm, visible, action, onClose }: Props) {
    const dispatch = useDispatch();

    const isFetchingAttributes = useSelector(selectors.isFetchingSignatureAttributes);

    const attributes = useSelector(selectors.signatureAttributeDescriptors);

    const [groupAttributesCallbackAttributes, setGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);

    const [fileContent, setFileContent] = useState<string>('');
    const [signatureContent, setSignatureContent] = useState<string>('');

    useEffect(
        () => {
            if (!visible) return;
            if (!tokenUuid) return;
            if (!tokenProfileUuid) return;
            if (!keyUuid) return;
            if (!keyItemUuid) return;
            if (!algorithm) return;
            dispatch(
                actions.listSignatureAttributeDescriptors({
                    tokenInstanceUuid: tokenUuid,
                    tokenProfileUuid: tokenProfileUuid,
                    uuid: keyUuid,
                    keyItemUuid: keyItemUuid,
                    algorithm: algorithm,
                }),
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [visible, tokenUuid, dispatch],
    );

    const onSubmit = useCallback(
        (values: any) => {
            if (!tokenUuid) return;

            const attribs: AttributeRequestModel[] =
                attributes && attributes.length > 0
                    ? collectFormAttributes('attributes', [...(attributes ?? []), ...groupAttributesCallbackAttributes], values) || []
                    : [];
            if (action === 'sign') {
                dispatch(
                    actions.signData({
                        tokenInstanceUuid: tokenUuid,
                        keyItemUuid: keyItemUuid || '',
                        uuid: keyUuid || '',
                        tokenProfileUuid: tokenProfileUuid || '',
                        request: {
                            signatureAttributes: attribs,
                            data: [{ data: fileContent }],
                        },
                    }),
                );
            } else {
                dispatch(
                    actions.verifyData({
                        tokenInstanceUuid: tokenUuid,
                        keyItemUuid: keyItemUuid || '',
                        uuid: keyUuid || '',
                        tokenProfileUuid: tokenProfileUuid || '',
                        request: {
                            signatureAttributes: attribs,
                            signatures: [{ data: signatureContent }],
                            data: [{ data: fileContent }],
                        },
                    }),
                );
            }

            onClose();
        },
        [
            dispatch,
            attributes,
            onClose,
            tokenUuid,
            groupAttributesCallbackAttributes,
            action,
            keyUuid,
            keyItemUuid,
            tokenProfileUuid,
            fileContent,
            signatureContent,
        ],
    );

    if (!tokenUuid) return <></>;

    return (
        <>
            <Form onSubmit={onSubmit} mutators={{ ...mutators() }}>
                {({ handleSubmit, pristine, submitting, valid }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                        <Field name="data">
                            {({ input, meta }) => (
                                <FormGroup>
                                    <Label for="data">Data</Label>
                                    <FileUpload
                                        id="data"
                                        editable
                                        fileType={'data'}
                                        onFileContentLoaded={(fileContent) => setFileContent(fileContent)}
                                    />
                                </FormGroup>
                            )}
                        </Field>

                        {action === 'verify' ? (
                            <Field name="signature">
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label for="signatureFileName">Signature</Label>
                                        <FileUpload
                                            editable
                                            id="signature"
                                            fileType={'signature'}
                                            onFileContentLoaded={(fileContent) => setSignatureContent(fileContent)}
                                        />
                                    </FormGroup>
                                )}
                            </Field>
                        ) : (
                            <></>
                        )}

                        {!attributes || attributes.length === 0 ? (
                            <></>
                        ) : (
                            <Field name="Attributes">
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <br />

                                        <TabLayout
                                            tabs={[
                                                {
                                                    title: 'Connector Attributes',
                                                    content: (
                                                        <AttributeEditor
                                                            id="attributes"
                                                            attributeDescriptors={attributes}
                                                            groupAttributesCallbackAttributes={groupAttributesCallbackAttributes}
                                                            setGroupAttributesCallbackAttributes={setGroupAttributesCallbackAttributes}
                                                        />
                                                    ),
                                                },
                                            ]}
                                        />
                                    </FormGroup>
                                )}
                            </Field>
                        )}

                        <div style={{ textAlign: 'right' }}>
                            <ButtonGroup>
                                <Button
                                    type="submit"
                                    color="primary"
                                    disabled={(action === 'verify' ? !signatureContent : false) || !fileContent || submitting || !valid}
                                    onClick={handleSubmit}
                                >
                                    {action === 'sign' ? 'Sign' : 'Verify'}
                                </Button>

                                <Button type="button" color="secondary" onClick={onClose}>
                                    Cancel
                                </Button>
                            </ButtonGroup>
                        </div>
                    </BootstrapForm>
                )}
            </Form>

            <Spinner active={isFetchingAttributes} />
        </>
    );
}
