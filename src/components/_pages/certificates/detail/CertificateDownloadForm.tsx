import { Buffer } from 'buffer';
import { actions as userInterfaceActions } from '../../../../ducks/user-interface';

import { actions as alertActions } from 'ducks/alerts';
import { actions, selectors } from 'ducks/certificates';

import { CertificateFormat, CertificateFormatEncoding } from '../../../../types/openapi';

import { selectors as enumSelectors } from 'ducks/enums';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { downloadFile } from 'utils/certificate';

import { PlatformEnum } from 'types/openapi';

import DropDownListForm from 'components/DropDownForm';
import SwitchWidget from 'components/SwitchWidget';
import { Container, Label } from 'reactstrap';

interface ChainDownloadSwitchState {
    isDownloadTriggered: boolean;
    certificateEncoding?: CertificateFormatEncoding;
    certificateFormat?: CertificateFormat;
    isCopyTriggered?: boolean;
}

const CertificateDownloadForm = () => {
    const dispatch = useDispatch();
    const certificate = useSelector(selectors.certificateDetail);
    const certificateChainDownloadContent = useSelector(selectors.certificateChainDownloadContent);
    const certificateDownloadContent = useSelector(selectors.certificateDownloadContent);
    const certificateRequestFormatEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.CertificateFormat));
    const certificateFormatEncodingEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.CertificateFormatEncoding));
    const isFetchingCertificateChainDownloadContent = useSelector(selectors.isFetchingCertificateChainDownloadContent);
    const isFetchingCertificateDownloadContent = useSelector(selectors.isFetchingCertificateDownloadContent);

    const [chainDownloadSwitch, setTriggerChainDownload] = useState<ChainDownloadSwitchState>({ isDownloadTriggered: false });
    const [certificateDownloadSwitch, setCertificateDownload] = useState<ChainDownloadSwitchState>({ isDownloadTriggered: false });
    const [isDownloadFormCertificateChain, setIsDownloadFormCertificateChain] = useState<boolean>(false);

    const fileNameToDownload = certificate?.commonName + '_' + certificate?.serialNumber;

    const certificateFormatEncodingMap = useMemo(() => {
        return {
            [CertificateFormat.Raw]: {
                [CertificateFormatEncoding.Pem]: '.pem',
                [CertificateFormatEncoding.Der]: '.cer',
            },
            [CertificateFormat.Pkcs7]: {
                [CertificateFormatEncoding.Pem]: '.p7c',
                [CertificateFormatEncoding.Der]: '.p7b',
            },
        };
    }, []);

    const certificateChainFormatEncodingMap = useMemo(() => {
        return {
            [CertificateFormat.Raw]: {
                [CertificateFormatEncoding.Pem]: '.pem',
                [CertificateFormatEncoding.Der]: null,
            },
            [CertificateFormat.Pkcs7]: {
                [CertificateFormatEncoding.Pem]: '.p7c',
                [CertificateFormatEncoding.Der]: '.p7b',
            },
        };
    }, []);

    const certificateFormatOptions = Object.values(certificateRequestFormatEnum).map((item) => {
        return {
            label: item.label,
            value: item.code,
        };
    });

    const certificateEncodingOptions = Object.values(certificateFormatEncodingEnum).map((item) => {
        return {
            label: item.label,
            value: item.code,
        };
    });

    const downloadCertificateChainContent = useCallback(
        (certificateFormat: CertificateFormat, certificateEncoding: CertificateFormatEncoding) => {
            if (!certificate) return;
            dispatch(
                actions.downloadCertificateChain({
                    certificateFormat: certificateFormat,
                    uuid: certificate.uuid,
                    withEndCertificate: true,
                    encoding: certificateEncoding,
                }),
            );
            setTriggerChainDownload({
                isDownloadTriggered: true,
                certificateEncoding: certificateEncoding,
                certificateFormat: certificateFormat,
            });
        },
        [certificate, dispatch],
    );

    const downloadCertificateContent = useCallback(
        (certificateFormat: CertificateFormat, certificateEncoding: CertificateFormatEncoding) => {
            if (!certificate) return;
            dispatch(
                actions.downloadCertificate({
                    certificateFormat: certificateFormat,
                    uuid: certificate.uuid,
                    encoding: certificateEncoding,
                }),
            );
            setCertificateDownload({
                isDownloadTriggered: true,
                certificateEncoding: certificateEncoding,
                certificateFormat: certificateFormat,
            });
        },
        [certificate, dispatch],
    );

    useEffect(() => {
        if (
            !certificateChainDownloadContent ||
            !chainDownloadSwitch.isDownloadTriggered ||
            !chainDownloadSwitch.certificateFormat ||
            !chainDownloadSwitch.certificateEncoding
        )
            return;

        let extensionFormat;

        extensionFormat =
            certificateChainFormatEncodingMap[chainDownloadSwitch.certificateFormat]?.[chainDownloadSwitch.certificateEncoding];

        if (!extensionFormat) {
            dispatch(alertActions.error('There was some error with the extension format.'));
            return;
        }

        downloadFile(Buffer.from(certificateChainDownloadContent.content ?? '', 'base64'), fileNameToDownload + '_chain' + extensionFormat);

        setTriggerChainDownload({ isDownloadTriggered: false });
    }, [certificateChainDownloadContent, chainDownloadSwitch, fileNameToDownload, certificateChainFormatEncodingMap, dispatch]);

    useEffect(() => {
        if (
            !certificateDownloadContent ||
            !certificateDownloadSwitch.isDownloadTriggered ||
            !certificateDownloadSwitch.certificateFormat ||
            !certificateDownloadSwitch.certificateEncoding
        )
            return;
        if (certificateDownloadSwitch.isCopyTriggered) {
            setCertificateDownload({ isDownloadTriggered: false });
            return;
        }

        let extensionFormat;

        extensionFormat =
            certificateFormatEncodingMap[certificateDownloadSwitch.certificateFormat]?.[certificateDownloadSwitch.certificateEncoding];

        if (!extensionFormat) {
            dispatch(alertActions.error('There was some error with the extension format.'));
        }

        downloadFile(Buffer.from(certificateDownloadContent.content ?? '', 'base64'), fileNameToDownload + extensionFormat);

        setCertificateDownload({ isDownloadTriggered: false });
    }, [certificateDownloadContent, certificateDownloadSwitch, fileNameToDownload, certificateFormatEncodingMap, dispatch]);

    return (
        <>
            <Container className="ps-5 mb-3">
                <div className="d-flex">
                    <Label className="my-1 me-2">Certificate Chain</Label>
                    <SwitchWidget
                        checked={isDownloadFormCertificateChain ?? false}
                        onClick={() => setIsDownloadFormCertificateChain(!isDownloadFormCertificateChain)}
                    />
                </div>
            </Container>

            <DropDownListForm
                isBusy={isFetchingCertificateDownloadContent || isFetchingCertificateChainDownloadContent}
                onClose={() => {
                    dispatch(userInterfaceActions.hideGlobalModal());
                }}
                onSubmit={(values) => {
                    if (!isDownloadFormCertificateChain) {
                        if (values.certificateFormat && values.certificateEncoding && certificate?.uuid) {
                            downloadCertificateContent(values.certificateFormat.value, values.certificateEncoding.value);
                        }
                    }
                    if (isDownloadFormCertificateChain) {
                        if (values.certificateFormat && values.certificateEncoding && certificate?.uuid) {
                            downloadCertificateChainContent(values.certificateFormat.value, values.certificateEncoding.value);
                        }
                    }
                }}
                dropDownOptionsList={[
                    {
                        formLabel: isDownloadFormCertificateChain ? 'Certificate Chain Format' : 'Certificate Format',
                        formValue: 'certificateFormat',
                        options: certificateFormatOptions,
                    },
                    {
                        formLabel: isDownloadFormCertificateChain ? 'Certificate Chain Encoding' : 'Certificate Encoding',
                        formValue: 'certificateEncoding',

                        options: certificateEncodingOptions,
                    },
                ]}
            />
        </>
    );
};

export default CertificateDownloadForm;
