import { Observable } from "rxjs";
import { HttpRequestOptions } from "ts-rest-client";
import { FetchHttpService } from "ts-rest-client-fetch";

import { AttributeDescriptorDTO, AttributeDTO } from "api/_common/attributeDTO";
import { CertificateRevocationReason } from "types/certificate";

import * as model from "./model";
import { CertificateIssuanceDTO } from "./model";

const baseUrl = "/api/v2/operations/";

export class OperationsBackend implements model.OperationsApi {

   private _fetchService: FetchHttpService;

   constructor() {
      this._fetchService = new FetchHttpService();
   }

   issueCertificate(
      raProfileUuid: string,
      pkcs10: string,
      attributes: AttributeDTO[],
   ): Observable<string> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}${raProfileUuid}/issue`, "POST", {
            pkcs10,
            attributes,
         })
      );

   }


   revokeCertificate(
      uuid: string,
      raProfileUuid: string,
      reason: CertificateRevocationReason,
      attributes: AttributeDTO[]
   ): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(
            `${baseUrl}${raProfileUuid}/${uuid}/revoke`,
            "POST",
            {
               reason,
               attributes,
            }
         )
      );

   }


   renewCertificate(
      uuid: string,
      raProfileUuid: string,
      pkcs10: string,
   ): Observable<CertificateIssuanceDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(
            `${baseUrl}${raProfileUuid}/${uuid}/renew`,
            "POST",
            {
               pkcs10,
            }
         )
      );

   }


   getIssuanceAttributes(raProfileUuid: string): Observable<AttributeDescriptorDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(
            `${baseUrl}${raProfileUuid}/issue/attributes`,
            "GET"
         )
      );

   }


   getRevocationAttributes(raProfileUuid: string): Observable<AttributeDescriptorDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(
            `${baseUrl}${raProfileUuid}/revoke/attributes`,
            "GET"
         )
      );
   }

}