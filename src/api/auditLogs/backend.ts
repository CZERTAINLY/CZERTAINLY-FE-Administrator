import { Observable } from 'rxjs';

import { FetchHttpService, HttpRequestOptions, NamedValues } from "utils/FetchHttpService";

import * as model from './model';

const baseUrl = '/v1/auditLogs';


export class AuditLogsBackend implements model.AuditLogsApi {

   private _fetchService: FetchHttpService;


   constructor(fetchService: FetchHttpService) {

      this._fetchService = fetchService;

   }


   getLogs(page: number, size: number, filters?: { [key: string]: string }): Observable<model.PagedAuditLog> {

      const params = new NamedValues({
         page: page.toString(),
         size: size.toString(),
         ...(filters || {}),
      });

      return this._fetchService.request
         (new HttpRequestOptions(
            baseUrl,
            'GET',
            undefined,
            undefined,
            params,
         )
         );

   }

   getObjects(): Observable<string[]> {

      return this._fetchService.request(new HttpRequestOptions(`${baseUrl}/objects`, 'GET'));

   }

   getOperations(): Observable<string[]> {

      return this._fetchService.request(new HttpRequestOptions(`${baseUrl}/operations`, 'GET'));

   }

   getStatuses(): Observable<string[]> {

      return this._fetchService.request(new HttpRequestOptions(`${baseUrl}/statuses`, 'GET'));

   }

   purgeLogs(queryString: string): Observable<void> {

      return this._fetchService.request(new HttpRequestOptions(`${baseUrl}/purge?${queryString}`, 'GET'));

   }
}
