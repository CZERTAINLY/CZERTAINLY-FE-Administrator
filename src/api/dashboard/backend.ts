import { Observable } from "rxjs";

import { FetchHttpService, HttpRequestOptions } from "utils/FetchHttpService";

import * as model from "./model";

const baseUrl = "/v1/statistics";

export class DashboardManagementBackend implements model.DashboardManagementApi {

   private _fetchService: FetchHttpService;


   constructor(fetchService: FetchHttpService) {

      this._fetchService = fetchService;

   }


   getDashboardData(): Observable<model.DashboardDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}`, "GET")
      );

   }

}
