import {
    ActionDto as ActionDtoOpenApi,
    ResourceDetailDto,
    RoleDto,
    UpdateUserRequestDto,
    UserCertificateDto as UserCertificateDtoOpenApi,
    UserDetailDto as UserDetailDtoOpenApi
} from "./openapi";

export type ActionDto = ActionDtoOpenApi;
export type ActionModel = ActionDto;

export type ResourceDto = ResourceDetailDto;
export type ResourceModel = Omit<ResourceDto, "actions"> & { actions: Array<ActionModel>};

export type UserCertificateDto = UserCertificateDtoOpenApi;
export type UserCertificateModel = UserCertificateDto;

export type RoleResponseDto = RoleDto;
export type RoleResponseModel = RoleResponseDto;

export type UserDetailDto = UserDetailDtoOpenApi;
export type UserDetailModel = Omit<UserDetailDto, "certificate | roles"> & { certificate?: UserCertificateModel, roles: Array<RoleResponseModel> };

export type UserUpdateRequestDto = UpdateUserRequestDto;
export type UserUpdateRequestModel = UserUpdateRequestDto;