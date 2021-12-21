import { ErrorDeleteObject } from "models";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpRequestOptions } from "ts-rest-client";
import { FetchHttpService } from "ts-rest-client-fetch";
import { attributeSimplifier } from "utils/attributes";

import { createNewResource } from "utils/net";
import * as model from "./model";

const baseUrl = "/api/v1/authorities";
const baseUrlAuthorityProvider = "/api/v1/connectors";

export class AuthorityManagementBackend
  implements model.AuthorityManagementApi
{
  constructor() {
    this._fetchService = new FetchHttpService();
  }

  private _fetchService: FetchHttpService;

  createNewAuthority(
    name: string,
    connectorUuid: string,
    credential: any,
    status: string,
    attributes: any,
    authorityType: string
  ): Observable<string> {
    return createNewResource(baseUrl, {
      name,
      connectorUuid,
      status,
      attributes: attributeSimplifier(attributes),
      authorityType,
    }).pipe(
      map((location) => location?.substr(location.lastIndexOf("/") + 1) || "")
    );
  }

  getAuthoritiesList(): Observable<model.AuthorityInfoResponse[]> {
    return this._fetchService.request(new HttpRequestOptions(baseUrl, "GET"));
  }

  getAuthorityProviderList(): Observable<model.AuthorityProviderResponse[]> {
    return this._fetchService.request(
      new HttpRequestOptions(
        `${baseUrlAuthorityProvider}?functionGroup=${encodeURIComponent(
          "AUTHORITY_PROVIDER"
        )}`,
        "GET"
      )
    );
  }

  getAuthorityProviderAttributes(
    uuid: string,
    kind: string,
    functionGroup: string
  ): Observable<model.AuthorityProviderAttributes[]> {
    return this._fetchService.request(
      new HttpRequestOptions(
        `${baseUrlAuthorityProvider}/${uuid}/${functionGroup}/${kind}/attributes`,
        "GET"
      )
    );
  }

  getAuthorityDetail(uuid: string): Observable<model.AuthorityDetailResponse> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}`, "GET")
    );
  }

  deleteBulkAuthority(
    uuid: (number | string)[]
  ): Observable<ErrorDeleteObject[]> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}`, "DELETE", uuid)
    );
  }

  deleteAuthority(uuid: number | string): Observable<ErrorDeleteObject[]> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}`, "DELETE")
    );
  }

  forceDeleteAuthority(uuid: number | string): Observable<void> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/force`, "DELETE", [uuid])
    );
  }

  bulkForceDeleteAuthority(uuid: (number | string)[]): Observable<void> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/force`, "DELETE", uuid)
    );
  }

  updateAuthority(
    uuid: string,
    name: string,
    connectorUuid: string,
    credential: any,
    status: string,
    attributes: any,
    authorityType: string
  ): Observable<model.AuthorityDetailResponse> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}`, "POST", {
        uuid,
        name,
        connectorUuid,
        credential,
        status,
        attributes: attributeSimplifier(attributes),
        authorityType,
      })
    );
  }
}
