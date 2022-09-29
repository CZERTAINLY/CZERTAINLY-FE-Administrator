import { UserDTO } from 'api/users';
import { Observable } from 'rxjs';

/*
GET /auth/resources
GET /auth/roles/{uuid}
GET /auth/roles/{uuid}/permissions
GET /auth/roles/{uuid}/permissions/objects?resource=users
GET /auth/roles/{uuid}/permissions/objects?resource=users

POST /auth/roles/{uuid}/permissions
PUT  /auth/roles/{uuid}/permissions/{resource}/objects/{object_uuid}
DELETE /auth/roles/{uuid}/permissions/{resource}/objects/{object_uuid}
*/


export interface RoleDTO {
   uuid: string;
   name: string;
   description?: string;
   systemRole: boolean;
}


export interface RoleDetailDTO {
   uuid: string;
   name: string;
   description?: string;
   systemRole: boolean;
   users: UserDTO[];
}


export interface RoleApi {

   /*resources(): Observable<ResourceDTO[]>;*/

   listRoles(): Observable<RoleDTO[]>;

   /*role(name: string): Observable<RoleDTO>;

   addRole(
      uuid: string,
      name: string,
      resources: ResourcePermissionDTO[],
   ): Observable<RoleDTO>;

   updateRole(
      uuid: string,
      resources: ResourcePermissionDTO[],
   ): Observable<RoleDTO>;

   deleteRole(uuid: string): Observable<void>;
   */

}
