import {
   CertificateGroupRequestDto,
   CertificateGroupRequestModel,
   CertificateGroupResponseDto,
   CertificateGroupResponseModel
} from "types/certificateGroups";

export function transformCertificateGroupRequestModelToDto(group: CertificateGroupRequestModel): CertificateGroupRequestDto {
   return { ...group };
}

export function transformCertificateGroupResponseDtoToModel(group: CertificateGroupResponseDto): CertificateGroupResponseModel {
   return { ...group };
}