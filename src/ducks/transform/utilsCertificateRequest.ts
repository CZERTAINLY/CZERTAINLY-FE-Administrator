import { isX509CertificateRequestAsn1Data } from 'types/utilsCertificate';
import { CertificateDetailResponseModel } from '../../types/certificate';
import { ParseRequestResponseDto } from '../../types/openapi/utils';
import { isPkcs10RequestBasicData } from '../../types/utilsCertificateRequest';
import { emptyCertificate } from '../../utils/certificate';

export function transformParseRequestResponseDtoToCertificateResponseDetailModel(
    req: ParseRequestResponseDto,
): CertificateDetailResponseModel {
    return isPkcs10RequestBasicData(req.data)
        ? {
              ...emptyCertificate,
              subjectDn: req.data.subject,
          }
        : emptyCertificate;
}

export function transformParseRequestResponseDtoToCertificateResponseDetailModelToAsn1String(
    cert: ParseRequestResponseDto,
): string | undefined {
    return isX509CertificateRequestAsn1Data(cert.data) ? cert.data.asn1dump : undefined;
}
