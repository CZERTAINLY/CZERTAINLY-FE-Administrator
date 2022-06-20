import { AttributeDTO } from "api/_common/attributeDTO";
import { DeleteObjectErrorDTO } from "api/_common/deleteObjectErrorDTO";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpRequestOptions } from "ts-rest-client";
import { FetchHttpService } from "ts-rest-client-fetch";
// import { attributeSimplifier } from "utils/attributes";

import { createNewResource } from "utils/net";
import * as model from "./model";

const baseUrl = "/api/v1/credentials";


export class CredentialManagementBackend implements model.CredentialManagementApi {

   private _fetchService: FetchHttpService;

   constructor() {
      this._fetchService = new FetchHttpService();
   }


   createNewCredential(name: string, kind: string, connectorUuid: string, attributes: AttributeDTO[]): Observable<string> {

      return createNewResource(baseUrl, {
         name,
         kind,
         connectorUuid,
         attributes: attributes,
      }).pipe(
         map((location) => location?.substr(location.lastIndexOf("/") + 1) || "")
      );

   }


   getCredentialsList(): Observable<model.CredentialDTO[]> {

      return this._fetchService.request(new HttpRequestOptions(baseUrl, "GET"));

   }


   getCredentialDetail(uuid: string): Observable<model.CredentialDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "GET")
      );

   }


   deleteCredential(uuid: string): Observable<DeleteObjectErrorDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "DELETE")
      );

   }


   forceDeleteCredential(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/force`, "DELETE", [uuid])
      );

   }


   bulkDeleteCredentials(uuids: string[]): Observable<DeleteObjectErrorDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}`, "DELETE", uuids)
      );

   }


   bulkForceDeleteCredentials(uuids: string[]): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/force`, "DELETE", uuids)
      );

   }


   updateCredential(uuid: string, attributes: AttributeDTO[]): Observable<model.CredentialDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "POST", {
            uuid,
            attributes: attributes,
         })
      );

   }


   enableCredential(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/enable`, "PUT")
      );

   }


   disableCredential(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/disable`, "PUT")
      );

   }


}
