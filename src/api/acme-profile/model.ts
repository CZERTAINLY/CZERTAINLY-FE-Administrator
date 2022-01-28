import { ErrorDeleteObject, RaProfile } from "models";
import { AttributeResponse } from "models/attributes";
import { Observable } from "rxjs";

export interface AcmeProfileResponse {
  uuid: string;
  name: string;
  enabled: boolean;
  description?: string;
  raProfileName?: string;
  raProfileUuid?: string;
  directoryUrl?: string;
}

export interface AcmeProfileDetailResponse {
  uuid: string;
  name: string;
  enabled: boolean;
  description?: string;
  termsOfServiceUrl?: string;
  websiteUrl?: string;
  dnsResolverIp?: string;
  dnsResolverPort?: string;
  raProfile?: RaProfile;
  retryInterval?: number;
  termsOfServiceChangeDisable?: boolean;
  validity?: number;
  directoryUrl: string;
  issueCertificateAttributes?: AttributeResponse[];
  revokeCertificateAttributes?: AttributeResponse[];
  requireContact: boolean;
  requireTermsOfService: boolean;
  termsOfServiceChangeUrl: string;
}

export interface AcmeProfilesManagementApi {
  createAcmeProfile(
    name: string,
    description: string,
    termsOfServiceUrl: string,
    dnsResolverIp: string,
    dnsResolverPort: string,
    raProfileUuid: string,
    websiteUrl: string,
    retryInterval: number,
    termsOfServiceChangeDisable: boolean,
    validity: number,
    issueCertificateAttributes: AttributeResponse[],
    revokeCertificateAttributes: AttributeResponse[],
    requireContact: boolean,
    requireTermsOfService: boolean,
    termsOfServiceChangeUrl: string
  ): Observable<string>;
  deleteAcmeProfile(uuid: string | number): Observable<ErrorDeleteObject[]>;
  enableAcmeProfile(uuid: string | number): Observable<void>;
  disableAcmeProfile(uuid: string | number): Observable<void>;
  bulkDeleteAcmeProfile(
    uuid: (string | number)[]
  ): Observable<ErrorDeleteObject[]>;
  bulkForceDeleteAcmeProfile(uuid: (string | number)[]): Observable<void>;
  bulkEnableAcmeProfile(uuid: (string | number)[]): Observable<void>;
  bulkDisableAcmeProfile(uuid: (string | number)[]): Observable<void>;
  getAcmeProfilesList(): Observable<AcmeProfileResponse[]>;
  getAcmeProfileDetail(uuid: string): Observable<AcmeProfileDetailResponse>;
  updateAcmeProfile(
    uuid: string,
    description: string,
    termsOfServiceUrl: string,
    dnsResolverIp: string,
    dnsResolverPort: string,
    raProfileUuid: string,
    websiteUrl: string,
    retryInterval: number,
    termsOfServiceChangeDisable: boolean,
    validity: number,
    issueCertificateAttributes: AttributeResponse[],
    revokeCertificateAttributes: AttributeResponse[],
    requireContact: boolean,
    requireTermsOfService: boolean,
    termsOfServiceChangeUrl: string
  ): Observable<AcmeProfileDetailResponse>;
}
