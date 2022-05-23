import { AdministratorDTO } from "api/administrators";
import { AdministratorModel } from "models";
import { transformCertDTOToCertModel } from "./certificates";

export function transformAdminDtoToAdminModel(adminDto: AdministratorDTO): AdministratorModel {

   return {
      uuid: adminDto.uuid,
      name: adminDto.name,
      username: adminDto.username,
      certificate: transformCertDTOToCertModel(adminDto.certificate),
      role: adminDto.role,
      email: adminDto.email,
      serialNumber: adminDto.serialNumber,
      description: adminDto.description,
      enabled: adminDto.enabled,
      surname: adminDto.surname
   }

}
