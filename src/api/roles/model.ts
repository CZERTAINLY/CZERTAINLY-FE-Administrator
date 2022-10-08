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

   getPermissions(uuid: string): Observable<SubjectPermissionsDTO>;

   updatePermissions(uuid: string, permissions: SubjectPermissionsDTO): Observable<SubjectPermissionsDTO>;

   /*
      ResourcePermissionsDto getRoleResourcePermissions(
         @Parameter(description = "Role UUID") @PathVariable String roleUuid,
         @Parameter(description = "Resource UUID") @PathVariable String resourceUuid
      ) throws NotFoundException;


      List<ObjectPermissionsDto> getResourcePermissionObjects(
         @Parameter(description = "Role UUID") @PathVariable String roleUuid,
         @Parameter(description = "Resource UUID")
         @PathVariable String resourceUuid
      ) throws NotFoundException;


      void addResourcePermissionObjects(
         @Parameter(description = "Role UUID") @PathVariable String roleUuid,
         @Parameter(description = "Resource UUID") @PathVariable String resourceUuid,
         @RequestBody List<ObjectPermissionsRequestDto> request
      ) throws NotFoundException;

      void updateResourcePermissionObjects(
         @Parameter(description = "Role UUID") @PathVariable String roleUuid,
         @Parameter(description = "Resource UUID") @PathVariable String resourceUuid,
         @Parameter(description = "Object UUID") @PathVariable String objectUuid,
         @RequestBody ObjectPermissionsRequestDto request
      ) throws NotFoundException;

      void removeResourcePermissionObjects(
         @Parameter(description = "Role UUID") @PathVariable String roleUuid,
         @Parameter(description = "Resource UUID") @PathVariable String resourceUuid,
         @Parameter(description = "Object UUID") @PathVariable String objectUuid
      ) throws NotFoundException;

   */

}
