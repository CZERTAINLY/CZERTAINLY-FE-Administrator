import { Observable } from "rxjs";
import { fromFetch } from "rxjs/fetch";

import { FetchHttpService } from "./FetchHttpService";
import { HttpRequestOptions } from "./HttpRequestOptions";
import { HttpErrorResponse } from "./HttpErrorResponse";

import { switchMap } from "rxjs/operators";


export class FetchHttpServiceImpl implements FetchHttpService {


   private _baseUrl: string;


   constructor(baseUrl: string) {

      this._baseUrl = baseUrl;

   }


   public request(options: HttpRequestOptions): Observable<any> {

      const opts = new HttpRequestOptions(
         `${this._baseUrl}${options.getUrl()}`,
         options.method,
         options.body === null ? undefined : options.body,
         options.headers
      );

      const fetchOpts: RequestInit = {};


      if (options.method) fetchOpts.method = options.method;
      if (options.body) fetchOpts.body = options.getSerializedBody();
      if (options.headers) fetchOpts.headers = new Headers(options.headers.values);


      return fromFetch(opts.url, fetchOpts).pipe(

         switchMap(

            async (response: Response) => {

               if (response.ok) return await this.getResponseBody(response);

               const error = await this.getResponseBody(response);

               const headers: { [key: string]: string } = {};
               if (response.headers) response.headers.forEach((value, key) => headers[key] = value);

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