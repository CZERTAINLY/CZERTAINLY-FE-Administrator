import { CertificateData, X509CertificateBasicData } from "./openapi/utils";

export const isX509CertificateBasicData = (certData: CertificateData): certData is X509CertificateBasicData => {
    return ((certData as X509CertificateBasicData).subject !== undefined) &&
        ((certData as X509CertificateBasicData).serialNumber !== undefined) &&
        ((certData as X509CertificateBasicData).issuer !== undefined) &&
        ((certData as X509CertificateBasicData).validFrom !== undefined) &&
        ((certData as X509CertificateBasicData).validTo !== undefined);
};
