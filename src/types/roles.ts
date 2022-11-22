import {
    ObjectPermissionsDto,
    ObjectPermissionsRequestDto as ObjectPermissionsRequestDtoOpenApi,
    ResourcePermissionsDto,
    ResourcePermissionsRequestDto as ResourcePermissionsRequestDtoOpenApi,
    RoleDetailDto as RoleDetailDtoOpenApi, RolePermissionsRequestDto,
    SubjectPermissionsDto as SubjectPermissionsDtoOpenApi,
    RoleRequestDto as RoleRequestDtoOpenApi,
} from "./openapi";
import { UserResponseModel } from "./users";

export type RoleDetailDto = RoleDetailDtoOpenApi;
export type RoleDetailModel = Omit<RoleDetailDto, "users"> & { users: Array<UserResponseModel> };

export type RoleRequestDto = RoleRequestDtoOpenApi;
export type RoleRequestModel = RoleRequestDto;

export type ObjectPermissionsRequestDto = ObjectPermissionsRequestDtoOpenApi;
export type ObjectPermissionsRequestModel = ObjectPermissionsRequestDto;

export type ObjectPermissionsResponseDto = ObjectPermissionsDto;
export type ObjectPermissionsResponseModel = ObjectPermissionsResponseDto;

export type ResourcePermissionsRequestDto = ResourcePermissionsRequestDtoOpenApi;
export type ResourcePermissionsRequestModel = Omit<ResourcePermissionsRequestDto, "objects"> & { objects?: Array<ObjectPermissionsRequestModel> };

export type ResourcePermissionsResponseDto = ResourcePermissionsDto;
export type ResourcePermissionsResponseModel = Omit<ResourcePermissionsResponseDto, "objects"> & { objects: Array<ObjectPermissionsResponseModel> };

export type SubjectPermissionsDto = SubjectPermissionsDtoOpenApi;
export type SubjectPermissionsModel = Omit<SubjectPermissionsDto, "resources"> & { resources: Array<ResourcePermissionsResponseModel> };

export type RolePermissionsDto = RolePermissionsRequestDto;
export type RolePermissionsModel = Omit<RolePermissionsDto, "resources"> & { resources?: Array<ResourcePermissionsRequestModel> };