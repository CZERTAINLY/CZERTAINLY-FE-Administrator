import { Observable } from 'rxjs';
import { HttpRequestOptions } from 'ts-rest-client';
import { FetchHttpService } from 'ts-rest-client-fetch';

import * as model from './model';

const baseUrl = '/api/v1/roles';

export class RolesBackend implements model.RoleApi {

   private _fetchService: FetchHttpService;

   constructor() {

      this._fetchService = new FetchHttpService();

   }


   listRoles(): Observable<model.RoleDTO[]> {

      return this._fetchService.request(

         new HttpRequestOptions(
            `${baseUrl}`,
            'GET',
         )

      );

   }


}
