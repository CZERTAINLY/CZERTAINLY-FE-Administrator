import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { HttpRequestOptions } from "ts-rest-client";
import { FetchHttpService } from "ts-rest-client-fetch";

import { AttributeDescriptorDTO, AttributeDTO } from "api/_common/attributeDTO";
import { createNewResource } from "utils/net";

import * as model from "./model";

const baseUrl = "/api/v1/raprofiles";

export class ProfilesManagementBackend implements model.ProfilesManagementApi {

   private _fetchService: FetchHttpService;


   constructor() {
      this._fetchService = new FetchHttpService();
   }


   getRaAcmeProfile(uuid: string): Observable<model.RaAcmeLinkDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/acme`, "GET")
      );

   }


   activateAcme(uuid: string, acmeProfileUuid: string, issueCertificateAttributes: AttributeDTO[], revokeCertificateAttributes: AttributeDTO[]): Observable<model.RaAcmeLinkDTO> {

      return this._fetchService.request(

         new HttpRequestOptions(`${baseUrl}/${uuid}/activateAcme`, "POST", {
            acmeProfileUuid,
            issueCertificateAttributes: issueCertificateAttributes,
            revokeCertificateAttributes: revokeCertificateAttributes,
         })

      );

   }


   deactivateAcme(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/deactivateAcme`, "POST")
      );

   }


   createRaProfile(authorityInstanceUuid: string, name: string, attributes: AttributeDTO[], description?: string, enabled?: boolean): Observable<string> {

      return createNewResource(
         baseUrl,
         {
            authorityInstanceUuid,
            name: name,
            description,
            attributes: attributes,
         }
      ).pipe(
         map((location) => location?.substr(location.lastIndexOf("/") + 1) || "")
      );

   }


   deleteRaProfile(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "DELETE")
      );

   }


   enableRaProfile(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/enable`, "PUT")
      );

   }


   disableRaProfile(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/disable`, "PUT")
      );

   }


   bulkDeleteRaProfile(uuids: string[]): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}`, "DELETE", uuids)
      );

   }


   bulkEnableRaProfile(uuids: string[]): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/enable`, "PUT", uuids)
      );

   }


   bulkDisableRaProfile(uuids: string[]): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/disable`, "PUT", uuids)
      );

   }


   getRaProfilesList(enabled?: boolean): Observable<model.RaProfileDTO[]> {

      return this._fetchService.request(new HttpRequestOptions(baseUrl, "GET"));

   }


   getRaProfileDetail(uuid: string): Observable<model.RaProfileDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "GET")
      );

   }


   getAuthorizedClients(uuid: string): Observable<model.RaAuthorizedClientDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/listclients`, "GET")
      );

   }


   updateRaProfile(uuid: string, authorityInstanceUuid: string, attributes: AttributeDTO[], enabled?: boolean, description?: string): Observable<model.RaProfileDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "POST", {
            authorityInstanceUuid,
            description,
            uuid,
            attributes: attributes,
         })
      );

   }


   getIssueAttributes(uuid: string): Observable<AttributeDescriptorDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(
            `${baseUrl}/${uuid}/issue/attributes`,
            "GET"
         )
      );

   }


   getRevocationAttributes(uuid: string): Observable<AttributeDescriptorDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(
            `${baseUrl}/${uuid}/revoke/attributes`,
            "GET"
         )
      );

   }

}
