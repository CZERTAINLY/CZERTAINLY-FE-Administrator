import { GroupDTO } from "api/groups";
import { LocationDTO } from "api/location";
import { AttributeDTO } from "api/_common/attributeDTO";
import { Observable } from "rxjs";

import { CertificateEvent, CertificateFilterCondition, CertificateFilterField, Status, ValidationStatus } from "types/certificate";


export interface CertificateRAProfileDTO {
   uuid: string;
   name: string;
   enabled: boolean;
   authorityInstanceUuid: string;
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
   value?: string | number | string[] | number[];
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

 export interface ValidationResultDTO {
   status: ValidationStatus;
   message: string;
 }

export interface CertificateValidationResultDTO {
   [key: string]: ValidationResultDTO;
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

