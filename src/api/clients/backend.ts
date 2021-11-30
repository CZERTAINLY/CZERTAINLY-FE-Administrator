import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpRequestOptions } from "ts-rest-client";
import { FetchHttpService } from "ts-rest-client-fetch";

import { createNewResource } from "utils/net";
import * as model from "./model";

const baseUrl = "/api/v1/clients";

export class ClientManagementBackend implements model.ClientManagementApi {
  constructor() {
    this._fetchService = new FetchHttpService();
  }

  private _fetchService: FetchHttpService;

  authorizeProfile(clientId: string, profileId: string): Observable<void> {
    return this._fetchService.request(
      new HttpRequestOptions(
        `${baseUrl}/${clientId}/authorize/${profileId}`,
        "PUT"
      )
    );
  }

  createNewClient(
    name: string,
    clientCertificate: string,
    description: string,
    enabled: boolean,
    certificateUuid: string
  ): Observable<string> {
    return createNewResource(baseUrl, {
      name,
      clientCertificate,
      description,
      enabled,
      certificateUuid,
    }).pipe(
      map((location) => location?.substr(location.lastIndexOf("/") + 1) || "")
    );
  }

  enableClient(uuid: string): Observable<void> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}/enable`, "PUT")
    );
  }

  disableClient(uuid: string): Observable<void> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}/disable`, "PUT")
    );
  }

  bulkEnableClient(uuid: string[]): Observable<void> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/enable`, "PUT", uuid)
    );
  }

  bulkDisableClient(uuid: string[]): Observable<void> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/disable`, "PUT", uuid)
    );
  }

  getClientsList(): Observable<model.ClientInfoResponse[]> {
    return this._fetchService.request(new HttpRequestOptions(baseUrl, "GET"));
  }

  getClientDetail(uuid: string): Observable<model.ClientDetailResponse> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}`, "GET")
    );
  }

  getClientAuth(uuid: string): Observable<model.ClientAuthorizationsReponse[]> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}/listauth`, "GET")
    );
  }

  unauthorizeProfile(clientId: string, profileId: string): Observable<void> {
    return this._fetchService.request(
      new HttpRequestOptions(
        `${baseUrl}/${clientId}/unauthorize/${profileId}`,
        "PUT"
      )
    );
  }

  deleteClient(uuid: string): Observable<void> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}`, "DELETE")
    );
  }

  bulkDeleteClient(uuid: string[]): Observable<void> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}`, "DELETE", uuid)
    );
  }

  updateClient(
    uuid: string,
    clientCertificate: string | undefined,
    description: string,
    certificateUuid: string
  ): Observable<model.ClientDetailResponse> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}`, "POST", {
        clientCertificate,
        description,
        certificateUuid,
      })
    );
  }
}
