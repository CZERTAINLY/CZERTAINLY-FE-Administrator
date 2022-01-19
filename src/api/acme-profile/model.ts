import { RaProfile } from "models";
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
  dnsResolverIp?: string;
  dnsResolverPort?: string;
  raProfile?: RaProfile;
  retryInterval?: number;
  termsOfServiceChangeApproval?: boolean;
  validity?: number;
  directoryUrl: string;
  issueCertificateAttributes?: AttributeResponse[];
  revokeCertificateAttributes?: AttributeResponse[];
  insistContact: boolean;
  insistTermsOfServiceUrl: boolean;
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
    termsOfServiceChangeApproval: boolean,
    validity: number,
    issueCertificateAttributes: AttributeResponse[],
    revokeCertificateAttributes: AttributeResponse[],
    insistContact: boolean,
    insistTermsOfServiceUrl: boolean
  ): Observable<string>;
  deleteAcmeProfile(uuid: string | number): Observable<void>;
  enableAcmeProfile(uuid: string | number): Observable<void>;
  disableAcmeProfile(uuid: string | number): Observable<void>;
  bulkDeleteAcmeProfile(uuid: (string | number)[]): Observable<void>;
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
    termsOfServiceChangeApproval: boolean,
    validity: number,
    issueCertificateAttributes: AttributeResponse[],
    revokeCertificateAttributes: AttributeResponse[],
    insistContact: boolean,
    insistTermsOfServiceUrl: boolean
  ): Observable<AcmeProfileDetailResponse>;
}
