// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 2.14.2-SNAPSHOT
 * Contact: info@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type { Observable } from 'rxjs';
import type { AjaxResponse } from 'rxjs/ajax';
import { BaseAPI, throwIfNullOrUndefined, encodeURI } from '../runtime';
import type { OperationOpts, HttpHeaders } from '../runtime';
import type {
    AuthenticationServiceExceptionDto,
    ErrorMessageDto,
    ObjectPermissionsDto,
    ObjectPermissionsRequestDto,
    ResourcePermissionsDto,
    RoleDetailDto,
    RoleDto,
    RolePermissionsRequestDto,
    RoleRequestDto,
    SubjectPermissionsDto,
    UserDto,
} from '../models';

export interface AddResourcePermissionObjectsRequest {
    roleUuid: string;
    resourceUuid: string;
    objectPermissionsRequestDto: Array<ObjectPermissionsRequestDto>;
}

export interface CreateRoleRequest {
    roleRequestDto: RoleRequestDto;
}

export interface DeleteRoleRequest {
    roleUuid: string;
}

export interface GetResourcePermissionObjectsRequest {
    roleUuid: string;
    resourceUuid: string;
}

export interface GetRoleRequest {
    roleUuid: string;
}

export interface GetRolePermissionsRequest {
    roleUuid: string;
}

export interface GetRoleResourcePermissionsRequest {
    roleUuid: string;
    resourceUuid: string;
}

export interface GetRoleUsersRequest {
    roleUuid: string;
}

export interface RemoveResourcePermissionObjectsRequest {
    roleUuid: string;
    resourceUuid: string;
    objectUuid: string;
}

export interface SavePermissionsRequest {
    roleUuid: string;
    rolePermissionsRequestDto: RolePermissionsRequestDto;
}

export interface UpdateResourcePermissionObjectsRequest {
    roleUuid: string;
    resourceUuid: string;
    objectUuid: string;
    objectPermissionsRequestDto: ObjectPermissionsRequestDto;
}

export interface UpdateRoleRequest {
    roleUuid: string;
    roleRequestDto: RoleRequestDto;
}

export interface UpdateUsersRequest {
    roleUuid: string;
    requestBody: Array<string>;
}

/**
 * no description
 */
export class RoleManagementApi extends BaseAPI {

    /**
     * Add Resource Objects to a Role
     */
    addResourcePermissionObjects({ roleUuid, resourceUuid, objectPermissionsRequestDto }: AddResourcePermissionObjectsRequest): Observable<void>
    addResourcePermissionObjects({ roleUuid, resourceUuid, objectPermissionsRequestDto }: AddResourcePermissionObjectsRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>>
    addResourcePermissionObjects({ roleUuid, resourceUuid, objectPermissionsRequestDto }: AddResourcePermissionObjectsRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(roleUuid, 'roleUuid', 'addResourcePermissionObjects');
        throwIfNullOrUndefined(resourceUuid, 'resourceUuid', 'addResourcePermissionObjects');
        throwIfNullOrUndefined(objectPermissionsRequestDto, 'objectPermissionsRequestDto', 'addResourcePermissionObjects');

        const headers: HttpHeaders = {
            'Content-Type': 'application/json',
        };

        return this.request<void>({
            url: '/v1/roles/{roleUuid}/permissions/{resourceUuid}/objects'.replace('{roleUuid}', encodeURI(roleUuid)).replace('{resourceUuid}', encodeURI(resourceUuid)),
            method: 'POST',
            headers,
            body: objectPermissionsRequestDto,
        }, opts?.responseOpts);
    };

    /**
     * Create Role
     */
    createRole({ roleRequestDto }: CreateRoleRequest): Observable<RoleDetailDto>
    createRole({ roleRequestDto }: CreateRoleRequest, opts?: OperationOpts): Observable<AjaxResponse<RoleDetailDto>>
    createRole({ roleRequestDto }: CreateRoleRequest, opts?: OperationOpts): Observable<RoleDetailDto | AjaxResponse<RoleDetailDto>> {
        throwIfNullOrUndefined(roleRequestDto, 'roleRequestDto', 'createRole');

        const headers: HttpHeaders = {
            'Content-Type': 'application/json',
        };

        return this.request<RoleDetailDto>({
            url: '/v1/roles',
            method: 'POST',
            headers,
            body: roleRequestDto,
        }, opts?.responseOpts);
    };

    /**
     * Delete Role
     */
    deleteRole({ roleUuid }: DeleteRoleRequest): Observable<void>
    deleteRole({ roleUuid }: DeleteRoleRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>>
    deleteRole({ roleUuid }: DeleteRoleRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(roleUuid, 'roleUuid', 'deleteRole');

        return this.request<void>({
            url: '/v1/roles/{roleUuid}'.replace('{roleUuid}', encodeURI(roleUuid)),
            method: 'DELETE',
        }, opts?.responseOpts);
    };

    /**
     * Get Resource Objects of a Role
     */
    getResourcePermissionObjects({ roleUuid, resourceUuid }: GetResourcePermissionObjectsRequest): Observable<Array<ObjectPermissionsDto>>
    getResourcePermissionObjects({ roleUuid, resourceUuid }: GetResourcePermissionObjectsRequest, opts?: OperationOpts): Observable<AjaxResponse<Array<ObjectPermissionsDto>>>
    getResourcePermissionObjects({ roleUuid, resourceUuid }: GetResourcePermissionObjectsRequest, opts?: OperationOpts): Observable<Array<ObjectPermissionsDto> | AjaxResponse<Array<ObjectPermissionsDto>>> {
        throwIfNullOrUndefined(roleUuid, 'roleUuid', 'getResourcePermissionObjects');
        throwIfNullOrUndefined(resourceUuid, 'resourceUuid', 'getResourcePermissionObjects');

        return this.request<Array<ObjectPermissionsDto>>({
            url: '/v1/roles/{roleUuid}/permissions/{resourceUuid}/objects'.replace('{roleUuid}', encodeURI(roleUuid)).replace('{resourceUuid}', encodeURI(resourceUuid)),
            method: 'GET',
        }, opts?.responseOpts);
    };

    /**
     * Get role details
     */
    getRole({ roleUuid }: GetRoleRequest): Observable<RoleDetailDto>
    getRole({ roleUuid }: GetRoleRequest, opts?: OperationOpts): Observable<AjaxResponse<RoleDetailDto>>
    getRole({ roleUuid }: GetRoleRequest, opts?: OperationOpts): Observable<RoleDetailDto | AjaxResponse<RoleDetailDto>> {
        throwIfNullOrUndefined(roleUuid, 'roleUuid', 'getRole');

        return this.request<RoleDetailDto>({
            url: '/v1/roles/{roleUuid}'.replace('{roleUuid}', encodeURI(roleUuid)),
            method: 'GET',
        }, opts?.responseOpts);
    };

    /**
     * Get Permissions of a Role
     */
    getRolePermissions({ roleUuid }: GetRolePermissionsRequest): Observable<SubjectPermissionsDto>
    getRolePermissions({ roleUuid }: GetRolePermissionsRequest, opts?: OperationOpts): Observable<AjaxResponse<SubjectPermissionsDto>>
    getRolePermissions({ roleUuid }: GetRolePermissionsRequest, opts?: OperationOpts): Observable<SubjectPermissionsDto | AjaxResponse<SubjectPermissionsDto>> {
        throwIfNullOrUndefined(roleUuid, 'roleUuid', 'getRolePermissions');

        return this.request<SubjectPermissionsDto>({
            url: '/v1/roles/{roleUuid}/permissions'.replace('{roleUuid}', encodeURI(roleUuid)),
            method: 'GET',
        }, opts?.responseOpts);
    };

    /**
     * Get Resources of a Role
     */
    getRoleResourcePermissions({ roleUuid, resourceUuid }: GetRoleResourcePermissionsRequest): Observable<ResourcePermissionsDto>
    getRoleResourcePermissions({ roleUuid, resourceUuid }: GetRoleResourcePermissionsRequest, opts?: OperationOpts): Observable<AjaxResponse<ResourcePermissionsDto>>
    getRoleResourcePermissions({ roleUuid, resourceUuid }: GetRoleResourcePermissionsRequest, opts?: OperationOpts): Observable<ResourcePermissionsDto | AjaxResponse<ResourcePermissionsDto>> {
        throwIfNullOrUndefined(roleUuid, 'roleUuid', 'getRoleResourcePermissions');
        throwIfNullOrUndefined(resourceUuid, 'resourceUuid', 'getRoleResourcePermissions');

        return this.request<ResourcePermissionsDto>({
            url: '/v1/roles/{roleUuid}/permissions/{resourceUuid}'.replace('{roleUuid}', encodeURI(roleUuid)).replace('{resourceUuid}', encodeURI(resourceUuid)),
            method: 'GET',
        }, opts?.responseOpts);
    };

    /**
     * Get Role Users
     */
    getRoleUsers({ roleUuid }: GetRoleUsersRequest): Observable<Array<UserDto>>
    getRoleUsers({ roleUuid }: GetRoleUsersRequest, opts?: OperationOpts): Observable<AjaxResponse<Array<UserDto>>>
    getRoleUsers({ roleUuid }: GetRoleUsersRequest, opts?: OperationOpts): Observable<Array<UserDto> | AjaxResponse<Array<UserDto>>> {
        throwIfNullOrUndefined(roleUuid, 'roleUuid', 'getRoleUsers');

        return this.request<Array<UserDto>>({
            url: '/v1/roles/{roleUuid}/users'.replace('{roleUuid}', encodeURI(roleUuid)),
            method: 'GET',
        }, opts?.responseOpts);
    };

    /**
     * List Roles
     */
    listRoles(): Observable<Array<RoleDto>>
    listRoles(opts?: OperationOpts): Observable<AjaxResponse<Array<RoleDto>>>
    listRoles(opts?: OperationOpts): Observable<Array<RoleDto> | AjaxResponse<Array<RoleDto>>> {
        return this.request<Array<RoleDto>>({
            url: '/v1/roles',
            method: 'GET',
        }, opts?.responseOpts);
    };

    /**
     * Update Resource Objects to a Role
     */
    removeResourcePermissionObjects({ roleUuid, resourceUuid, objectUuid }: RemoveResourcePermissionObjectsRequest): Observable<void>
    removeResourcePermissionObjects({ roleUuid, resourceUuid, objectUuid }: RemoveResourcePermissionObjectsRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>>
    removeResourcePermissionObjects({ roleUuid, resourceUuid, objectUuid }: RemoveResourcePermissionObjectsRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(roleUuid, 'roleUuid', 'removeResourcePermissionObjects');
        throwIfNullOrUndefined(resourceUuid, 'resourceUuid', 'removeResourcePermissionObjects');
        throwIfNullOrUndefined(objectUuid, 'objectUuid', 'removeResourcePermissionObjects');

        return this.request<void>({
            url: '/v1/roles/{roleUuid}/permissions/{resourceUuid}/objects/{objectUuid}'.replace('{roleUuid}', encodeURI(roleUuid)).replace('{resourceUuid}', encodeURI(resourceUuid)).replace('{objectUuid}', encodeURI(objectUuid)),
            method: 'DELETE',
        }, opts?.responseOpts);
    };

    /**
     * Add permissions to Role
     */
    savePermissions({ roleUuid, rolePermissionsRequestDto }: SavePermissionsRequest): Observable<SubjectPermissionsDto>
    savePermissions({ roleUuid, rolePermissionsRequestDto }: SavePermissionsRequest, opts?: OperationOpts): Observable<AjaxResponse<SubjectPermissionsDto>>
    savePermissions({ roleUuid, rolePermissionsRequestDto }: SavePermissionsRequest, opts?: OperationOpts): Observable<SubjectPermissionsDto | AjaxResponse<SubjectPermissionsDto>> {
        throwIfNullOrUndefined(roleUuid, 'roleUuid', 'savePermissions');
        throwIfNullOrUndefined(rolePermissionsRequestDto, 'rolePermissionsRequestDto', 'savePermissions');

        const headers: HttpHeaders = {
            'Content-Type': 'application/json',
        };

        return this.request<SubjectPermissionsDto>({
            url: '/v1/roles/{roleUuid}/permissions'.replace('{roleUuid}', encodeURI(roleUuid)),
            method: 'POST',
            headers,
            body: rolePermissionsRequestDto,
        }, opts?.responseOpts);
    };

    /**
     * Update Resource Objects to a Role
     */
    updateResourcePermissionObjects({ roleUuid, resourceUuid, objectUuid, objectPermissionsRequestDto }: UpdateResourcePermissionObjectsRequest): Observable<void>
    updateResourcePermissionObjects({ roleUuid, resourceUuid, objectUuid, objectPermissionsRequestDto }: UpdateResourcePermissionObjectsRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>>
    updateResourcePermissionObjects({ roleUuid, resourceUuid, objectUuid, objectPermissionsRequestDto }: UpdateResourcePermissionObjectsRequest, opts?: OperationOpts): Observable<void | AjaxResponse<void>> {
        throwIfNullOrUndefined(roleUuid, 'roleUuid', 'updateResourcePermissionObjects');
        throwIfNullOrUndefined(resourceUuid, 'resourceUuid', 'updateResourcePermissionObjects');
        throwIfNullOrUndefined(objectUuid, 'objectUuid', 'updateResourcePermissionObjects');
        throwIfNullOrUndefined(objectPermissionsRequestDto, 'objectPermissionsRequestDto', 'updateResourcePermissionObjects');

        const headers: HttpHeaders = {
            'Content-Type': 'application/json',
        };

        return this.request<void>({
            url: '/v1/roles/{roleUuid}/permissions/{resourceUuid}/objects/{objectUuid}'.replace('{roleUuid}', encodeURI(roleUuid)).replace('{resourceUuid}', encodeURI(resourceUuid)).replace('{objectUuid}', encodeURI(objectUuid)),
            method: 'PUT',
            headers,
            body: objectPermissionsRequestDto,
        }, opts?.responseOpts);
    };

    /**
     * Update Role
     */
    updateRole({ roleUuid, roleRequestDto }: UpdateRoleRequest): Observable<RoleDetailDto>
    updateRole({ roleUuid, roleRequestDto }: UpdateRoleRequest, opts?: OperationOpts): Observable<AjaxResponse<RoleDetailDto>>
    updateRole({ roleUuid, roleRequestDto }: UpdateRoleRequest, opts?: OperationOpts): Observable<RoleDetailDto | AjaxResponse<RoleDetailDto>> {
        throwIfNullOrUndefined(roleUuid, 'roleUuid', 'updateRole');
        throwIfNullOrUndefined(roleRequestDto, 'roleRequestDto', 'updateRole');

        const headers: HttpHeaders = {
            'Content-Type': 'application/json',
        };

        return this.request<RoleDetailDto>({
            url: '/v1/roles/{roleUuid}'.replace('{roleUuid}', encodeURI(roleUuid)),
            method: 'PUT',
            headers,
            body: roleRequestDto,
        }, opts?.responseOpts);
    };

    /**
     * Add users to Role
     */
    updateUsers({ roleUuid, requestBody }: UpdateUsersRequest): Observable<RoleDetailDto>
    updateUsers({ roleUuid, requestBody }: UpdateUsersRequest, opts?: OperationOpts): Observable<AjaxResponse<RoleDetailDto>>
    updateUsers({ roleUuid, requestBody }: UpdateUsersRequest, opts?: OperationOpts): Observable<RoleDetailDto | AjaxResponse<RoleDetailDto>> {
        throwIfNullOrUndefined(roleUuid, 'roleUuid', 'updateUsers');
        throwIfNullOrUndefined(requestBody, 'requestBody', 'updateUsers');

        const headers: HttpHeaders = {
            'Content-Type': 'application/json',
        };

        return this.request<RoleDetailDto>({
            url: '/v1/roles/{roleUuid}/users'.replace('{roleUuid}', encodeURI(roleUuid)),
            method: 'PATCH',
            headers,
            body: requestBody,
        }, opts?.responseOpts);
    };

}
