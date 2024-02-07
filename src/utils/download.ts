import 'jszip';

import { Buffer } from 'buffer';
import { saveAs } from 'file-saver';

import JSZip from 'jszip';
import { CertificateContentResponseModel, CertificateDetailResponseModel } from 'types/certificate';

export function downloadFile(content: any, fileName: string, type?: string) {
    const element = document.createElement('a');

    var byteNumbers = new Array(content.length);
    for (var i = 0; i < content.length; i++) {
        byteNumbers[i] = content.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);

    if (!type) {
        type = 'text/plain';
    }

    const file = new Blob([byteArray], { type: type });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
}

export function downloadFileZip(
    certificateUuids: string[],
    certificates: CertificateDetailResponseModel[] | CertificateContentResponseModel[],
    fileType: string,
) {
    const zip = new JSZip();

    for (let i of certificateUuids) {
        const certificate = (certificates as Array<CertificateDetailResponseModel | CertificateContentResponseModel>).find(
            (c) => c.uuid === i,
        );

        if (!certificate) continue;

        let content: string | Buffer;

        if (fileType === 'pem') {
            content = formatPEM(certificate.certificateContent || '');
        } else {
            content = Buffer.from(certificate.certificateContent || '', 'base64');
        }

        zip.file(certificate.commonName.replace('*.', '_.') + '_' + certificate.serialNumber + '.' + fileType, content);
    }

    zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, 'CertificateDownload ' + new Date().toISOString().replace(' ', '_') + '.zip');
    });
}

export function formatPEM(pemString: string) {
    const PEM_STRING_LENGTH = pemString.length,
        LINE_LENGTH = 64;

    const wrapNeeded = PEM_STRING_LENGTH > LINE_LENGTH;

    if (wrapNeeded) {
        let formattedString = '',
            wrapIndex = 0;

        for (let i = LINE_LENGTH; i < PEM_STRING_LENGTH; i += LINE_LENGTH) {
            formattedString += pemString.substring(wrapIndex, i) + '\r\n';
            wrapIndex = i;
        }

        formattedString += pemString.substring(wrapIndex, PEM_STRING_LENGTH);

        return `-----BEGIN CERTIFICATE-----\n${formattedString}\n-----END CERTIFICATE-----`;
    } else {
        return `-----BEGIN CERTIFICATE-----\n${pemString}\n-----END CERTIFICATE-----`;
    }
}
