import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpRequestOptions } from "ts-rest-client";
import { FetchHttpService } from "ts-rest-client-fetch";

import * as model from "./model";
import { createNewResource } from "utils/net";
import { AdministratorRole } from "./model";

const baseUrl = "/api/v1/admins";

export class AdministratorsManagementBackend implements model.AdministratorManagementApi {

   private _fetchService: FetchHttpService;

   constructor() {
      this._fetchService = new FetchHttpService();
   }

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
   ): Observable<string> {

      return createNewResource(baseUrl, {
         name,
         surname,
         username,
         email,
         adminCertificate,
         description,
         role,
         enabled,
         certificateUuid,
      }).pipe(
         map((location) => location?.substr(location.lastIndexOf("/") + 1) || "")
      );

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
      name: string,
      surname: string,
      username: string,
      email: string,
      adminCertificate: string | undefined,
      description: string,
      role: string,
      certificateUuid: string
   ): Observable<model.AdministratorDTO> {

      return this._fetchService.request(

         new HttpRequestOptions(`${baseUrl}/${uuid}`, "POST", {
            name,
            surname,
            username,
            email,
            adminCertificate,
            description,
            role,
            certificateUuid,
         })

      );
   }

}
