import { LocationDTO } from "api/location";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpRequestOptions } from "ts-rest-client";
import { FetchHttpService } from "ts-rest-client-fetch";
import { createNewResource } from "utils/net";

import * as model from "./model";
import { CertificateEventHistoryDTO } from "./model";

const baseUrl = "/api/v1/certificate";

export class CertificateInventoryBackend implements model.CertificateInventoryApi {

   private _fetchService: FetchHttpService;

   constructor() {
      this._fetchService = new FetchHttpService();
   }


   getCertificatesList(
      itemsPerPage?: number,
      pageNumber?: number,
      filters?: model.CertificateListFilterDTO[]
   ): Observable<model.CertificateListDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(baseUrl, "POST", {
            itemsPerPage,
            pageNumber,
            filters
         })
      );

   }


   getCertificateDetail(uuid: string): Observable<model.CertificateDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "GET")
      );

   }


   listLocations(uuid: string): Observable<LocationDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/locations`, "GET")
      );


   }


   getCertificateHistory(uuid: string): Observable<CertificateEventHistoryDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/history`, "GET")
      );

   }


   uploadCertificate(certificate: string): Observable<string> {

      return createNewResource(`${baseUrl}/upload`, {
         certificate,
      }).pipe(
         map((location) => location?.substr(location.lastIndexOf("/") + 1) || "")
      );

   }


   deleteCertificate(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "DELETE")
      );

   }


   updateGroup(uuid: string, groupUuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/group`, "PUT", {
            groupUuid,
         })
      );

   }


   /*
   updateEntity(uuid: string, entityUuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/entity`, "PUT", {
            entityUuid,
         })
      );

   }
   */


   updateRaProfile(uuid: string, raProfileUuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/ra-profile`, "PUT", {
            raProfileUuid,
         })
      );

   }


   updateOwner(uuid: string, owner: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/owner`, "PUT", {
            owner,
         })
      );

   }


   bulkUpdateGroup(
      certificateIds: string[],
      uuid: string,
      inFilter: any,
      allSelect: boolean
   ): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/group`, "PUT", {
            uuid,
            certificateUuids: certificateIds,
            filters: allSelect ? inFilter : null,
         })
      );

   }


   /*
   bulkUpdateEntity(
      certificateIds: string[],
      uuid: string,
      inFilter: any,
      allSelect: boolean
   ): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/entity`, "PUT", {
            uuid,
            certificateUuids: certificateIds,
            filters: allSelect ? inFilter : null,
         })
      );

   }
   */


   bulkUpdateRaProfile(
      certificateIds: string[],
      uuid: string,
      inFilter: any,
      allSelect: boolean
   ): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/ra-profile`, "PUT", {
            uuid,
            certificateUuids: certificateIds,
            filters: allSelect ? inFilter : null,
         })
      );

   }


   bulkUpdateOwner(
      certificateIds: string[],
      owner: string,
      inFilter: any,
      allSelect: boolean
   ): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/owner`, "PUT", {
            owner,
            certificateUuids: certificateIds,
            filters: allSelect ? inFilter : null,
         })
      );

   }


   bulkDeleteCertificate(
      certificateIds: string[],
      inFilter: any,
      allSelect: boolean
   ): Observable<model.CertificateBulkDeleteResultDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/delete`, "POST", {
            uuids: certificateIds,
            filters: allSelect ? inFilter : null,
         })
      );

   }


   getAvailableCertificateFilters(): Observable<model.AvailableCertificateFilterDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/search`, "GET")
      );

   }

   checkCompliance(uuids: string[]): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/compliance`, "POST", {
            certificateUuids: uuids
         })
      );

   }

   getCertificateValidationResult(uuid: string): Observable<model.CertificateValidationResultDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/validate`, "GET")
      );

   }



}
