import { RaAcmeLink } from "models";
import { AttributeResponse } from "models/attributes";
import { Observable } from "rxjs";

export interface RaProfileResponse {
  uuid: string;
  name: string;
  enabled: boolean;
  authorityInstanceUuid: string;
  description: string;
  authorityInstanceName: string;
}

export interface RaProfileDetailResponse {
  uuid: string;
  name: string;
  description?: string;
  authorityInstanceUuid: string;
  attributes?: AttributeResponse[];
  enabled: boolean;
  authorityInstanceName: string;
}

export interface RaProfileAuthorizationsReponse {
  uuid: string;
}

export interface EntityProfileResponse {
  id: number;
  name: string;
}

export interface ProfilesManagementApi {
  createRaProfile(
    authorityInstanceUuid: string,
    name: string,
    description: string,
    attributes: AttributeResponse[]
  ): Observable<string>;
  deleteRaProfile(uuid: string | number): Observable<void>;
  enableRaProfile(uuid: string | number): Observable<void>;
  disableRaProfile(uuid: string | number): Observable<void>;
  bulkDeleteRaProfile(uuid: (string | number)[]): Observable<void>;
  bulkEnableRaProfile(uuid: (string | number)[]): Observable<void>;
  bulkDisableRaProfile(uuid: (string | number)[]): Observable<void>;
  getRaProfilesList(): Observable<RaProfileResponse[]>;
  getAttributes(authorityUuid: string): Observable<AttributeResponse[]>;
  getRaProfileDetail(uuid: string): Observable<RaProfileDetailResponse>;
  getAuthorizedClients(
    uuid: string
  ): Observable<RaProfileAuthorizationsReponse[]>;
  updateRaProfile(
    authorityInstanceUuid: string,
    uuid: string,
    name: string,
    description: string,
    attributes: AttributeResponse[]
  ): Observable<RaProfileDetailResponse>;
  getIssuanceAttributes(raProfileUuid: string): Observable<AttributeResponse[]>;
  getRevocationAttributes(
    raProfileUuid: string
  ): Observable<AttributeResponse[]>;
  getRaAcmeProfile(uuid: string): Observable<RaAcmeLink>;
  activateAcme(
    uuid: string,
    acmeProfileUuid: string,
    issueCertificateAttributes: AttributeResponse[],
    revokeCertificateAttributes: AttributeResponse[]
  ): Observable<RaAcmeLink>;
  deactivateAcme(uuid: string): Observable<void>;
}
