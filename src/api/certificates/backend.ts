import { CertificateDetailResponse } from "models";
import { Observable } from "rxjs";
import { HttpRequestOptions } from "ts-rest-client";
import { FetchHttpService } from "ts-rest-client-fetch";
import * as model from "./model";

const baseUrl = "/api/v1/certificate";

export class CertificateManagementBackend
  implements model.CertificateManagementApi
{
  constructor() {
    this._fetchService = new FetchHttpService();
  }

  private _fetchService: FetchHttpService;

  getCertificatesList(): Observable<CertificateDetailResponse[]> {
    return this._fetchService.request(new HttpRequestOptions(baseUrl, "GET"));
  }

  getCertificateDetail(uuid: string): Observable<CertificateDetailResponse> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}`, "GET")
    );
  }
}
