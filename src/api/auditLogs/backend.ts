import { Observable } from 'rxjs';
import { HttpRequestOptions, NamedValues } from 'ts-rest-client';
import { FetchHttpService } from 'ts-rest-client-fetch';

import * as model from './model';

const baseUrl = '/api/v1/auditLogs';


export class AuditLogsBackend implements model.AuditLogsApi {

   private _fetchService: FetchHttpService;


   constructor() {

      this._fetchService = new FetchHttpService();

   }


   getLogs(page: number, size: number, sort?: string, filters?: { [key: string]: string }): Observable<model.PagedAuditLog> {

      const params = new NamedValues({
         page: page.toString(),
         size: size.toString(),
         ...(filters || {}),
      });

      if (sort) params.set('sort', sort);

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
