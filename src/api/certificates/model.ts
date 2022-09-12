import { GroupDTO } from "api/groups";
import { LocationDTO } from "api/location";
import { AttributeDTO } from "api/_common/attributeDTO";
import { Observable } from "rxjs";

import { CertificateEvent, CertificateFilterCondition, CertificateFilterField, Status, ValidationStatus } from "types/certificate";


export interface CertificateRAProfileDTO {
   uuid: string;
   name: string;
   enabled: boolean;
}


export interface CertificateEntityDTO {
   uuid: string;
   name: string;
   description?: string;
   entityType: "server" | "router" | "HSM" | "switch" | "loadBalancer" | "firewall" | "MDM" | "cloud";
}


export interface CertificateEventHistoryDTO {
   uuid: string;
   certificateUuid: string;
   created: string;
   createdBy: string;
   event: CertificateEvent;
   status: "SUCCESS" | "FAILED";
   message: string;
   additionalInformation: { [ property: string ]: any };
}


export interface CertificateBulkDeleteResultDTO {
   status: "SUCCESS" | "FAILED" | "PARTIAL";
   failedItems: number;
   message: string;
}


export interface AvailableCertificateFilterDTO {
   field: CertificateFilterField;
   label: string;
   type: "string" | "number" | "list" | "date";
   conditions: CertificateFilterCondition[];
   value?: string;
   multiValue?: boolean;
}


export interface CertificateSubjectAlternativeNamesDTO {

   [key: string]: any[];

   registeredID: any[];
   ediPartyName: any[];
   iPAddress: string[];
   x400Address: any[];
   rfc822Name: any[];
   otherName: any[];
   dNSName: string[];
   directoryName: any[];
   uniformResourceIdentifier: string[];

}


export interface CertificateMetaDTO {
   [key: string]: string;
}


export interface CertificateListFilterDTO {
   field: string;
   condition: string;
   value?: any;
}

 export interface ValidationResult {
   status: ValidationStatus;
   message: string;
 }

export interface CertificateValidationResultDTO {
   [key: string]: ValidationResult;
}


export interface CertificateDTO {

   uuid: string;
   commonName: string;
   serialNumber: string;
   issuerCommonName: string;
   certificateContent: string;
   issuerDn: string;
   subjectDn: string;
   notBefore: string;
   notAfter: string;
   publicKeyAlgorithm: string;
   signatureAlgorithm: string;
   keySize: number;
   keyUsage: string[];
   extendedKeyUsage?: string[];
   basicConstraints: string;
   status: Status;
   fingerprint: string;
   certificateType?: "X509" | "SSH";
   issuerSerialNumber?: string;
   subjectAlternativeNames: CertificateSubjectAlternativeNamesDTO;
   meta?: CertificateMetaDTO;
   certificateValidationResult?: CertificateValidationResultDTO;
   entity?: CertificateEntityDTO;
   group?: GroupDTO;
   owner?: string;
   raProfile?: CertificateRAProfileDTO;
   complianceStatus?: "na" | "ok" | "nok";
   nonCompliantRules?: NonCompliantRuleDTO[]
}

export interface NonCompliantRuleDTO {
   connectorName: string;
   ruleName: string;
   ruleDescription: string;
   status: "na" | "ok" | "nok";
   attributes?: AttributeDTO[];
}


export interface CertificateListDTO {
   certificates: CertificateDTO[];
   totalPages: number;
   totalItems: number;
}


export interface CertificateInventoryApi {


   getCertificatesList(
      itemsPerPage?: number,
      pageNumber?: number,
      filters?: CertificateListFilterDTO[]
   ): Observable<CertificateListDTO>;


   getCertificateDetail(uuid: string): Observable<CertificateDTO>;


   listLocations(uuid: string): Observable<LocationDTO[]>;


   getCertificateHistory(uuid: string): Observable<CertificateEventHistoryDTO[]>;


   uploadCertificate(certificate: string): Observable<string>;


   deleteCertificate(uuid: string): Observable<void>;


   updateGroup(uuid: string, groupUuid: string): Observable<void>;


   // updateEntity(uuid: string, entityUuid: string): Observable<void>;


   updateRaProfile(uuid: string, raProfileUuid: string): Observable<void>;


   updateOwner(uuid: string, owner: string): Observable<void>;


   bulkUpdateGroup(
      uuids: string[],
      groupUuid: string,
      inFilter: any,
      allSelect: boolean
   ): Observable<void>;


   /*
   bulkUpdateEntity(
      certificateIds: (string)[],
      uuid: string,
      inFilter: any,
      allSelect: boolean
   ): Observable<void>;
   */


   bulkUpdateRaProfile(
      uuids: string[],
      profileUuid: string,
      inFilter: any,
      allSelect: boolean
   ): Observable<void>;


   bulkUpdateOwner(
      uuids: string[],
      owner: string,
      inFilter: any,
      allSelect: boolean
   ): Observable<void>;


   bulkDeleteCertificate(
      uuids: string[],
      inFilter: any,
      allSelect: boolean
   ): Observable<CertificateBulkDeleteResultDTO>;


   getAvailableCertificateFilters(): Observable<AvailableCertificateFilterDTO[]>;

   checkCompliance(uuids: string[]): Observable<void>;


}
