import { LocationDTO } from "api/location";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { FetchHttpService, HttpRequestOptions } from "utils/FetchHttpService";
import { createNewResource } from "utils/net";

import * as model from "./model";
import { CertificateEventHistoryDTO } from "./model";

const baseUrl = "/v1/certificates";

export class CertificateInventoryBackend implements model.CertificateInventoryApi {

   private _fetchService: FetchHttpService;


   constructor(fetchService: FetchHttpService) {

      this._fetchService = fetchService;

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


   // All three below operations uses Same API. For the UI sake, it is separated into three different methods.
   updateGroup(uuid: string, groupUuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "PATCH", {
            "groupUuid": groupUuid,
         })
      );

   }



   updateRaProfile(uuid: string, raProfileUuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "PATCH", {
            "raProfileUuid": raProfileUuid,
         })
      );

   }


   updateOwner(uuid: string, owner: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "PATCH", {
            "owner": owner,
         })
      );

   }

   // All three below operations uses Same API. For the UI sake, it is separated into three different methods.

   bulkUpdateGroup(
      certificateIds: string[],
      uuid: string,
      inFilter: any,
      allSelect: boolean
   ): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}`, "PATCH", {
            "groupUuid": uuid,
            certificateUuids: certificateIds,
            filters: allSelect ? inFilter : null,
         })
      );

   }


   bulkUpdateRaProfile(
      certificateIds: string[],
      uuid: string,
      inFilter: any,
      allSelect: boolean
   ): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}`, "PATCH", {
            "raProfileUuid": uuid,
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
         new HttpRequestOptions(`${baseUrl}`, "PATCH", {
            "owner": owner,
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
