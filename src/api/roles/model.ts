import { UserDTO } from 'api/users';


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
