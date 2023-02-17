import { CertificateDetailResponseModel } from "../../types/certificate";
import { ParseCertificateResponseDto } from "../../types/openapi/utils";
import { isX509CertificateBasicData } from "../../types/utilsCertificate";
import { emptyCertificate } from "../../utils/certificate";

export function transformParseCertificateResponseDtoToCertificateResponseDetailModel(cert: ParseCertificateResponseDto): CertificateDetailResponseModel {
    return isX509CertificateBasicData(cert.data) ? {
        ...emptyCertificate,
        notBefore: new Date(cert.data.validFrom).toISOString(),
        notAfter: new Date(cert.data.validTo).toISOString(),
        issuerDn: cert.data.issuer,
        subjectDn: cert.data.subject,
        serialNumber: cert.data.serialNumber,
    } : emptyCertificate;
}

