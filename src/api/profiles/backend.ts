import { Observable } from "rxjs";

import { FetchHttpService, HttpRequestOptions } from "utils/FetchHttpService";
import { createNewResource } from "utils/net";

import * as model from "./model";
import { AttributeDescriptorDTO, AttributeDTO } from "api/_common/attributeDTO";


const baseUrl = "/v1/raProfiles";
const baseUrlCompliance = "/v1/complianceProfiles";
const extBaseUrl = "/v1/authorities";


export class ProfilesManagementBackend implements model.ProfilesManagementApi {


   private _fetchService: FetchHttpService;


   constructor(fetchService: FetchHttpService) {

      this._fetchService = fetchService;

   }


   getRaAcmeProfile(authorityInstanceUuid: string, uuid: string): Observable<model.RaAcmeLinkDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${extBaseUrl}/${authorityInstanceUuid}/raProfiles/${uuid}/acme`, "GET")
      );

   }


   activateAcme(authorityInstanceUuid: string, uuid: string, acmeProfileUuid: string, issueCertificateAttributes: AttributeDTO[], revokeCertificateAttributes: AttributeDTO[]): Observable<model.RaAcmeLinkDTO> {

      return this._fetchService.request(

         new HttpRequestOptions(`$${extBaseUrl}/${authorityInstanceUuid}/raProfiles/${uuid}/acme/activate/${acmeProfileUuid}`, "PATCH", {
            issueCertificateAttributes: issueCertificateAttributes,
            revokeCertificateAttributes: revokeCertificateAttributes,
         })

      );

   }


   deactivateAcme(authorityInstanceUuid: string, uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${extBaseUrl}/${authorityInstanceUuid}/raProfiles/${uuid}/acme/deactivate`, "PATCH")
      );

   }


   createRaProfile(authorityInstanceUuid: string, name: string, attributes: AttributeDTO[], description?: string, enabled?: boolean): Observable<{ uuid: string }> {

      return createNewResource(
         `${extBaseUrl}/${authorityInstanceUuid}/raProfiles`,
         {
            name: name,
            description,
            attributes: attributes,
         }
      );

   }


   deleteRaProfile(authorityInstanceUuid: string, uuid: string): Observable<void> {

      if (authorityInstanceUuid === "unknown") {

         return this._fetchService.request(
            new HttpRequestOptions(`${baseUrl}/${uuid}`, "DELETE")
         );

      } else {
         return this._fetchService.request(
            new HttpRequestOptions(`${extBaseUrl}/${authorityInstanceUuid}/raProfiles/${uuid}`, "DELETE")
         );
      }

   }


   enableRaProfile(authorityInstanceUuid: string, uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${extBaseUrl}/${authorityInstanceUuid}/raProfiles/${uuid}/enable`, "PATCH")
      );

   }


   disableRaProfile(authorityInstanceUuid: string, uuid: string): Observable<void> {

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
         new HttpRequestOptions(`${baseUrl}/enable`, "PATCH", uuids)
      );

   }


   bulkDisableRaProfile(uuids: string[]): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/disable`, "PATCH", uuids)
      );

   }


   getRaProfilesList(enabled?: boolean): Observable<model.RaProfileDTO[]> {

      return this._fetchService.request(new HttpRequestOptions(baseUrl, "GET"));

   }


   getRaProfileDetail(authorityInstanceUuid: string, uuid: string): Observable<model.RaProfileDTO> {

      if (authorityInstanceUuid === "unknown") {

         return this._fetchService.request(
            new HttpRequestOptions(`${baseUrl}/${uuid}`, "GET")
         );

      } else {

         return this._fetchService.request(
            new HttpRequestOptions(`${extBaseUrl}/${authorityInstanceUuid}/raProfiles/${uuid}`, "GET")
         );

      }

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


   getIssueAttributes(authorityInstanceUuid: string, uuid: string): Observable<AttributeDescriptorDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(
            `${extBaseUrl}/${authorityInstanceUuid}/raProfiles/${uuid}/attributes/issue`,
            "GET"
         )
      );

   }


   getRevocationAttributes(authorityInstanceUuid: string, uuid: string): Observable<AttributeDescriptorDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(
            `${extBaseUrl}/${authorityInstanceUuid}/raProfiles/${uuid}/attributes/revoke`,
            "GET"
         )
      );

   }


   checkCompliance(uuids: string[]): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/compliance`, "POST",
            uuids
         )
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

   getComplianceProfilesForRaProfile(authorityInstanceUuid: string, uuid: string): Observable<model.raComplianceProfileDTO[]> {

         return this._fetchService.request(
            new HttpRequestOptions(`${extBaseUrl}/${authorityInstanceUuid}/raProfiles/${uuid}/complianceProfiles`, "GET")
         );

   }

}
