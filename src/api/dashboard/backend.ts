import { Observable } from "rxjs";
import { HttpRequestOptions } from "ts-rest-client";
import { FetchHttpService } from "ts-rest-client-fetch";
import * as model from "./model";

const baseUrl = "/api/v1/statistics";

export class DashboardManagementBackend
  implements model.DashboardManagementApi
{
  constructor() {
    this._fetchService = new FetchHttpService();
  }

  private _fetchService: FetchHttpService;

  getDashboardData(): Observable<model.DashboardDTO> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}`, "GET")
    );
  }
}
