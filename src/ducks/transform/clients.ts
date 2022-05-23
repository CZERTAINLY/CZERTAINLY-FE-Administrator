import { ClientDTO } from "api/clients/model";
import { ClientModel } from "models";
import { transformCertDTOToCertModel } from "./certificates";

export function transformClientDTOToClientModel(client: ClientDTO): ClientModel {

   return {
      uuid: client.uuid,
      name: client.name,
      description: client.description,
      serialNumber: client.serialNumber,
      enabled: client.enabled,
      certificate: transformCertDTOToCertModel(client.certificate)
   }

}