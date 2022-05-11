import { AttributeDescriptorDTO } from "api/.common/AttributeDTO";
import { RaAcmeLink } from "models";
import { Observable } from "rxjs";

export interface RaProfileDTO {
  uuid: string;
  name: string;
  enabled: boolean;
  description: string;
  authorityInstanceUuid: string;
  authorityInstanceName: string;
  attributes?: AttributeDescriptorDTO[];
  enabledProtocols?: string[];
}

export interface RaProfileAuthorizationsResponse {
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
    attributes: AttributeDescriptorDTO[]
  ): Observable<string>;

  deleteRaProfile(uuid: string | number): Observable<void>;

  enableRaProfile(uuid: string | number): Observable<void>;

  disableRaProfile(uuid: string | number): Observable<void>;

  bulkDeleteRaProfile(uuid: (string | number)[]): Observable<void>;

  bulkEnableRaProfile(uuid: (string | number)[]): Observable<void>;

  bulkDisableRaProfile(uuid: (string | number)[]): Observable<void>;

  getRaProfilesList(): Observable<RaProfileDTO[]>;

  getAttributes(authorityUuid: string): Observable<AttributeDescriptorDTO[]>;

  getRaProfileDetail(uuid: string): Observable<RaProfileDTO>;

  getAuthorizedClients(uuid: string): Observable<RaProfileAuthorizationsResponse[]>;

  updateRaProfile(
    authorityInstanceUuid: string,
    uuid: string,
    name: string,
    description: string,
    attributes: AttributeDescriptorDTO[]
  ): Observable<RaProfileDTO>;

  getIssuanceAttributes(raProfileUuid: string): Observable<AttributeDescriptorDTO[]>;

  getRevocationAttributes(raProfileUuid: string): Observable<AttributeDescriptorDTO[]>;

  getRaAcmeProfile(uuid: string): Observable<RaAcmeLink>;

  activateAcme(
    uuid: string,
    acmeProfileUuid: string,
    issueCertificateAttributes: AttributeDescriptorDTO[],
    revokeCertificateAttributes: AttributeDescriptorDTO[]
  ): Observable<RaAcmeLink>;

  deactivateAcme(uuid: string): Observable<void>;
}
