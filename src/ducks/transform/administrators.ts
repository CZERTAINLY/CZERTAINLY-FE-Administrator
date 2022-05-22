import { AdministratorDTO } from "api/administrators";
import { AdministratorModel } from "models";

export function transformAdminDtoToAdminModel(adminDto: AdministratorDTO): AdministratorModel {

   return {
      uuid: adminDto.uuid,
      name: adminDto.name,
      username: adminDto.username,
      certificate: adminDto.certificate,
      role: adminDto.role,
      email: adminDto.email,
      serialNumber: adminDto.serialNumber,
      description: adminDto.description,
      enabled: adminDto.enabled,
      surname: adminDto.surname
   }

}
