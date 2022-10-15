import { Observable } from "rxjs";

import { FetchHttpService, HttpRequestOptions } from "utils/FetchHttpService";
import { createNewResource } from "utils/net";

import * as model from "./model";

const baseUrl = "/v1/certificateGroups";

export class GroupManagementBackend implements model.GroupManagementApi {

   private _fetchService: FetchHttpService;


   constructor(fetchService: FetchHttpService) {

      this._fetchService = fetchService;

   }


   createNewGroup(name: string, description: string): Observable<{ uuid: string}> {

      return createNewResource(baseUrl, {
         name,
         description,
      });

   }


   getGroupsList(): Observable<model.GroupDTO[]> {

      return this._fetchService.request(new HttpRequestOptions(baseUrl, "GET"));

   }


   getGroupDetail(uuid: string): Observable<model.GroupDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "GET")
      );

   }


   deleteGroup(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "DELETE")
      );

   }


   bulkDeleteGroup(uuid: string[]): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}`, "DELETE", uuid)
      );

   }


   updateGroup(
      uuid: string,
      name: string,
      description: string
   ): Observable<model.GroupDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "PUT", {
            name,
            description,
         })
      );

   }

}
