import { AttributeResponse } from "models/attributes";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpRequestOptions } from "ts-rest-client";
import { FetchHttpService } from "ts-rest-client-fetch";
import { attributeSimplifier } from "utils/attributes";

import { createNewResource } from "utils/net";
import * as model from "./model";

const baseUrl = "/api/v1/raprofiles";
const baseUrlAuthorities = "/api/v1/authorities";

export class ProfilesManagementBackend implements model.ProfilesManagementApi {
  constructor() {
    this._fetchService = new FetchHttpService();
  }

  private _fetchService: FetchHttpService;

  createRaProfile(
    caInstanceUuid: string,
    name: string,
    description: string,
    attributes: AttributeResponse[]
  ): Observable<string> {
    return createNewResource(baseUrl, {
      caInstanceUuid,
      name: name,
      description,
      attributes: attributeSimplifier(attributes),
    }).pipe(
      map((location) => location?.substr(location.lastIndexOf("/") + 1) || "")
    );
  }

  deleteRaProfile(uuid: string | number): Observable<void> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}`, "DELETE")
    );
  }

  enableRaProfile(uuid: string | number): Observable<void> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}/enable`, "PUT")
    );
  }

  disableRaProfile(uuid: string | number): Observable<void> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}/disable`, "PUT")
    );
  }

  bulkDeleteRaProfile(uuid: (string | number)[]): Observable<void> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}`, "DELETE", uuid)
    );
  }

  bulkEnableRaProfile(uuid: (string | number)[]): Observable<void> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/enable`, "PUT", uuid)
    );
  }

  bulkDisableRaProfile(uuid: (string | number)[]): Observable<void> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/disable`, "PUT", uuid)
    );
  }

  getRaProfilesList(): Observable<model.RaProfileResponse[]> {
    return this._fetchService.request(new HttpRequestOptions(baseUrl, "GET"));
  }

  getRaProfileDetail(uuid: string): Observable<model.RaProfileDetailResponse> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}`, "GET")
    );
  }

  getAttributes(authorityUuid: string): Observable<AttributeResponse[]> {
    return this._fetchService.request(
      new HttpRequestOptions(
        `${baseUrlAuthorities}/${authorityUuid}/raProfiles/attributes`,
        "GET"
      )
    );
  }

  getAuthorizedClients(
    uuid: string
  ): Observable<model.RaProfileAuthorizationsReponse[]> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}/listclients`, "GET")
    );
  }

  updateRaProfile(
    caInstanceUuid: string,
    uuid: string,
    name: string,
    description: string,
    attributes: AttributeResponse[]
  ): Observable<model.RaProfileDetailResponse> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}`, "POST", {
        caInstanceUuid,
        description,
        uuid,
        name: name,
        attributes: attributeSimplifier(attributes),
      })
    );
  }
}
