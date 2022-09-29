import { RoleDTO } from "api/roles";
import { RoleModel } from "models/roles";

export function transformRoleDTOToModel(role: RoleDTO): RoleModel {

   return {
      uuid: role.uuid,
      name: role.name,
      description: role.description,
      systemRole: role.systemRole,
   };

}