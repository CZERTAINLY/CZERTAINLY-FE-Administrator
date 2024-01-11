import { Buffer } from "buffer";
import { actions as userInterfaceActions } from "../../../../ducks/user-interface";

import { actions, selectors } from "ducks/certificates";

import { CertificateFormat, CertificateFormatEncoding } from "../../../../types/openapi";

import { selectors as enumSelectors } from "ducks/enums";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { downloadFile } from "utils/certificate";

import { PlatformEnum } from "types/openapi";

import DropDownListForm from "components/DropDownForm";
import SwitchWidget from "components/SwitchWidget";
import { Container } from "reactstrap";

// Adding eslint supress no-useless concat warning
/* eslint-disable no-useless-concat */

interface ChainDownloadSwitchState {
    isDownloadTriggered: boolean;
    certificateEncoding?: CertificateFormatEncoding;
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

    const fileNameToDownload = certificate?.commonName + "_" + certificate?.serialNumber;

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
            setTriggerChainDownload({ isDownloadTriggered: true, certificateEncoding: certificateEncoding });
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
            });
        },
        [certificate, dispatch],
    );

    useEffect(() => {
        if (!certificateChainDownloadContent || !chainDownloadSwitch.isDownloadTriggered) return;

        const extensionFormat = chainDownloadSwitch.certificateEncoding === CertificateFormatEncoding.Pem ? ".pem" : ".p7b";
        downloadFile(Buffer.from(certificateChainDownloadContent.content ?? "", "base64"), fileNameToDownload + "_chain" + extensionFormat);

        setTriggerChainDownload({ isDownloadTriggered: false });
    }, [certificateChainDownloadContent, chainDownloadSwitch, fileNameToDownload]);

    useEffect(() => {
        if (!certificateDownloadContent || !certificateDownloadSwitch.isDownloadTriggered) return;
        if (certificateDownloadSwitch.isCopyTriggered) {
            setCertificateDownload({ isDownloadTriggered: false });
            return;
        }

        const extensionFormat = certificateDownloadSwitch.certificateEncoding === CertificateFormatEncoding.Pem ? ".pem" : ".cer";
        downloadFile(Buffer.from(certificateDownloadContent.content ?? "", "base64"), fileNameToDownload + extensionFormat);

        setCertificateDownload({ isDownloadTriggered: false });
    }, [certificateDownloadContent, certificateDownloadSwitch, fileNameToDownload]);

    return (
        <>
            <Container>
                <div className="d-flex justify-content-center">
                    <span className="my-1 me-1">Certificate Chain : </span>
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
                        formLabel: isDownloadFormCertificateChain ? "Certificate Chain Format" : "Certificate Format",
                        formValue: "certificateFormat",
                        options: certificateFormatOptions,
                    },
                    {
                        formLabel: isDownloadFormCertificateChain ? "Certificate Chain Encoding" : "Certificate Encoding",
                        formValue: "certificateEncoding",

                        options: certificateEncodingOptions,
                    },
                ]}
            />
        </>
    );
};

export default CertificateDownloadForm;
