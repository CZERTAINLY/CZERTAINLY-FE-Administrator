import { AttributeResponse } from "models/attributes";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpRequestOptions } from "ts-rest-client";
import { FetchHttpService } from "ts-rest-client-fetch";
import { attributeSimplifier } from "utils/attributes";

import { createNewResource } from "utils/net";
import * as model from "./model";

const baseUrl = "/api/v1/acmeProfiles";

export class AcmeProfilesManagementBackend
  implements model.AcmeProfilesManagementApi
{
  constructor() {
    this._fetchService = new FetchHttpService();
  }

  private _fetchService: FetchHttpService;

  createAcmeProfile(
    name: string,
    description: string,
    termsOfServiceUrl: string,
    dnsResolverIp: string,
    dnsResolverPort: string,
    raProfileUuid: string,
    websiteUrl: string,
    retryInterval: number,
    termsOfServiceChangeApproval: boolean,
    validity: number,
    issueCertificateAttributes: AttributeResponse[],
    revokeCertificateAttributes: AttributeResponse[],
    insistContact: boolean,
    insistTermsOfService: boolean,
    changeTermsOfServiceUrl: string
  ): Observable<string> {
    return createNewResource(baseUrl, {
      name,
      description,
      termsOfServiceUrl,
      dnsResolverIp,
      dnsResolverPort,
      raProfileUuid,
      websiteUrl,
      retryInterval,
      termsOfServiceChangeApproval,
      validity,
      issueCertificateAttributes: attributeSimplifier(
        issueCertificateAttributes
      ),
      revokeCertificateAttributes: attributeSimplifier(
        revokeCertificateAttributes
      ),
      insistContact,
      insistTermsOfService,
      changeTermsOfServiceUrl,
    }).pipe(
      map((location) => location?.substr(location.lastIndexOf("/") + 1) || "")
    );
  }

  deleteAcmeProfile(uuid: string | number): Observable<void> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}`, "DELETE")
    );
  }

  enableAcmeProfile(uuid: string | number): Observable<void> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}/enable`, "PUT")
    );
  }

  disableAcmeProfile(uuid: string | number): Observable<void> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}/disable`, "PUT")
    );
  }

  bulkDeleteAcmeProfile(uuid: (string | number)[]): Observable<void> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}`, "DELETE", uuid)
    );
  }

  bulkEnableAcmeProfile(uuid: (string | number)[]): Observable<void> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/enable`, "PUT", uuid)
    );
  }

  bulkDisableAcmeProfile(uuid: (string | number)[]): Observable<void> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/disable`, "PUT", uuid)
    );
  }

  getAcmeProfilesList(): Observable<model.AcmeProfileResponse[]> {
    return this._fetchService.request(new HttpRequestOptions(baseUrl, "GET"));
  }

  getAcmeProfileDetail(
    uuid: string
  ): Observable<model.AcmeProfileDetailResponse> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}`, "GET")
    );
  }

  updateAcmeProfile(
    uuid: string,
    description: string,
    termsOfServiceUrl: string,
    dnsResolverIp: string,
    dnsResolverPort: string,
    raProfileUuid: string,
    websiteUrl: string,
    retryInterval: number,
    termsOfServiceChangeApproval: boolean,
    validity: number,
    issueCertificateAttributes: AttributeResponse[],
    revokeCertificateAttributes: AttributeResponse[],
    insistContact: boolean,
    insistTermsOfService: boolean,
    changeTermsOfServiceUrl: string
  ): Observable<model.AcmeProfileDetailResponse> {
    return this._fetchService.request(
      new HttpRequestOptions(`${baseUrl}/${uuid}`, "PUT", {
        description,
        termsOfServiceUrl,
        dnsResolverIp,
        dnsResolverPort,
        raProfileUuid,
        websiteUrl,
        retryInterval,
        termsOfServiceChangeApproval,
        validity,
        issueCertificateAttributes: attributeSimplifier(
          issueCertificateAttributes
        ),
        revokeCertificateAttributes: attributeSimplifier(
          revokeCertificateAttributes
        ),
        insistContact,
        insistTermsOfService,
        changeTermsOfServiceUrl,
      })
    );
  }
}
