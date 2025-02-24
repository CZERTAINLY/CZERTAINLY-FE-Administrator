import {
    AuthActionDto,
    AuthActionModel,
    AuthResourceDto,
    AuthResourceModel,
    RoleResponseDto,
    RoleResponseModel,
    UserCertificateDto,
    UserCertificateModel,
    UserDetailDto,
    UserDetailModel,
    UserUpdateRequestDto,
    UserUpdateRequestModel,
} from 'types/auth';
import { transformAttributeRequestModelToDto, transformAttributeResponseDtoToModel } from './attributes';

export function transformResourceDtoToModel(resource: AuthResourceDto): AuthResourceModel {
    return {
        ...resource,
        actions: resource.actions.map(transformAuthActionDtoToModel),
    };
}

export function transformAuthActionDtoToModel(action: AuthActionDto): AuthActionModel {
    return { ...action };
}

export function transformUserDetailDtoToModel(user: UserDetailDto): UserDetailModel {
    return {
        ...user,
        certificate: user.certificate ? transformUserCertificateDtoToModel(user.certificate) : undefined,
        roles: user.roles.map((role) => transformRoleResponseDtoToModel(role)),
        customAttributes: user.customAttributes?.map(transformAttributeResponseDtoToModel),
    };
}

export function transformUserCertificateDtoToModel(certificate: UserCertificateDto): UserCertificateModel {
    return { ...certificate };
}

export function transformRoleResponseDtoToModel(role: RoleResponseDto): RoleResponseModel {
    return { ...role };
}

export function transformUserUpdateRequestModelToDto(user: UserUpdateRequestModel): UserUpdateRequestDto {
    return {
        ...user,
        customAttributes: user.customAttributes?.map(transformAttributeRequestModelToDto),
    };
}
