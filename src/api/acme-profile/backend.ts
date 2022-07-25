import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { HttpRequestOptions } from "ts-rest-client";
import { FetchHttpService } from "ts-rest-client-fetch";

import { AttributeDTO } from "../_common/attributeDTO";

import { createNewResource } from "utils/net";
import * as model from "./model";
import { DeleteObjectErrorDTO } from "api/_common/deleteObjectErrorDTO";

const baseUrl = "/api/v1/acmeProfiles";

export class AcmeProfilesManagementBackend implements model.AcmeProfilesManagementApi {


   private _fetchService: FetchHttpService;


   constructor() {
      this._fetchService = new FetchHttpService();
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
         new HttpRequestOptions(`${baseUrl}/${uuid}/enable`, "PUT")
      );

   }


   disableAcmeProfile(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/disable`, "PUT")
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
         new HttpRequestOptions(`${baseUrl}/enable`, "PUT", uuids)
      );

   }

   bulkDisableAcmeProfile(uuids: string[]): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/disable`, "PUT", uuids)
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
         new HttpRequestOptions(`${baseUrl}/${uuid}/raprofile/${raProfileUuid}`, "PUT")
      );

   }

}
