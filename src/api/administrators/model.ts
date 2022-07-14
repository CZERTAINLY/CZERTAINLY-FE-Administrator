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
      username: string,
      name: string,
      surname: string,
      email: string,
      description: string,
      role: AdministratorRole,
      certificateUuid?: string,
      adminCertificate?: CertificateDTO
   ): Observable<AdministratorDTO>;

   deleteAdmin(uuid: string): Observable<void>;

   getAdminsList(): Observable<AdministratorDTO[]>;

   createAdmin(
      username: string,
      name: string,
      surname: string,
      email: string,
      description: string,
      role: AdministratorRole,
      enabled: boolean,
      certificateUuid?: string,
      adminCertificate?: CertificateDTO
   ): Observable<string>;

   bulkDeleteAdmin(uuids: string[]): Observable<void>;

}
