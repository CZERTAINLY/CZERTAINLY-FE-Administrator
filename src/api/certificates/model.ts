import { Observable } from "rxjs";

import { CertificateEvent, CertificateFilterCondition, CertificateFilterField } from "types/certificate";


export interface CertificateRAProfileDTO {
   uuid: string;
   name: string;
   enabled: string;
}


export interface CertificateEntityDTO {
   uuid: string;
   name: string;
   description?: string;
   entityType: "server" | "router" | "HSM" | "switch" | "loadBallancer" | "firewall" | "MDM" | "cloud";
}


export interface CertificateGroupDTO {
   uuid: string;
   name: string;
   description: string;
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
   discoverySource: string;
   cipherSuite: string;
}


export interface CertificateListFilterDTO {
   field: string;
   condition: string;
   value?: any;
}


export interface CertificateValidationResultRecordDTO {
   status: "success" | "failed" | "warning" | "revoked" | "not_checked" | "invalid" | "expiring" | "expired";
}


export interface CertificateValidationResultDTO {
   [key: string]: CertificateValidationResultRecordDTO;
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
   status: "valid" | "revoked" | "expired" | "unknown" | "expiring" | "new" | "invalid";
   fingerprint: string;
   certificateType?: "X509" | "SSH";
   issuerSerialNumber?: string;
   subjectAlternativeNames: CertificateSubjectAlternativeNamesDTO;
   meta?: CertificateMetaDTO;

   certificateValidationResult?: CertificateValidationResultRecordDTO;
   entity?: CertificateEntityDTO;
   group?: CertificateGroupDTO;
   owner?: string;
   raProfile?: CertificateRAProfileDTO;

}


export interface CertificateListDTO {
   certificates: CertificateDTO[];
   itemsPerPage: number;
   pageNumber: number;
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


   getCertificateHistory(uuid: string): Observable<CertificateEventHistoryDTO[]>;


   uploadCertificate(certificate: string): Observable<string>;


   deleteCertificate(uuid: string): Observable<void>;


   updateGroup(uuid: string, groupUuid: string): Observable<void>;


   // updateEntity(uuid: string, entityUuid: string): Observable<void>;


   updateRaProfile(uuid: string, raProfileUuid: string): Observable<void>;


   updateOwner(uuid: string, owner: string): Observable<void>;


   bulkUpdateGroup(
      certificateIds: (string | number)[],
      uuid: string,
      inFilter: any,
      allSelect: boolean
   ): Observable<void>;


   /*
   bulkUpdateEntity(
      certificateIds: (string | number)[],
      uuid: string,
      inFilter: any,
      allSelect: boolean
   ): Observable<void>;
   */


   bulkUpdateRaProfile(
      certificateIds: (string | number)[],
      uuid: string,
      inFilter: any,
      allSelect: boolean
   ): Observable<void>;


   bulkUpdateOwner(
      certificateIds: (string | number)[],
      owner: string,
      inFilter: any,
      allSelect: boolean
   ): Observable<void>;


   bulkDeleteCertificate(
      certificateIds: (string | number)[],
      inFilter: any,
      allSelect: boolean
   ): Observable<CertificateBulkDeleteResultDTO>;


   getAvailableCertificateFilters(): Observable<AvailableCertificateFilterDTO[]>;


}
