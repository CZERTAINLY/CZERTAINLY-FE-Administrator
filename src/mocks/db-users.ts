import { UserDetailDTO } from "api/users";
import { dbRoles } from "./db-roles";
import { dbCertificates } from "./db-certificates";


export interface DbUser extends UserDetailDTO {
   authorizedProfiles: string[];
};


interface DbUsers {
   [key: string]: DbUser;
}


export const dbUsers: DbUsers = {

   "Admin": {
      uuid: "1825af93-cf31-402e-84c6-4988d96096c4",
      username: "Admin",
      firstName: "Admin",
      lastName: "admin",
      email: "admin@3key.company",
      enabled: true,
      systemUser: true,
      certificate: {
         uuid: dbCertificates["Admin"].uuid,
         fingerprint: dbCertificates["Admin"].fingerprint,
      },
      roles: [
         dbRoles[""]
      ],
      authorizedProfiles: []
   },

   "User": {
      uuid: "1825af93-cf31-402e-84c6-4988d96096c4",
      username: "lkopenec",
      firstName: "Lukas",
      lastName: "Kopenec",
      email: "lukas.kopenec@3key.company",
      enabled: true,
      systemUser: false,
      certificate: {
         uuid: dbCertificates["Lukas Kopenec"].uuid,
         fingerprint: dbCertificates["Lukas Kopenec"].fingerprint,
      },
      roles: [
         {
            uuid: dbRoles["user"].uuid,
            name: dbRoles["user"].name,
            description: dbRoles["user"].description,
            systemRole: dbRoles["user"].systemRole,
         }
      ],
      authorizedProfiles: []
   },

}