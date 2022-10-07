import { UserDetailDTO } from 'api/users';
import { Observable } from 'rxjs';

import { FetchHttpService, HttpRequestOptions } from "utils/FetchHttpService";

import * as model from './model';

const baseUrl = '/v1/auth';

export class AuthBackend implements model.AuthApi {

   private _fetchService: FetchHttpService;


   constructor(fetchService: FetchHttpService) {

      this._fetchService = fetchService;

   }


   profile(): Observable<UserDetailDTO> {

      return this._fetchService.request(

         new HttpRequestOptions(
            `${baseUrl}/profile`,
            'GET',
         )

      );

   }


   getAllResources(): Observable<model.ResourceDetailDTO[]> {

      return this._fetchService.request(

         new HttpRequestOptions(
            `${baseUrl}/resources`,
            'GET'
         )

      );

   }


   listObjects(endpoint: string): Observable<{ uuid: string; name: string; }[]> {

      return this._fetchService.request(

         new HttpRequestOptions(
            `${endpoint}`,
            'GET'
         )

      );

   }

}
