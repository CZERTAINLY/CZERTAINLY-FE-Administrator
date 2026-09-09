import type { AttributeRequestModel, AttributeResponseModel } from './attributes';
import type { GroupDto, GroupRequestDto, NameAndUuidDto } from './openapi';

export type CertificateGroupResponseDto = GroupDto;
export type CertificateGroupResponseModel = Omit<CertificateGroupResponseDto, 'customAttributes'> & {
    customAttributes?: Array<AttributeResponseModel>;
};

export type CertificateGroupRequestDto = GroupRequestDto;
export type CertificateGroupRequestModel = Omit<CertificateGroupRequestDto, 'customAttributes'> & {
    customAttributes?: Array<AttributeRequestModel>;
};

export type GroupUserDto = NameAndUuidDto;
export type GroupUserModel = GroupUserDto;
