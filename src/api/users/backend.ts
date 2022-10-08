import { Observable } from "rxjs";

import { FetchHttpService, HttpRequestOptions } from "utils/FetchHttpService";
import { createNewResource } from "utils/net";

import * as model from "./model";
import { CertificateDTO } from "api/certificates";
import { RoleDTO } from "api/roles";


const baseUrl = "/v1/users";


export class UserManagementBackend implements model.UserManagementApi {

   private _fetchService: FetchHttpService;


   constructor(fetchService: FetchHttpService) {

      this._fetchService = fetchService;

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
      certificateUuid?: string,
      certificate?: CertificateDTO,
   ): Observable<model.UserDetailDTO> {

      return this._fetchService.request(

         new HttpRequestOptions(`${baseUrl}/${uuid}`, "PUT", {
            firstName,
            lastName,
            email,
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
         new HttpRequestOptions(`${baseUrl}/${uuid}/disable`, "PATCH")
      );

   }


   enable(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/enable`, "PATCH")
      );

   }


   getRoles(uuid: string): Observable<RoleDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/roles`, "GET")
      );

   }


   updateRoles(userUuid: string, rolesUuids: string[]): Observable<model.UserDetailDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${userUuid}/roles`, "PATCH", rolesUuids)
      );

   }


   addRole(userUuid: string, roleUuid: string): Observable<model.UserDetailDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${userUuid}/roles/${roleUuid}`, "PUT")
      );


   }


   removeRole(userUuid: string, roleUuid: string): Observable<model.UserDetailDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${userUuid}/roles/${roleUuid}`, "DELETE")
      );

   }

}
