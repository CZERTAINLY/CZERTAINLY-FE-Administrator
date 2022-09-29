import { RoleDetailDTO } from "api/roles";
import { dbUsers } from "./db-users";

export interface DbRole extends RoleDetailDTO {
}

interface DbRoles {
   [key: string]: DbRole;
}

export const dbRoles: DbRoles = {

   "admin": {
      uuid: "bbbbbbbb-cf31-402e-84c6-4988d96096c4",
      name: "admin",
      description: "Admin role",
      systemRole: true,
      users: [
         dbUsers["Admin"],
      ]
   },

   "user": {
      uuid: "aaaaaaaa-cf31-402e-84c6-4988d96096c4",
      name: "user",
      description: "User role",
      systemRole: false,
      users: [
         dbUsers["User"],
      ]
   }

}
