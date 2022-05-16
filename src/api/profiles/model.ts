import { AttributeDescriptorDTO, AttributeDTO } from "api/.common/AttributeDTO";
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

   getRaProfileDetail(uuid: string): Observable<RaProfileDTO>;

   getAuthorizedClients(uuid: string): Observable<RaAuthorizedClientDTO[]>;

   getIssueAttributes(uuid: string): Observable<AttributeDescriptorDTO[]>;

   getRevocationAttributes(uuid: string): Observable<AttributeDescriptorDTO[]>;

   getRaAcmeProfile(uuid: string): Observable<RaAcmeLinkDTO>;

   createRaProfile(authorityInstanceUuid: string, name: string, attributes: AttributeDTO[], description?: string, enabled?: boolean): Observable<string>;

   updateRaProfile(uuid: string, authorityInstanceUuid: string, attributes: AttributeDTO[], enabled?: boolean, description?: string): Observable<RaProfileDTO>;

   deleteRaProfile(uuid: string): Observable<void>;

   bulkDeleteRaProfile(uuids: string[]): Observable<void>;

   enableRaProfile(uuid: string): Observable<void>;

   bulkEnableRaProfile(uuids: string[]): Observable<void>;

   disableRaProfile(uuid: string): Observable<void>;

   bulkDisableRaProfile(uuids: string[]): Observable<void>;

   activateAcme(uuid: string, acmeProfileUuid: string, issueCertificateAttributes: AttributeDTO[], revokeCertificateAttributes: AttributeDTO[]): Observable<RaAcmeLinkDTO>;

   deactivateAcme(uuid: string): Observable<void>;

}
