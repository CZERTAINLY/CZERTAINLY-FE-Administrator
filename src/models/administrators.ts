export type AdministratorRole = "administrator" | "superAdministrator";

export interface AdministratorModel {

   uuid: string;
   serialNumber: string;
   name: string;
   username: string;
   surname: string;
   email: string;
   role: AdministratorRole;
   description: string;
   //certificate: Certificate;
   enabled: boolean;

}
