import { Observable } from 'rxjs';

import { FetchHttpService, HttpRequestOptions } from "utils/FetchHttpService";

import * as model from './model';

const baseUrl = '/v1/roles';

export class RolesBackend implements model.RoleApi {


   private _fetchService: FetchHttpService;


   constructor(fetchService: FetchHttpService) {

      this._fetchService = fetchService;

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
