import CertificateAttributes from 'components/CertificateAttributes';
import { actions as utilsActuatorActions, selectors as utilsActuatorSelectors } from 'ducks/utilsActuator';
import { useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { Form as BootstrapForm, Button, ButtonGroup } from 'reactstrap';
import { CertificateDetailResponseModel } from 'types/certificate';
import { actions as customAttributesActions, selectors as customAttributesSelectors } from '../../../../ducks/customAttributes';
import { transformParseCertificateResponseDtoToCertificateResponseDetailModel } from '../../../../ducks/transform/utilsCertificate';
import { actions as utilsCertificateActions, selectors as utilsCertificateSelectors } from '../../../../ducks/utilsCertificate';
import { AttributeRequestModel } from '../../../../types/attributes';
import { Resource } from '../../../../types/openapi';
import { ParseCertificateRequestDtoParseTypeEnum } from '../../../../types/openapi/utils';
import { mutators } from '../../../../utils/attributes/attributeEditorMutators';
import { collectFormAttributes } from '../../../../utils/attributes/attributes';
import AttributeEditor from '../../../Attributes/AttributeEditor';
import FileUpload from '../../../Input/FileUpload/FileUpload';
import TabLayout from '../../../Layout/TabLayout';
import ProgressButton from '../../../ProgressButton';

interface FormValues {}

interface Props {
    onCancel: () => void;
    onUpload: (data: {
        fileContent: string;
        customAttributes?: Array<AttributeRequestModel>;
        certificate?: CertificateDetailResponseModel;
    }) => void;
    okButtonTitle?: string;
}

export default function CertificateUploadDialog({ onCancel, onUpload, okButtonTitle = 'Upload' }: Props) {
    const dispatch = useDispatch();

    const [certificate, setCertificate] = useState<CertificateDetailResponseModel | undefined>();
    const [fileContent, setFileContent] = useState('');

    const secondaryResourceCustomAttributes = useSelector(customAttributesSelectors.secondaryResourceCustomAttributes);
    const parsedCertificate = useSelector(utilsCertificateSelectors.parsedCertificate);
    const health = useSelector(utilsActuatorSelectors.health);

    useEffect(() => {
        dispatch(customAttributesActions.listSecondaryResourceCustomAttributes(Resource.Certificates));
        dispatch(utilsCertificateActions.reset());
        dispatch(utilsActuatorActions.health());
    }, [dispatch]);

    useEffect(() => {
        setCertificate(
            parsedCertificate ? transformParseCertificateResponseDtoToCertificateResponseDetailModel(parsedCertificate) : undefined,
        );
    }, [parsedCertificate]);

    return (
        <Form
            onSubmit={(values) =>
                onUpload({
                    fileContent: fileContent,
                    customAttributes: collectFormAttributes('customUploadCertificate', secondaryResourceCustomAttributes, values),
                    certificate: certificate,
                })
            }
            mutators={{ ...mutators<FormValues>() }}
        >
            {({ handleSubmit, valid, submitting }) => (
                <BootstrapForm onSubmit={handleSubmit}>
                    <div>
                        <FileUpload
                            editable
                            fileType={'certificate'}
                            onFileContentLoaded={(fileContent) => {
                                setFileContent(fileContent);
                                if (health) {
                                    dispatch(
                                        utilsCertificateActions.parseCertificate({
                                            certificate: fileContent,
                                            parseType: ParseCertificateRequestDtoParseTypeEnum.Basic,
                                        }),
                                    );
                                }
                            }}
                        />

                        {certificate && (
                            <>
                                <br />
                                <CertificateAttributes certificate={certificate} />
                            </>
                        )}

                        <br />

                        <TabLayout
                            tabs={[
                                {
                                    title: 'Custom Attributes',
                                    content: (
                                        <AttributeEditor
                                            id="customUploadCertificate"
                                            attributeDescriptors={secondaryResourceCustomAttributes}
                                        />
                                    ),
                                },
                            ]}
                        />

                        <br />

                        <div className="d-flex justify-content-end">
                            <ButtonGroup>
                                <ProgressButton
                                    title={okButtonTitle}
                                    inProgressTitle={okButtonTitle}
                                    inProgress={submitting}
                                    disabled={!valid || !fileContent}
                                />
                                <Button color="default" onClick={onCancel} disabled={submitting}>
                                    Cancel
                                </Button>
                            </ButtonGroup>
                        </div>
                    </div>
                </BootstrapForm>
            )}
        </Form>
    );
}
