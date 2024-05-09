import { actions as utilsActuatorActions, selectors as utilsActuatorSelectors } from 'ducks/utilsActuator';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonGroup, FormGroup, Label } from 'reactstrap';
import { ParseRequestRequestDtoParseTypeEnum } from 'types/openapi/utils';
import { transformParseRequestResponseDtoToCertificateResponseDetailModel } from '../../../../ducks/transform/utilsCertificateRequest';
import {
    actions as utilsCertificateRequestActions,
    selectors as utilsCertificateRequestSelectors,
} from '../../../../ducks/utilsCertificateRequest';
import { CertificateDetailResponseModel } from '../../../../types/certificate';
import CertificateAttributes from '../../../CertificateAttributes';
import FileUpload from '../../../Input/FileUpload/FileUpload';

interface Props {
    onCancel: () => void;
    allowWithoutFile: boolean;
    onRenew: (data: { fileContent?: string }) => void;
}

export default function CertificateRenewDialog({ onCancel, allowWithoutFile, onRenew }: Props) {
    const dispatch = useDispatch();

    const [fileContent, setFileContent] = useState<string | undefined>();
    const [uploadCsr, setUploadCsr] = useState(false);
    const [certificate, setCertificate] = useState<CertificateDetailResponseModel | undefined>();

    const parsedCertificateRequest = useSelector(utilsCertificateRequestSelectors.parsedCertificateRequest);
    const health = useSelector(utilsActuatorSelectors.health);

    useEffect(() => {
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

    return (
        <div>
            <FormGroup>
                {allowWithoutFile ? (
                    <>
                        <Label for="uploadCsr">Upload new CSR ?</Label>
                        &nbsp;&nbsp;
                        <input
                            id="uploadCsr"
                            type="checkbox"
                            placeholder="Select Option"
                            onChange={(e) => {
                                setUploadCsr(e.target.checked);
                            }}
                        />
                    </>
                ) : (
                    <></>
                )}
            </FormGroup>

            {!allowWithoutFile || uploadCsr ? (
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

            <br />

            <div className="d-flex justify-content-end">
                <ButtonGroup>
                    <Button color="primary" onClick={() => onRenew({ fileContent: fileContent })}>
                        Renew
                    </Button>
                    <Button color="default" onClick={onCancel}>
                        Cancel
                    </Button>
                </ButtonGroup>
            </div>
        </div>
    );
}
