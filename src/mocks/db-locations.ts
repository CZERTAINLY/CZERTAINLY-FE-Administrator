import { LocationDTO } from "api/location";
import { dbEntities } from "./db-entities";
import { dbCertificates } from "./db-certificates";

export interface DbLocation extends LocationDTO {
}

export interface DbLocations {
   [key: string]: DbLocation;
}

export const dbLocations: DbLocations = {

   "location1": {
      uuid: "ffb53f2c-a6b9-49f0-ad99-418d5fe2b298",
      name: "Location 1",
      description: "Location 1",
      enabled: true,
      metadata: {},
      entityInstanceUuid: dbEntities["entity1"].uuid,
      entityInstanceName: dbEntities["entity1"].name,
      attributes: [
      ],
      certificates: [
         {
            certificateUuid: dbCertificates["Lukas Kopenec"].uuid,
            commonName: dbCertificates["Lukas Kopenec"].commonName,
            serialNumber: dbCertificates["Lukas Kopenec"].serialNumber,
            csrAttributes: [],
            pushAttributes: [],
            metadata: {},
            withKey: false,
         }
      ],
      supportKeyMannagement: false,
      supportMultipleEntries: false
   },

   "location2": {
      uuid: "f0b53f2c-a6b9-49f0-ad99-418d5fe2b298",
      name: "Location 2",
      description: "Location 2",
      enabled: false,
      metadata: {},
      entityInstanceUuid: dbEntities["entity1"].uuid,
      entityInstanceName: dbEntities["entity1"].name,
      attributes: [
      ],
      certificates: [
         {
            certificateUuid: dbCertificates["Lukas Kopenec"].uuid,
            commonName: dbCertificates["Lukas Kopenec"].commonName,
            serialNumber: dbCertificates["Lukas Kopenec"].serialNumber,
            csrAttributes: [],
            pushAttributes: [],
            metadata: {},
            withKey: true,
         }
      ],
      supportKeyMannagement: false,
      supportMultipleEntries: false
   }


}