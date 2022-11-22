import {
   ActionDto, ActionModel,
   ResourceDto,
   ResourceModel,
   RoleResponseDto,
   RoleResponseModel,
   UserCertificateDto,
   UserCertificateModel,
   UserDetailDto,
   UserDetailModel
} from "types/auth";

export function transformResourceDtoToModel(resource: ResourceDto): ResourceModel {
   return {
      ...resource,
      actions: resource.actions.map(transformActionDtoToModel),
   };
}

export function transformActionDtoToModel(action: ActionDto): ActionModel {
   return { ...action };
}

export function transformUserDetailDtoToModel(user: UserDetailDto): UserDetailModel {

   return {
      ...user,
      certificate: user.certificate ? transformUserCertificateDtoToModel(user.certificate) : undefined,
      roles: user.roles.map(role => transformRoleResponseDtoToModel(role))
   }
}

export function transformUserCertificateDtoToModel(certificate: UserCertificateDto): UserCertificateModel{
   return { ...certificate };
}

export function transformRoleResponseDtoToModel(role: RoleResponseDto): RoleResponseModel {
   return { ...role };
}

