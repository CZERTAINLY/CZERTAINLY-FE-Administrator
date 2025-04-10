import { AttributeRequestModel, AttributeResponseModel } from './attributes';
import {
    AuthActionDto as AuthActionDtoApi,
    AuthResourceDto as AuthResourceDtoApi,
    RoleDto,
    UpdateUserRequestDto,
    UserCertificateDto as UserCertificateDtoOpenApi,
    UserDetailDto as UserDetailDtoOpenApi,
    UserProfileDetailDto as UserProfileDetailDtoOpenApi,
} from './openapi';

export type AuthActionDto = AuthActionDtoApi;
export type AuthActionModel = AuthActionDto;

export type AuthResourceDto = AuthResourceDtoApi;
export type AuthResourceModel = Omit<AuthResourceDto, 'actions'> & { actions: Array<AuthActionModel> };

export type UserCertificateDto = UserCertificateDtoOpenApi;
export type UserCertificateModel = UserCertificateDto;

export type RoleResponseDto = RoleDto;
export type RoleResponseModel = RoleResponseDto;

export type UserDetailDto = UserDetailDtoOpenApi;
export type UserDetailModel = Omit<UserDetailDto, 'certificate' | 'roles' | 'customAttributes'> & {
    certificate?: UserCertificateModel;
    roles: Array<RoleResponseModel>;
    customAttributes?: Array<AttributeResponseModel>;
};

export type UserProfileDetailDto = UserProfileDetailDtoOpenApi;
export type UserProfileDetailModel = Omit<UserProfileDetailDto, 'certificate' | 'roles' | 'customAttributes'> & {
    certificate?: UserCertificateModel;
    roles: Array<RoleResponseModel>;
    customAttributes?: Array<AttributeResponseModel>;
};

export type UserUpdateRequestDto = UpdateUserRequestDto;
export type UserUpdateRequestModel = Omit<UserUpdateRequestDto, 'customAttributes'> & { customAttributes?: Array<AttributeRequestModel> };
