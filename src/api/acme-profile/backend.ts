import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { FetchHttpService, HttpRequestOptions } from "utils/FetchHttpService";
import { createNewResource } from "utils/net";

import { AttributeDTO } from "../_common/attributeDTO";

import * as model from "./model";
import { DeleteObjectErrorDTO } from "api/_common/deleteObjectErrorDTO";

const baseUrl = "/v1/acmeProfiles";

export class AcmeProfilesManagementBackend implements model.AcmeProfilesManagementApi {


   private _fetchService: FetchHttpService;


   constructor(fetchService: FetchHttpService) {
      this._fetchService = fetchService;
   }


   createAcmeProfile(
      name: string,
      issueCertificateAttributes: AttributeDTO[],
      revokeCertificateAttributes: AttributeDTO[],
      description?: string,
      termsOfServiceUrl?: string,
      websiteUrl?: string,
      dnsResolverIp?: string,
      dnsResolverPort?: string,
      raProfileUuid?: string,
      retryInterval?: number,
      validity?: number,
      requireContact?: boolean,
      requireTermsOfService?: boolean,
   ): Observable<string> {

      return createNewResource(baseUrl, {
         name,
         description,
         termsOfServiceUrl,
         dnsResolverIp,
         dnsResolverPort,
         raProfileUuid,
         websiteUrl,
         retryInterval,
         validity,
         issueCertificateAttributes: issueCertificateAttributes,
         revokeCertificateAttributes: revokeCertificateAttributes,
         requireContact,
         requireTermsOfService
      }).pipe(
         map((location) => location?.substr(location.lastIndexOf("/") + 1) || "")
      );

   }


   deleteAcmeProfile(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "DELETE")
      );

   }


   enableAcmeProfile(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/enable`, "PATCH")
      );

   }


   disableAcmeProfile(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/disable`, "PATCH")
      );

   }


   bulkDeleteAcmeProfiles(uuids: string[]): Observable<DeleteObjectErrorDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/delete`, "DELETE", uuids)
      );

   }


   bulkForceDeleteAcmeProfiles(uuids: string[]): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/delete/force`, "DELETE", uuids)
      );

   }


   bulkEnableAcmeProfile(uuids: string[]): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/enable`, "PATCH", uuids)
      );

   }

   bulkDisableAcmeProfile(uuids: string[]): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/disable`, "PATCH", uuids)
      );

   }


   getAcmeProfilesList(): Observable<model.AcmeProfileListItemDTO[]> {

      return this._fetchService.request(new HttpRequestOptions(baseUrl, "GET"));

   }


   getAcmeProfileDetail(uuid: string): Observable<model.AcmeProfileDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "GET")
      );

   }


   updateAcmeProfile(
      uuid: string,
      issueCertificateAttributes: AttributeDTO[],
      revokeCertificateAttributes: AttributeDTO[],
      description?: string,
      termsOfServiceUrl?: string,
      websiteUrl?: string,
      dnsResolverIp?: string,
      dnsResolverPort?: string,
      raProfileUuid?: string,
      retryInterval?: number,
      termsOfServiceChangeDisable?: boolean,
      termsOfServiceChangeUrl?: string,
      validity?: number,
      requireContact?: boolean,
      requireTermsOfService?: boolean,
   ): Observable<model.AcmeProfileDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "PUT", {
            description,
            termsOfServiceUrl,
            dnsResolverIp,
            dnsResolverPort,
            raProfileUuid,
            websiteUrl,
            retryInterval,
            termsOfServiceChangeDisable,
            validity,
            issueCertificateAttributes: issueCertificateAttributes,
            revokeCertificateAttributes: revokeCertificateAttributes,
            requireContact,
            requireTermsOfService,
            termsOfServiceChangeUrl,
         })
      );

   }

   updateRAProfileForAcmeProfile(uuid: string, raProfileUuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/raprofile/${raProfileUuid}`, "PATCH")
      );

   }

}
