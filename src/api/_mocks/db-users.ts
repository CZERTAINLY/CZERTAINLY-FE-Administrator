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
      uuid: "b241586e-609a-404e-affe-0e1d3b04aba6",
      username: "Admin",
      firstName: "Admin",
      lastName: "admin",
      email: "admin@3key.company",
      enabled: true,
      systemUser: true,
      certificate: ({
         uuid: undefined, //dbCertificates["CLIENT1"].uuid,
         fingerprint: dbCertificates["CLIENT1"].fingerprint,
      } as any),
      roles: [
         {
            uuid: dbRoles["admin"].uuid,
            name: dbRoles["admin"].name,
            description: dbRoles["admin"].description,
            systemRole: dbRoles["admin"].systemRole,
         }
      ],
      authorizedProfiles: []
   },

   "User": {
      uuid: "652d4186-1a65-4745-a1fd-f486f8df4d95",
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
