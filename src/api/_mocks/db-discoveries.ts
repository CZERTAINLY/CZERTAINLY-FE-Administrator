import { DiscoveryDTO } from "api/discovery";
import { dbCertificates } from "./db-certificates";


export interface DbDiscovery extends DiscoveryDTO {
};


interface DbDiscoveries {
   [key: string]: DbDiscovery;
}


export const dbDiscoveries: DbDiscoveries = {

   "Discovery1": {
      uuid: "817bf9e8-b855-4043-be66-e2a71913f441",
      name: "CZERTAINLY",
      kind: "IP-Hostname",
      status: "completed",
      startTime: "2022-01-05T13:55:50.534+00:00",
      endTime: "2022-01-05T13:55:56.712+00:00",
      totalCertificatesDiscovered: 3,
      connectorUuid: "26c5b011-cd13-4f93-8e04-14020c192430",
      connectorName: "Network-Discovery-Provider",
      certificate: [
         dbCertificates["Lukas Kopenec"],
         dbCertificates["CLIENT1"]
      ],
      attributes: [
         {
            "uuid": "1b6c48ad-c1c7-4c82-91ef-3b61bc9f52ac",
            "name": "ip",
            "label": "IP/Hostname",
            "type": "STRING",
            "content": {
               "value": "www.czertainly.com"
            }
         }
      ],
      meta: {
         "totalUrls": 1,
         "successUrls": 1,
         "failedUrls": 0
      }
   },

   "Discovery2": {
      uuid: "fba8b7a8-11af-4e35-b6d5-0e294427bb83",
      name: "CZERTAINLY2",
      kind: "IP-Hostname",
      status: "completed",
      startTime: "2022-01-05T13:55:50.534+00:00",
      endTime: "2022-01-05T13:55:56.712+00:00",
      totalCertificatesDiscovered: 3,
      connectorUuid: "26c5b011-cd13-4f93-8e04-14020c192430",
      connectorName: "Network-Discovery-Provider",
      certificate: [
         dbCertificates["Lukas Kopenec"],
         dbCertificates["CLIENT1"]
      ],
      attributes: [
         {
            "uuid": "1b6c48ad-c1c7-4c82-91ef-3b61bc9f52ac",
            "name": "ip",
            "label": "IP/Hostname",
            "type": "STRING",
            "content": {
               "value": "www.czertainly.com"
            }
         }
      ],
      meta: {
         "totalUrls": 1,
         "successUrls": 1,
         "failedUrls": 0
      }
   },

   "Discovery3": {
      uuid: "2f8fd761c-5d48-4994-9cc8-a74632e24778",
      name: "CZERTAINLY3",
      kind: "IP-Hostname",
      status: "completed",
      startTime: "2022-01-05T13:55:50.534+00:00",
      endTime: "2022-01-05T13:55:56.712+00:00",
      totalCertificatesDiscovered: 3,
      connectorUuid: "26c5b011-cd13-4f93-8e04-14020c192430",
      connectorName: "Network-Discovery-Provider",
      certificate: [
         dbCertificates["Lukas Kopenec"],
         dbCertificates["CLIENT1"]
      ],
      attributes: [
         {
            "uuid": "1b6c48ad-c1c7-4c82-91ef-3b61bc9f52ac",
            "name": "ip",
            "label": "IP/Hostname",
            "type": "STRING",
            "content": {
               "value": "www.czertainly.com"
            }
         }
      ],
      meta: {
         "totalUrls": 1,
         "successUrls": 1,
         "failedUrls": 0
      }
   }
}