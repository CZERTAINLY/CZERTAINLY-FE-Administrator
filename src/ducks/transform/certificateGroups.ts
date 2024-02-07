import {
    CertificateGroupRequestDto,
    CertificateGroupRequestModel,
    CertificateGroupResponseDto,
    CertificateGroupResponseModel,
} from 'types/certificateGroups';
import { transformAttributeRequestModelToDto, transformAttributeResponseDtoToModel } from './attributes';

export function transformCertificateGroupRequestModelToDto(group: CertificateGroupRequestModel): CertificateGroupRequestDto {
    return {
        ...group,
        customAttributes: group.customAttributes?.map(transformAttributeRequestModelToDto),
    };
}

export function transformCertificateGroupResponseDtoToModel(group: CertificateGroupResponseDto): CertificateGroupResponseModel {
    return {
        ...group,
        customAttributes: group.customAttributes?.map(transformAttributeResponseDtoToModel),
    };
}
