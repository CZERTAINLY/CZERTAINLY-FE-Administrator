import { CertificateDetailResponseModel } from "../../types/certificate";
import { CertificateStatus, CertificateType } from "../../types/openapi";
import { ParseCertificateResponseDto } from "../../types/openapi/utils";

export function transformParseCertificateResponseDtoToCertificateResponseDetailModel(cert: ParseCertificateResponseDto): CertificateDetailResponseModel {
    return {
        notBefore: new Date(cert.data.validFrom).toISOString(),
        notAfter: new Date(cert.data.validTo).toISOString(),
        issuerDn: cert.data.issuer,
        subjectDn: cert.data.subject,
        serialNumber: cert.data.serialNumber,
        uuid: "",
        commonName: "",
        issuerCommonName: "",
        certificateContent: "",
        publicKeyAlgorithm: "",
        signatureAlgorithm: "",
        keySize: -1,
        keyUsage: [],
        extendedKeyUsage: [],
        basicConstraints: "",
        status: CertificateStatus.Unknown,
        fingerprint: "",
        certificateType: CertificateType.X509,
        issuerSerialNumber: "",
        subjectAlternativeNames: {},
        privateKeyAvailability: false,
    };
}

