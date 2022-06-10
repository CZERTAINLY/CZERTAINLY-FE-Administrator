import { AuthorizedRAProfileDTO, ClientDTO } from "api/clients/model";
import { ClientAuthorizedRaProfileModel, ClientModel } from "models";
import { transformCertDTOToModel } from "./certificates";

export function transformClientDTOToModel(client: ClientDTO): ClientModel {

   return {
      uuid: client.uuid,
      name: client.name,
      description: client.description,
      serialNumber: client.serialNumber,
      enabled: client.enabled,
      certificate: transformCertDTOToModel(client.certificate)
   }

}

export function transformClientAuthorizedProfileDTOToModel(profile: AuthorizedRAProfileDTO): ClientAuthorizedRaProfileModel {

   return {
      uuid: profile.uuid,
      name: profile.name,
      description: profile.description || "",
      enabled: profile.enabled
   }

}