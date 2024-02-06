import {
    ObjectPermissionsResponseDto,
    ObjectPermissionsResponseModel,
    ResourcePermissionsResponseDto,
    ResourcePermissionsResponseModel,
    RoleDetailDto,
    RoleDetailModel,
    RoleRequestDto,
    RoleRequestModel,
    SubjectPermissionsDto,
    SubjectPermissionsModel,
} from 'types/roles';
import { transformAttributeRequestModelToDto, transformAttributeResponseDtoToModel } from './attributes';
import { transformUserResponseDtoToModel } from './users';

export function transformRoleDetailDtoToModel(role: RoleDetailDto): RoleDetailModel {
    return {
        ...role,
        users: role.users.map((user) => transformUserResponseDtoToModel(user)),
        customAttributes: role.customAttributes?.map(transformAttributeResponseDtoToModel),
    };
}

export function transformRoleRequestModelToDto(role: RoleRequestModel): RoleRequestDto {
    return {
        ...role,
        customAttributes: role.customAttributes?.map(transformAttributeRequestModelToDto),
    };
}

export function transformObjectPermissionsResponseDtoToModel(
    objectPermissions: ObjectPermissionsResponseDto,
): ObjectPermissionsResponseModel {
    return { ...objectPermissions };
}

export function transformResourcePermissionsResponseDtoToModel(
    resourcePermission: ResourcePermissionsResponseDto,
): ResourcePermissionsResponseModel {
    return {
        ...resourcePermission,
        objects: resourcePermission.objects.map(transformObjectPermissionsResponseDtoToModel),
    };
}

export function transformSubjectPermissionsDtoToModel(permissions: SubjectPermissionsDto): SubjectPermissionsModel {
    return {
        ...permissions,
        resources: permissions.resources.map(transformResourcePermissionsResponseDtoToModel),
    };
}
