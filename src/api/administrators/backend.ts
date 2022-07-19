import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpErrorResponse, HttpRequestOptions } from "ts-rest-client";
import { FetchHttpService } from "ts-rest-client-fetch";

import * as model from "./model";
import { createNewResource } from "utils/net";
import { AdministratorRole } from "./model";
import { CertificateDTO } from "api/certificates";

const baseUrl = "/api/v1/admins";

export class AdministratorsManagementBackend implements model.AdministratorManagementApi {

   private _fetchService: FetchHttpService;

   constructor() {
      this._fetchService = new FetchHttpService();
   }

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
   ): Observable<string> {

      return createNewResource(baseUrl, {
         name,
         surname,
         username,
         email,
         adminCertificate: adminCertificate?.certificateContent,
         description,
         role,
         enabled,
         certificateUuid,
      }).pipe(
         map(
            uuid => {
               if (uuid) return uuid;
               throw new HttpErrorResponse({ status: 0, statusText: "Unexpected server response!" });
            }
         )
      )

   }


   deleteAdmin(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "DELETE")
      );

   }


   disableAdmin(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/disable`, "PUT")
      );

   }


   enableAdmin(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/enable`, "PUT")
      );

   }


   bulkDeleteAdmin(uuid: string[]): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}`, "DELETE", uuid)
      );

   }


   bulkDisableAdmin(uuid: string[]): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/disable`, "PUT", uuid)
      );

   }


   bulkEnableAdmin(uuid: string[]): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/enable`, "PUT", uuid)
      );

   }


   getAdminDetail(uuid: string): Observable<model.AdministratorDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "GET")
      );

   }


   getAdminsList(): Observable<model.AdministratorDTO[]> {

      return this._fetchService.request(new HttpRequestOptions(baseUrl, "GET"));

   }


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
   ): Observable<model.AdministratorDTO> {

      return this._fetchService.request(

         new HttpRequestOptions(`${baseUrl}/${uuid}`, "POST", {
            name,
            surname,
            username,
            email,
            adminCertificate: adminCertificate?.certificateContent,
            description,
            role,
            certificateUuid
         })

      );
   }

}
