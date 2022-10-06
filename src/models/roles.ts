import { UserModel } from "./users";

export interface RoleModel {
   uuid: string;
   name: string;
   description?: string;
   systemRole: boolean;
}


export interface RoleDetailModel extends RoleModel {
   users: UserModel[];
}


export interface ObjectPermissionsModel {
   uuid: string;
   allow: string[];
   deny: string[];
}


export interface ResourcePermissionsModel {
   name: string;
   allowAllActions: boolean;
   actions: string[];
   objects: ObjectPermissionsModel[];
}


export interface SubjectPermissionsModel {
   allowAllResources: boolean;
   resources: ResourcePermissionsModel[];
}

