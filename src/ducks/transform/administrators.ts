import { AdministratorDTO } from "api/administrators";
import { AdministratorModel } from "models";
import { transformCertDTOToModel } from "./certificates";

export function transformAdminDtoToModel(adminDto: AdministratorDTO): AdministratorModel {

   return {
      uuid: adminDto.uuid,
      name: adminDto.name,
      username: adminDto.username,
      certificate: transformCertDTOToModel(adminDto.certificate),
      role: adminDto.role,
      email: adminDto.email,
      serialNumber: adminDto.serialNumber,
      description: adminDto.description,
      enabled: adminDto.enabled,
      surname: adminDto.surname
   }

}
