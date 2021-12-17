import { ErrorDeleteObject } from "models";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpRequestOptions } from "ts-rest-client";
import { FetchHttpService } from "ts-rest-client-fetch";

import { createNewResource } from "utils/net";
import * as model from "./model";

const baseUrl = "/api/v1/credentials";
const baseUrlCredentialProvider = "/api/v1/connectors";

export class CredentialManagementBackend
  implements model.CredentialManagementApi
{
  constructor() {
    this._fetchService = new FetchHttpService();
  }

  private _fetchService: FetchHttpService;

  createNewCredential(
    name: string,
    credentialType: string,
    connectorUuid: string,
    attributes: any
  ): Observable<string> {
    return createNewResource(baseUrl, {
      name,
      credentialType,
      connectorUuid,
      attributes,
    }).pipe(
      map((location) => location?.substr(location.lastIndexOf("/") + 1) || "")
    );
  }

  getCredentialsList(): Observable<model.CredentialInfoResponse[]> {
    return this._fetchService.request(new HttpRequestOptions(baseUrl, "GET"));
  }

  getCredentialProviderList(): Observable<model.CredentialProviderResponse[]> {
    return this._fetchService.request(
      new HttpRequestOptions(
        `${baseUrlCredentialProvider}?functionGroup=${encodeURIComponent(
          "CREDENTIAL_PROVIDER"
        )}`,
        "GET"
      )
    );
  }

  getCredentialProviderAttributes(
    uuid: string,
    code: string,
    kind: string
  ): Observable<model.CredentialProviderAttributes[]> {
    return this._fetchService.request(
      new HttpRequestOptions(
        `${baseUrlCredentialProvider}/${uuid}/credentialProvider/${kind}/attributes`,
        "GET"
      )
    );
  }

  getCredentialDetail(
    uuid: string
  ): Observable<model.CredentialDetailResponse> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}`, "GET")
    );
  }

  deleteCredential(uuid: number | string): Observable<ErrorDeleteObject[]> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}`, "DELETE")
    );
  }

  forceDeleteCredential(uuid: string | number): Observable<void> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/force`, "DELETE", [uuid])
    );
  }

  bulkDeleteCredential(
    uuid: (number | string)[]
  ): Observable<ErrorDeleteObject[]> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}`, "DELETE", uuid)
    );
  }

  bulkForceDeleteCredential(uuid: (string | number)[]): Observable<void> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/force`, "DELETE", uuid)
    );
  }

  updateCredential(
    uuid: string,
    name: string,
    credentialType: string,
    connectorUuid: number | string,
    attributes: any
  ): Observable<model.CredentialDetailResponse> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}`, "POST", {
        name,
        credentialType,
        connectorUuid,
        attributes,
      })
    );
  }
}
