import { Observable } from "rxjs";
import { HttpRequestOptions } from "ts-rest-client";
import { FetchHttpService } from "ts-rest-client-fetch";
import * as model from "./model";

const baseUrl = "/api/v1/acmeAccounts";

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


   getAcmeAccountDetails(uuid: string | number): Observable<model.AcmeAccountDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "GET")
      );

   }


   revokeAcmeAccount(uuid: string | number): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "DELETE")
      );

   }


   enableAcmeAccount(uuid: string | number): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/enable`, "PUT")
      );

   }


   disableAcmeAccount(uuid: string | number): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/disable`, "PUT")
      );

   }


   bulkRevokeAcmeAccount(uuids: (string | number)[]): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/revoke`, "PUT", uuids)
      );

   }


   bulkEnableAcmeAccount(uuids: (string | number)[]): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/enable`, "PUT", uuids)
      );

   }


   bulkDisableAcmeAccount(uuids: (string | number)[]): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/disable`, "PUT", uuids)
      );

   }


}
