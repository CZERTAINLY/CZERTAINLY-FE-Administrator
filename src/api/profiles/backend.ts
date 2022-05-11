import { RaAcmeLink } from "models";
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
  getRaAcmeProfile(uuid: string): Observable<RaAcmeLink> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}/acme`, "GET")
    );
  }
  activateAcme(
    uuid: string,
    acmeProfileUuid: string,
    issueCertificateAttributes: AttributeResponse[],
    revokeCertificateAttributes: AttributeResponse[]
  ): Observable<RaAcmeLink> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}/activateAcme`, "POST", {
        acmeProfileUuid,
        issueCertificateAttributes: attributeSimplifier(
          issueCertificateAttributes
        ),
        revokeCertificateAttributes: attributeSimplifier(
          revokeCertificateAttributes
        ),
      })
    );
  }
  deactivateAcme(uuid: string): Observable<void> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}/deactivateAcme`, "POST")
    );
  }

  private _fetchService: FetchHttpService;

  createRaProfile(
    authorityInstanceUuid: string,
    name: string,
    description: string,
    attributes: AttributeResponse[]
  ): Observable<string> {
    return createNewResource(baseUrl, {
      authorityInstanceUuid,
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

  getRaProfilesList(): Observable<model.RaProfileDTO[]> {
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
        `${baseUrlAuthorities}/${authorityUuid}/raProfile/attributes`,
        "GET"
      )
    );
  }

  getAuthorizedClients(
    uuid: string
  ): Observable<model.RaProfileAuthorizationsResponse[]> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}/listclients`, "GET")
    );
  }

  updateRaProfile(
    authorityInstanceUuid: string,
    uuid: string,
    name: string,
    description: string,
    attributes: AttributeResponse[]
  ): Observable<model.RaProfileDetailResponse> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}`, "POST", {
        authorityInstanceUuid,
        description,
        uuid,
        name: name,
        attributes: attributeSimplifier(attributes),
      })
    );
  }

  getIssuanceAttributes(
    raProfileUuid: string
  ): Observable<AttributeResponse[]> {
    return this._fetchService.request(
      new HttpRequestOptions(
        `${baseUrl}/${raProfileUuid}/issue/attributes`,
        "GET"
      )
    );
  }

  getRevocationAttributes(
    raProfileUuid: string
  ): Observable<AttributeResponse[]> {
    return this._fetchService.request(
      new HttpRequestOptions(
        `${baseUrl}/${raProfileUuid}/revoke/attributes`,
        "GET"
      )
    );
  }
}
