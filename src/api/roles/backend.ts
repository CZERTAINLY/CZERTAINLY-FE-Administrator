import { UserDTO } from 'api/users';
import { Observable } from 'rxjs';

import { FetchHttpService, HttpRequestOptions } from "utils/FetchHttpService";

import * as model from './model';

const baseUrl = '/v1/roles';

export class RolesManagementBackend implements model.RolesManagementApi {


   private _fetchService: FetchHttpService;


   constructor(fetchService: FetchHttpService) {

      this._fetchService = fetchService;

   }


   list(): Observable<model.RoleDTO[]> {

      return this._fetchService.request(

         new HttpRequestOptions(
            `${baseUrl}`,
            'GET',
         )

      );

   }


   getDetail(uuid: string): Observable<model.RoleDetailDTO> {

      return this._fetchService.request(

         new HttpRequestOptions(
            `${baseUrl}/${uuid}`,
            'GET',
         )

      );

   }


   create(
      name: string,
      description?: string,
   ): Observable<model.RoleDetailDTO> {

      return this._fetchService.request(

         new HttpRequestOptions(
            `${baseUrl}`,
            'POST',
            {
               name,
               description,
            }
         )

      );

   }


   update(
      uuid: string,
      name: string,
      description?: string,
   ): Observable<model.RoleDetailDTO> {

      return this._fetchService.request(

         new HttpRequestOptions(
            `${baseUrl}/${uuid}`,
            'PUT',
            {
               name,
               description,
            }
         )

      );

   }


   delete(uuid: string): Observable<void> {

      return this._fetchService.request(

         new HttpRequestOptions(
            `${baseUrl}/${uuid}`,
            'DELETE',
         )

      );

   }


   getUsers(uuid: string): Observable<UserDTO[]> {

            return this._fetchService.request(

               new HttpRequestOptions(
                  `${baseUrl}/${uuid}/users`,
                  'GET',
               )

            );

   }


   updateUsers(uuid: string, userUuids: string[]): Observable<model.RoleDetailDTO> {

         return this._fetchService.request(

            new HttpRequestOptions(
               `${baseUrl}/${uuid}/users`,
               'PATCH',
               userUuids
            )

         );

   }


   getPermissions(uuid: string): Observable<model.SubjectPermissionsDTO> {

      return this._fetchService.request(

         new HttpRequestOptions(
            `${baseUrl}/${uuid}/permissions`,
            'GET',
         )

      );

   }


   updatePermissions(uuid: string, permissions: model.SubjectPermissionsDTO): Observable<model.SubjectPermissionsDTO> {

         return this._fetchService.request(

            new HttpRequestOptions(
               `${baseUrl}/${uuid}/permissions`,
               'POST',
               permissions
            )

         );

   }


   getResourcePermissions(uuid: string, resourceName: string): Observable<model.ResourcePermissionsDTO> {

         return this._fetchService.request(

            new HttpRequestOptions(
               `${baseUrl}/${uuid}/permissions/${resourceName}`,
               'GET',
            )

         );

   }


   getResourceObjectsPermissions(uuid: string, resourceName: string): Observable<model.ObjectPermissionsDTO[]> {

         return this._fetchService.request(

            new HttpRequestOptions(
               `${baseUrl}/${uuid}/permissions/${resourceName}/objects`,
               'GET',
            )

         );

   }


   addResourceObjectsPermissions(uuid: string, resourceName: string, objectUuid: string, permissions: model.ObjectPermissionsDTO[]): Observable<void> {

         return this._fetchService.request(

            new HttpRequestOptions(
               `${baseUrl}/${uuid}/permissions/${resourceName}/objects/${objectUuid}`,
               'POST',
               permissions
            )

         );

   }


   updateResourceObjectsPermissions(uuid: string, resourceName: string, objectUuid: string, permissions: model.ObjectPermissionsDTO): Observable<void> {

         return this._fetchService.request(

            new HttpRequestOptions(
               `${baseUrl}/${uuid}/permissions/${resourceName}/objects/${objectUuid}`,
               'PUT',
               permissions
            )

         );

   }


   removeResourceObjectsPermissions(uuid: string, resourceName: string, objectUuid: string): Observable<void> {

         return this._fetchService.request(

            new HttpRequestOptions(
               `${baseUrl}/${uuid}/permissions/${resourceName}/objects/${objectUuid}`,
               'DELETE',
            )

         );

   }


}
