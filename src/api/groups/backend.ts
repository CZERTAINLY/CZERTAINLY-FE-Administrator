import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpRequestOptions } from "ts-rest-client";
import { FetchHttpService } from "ts-rest-client-fetch";

import { createNewResource } from "utils/net";
import * as model from "./model";

const baseUrl = "/api/v1/groups";

export class GroupManagementBackend implements model.GroupManagementApi {
  constructor() {
    this._fetchService = new FetchHttpService();
  }

  private _fetchService: FetchHttpService;

  createNewGroup(name: string, description: string): Observable<string> {
    return createNewResource(baseUrl, {
      name,
      description,
    }).pipe(
      map((location) => location?.substr(location.lastIndexOf("/") + 1) || "")
    );
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
      new HttpRequestOptions(`${baseUrl}/${uuid}`, "POST", {
        name,
        description,
      })
    );
  }
}
