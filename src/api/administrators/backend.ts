import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpRequestOptions } from "ts-rest-client";
import { FetchHttpService } from "ts-rest-client-fetch";

import * as model from "./model";
import { createNewResource } from "utils/net";

const baseUrl = "/api/v1/admins";

export class AdministratorsManagementBackend
  implements model.AdministratorManagementApi
{
  constructor() {
    this._fetchService = new FetchHttpService();
  }

  private _fetchService: FetchHttpService;

  createAdmin(
    name: string,
    surname: string,
    username: string,
    email: string,
    adminCertificate: string,
    description: string,
    role: string,
    enabled: boolean,
    certificateUuid: string
  ): Observable<string> {
    return createNewResource(baseUrl, {
      name,
      surname,
      username,
      email,
      adminCertificate,
      description,
      role,
      enabled,
      certificateUuid,
    }).pipe(
      map((location) => location?.substr(location.lastIndexOf("/") + 1) || "")
    );
  }

  deleteAdmin(uuid: string): Observable<void> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}`, "DELETE")
    );
  }

  disableAdmin(uuid: string): Observable<void> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}/disable`, "PUT")
    );
  }

  enableAdmin(uuid: string): Observable<void> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}/enable`, "PUT")
    );
  }

  bulkDeleteAdmin(uuid: string[]): Observable<void> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}`, "DELETE", uuid)
    );
  }

  bulkDisableAdmin(uuid: string[]): Observable<void> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/disable`, "PUT", uuid)
    );
  }

  bulkEnableAdmin(uuid: string[]): Observable<void> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/enable`, "PUT", uuid)
    );
  }

  getAdminDetail(uuid: string): Observable<model.AdminDetailResponse> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}`, "GET")
    );
  }

  getAdminsList(): Observable<model.AdminInfoResponse[]> {
    return this._fetchService.request(new HttpRequestOptions(baseUrl, "GET"));
  }

  updateAdmin(
    uuid: string,
    name: string,
    surname: string,
    username: string,
    email: string,
    adminCertificate: string | undefined,
    description: string,
    role: string,
    certificateUuid: string
  ): Observable<model.AdminDetailResponse> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}`, "POST", {
        name,
        surname,
        username,
        email,
        adminCertificate,
        description,
        role,
        certificateUuid,
      })
    );
  }
}
