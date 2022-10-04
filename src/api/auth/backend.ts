import { Observable } from 'rxjs';

import { FetchHttpService, HttpRequestOptions } from "utils/FetchHttpService";

import * as model from './model';

const baseUrl = '/v1/auth';

export class AuthBackend implements model.AuthApi {

   private _fetchService: FetchHttpService;


   constructor(fetchService: FetchHttpService) {

      this._fetchService = fetchService;

   }


   getProfile(): Observable<model.UserProfileDTO> {

      return this._fetchService.request(

         new HttpRequestOptions(
            `${baseUrl}/profile`,
            'GET',
         )

      );

   }


   updateProfile(name?: string, surname?: string, username?: string, email?: string): Observable<void> {

      return this._fetchService.request(

         new HttpRequestOptions(
            `${baseUrl}/profile`,
            'PUT',
            { name, surname, username, email },
         )

      );

   }

}
