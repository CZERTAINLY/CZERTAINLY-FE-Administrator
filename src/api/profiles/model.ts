import { AttributeDescriptorDTO, AttributeDTO } from "api/_common/attributeDTO";
import { Observable } from "rxjs";


export interface RaProfileDTO {
   uuid: string;
   name: string;
   enabled: boolean;
   description?: string;
   authorityInstanceUuid: string;
   authorityInstanceName: string;
   attributes: AttributeDTO[];
   enabledProtocols?: string[];
   complianceProfiles?: raComplianceProfileDTO[];
}

export interface raComplianceProfileDTO {
   uuid: string;
   name: string;
   description?: string;
}


export interface RaAuthorizedClientDTO {
   uuid: string;
   name: string;
   enabled: boolean;
}


export interface RaAcmeLinkDTO {
   uuid?: string;
   name?: string;
   directoryUrl?: string;
   issueCertificateAttributes?: AttributeDTO[];
   revokeCertificateAttributes?: AttributeDTO[];
   acmeAvailable: boolean;
}


export interface ProfilesManagementApi {

   getRaProfilesList(enabled?: boolean): Observable<RaProfileDTO[]>;

   getRaProfileDetail(authorityInstanceUuid: string, uuid: string): Observable<RaProfileDTO>;

   getAuthorizedClients(authorityInstanceUuid: string, uuid: string): Observable<RaAuthorizedClientDTO[]>;

   getIssueAttributes(authorityInstanceUuid: string, uuid: string): Observable<AttributeDescriptorDTO[]>;

   getRevocationAttributes(authorityInstanceUuid: string, uuid: string): Observable<AttributeDescriptorDTO[]>;

   getRaAcmeProfile(authorityInstanceUuid: string, uuid: string): Observable<RaAcmeLinkDTO>;

   createRaProfile(authorityInstanceUuid: string, name: string, attributes: AttributeDTO[], description?: string, enabled?: boolean): Observable<{ uuid: string}>;

   updateRaProfile(uuid: string, authorityInstanceUuid: string, attributes: AttributeDTO[], enabled?: boolean, description?: string): Observable<RaProfileDTO>;

   deleteRaProfile(authorityInstanceUuid: string, uuid: string): Observable<void>;

   bulkDeleteRaProfile(uuids: string[]): Observable<void>;

   enableRaProfile(authorityInstanceUuid: string, uuid: string): Observable<void>;

   bulkEnableRaProfile(uuids: string[]): Observable<void>;

   disableRaProfile(authorityInstanceUuid: string, uuid: string): Observable<void>;

   bulkDisableRaProfile(uuids: string[]): Observable<void>;

   activateAcme(authorityInstanceUuid: string, uuid: string, acmeProfileUuid: string, issueCertificateAttributes: AttributeDTO[], revokeCertificateAttributes: AttributeDTO[]): Observable<RaAcmeLinkDTO>;

   deactivateAcme(authorityInstanceUuid: string, uuid: string): Observable<void>;

   checkCompliance(uuids: string[]): Observable<void>;

   associateComplianceProfileToRaProfile(uuid: string, raProfileUuids: string[]): Observable<void>;

   dissociateComplianceProfileFromRaProfile(uuid: string, raProfileUuids: string[]): Observable<void>;

   getComplianceProfilesForRaProfile(authorityInstanceUuid: string, uuid: string): Observable<raComplianceProfileDTO[]>;

}
