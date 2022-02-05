import { Observable } from "rxjs";
import { HttpRequestOptions } from "ts-rest-client";
import { FetchHttpService } from "ts-rest-client-fetch";
import * as model from "./model";

const baseUrl = "/api/v1/acmeAccounts";

export class AcmeAccountManagementBackend
  implements model.AcmeAccountManagementApi
{
  constructor() {
    this._fetchService = new FetchHttpService();
  }

  private _fetchService: FetchHttpService;

  getAcmeAccountList(): Observable<model.AcmeAccountListResponse[]> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}`, "GET")
    );
  }

  getAcmeDetails(
    uuid: string | number
  ): Observable<model.AcmeAccountDetailResponse> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}`, "GET")
    );
  }

  deleteAcmeAccount(uuid: string | number): Observable<void> {
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

  bulkDeleteAcmeAccount(uuids: (string | number)[]): Observable<void> {
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
