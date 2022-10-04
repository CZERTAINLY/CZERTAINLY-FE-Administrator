import { CertificateDTO } from "api/certificates";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { FetchHttpService, HttpRequestOptions } from "utils/FetchHttpService";
import { createNewResource } from "utils/net";

import * as model from "./model";

const baseUrl = "/v1/clients";

export class ClientManagementBackend implements model.ClientManagementApi {


   private _fetchService: FetchHttpService;


   constructor(fetchService: FetchHttpService) {

      this._fetchService = fetchService;

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
         description,
         enabled,
         certificateUuid: certificateUuid || "",
         clientCertificate: certificate?.certificateContent
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
