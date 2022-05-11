import { ClientAuthorizationsDTO, ClientDTO } from "api/clients";
import { RaProfile } from "models";
import { dbCertificates } from "./db-certificates";


export interface DBClient extends ClientDTO {
   auth: ClientAuthorizationsDTO[];
}


interface DbClientList {
   [key: string]: DBClient;
}


export const dbClients: DbClientList = {

   "PT1": {
      uuid: "63491c27-e264-46cb-8546-5c4a5ff1ea8f",
      serialNumber: "47e17ab1d1a86ad789c0874a6b11663da0fba952",
      name: "PT1",
      description: "T!",
      enabled: false,
      certificate: dbCertificates["t1c.com"],
      auth: []
   },

   "test-client1": {
      uuid: "aaab33a4-f286-4279-a670-75c34e033e74",
      serialNumber: "177e75f42e95ecb98f831eb57de27b0bc8c47643",
      name: "test-client1",
      description: "",
      enabled: true,
      certificate: dbCertificates["t1c.com"],
      auth: []
   },

   "TestClient": {
      uuid: "038ba4d5-62eb-4fca-8ad1-65d27fe4d7ee",
      serialNumber: "ea1acbe5c57a642a",
      name: "TestClient",
      certificate: dbCertificates["t1c.com"],
      description: "TestClient",
      enabled: false,
      auth: []
   }

}