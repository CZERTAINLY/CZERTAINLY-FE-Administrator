import { RoleDetailDTO, SubjectPermissionsDTO } from "api/roles";

export interface DbRole extends RoleDetailDTO {
}

export interface DbRolePermissions {
   uuid: string;
   permissions: SubjectPermissionsDTO;
}

interface DbRoles {
   [key: string]: DbRole;
}

interface DbRolePermission {
   [key: string]: DbRolePermissions;
}


export const dbRoles: DbRoles = {

   "admin": {
      uuid: "bbbbbbbb-cf31-402e-84c6-4988d96096c4",
      name: "admin",
      description: "Admin role",
      systemRole: true,
      users: []
   },

   "user": {
      uuid: "aaaaaaaa-cf31-402e-84c6-4988d96096c4",
      name: "user",
      description: "User role",
      systemRole: false,
      users: []
   }

}

export const dbRolePermissions: DbRolePermission = {

   "bbbbbbbb-cf31-402e-84c6-4988d96096c4": {
      uuid: "bbbbbbbb-cf31-402e-84c6-4988d96096c4",
      permissions: {
         allowAllResources: true,
         resources: []
      }
   },

   "aaaaaaaa-cf31-402e-84c6-4988d96096c4": {
      uuid: "aaaaaaaa-cf31-402e-84c6-4988d96096c4",
      permissions: {
         allowAllResources: false,
         resources: [
            {
               name: "users",
               allowAllActions: false,
               actions: ["read"],
               objects: []
            }
         ]
      }
   }

}