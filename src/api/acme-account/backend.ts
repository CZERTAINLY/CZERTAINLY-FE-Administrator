import { Observable } from "rxjs";
import { HttpRequestOptions } from "ts-rest-client";
import { FetchHttpService } from "ts-rest-client-fetch";
import * as model from "./model";

const baseUrl = "/api/v1/acmeAccounts";
const extBaseUrl = "/api/v1/acmeProfiles";

export class AcmeAccountManagementBackend implements model.AcmeAccountManagementApi {

   private _fetchService: FetchHttpService;


   constructor() {
      this._fetchService = new FetchHttpService();
   }


   getAcmeAccountList(): Observable<model.AcmeAccountListItemDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}`, "GET")
      );

   }


   getAcmeAccountDetails(acmeProfileUuid: string, uuid: string | number): Observable<model.AcmeAccountDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${extBaseUrl}/${acmeProfileUuid}/acmeAccounts/${uuid}`, "GET")
      );

   }


   revokeAcmeAccount(acmeProfileUuid: string, uuid: string | number): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${extBaseUrl}/${acmeProfileUuid}/acmeAccounts/${uuid}`, "POST")
      );

   }


   enableAcmeAccount(acmeProfileUuid: string, uuid: string | number): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${extBaseUrl}/${acmeProfileUuid}/acmeAccounts/${uuid}/enable`, "PATCH")
      );

   }


   disableAcmeAccount(acmeProfileUuid: string, uuid: string | number): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${extBaseUrl}/${acmeProfileUuid}/acmeAccounts/${uuid}/disable`, "PATCH")
      );

   }


   bulkRevokeAcmeAccount(uuids: (string | number)[]): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/revoke`, "PUT", uuids)
      );

   }


   bulkEnableAcmeAccount(uuids: (string | number)[]): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/enable`, "PATCH", uuids)
      );

   }


   bulkDisableAcmeAccount(uuids: (string | number)[]): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/disable`, "PATCH", uuids)
      );

   }


}
