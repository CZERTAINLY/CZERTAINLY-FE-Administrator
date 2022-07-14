import { CertificateDTO } from "api/certificates";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpRequestOptions } from "ts-rest-client";
import { FetchHttpService } from "ts-rest-client-fetch";

import { createNewResource } from "utils/net";
import * as model from "./model";

const baseUrl = "/api/v1/clients";

export class ClientManagementBackend implements model.ClientManagementApi {


   private _fetchService: FetchHttpService;


   constructor() {
      this._fetchService = new FetchHttpService();
   }


   authorizeClient(clientId: string, profileId: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(
            `${baseUrl}/${clientId}/authorize/${profileId}`,
            "PUT"
         )
      );

   }


   createNewClient(name: string, description?: string, enabled?: boolean, certificateUuid?: string, certificate?: CertificateDTO): Observable<string> {

      return createNewResource(baseUrl, {
         name,
         certificate,
         description,
         enabled,
         certificateUuid,
         clientCertificate: certificate
      }).pipe(
         map(

            uuid => {
               if (!uuid) throw new Error("Unexpected response returned from server");
               return uuid;
            }

         )
      );

   }


   enableClient(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/enable`, "PUT")
      );

   }


   disableClient(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/disable`, "PUT")
      );

   }


   bulkEnableClient(uuids: string[]): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/enable`, "PUT", uuids)
      );

   }


   bulkDisableClient(uuids: string[]): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/disable`, "PUT", uuids)
      );

   }


   getClientsList(): Observable<model.ClientDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(baseUrl, "GET")
      );

   }


   getClientDetail(uuid: string): Observable<model.ClientDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "GET")
      );

   }


   getAuthorizedProfiles(uuid: string): Observable<model.AuthorizedRAProfileDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/listauth`, "GET")
      );

   }


   unauthorizeClient(clientId: string, profileId: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${clientId}/unauthorize/${profileId}`, "PUT")
      );

   }


   deleteClient(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "DELETE")
      );

   }


   bulkDeleteClient(uuid: string[]): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}`, "DELETE", uuid)
      );

   }


   updateClient(uuid: string, description?: string, certificateUuid?: string, certificate?: CertificateDTO): Observable<model.ClientDTO> {

      return this._fetchService.request(

         new HttpRequestOptions(
            `${baseUrl}/${uuid}`,
            "POST",
            {
               uuid,
               description,
               certificateUuid,
               clientCertificate: certificate?.certificateContent,
            }
         )

      );


   }

}
