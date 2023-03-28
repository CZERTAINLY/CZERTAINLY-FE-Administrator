import { CertificateData, X509CertificateAsn1Data, X509CertificateBasicData } from "./openapi/utils";

export const isX509CertificateBasicData = (certData: CertificateData): certData is X509CertificateBasicData => {
    return ((certData as X509CertificateBasicData).subject !== undefined) &&
        ((certData as X509CertificateBasicData).serialNumber !== undefined) &&
        ((certData as X509CertificateBasicData).issuer !== undefined) &&
        ((certData as X509CertificateBasicData).validFrom !== undefined) &&
        ((certData as X509CertificateBasicData).validTo !== undefined);
};

export const isX509CertificateAsn1Data = (certData: CertificateData): certData is X509CertificateAsn1Data => {
    return ((certData as X509CertificateAsn1Data).asn1dump !== undefined);
};
