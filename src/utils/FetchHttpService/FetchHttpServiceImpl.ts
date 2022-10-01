import { Observable } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { FetchHttpService as IFetchHttpService } from "./FetchHttpService";

import { HttpErrorResponse, HttpRequestOptions } from "ts-rest-client";
import { switchMap } from "rxjs/operators";



export class FetchHttpServiceImpl implements IFetchHttpService {


   private _baseUrl: string;


   constructor(baseUrl: string) {

      this._baseUrl = baseUrl;

   }


   public request(options: HttpRequestOptions): Observable<any> {

      // --- This should be rewritten instead of using the ts-rest-client library ---

      const opts = new HttpRequestOptions(
         `${this._baseUrl}${options.url}`,
         options.method,
         options.body === null ? undefined : options.body,
         options.headers
      );

      const fetchOpts: RequestInit = {};

      if (options.method) fetchOpts.method = options.method;
      if (options.body) fetchOpts.body = options.getSerializedBody();
      if (options.headers) fetchOpts.headers = new Headers(options.headers.values);

      // --- !!! ---


      return fromFetch(opts.url, fetchOpts).pipe(

         switchMap(

            async (response: Response) => {

               if (response.ok) return await this.getResponseBody(response);

               const error = await this.getResponseBody(response);

               const headers: { [key: string]: string } = {};
               if (response.headers) response.headers.forEach((value, key) => headers[key] = value);

               if (response.status === 401) window.location.href = (window as any).__ENV__.LOGIN_URL;

               throw new HttpErrorResponse({
                  error,
                  headers,
                  status: response.status,
                  statusText: response.statusText,
                  url: response.url
               })

            }

         )

      )

   }


   public async getResponseBody(response: Response): Promise<any> {

      if (response.status === 204) return null;

      const contentType = response.headers.get('Content-Type');

      if (contentType && contentType.includes('application/json')) {
         return response.json();
      }

      return response.text();

   }


}