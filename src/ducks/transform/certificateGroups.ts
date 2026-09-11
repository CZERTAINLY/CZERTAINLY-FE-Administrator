import type {
    CertificateGroupRequestDto,
    CertificateGroupRequestModel,
    CertificateGroupResponseDto,
    CertificateGroupResponseModel,
    GroupUserDto,
    GroupUserModel,
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

export function transformGroupUserDtoToModel(user: GroupUserDto): GroupUserModel {
    return { ...user };
}
