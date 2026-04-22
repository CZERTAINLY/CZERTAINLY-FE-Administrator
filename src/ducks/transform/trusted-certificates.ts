import type {
    TrustedCertificateRequestDto,
    TrustedCertificateRequestModel,
    TrustedCertificateResponseDto,
    TrustedCertificateResponseModel,
} from 'types/trusted-certificates';

export function transformTrustedCertificateResponseDtoToModel(
    trustedCertificate: TrustedCertificateResponseDto,
): TrustedCertificateResponseModel {
    return { ...trustedCertificate };
}

export function transformTrustedCertificateRequestModelToDto(
    trustedCertificate: TrustedCertificateRequestModel,
): TrustedCertificateRequestDto {
    return { ...trustedCertificate };
}
