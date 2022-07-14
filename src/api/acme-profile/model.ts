import { AttributeDTO } from "api/_common/attributeDTO";
import { Observable } from "rxjs";
import { RaProfileDTO } from "api/profiles";
import { DeleteObjectErrorDTO } from "api/_common/deleteObjectErrorDTO";


export interface AcmeProfileListItemDTO {
   uuid: string;
   name: string;
   enabled: boolean;
   description?: string;
   raProfileName?: string;
   raProfileUuid?: string;
   directoryUrl?: string;
}


export interface AcmeProfileDTO {
   uuid: string;
   name: string;
   enabled: boolean;
   description?: string;
   termsOfServiceUrl?: string;
   websiteUrl?: string;
   dnsResolverIp?: string;
   dnsResolverPort?: string;
   raProfile?: RaProfileDTO;
   retryInterval?: number;
   termsOfServiceChangeDisable?: boolean;
   validity?: number;
   directoryUrl?: string;
   termsOfServiceChangeUrl?: string;
   requireContact?: boolean;
   requireTermsOfService?: boolean;
   issueCertificateAttributes?: AttributeDTO[];
   revokeCertificateAttributes?: AttributeDTO[];
}


export interface AcmeProfilesManagementApi {

   enableAcmeProfile(uuid: string): Observable<void>;

   disableAcmeProfile(uuid: string): Observable<void>;

   getAcmeProfileDetail(uuid: string): Observable<AcmeProfileDTO>;

   updateAcmeProfile(
      uuid: string,
      issueCertificateAttributes: AttributeDTO[],
      revokeCertificateAttributes: AttributeDTO[],
      description?: string,
      termsOfServiceUrl?: string,
      websiteUrl?: string,
      dnsResolverIp?: string,
      dnsResolverPort?: string,
      raProfileUuid?: string,
      retryInterval?: number,
      termsOfServiceChangeDisable?: boolean,
      termsOfServiceChangeUrl?: string,
      validity?: number,
      requireContact?: boolean,
      requireTermsOfService?: boolean,
   ): Observable<AcmeProfileDTO>;

   deleteAcmeProfile(uuid: string): Observable<DeleteObjectErrorDTO[]>;

   bulkEnableAcmeProfile(uuids: string[]): Observable<void>;

   bulkDisableAcmeProfile(uuids: string[]): Observable<void>;

   getAcmeProfilesList(): Observable<AcmeProfileListItemDTO[]>;

   createAcmeProfile(
      name: string,
      issueCertificateAttributes: AttributeDTO[],
      revokeCertificateAttributes: AttributeDTO[],
      description?: string,
      termsOfServiceUrl?: string,
      websiteUrl?: string,
      dnsResolverIp?: string,
      dnsResolverPort?: string,
      raProfileUuid?: string,
      retryInterval?: number,
      validity?: number,
      requireContact?: boolean,
      requireTermsOfService?: boolean,
   ): Observable<string>;


   bulkDeleteAcmeProfiles(uuids: string[]): Observable<DeleteObjectErrorDTO[]>;

   bulkForceDeleteAcmeProfiles(uuids: string[]): Observable<void>;

   deleteRAProfileForAcmeProfile(uuid: string, raProfileUuid: string): Observable<void>;


}
