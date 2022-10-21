import { UserDTO } from 'api/users';
import { Observable } from 'rxjs';


export interface RoleDTO {
   uuid: string;
   name: string;
   description?: string;
   systemRole: boolean;
}


export interface RoleDetailDTO extends RoleDTO {
   users: UserDTO[];
}


export interface ObjectPermissionsDTO {
   uuid: string;
   name: string;
   allow: string[];
   deny: string[];
}


export interface ResourcePermissionsDTO {
   name: string;
   allowAllActions: boolean;
   actions: string[];
   objects?: ObjectPermissionsDTO[];
}


export interface SubjectPermissionsDTO {
   allowAllResources: boolean;
   resources: ResourcePermissionsDTO[];
}


export interface RolesManagementApi {

   list(): Observable<RoleDTO[]>;

   getDetail(name: string): Observable<RoleDetailDTO>;

   create(
      name: string,
      description?: string,
   ): Observable<RoleDetailDTO>;

   update(
      uuid: string,
      name: string,
      description?: string,
   ): Observable<RoleDetailDTO>;

   delete(uuid: string): Observable<void>;

   getUsers(uuid: string): Observable<UserDTO[]>;

   updateUsers(uuid: string, userUuids: string[]): Observable<RoleDetailDTO>;

   getPermissions(uuid: string): Observable<SubjectPermissionsDTO>;

   updatePermissions(uuid: string, permissions: SubjectPermissionsDTO): Observable<SubjectPermissionsDTO>;

   getResourcePermissions(uuid: string, resourceName: string): Observable<ResourcePermissionsDTO>;

   getResourceObjectsPermissions(uuid: string, resourceName: string): Observable<ObjectPermissionsDTO[]>;

   addResourceObjectsPermissions(uuid: string, resourceName: string, objectUuid: string, permissions: ObjectPermissionsDTO[]): Observable<void>;

   updateResourceObjectsPermissions(uuid: string, resourceName: string, objectUuid: string, permissions: ObjectPermissionsDTO): Observable<void>;

   removeResourceObjectsPermissions(uuid: string, resourceName: string, objectUuid: string): Observable<void>;

}
