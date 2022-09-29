import { Observable } from "rxjs";
import { HttpRequestOptions } from "ts-rest-client";
import { FetchHttpService } from "ts-rest-client-fetch";

import * as model from "./model";
import { createNewResource } from "utils/net";
import { CertificateDTO } from "api/certificates";
import { RoleDTO } from "api/roles";


const baseUrl = "/api/v1/users";


export class UsersManagementBackend implements model.UserManagementApi {

   private _fetchService: FetchHttpService;

   constructor() {
      this._fetchService = new FetchHttpService();
   }


   list(): Observable<model.UserDetailDTO[]> {

      return this._fetchService.request(new HttpRequestOptions(baseUrl, "GET"));

   }


   detail(uuid: string): Observable<model.UserDetailDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "GET")
      );

   }


   create(
      username: string,
      firstName: string | undefined,
      lastName: string | undefined,
      email: string | undefined,
      enabled: boolean,
      certificateUuid?: string,
      certificate?: CertificateDTO,
   ): Observable<model.UserDetailDTO> {

      return createNewResource<model.UserDetailDTO>(baseUrl, {
         username,
         firstName,
         lastName,
         email,
         enabled,
         certificateUuid,
         certificate: certificate?.certificateContent
      });

   }


   update(
      uuid: string,
      firstName: string | undefined,
      lastName: string | undefined,
      email: string | undefined,
      enabled: boolean,
      certificateUuid?: string,
      certificate?: CertificateDTO,
   ): Observable<model.UserDetailDTO> {

      return this._fetchService.request(

         new HttpRequestOptions(`${baseUrl}/${uuid}`, "POST", {
            firstName,
            lastName,
            email,
            enabled,
            certificateUuid,
            certificateData: certificate?.certificateContent
         })

      );
   }


   delete(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "DELETE")
      );

   }


   disable(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/disable`, "PUT")
      );

   }


   enable(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/enable`, "PUT")
      );

   }


   getRoles(uuid: string): Observable<RoleDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/roles`, "GET")
      );

   }


   addRole(userUuid: string, roleUuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${userUuid}/roles/${roleUuid}`, "PUT")
      );


   }


   removeRole(userUuid: string, roleUuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${userUuid}/roles/${roleUuid}`, "DELETE")
      );

   }

}
