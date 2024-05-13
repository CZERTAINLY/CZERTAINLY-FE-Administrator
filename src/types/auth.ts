import { AttributeRequestModel, AttributeResponseModel } from './attributes';
import {
    ActionDto as ActionDtoOpenApi,
    AuthResourceDto as AuthResourceDtoApi,
    RoleDto,
    UpdateUserRequestDto,
    UserCertificateDto as UserCertificateDtoOpenApi,
    UserDetailDto as UserDetailDtoOpenApi,
} from './openapi';

export type ActionDto = ActionDtoOpenApi;
export type ActionModel = ActionDto;

export type AuthResourceDto = AuthResourceDtoApi;
export type AuthResourceModel = Omit<AuthResourceDto, 'actions'> & { actions: Array<ActionModel> };

export type UserCertificateDto = UserCertificateDtoOpenApi;
export type UserCertificateModel = UserCertificateDto;

export type RoleResponseDto = RoleDto;
export type RoleResponseModel = RoleResponseDto;

export type UserDetailDto = UserDetailDtoOpenApi;
export type UserDetailModel = Omit<UserDetailDto, 'certificate | roles | customAttributes'> & {
    certificate?: UserCertificateModel;
    roles: Array<RoleResponseModel>;
    customAttributes?: Array<AttributeResponseModel>;
};

export type UserUpdateRequestDto = UpdateUserRequestDto;
export type UserUpdateRequestModel = Omit<UserUpdateRequestDto, 'customAttributes'> & { customAttributes?: Array<AttributeRequestModel> };
