import { UserDetailDTO } from 'api/users';
import { Observable } from 'rxjs';
import { HttpRequestOptions } from 'ts-rest-client';
import { FetchHttpService } from 'ts-rest-client-fetch';

import * as model from './model';

const baseUrl = '/api/v1/auth';

export class AuthBackend implements model.AuthApi {

   private _fetchService: FetchHttpService;

   constructor() {

      this._fetchService = new FetchHttpService();

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

}
