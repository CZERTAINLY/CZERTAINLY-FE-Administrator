import { RoleDetailDTO, RoleDTO, SubjectPermissionsDTO } from "api/roles";
import { RoleDetailModel, RoleModel, SubjectPermissionsModel } from "models/roles";
import { transformUserDTOToModel } from "./users";


export function transformRoleDTOToModel(role: RoleDTO): RoleModel {

   return {
      uuid: role.uuid,
      name: role.name,
      description: role.description,
      systemRole: role.systemRole,
   };

}


export function transformRoleDetailDTOToModel(role: RoleDetailDTO): RoleDetailModel {

   return {
      ...transformRoleDTOToModel(role),
      users: role.users.map(user => transformUserDTOToModel(user))
   };

}


export function transformSubjectPermissionsDTOToModel(permissions: SubjectPermissionsDTO): SubjectPermissionsModel {

   return {

      allowAllResources: permissions.allowAllResources,

      resources: permissions.resources.map(

         resource => ({

            name: resource.name,
            allowAllActions: resource.allowAllActions,
            actions: [ ...resource.actions ],

            objects: resource.objects?.map(

               object => ({
                  uuid: object.uuid,
                  allow: [ ...object.allow ],
                  deny: [ ...object.deny ],
               })

            )

         })

      )

   }

}