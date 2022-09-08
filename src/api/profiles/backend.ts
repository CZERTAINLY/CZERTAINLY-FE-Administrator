import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { HttpRequestOptions } from "ts-rest-client";
import { FetchHttpService } from "ts-rest-client-fetch";

import { AttributeDescriptorDTO, AttributeDTO } from "api/_common/attributeDTO";
import { createNewResource } from "utils/net";

import * as model from "./model";

const baseUrl = "/api/v1/raProfiles";
const baseUrlCompliance = "/api/v1/complianceProfiles";
const extBaseUrl = "/api/v1/authorities";

export class ProfilesManagementBackend implements model.ProfilesManagementApi {

   private _fetchService: FetchHttpService;


   constructor() {
      this._fetchService = new FetchHttpService();
   }


   getRaAcmeProfile(authorityInstanceUuid: string, uuid: string): Observable<model.RaAcmeLinkDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${extBaseUrl}/${authorityInstanceUuid}/raProfiles/${uuid}/acme`, "GET")
      );

   }


   activateAcme(authorityInstanceUuid: string ,uuid: string, acmeProfileUuid: string, issueCertificateAttributes: AttributeDTO[], revokeCertificateAttributes: AttributeDTO[]): Observable<model.RaAcmeLinkDTO> {

      return this._fetchService.request(

         new HttpRequestOptions(`$${extBaseUrl}/${authorityInstanceUuid}/raProfiles/${uuid}/acme/activate/${acmeProfileUuid}`, "PATCH", {
            issueCertificateAttributes: issueCertificateAttributes,
            revokeCertificateAttributes: revokeCertificateAttributes,
         })

      );

   }


   deactivateAcme(authorityInstanceUuid: string ,uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${extBaseUrl}/${authorityInstanceUuid}/raProfiles/${uuid}/acme/deactivate`, "PATCH")
      );

   }


   createRaProfile(authorityInstanceUuid: string, name: string, attributes: AttributeDTO[], description?: string, enabled?: boolean): Observable<string> {

      return createNewResource(
         baseUrl,
         {
            name: name,
            description,
            attributes: attributes,
         }
      ).pipe(
         map((location) => location?.substr(location.lastIndexOf(`/${authorityInstanceUuid}`) + 1) || "")
      );

   }


   deleteRaProfile(authorityInstanceUuid:string, uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${extBaseUrl}/${authorityInstanceUuid}/raProfiles/${uuid}`, "DELETE")
      );

   }


   enableRaProfile(authorityInstanceUuid: string ,uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${extBaseUrl}/${authorityInstanceUuid}/raProfiles/${uuid}/enable`, "PATCH")
      );

   }


   disableRaProfile(authorityInstanceUuid: string ,uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${extBaseUrl}/${authorityInstanceUuid}/raProfiles/${uuid}/disable`, "PATCH")
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


   getRaProfileDetail(authorityInstanceUuid: string, uuid: string): Observable<model.RaProfileDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${extBaseUrl}/${authorityInstanceUuid}/raProfiles/${uuid}`, "GET")
      );

   }


   getAuthorizedClients(uuid: string): Observable<model.RaAuthorizedClientDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/users`, "GET")
      );

   }


   updateRaProfile(uuid: string, authorityInstanceUuid: string, attributes: AttributeDTO[], enabled?: boolean, description?: string): Observable<model.RaProfileDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${extBaseUrl}/${authorityInstanceUuid}/raProfiles/${uuid}`, "PUT", {
            description,
            uuid,
            attributes: attributes,
         })
      );

   }


   getIssueAttributes(authorityInstanceUuid: string ,uuid: string): Observable<AttributeDescriptorDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(
            `${extBaseUrl}/${authorityInstanceUuid}/raProfiles/${uuid}/attributes/issue`,
            "GET"
         )
      );

   }


   getRevocationAttributes(authorityInstanceUuid: string ,uuid: string): Observable<AttributeDescriptorDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(
            `${extBaseUrl}/${authorityInstanceUuid}/raProfiles/${uuid}/attributes/revoke`,
            "GET"
         )
      );

   }


   checkCompliance(uuids: string[]): Observable<void> {
      
      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/compliance`, "POST", {
            raProfileUuids: uuids
         })
      );

   }

   associateComplianceProfileToRaProfile(uuid: string, raProfileUuids: string[]): Observable<void> {
      return this._fetchService.request(
         
         new HttpRequestOptions(`${baseUrlCompliance}/${uuid}/raprofile/associate`, "PATCH", {
            raProfileUuids: raProfileUuids
         })
         
      );
   }

   dissociateComplianceProfileFromRaProfile(uuid: string, raProfileUuids: string[]): Observable<void> {
      return this._fetchService.request(
         
         new HttpRequestOptions(`${baseUrlCompliance}/${uuid}/raprofile/disassociate`, "PATCH", {
            raProfileUuids: raProfileUuids
         })
         
      );
   }

}
