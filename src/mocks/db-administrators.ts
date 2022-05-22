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
   },

   "Super_Administrator1": {
      uuid: "8e911a09-f8ab-45ac-8e8d-133d29c8db01",
      username: "Super_Administrator1",
      name: "Super",
      surname: "Administrator",
      role: "superAdministrator",
      email: "sadaa@seas.cz",
      serialNumber: "177e75f42e95ecb98f831eb57de27b0bc8c47643",
      description: "Hello",
      certificate: dbCertificates["CLIENT1"],
      enabled: true,
   },

   "Super_Administrator2": {
      uuid: "8e911a09-f8ab-45ac-8e8d-133d29c8db02",
      username: "Super_Administrator2",
      name: "Super",
      surname: "Administrator",
      role: "superAdministrator",
      email: "sadaa@seas.cz",
      serialNumber: "177e75f42e95ecb98f831eb57de27b0bc8c47643",
      description: "Hello",
      certificate: dbCertificates["CLIENT1"],
      enabled: true,
   },

   "Super_Administrator3": {
      uuid: "8e911a09-f8ab-45ac-8e8d-133d29c8db03",
      username: "Super_Administrator3",
      name: "Super",
      surname: "Administrator",
      role: "superAdministrator",
      email: "sadaa@seas.cz",
      serialNumber: "177e75f42e95ecb98f831eb57de27b0bc8c47643",
      description: "Hello",
      certificate: dbCertificates["CLIENT1"],
      enabled: true,
   },

   "Super_Administrator4": {
      uuid: "8e911a09-f8ab-45ac-8e8d-133d29c8db04",
      username: "Super_Administrator4",
      name: "Super",
      surname: "Administrator",
      role: "superAdministrator",
      email: "sadaa@seas.cz",
      serialNumber: "177e75f42e95ecb98f831eb57de27b0bc8c47643",
      description: "Hello",
      certificate: dbCertificates["CLIENT1"],
      enabled: true,
   },

   "Super_Administrator5": {
      uuid: "8e911a09-f8ab-45ac-8e8d-133d29c8db05",
      username: "Super_Administrator5",
      name: "Super",
      surname: "Administrator",
      role: "superAdministrator",
      email: "sadaa@seas.cz",
      serialNumber: "177e75f42e95ecb98f831eb57de27b0bc8c47643",
      description: "Hello",
      certificate: dbCertificates["CLIENT1"],
      enabled: true,
   },

   "Super_Administrator6": {
      uuid: "8e911a09-f8ab-45ac-8e8d-133d29c8db06",
      username: "Super_Administrator6",
      name: "Super",
      surname: "Administrator",
      role: "superAdministrator",
      email: "sadaa@seas.cz",
      serialNumber: "177e75f42e95ecb98f831eb57de27b0bc8c47643",
      description: "Hello",
      certificate: dbCertificates["CLIENT1"],
      enabled: true,
   },

   "Super_Administrator7": {
      uuid: "8e911a09-f8ab-45ac-8e8d-133d29c8db07",
      username: "Super_Administrator7",
      name: "Super",
      surname: "Administrator",
      role: "superAdministrator",
      email: "sadaa@seas.cz",
      serialNumber: "177e75f42e95ecb98f831eb57de27b0bc8c47643",
      description: "Hello",
      certificate: dbCertificates["CLIENT1"],
      enabled: true,
   },

   "Super_Administrator8": {
      uuid: "8e911a09-f8ab-45ac-8e8d-133d29c8db08",
      username: "Super_Administrator8",
      name: "Super",
      surname: "Administrator",
      role: "superAdministrator",
      email: "sadaa@seas.cz",
      serialNumber: "177e75f42e95ecb98f831eb57de27b0bc8c47643",
      description: "Hello",
      certificate: dbCertificates["CLIENT1"],
      enabled: true,
   },

   "Super_Administrator9": {
      uuid: "8e911a09-f8ab-45ac-8e8d-133d29c8db09",
      username: "Super_Administrator9",
      name: "Super",
      surname: "Administrator",
      role: "superAdministrator",
      email: "sadaa@seas.cz",
      serialNumber: "177e75f42e95ecb98f831eb57de27b0bc8c47643",
      description: "Hello",
      certificate: dbCertificates["CLIENT1"],
      enabled: true,
   },

   "Super_Administrator10": {
      uuid: "8e911a09-f8ab-45ac-8e8d-133d29c8db10",
      username: "Super_Administrator10",
      name: "Super",
      surname: "Administrator",
      role: "superAdministrator",
      email: "sadaa@seas.cz",
      serialNumber: "177e75f42e95ecb98f831eb57de27b0bc8c47643",
      description: "Hello",
      certificate: dbCertificates["CLIENT1"],
      enabled: true,
   },

   "Super_Administrator11": {
      uuid: "8e911a09-f8ab-45ac-8e8d-133d29c8db11",
      username: "Super_Administrator11",
      name: "Super",
      surname: "Administrator",
      role: "superAdministrator",
      email: "sadaa@seas.cz",
      serialNumber: "177e75f42e95ecb98f831eb57de27b0bc8c47643",
      description: "Hello",
      certificate: dbCertificates["CLIENT1"],
      enabled: true,
   },

   "Super_Administrator12": {
      uuid: "8e911a09-f8ab-45ac-8e8d-133d29c8db12",
      username: "Super_Administrator12",
      name: "Super",
      surname: "Administrator",
      role: "superAdministrator",
      email: "sadaa@seas.cz",
      serialNumber: "177e75f42e95ecb98f831eb57de27b0bc8c47643",
      description: "Hello",
      certificate: dbCertificates["CLIENT1"],
      enabled: true,
   },

   "Super_Administrator13": {
      uuid: "8e911a09-f8ab-45ac-8e8d-133d29c8db13",
      username: "Super_Administrator13",
      name: "Super",
      surname: "Administrator",
      role: "superAdministrator",
      email: "sadaa@seas.cz",
      serialNumber: "177e75f42e95ecb98f831eb57de27b0bc8c47643",
      description: "Hello",
      certificate: dbCertificates["CLIENT1"],
      enabled: true,
   },

   "Super_Administrator14": {
      uuid: "8e911a09-f8ab-45ac-8e8d-133d29c8db14",
      username: "Super_Administrator14",
      name: "Super",
      surname: "Administrator",
      role: "superAdministrator",
      email: "sadaa@seas.cz",
      serialNumber: "177e75f42e95ecb98f831eb57de27b0bc8c47643",
      description: "Hello",
      certificate: dbCertificates["CLIENT1"],
      enabled: true,
   },

   "Super_Administrator15": {
      uuid: "8e911a09-f8ab-45ac-8e8d-133d29c8db15",
      username: "Super_Administrator15",
      name: "Super",
      surname: "Administrator",
      role: "superAdministrator",
      email: "sadaa@seas.cz",
      serialNumber: "177e75f42e95ecb98f831eb57de27b0bc8c47643",
      description: "Hello",
      certificate: dbCertificates["CLIENT1"],
      enabled: true,
   },

   "Super_Administrator16": {
      uuid: "8e911a09-f8ab-45ac-8e8d-133d29c8db16",
      username: "Super_Administrator16",
      name: "Super",
      surname: "Administrator",
      role: "superAdministrator",
      email: "sadaa@seas.cz",
      serialNumber: "177e75f42e95ecb98f831eb57de27b0bc8c47643",
      description: "Hello",
      certificate: dbCertificates["CLIENT1"],
      enabled: true,
   },

   "Super_Administrator17": {
      uuid: "8e911a09-f8ab-45ac-8e8d-133d29c8db17",
      username: "Super_Administrator17",
      name: "Super",
      surname: "Administrator",
      role: "superAdministrator",
      email: "sadaa@seas.cz",
      serialNumber: "177e75f42e95ecb98f831eb57de27b0bc8c47643",
      description: "Hello",
      certificate: dbCertificates["CLIENT1"],
      enabled: true,
   },

   "Super_Administrator18": {
      uuid: "8e911a09-f8ab-45ac-8e8d-133d29c8db18",
      username: "Super_Administrator18",
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