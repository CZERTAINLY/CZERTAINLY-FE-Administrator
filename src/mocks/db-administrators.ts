import { AdministratorDTO } from "api/administrators";
import { dbCertificates } from "./db-certificates";


export interface DbAdministrator extends AdministratorDTO {
};


interface DbAdministrators {
   [key: string]: DbAdministrator;
}


export const dbAdministrators: DbAdministrators = {

   "Lukáš": {
      uuid: "1825af93-cf31-402e-84c6-4988d96096c4",
      username: "Lukáš",
      name: "Lukáš",
      surname: "Kopenec",
      role: "superAdministrator",
      email: "lukas.kopenec@cloudfield.cz",
      serialNumber: "659734db638fc6e550e7891f20c6581488ed7f0d",
      description: "Lukáš je nejlepší",
      certificate: dbCertificates["Lukas Kopenec"],
      enabled: true,
   },

   "Super_Administrator": {
      uuid: "8e911a09-f8ab-45ac-8e8d-133d29c8dbe9",
      username: "Super_Administrator",
      name: "Super",
      surname: "Administrator",
      role: "superAdministrator",
      email: "sadaa@seas.cz",
      serialNumber: "177e75f42e95ecb98f831eb57de27b0bc8c47643",
      description: "Hello",
      certificate: dbCertificates["CLIENT1"],
      enabled: true,
   }

}