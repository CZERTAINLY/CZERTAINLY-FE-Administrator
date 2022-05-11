import { CertificateDTO } from "api/certificates";
import { Observable } from "rxjs";

export type AdministratorRole = "administrator" | "superAdministrator";

export interface AdministratorDTO {

   uuid: string;
   name: string;
   username: string;
   certificate: CertificateDTO;
   role: AdministratorRole;
   email: string;
   serialNumber: string;
   description: string;
   enabled: boolean;
   surname: string;

}


export interface AdministratorManagementApi {

   enableAdmin(uuid: string): Observable<void>;

   disableAdmin(uuid: string): Observable<void>;

   bulkEnableAdmin(uuids: string[]): Observable<void>;

   bulkDisableAdmin(uuids: string[]): Observable<void>;

   getAdminDetail(uuid: string): Observable<AdministratorDTO>;

   updateAdmin(
      uuid: string,
      name: string,
      surname: string,
      username: string,
      email: string,
      certificate: string | undefined,
      description: string,
      role: AdministratorRole,
      certificateUuid: string
   ): Observable<AdministratorDTO>;

   deleteAdmin(uuid: string): Observable<void>;

   getAdminsList(): Observable<AdministratorDTO[]>;

   createAdmin(
      name: string,
      surname: string,
      username: string,
      email: string,
      description: string,
      role: AdministratorRole,
      enabled: boolean,
      adminCertificate?: string,
      certificateUuid?: string
   ): Observable<string>;

   bulkDeleteAdmin(uuids: string[]): Observable<void>;

}
