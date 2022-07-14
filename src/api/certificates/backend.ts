import { Observable } from "rxjs";
import { HttpRequestOptions } from "ts-rest-client";
import { FetchHttpService } from "ts-rest-client-fetch";

import * as model from "./model";

const baseUrl = "/api/v1/certificate";

export class CertificateManagementBackend implements model.CertificateManagementApi {

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
}
