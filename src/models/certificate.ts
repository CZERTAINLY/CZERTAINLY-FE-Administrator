import { DistinguishedName, Extension, PublicKey } from "@fidm/x509";
import { CertificateEvent, CertificateFilterCondition, CertificateFilterField } from "types/certificate";
import { GroupModel } from "./groups";


interface CertificateValidationResultRecordModel {
   status: "success" | "failed" | "warning" | "revoked" | "not_checked" | "invalid" | "expiring" | "expired";
}


export interface CertificateListQueryFilterModel {
   field: string;
   condition: string;
   value?: any;
}


export interface CertificateListQueryModel {
   itemsPerPage: number;
   pageNumber: number;
   filters: CertificateListQueryFilterModel[];
}


export interface AvailableCertificateFilterModel {

   field: CertificateFilterField;
   label: string;
   type: "string" | "number" | "list" | "date";
   conditions: CertificateFilterCondition[];
   value?: string | string[];
   multiValue?: boolean;

}


export interface CertificateEventHistoryModel {

   uuid: string;
   certificateUuid: string;
   created: string;
   createdBy: string;
   event: CertificateEvent;
   status: "SUCCESS" | "FAILED";
   message: string;
   additionalInformation: { [ property: string ]: any };

}


export interface CertificateSubjectAlternativeNamesModel {

   [key: string]: any[] | undefined;

   registeredID?: any[];
   ediPartyName?: any[];
   iPAddress?: string[];
   x400Address?: any[];
   rfc822Name?: any[];
   otherName?: any[];
   dNSName?: string[];
   directoryName?: any[];
   uniformResourceIdentifier?: string[];

}


interface CertificateEntityModel {
   uuid: string;
   name: string;
   description?: string;
   entityType: "server" | "router" | "HSM" | "switch" | "loadBallancer" | "firewall" | "MDM" | "cloud";
}


interface CertificateMetaModel {
   [key: string]: string;
   discoverySource: string;
   cipherSuite: string;
}


export interface CertificateRAProfileModel {
   uuid: string;
   name: string;
   enabled: boolean;
}


export interface CertificateModel {

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
   subjectAlternativeNames: CertificateSubjectAlternativeNamesModel;
   meta?: CertificateMetaModel;

   certificateValidationResult?: CertificateValidationResultRecordModel;
   entity?: CertificateEntityModel;
   group?: GroupModel;
   owner?: string;
   raProfile?: CertificateRAProfileModel;

}


export interface X509Certificate {

   readonly version: number;
   readonly serialNumber: string;
   readonly signatureOID: string;
   readonly signatureAlgorithm: string;
   readonly infoSignatureOID: string;
   readonly signature: Buffer;
   readonly subjectKeyIdentifier: string;
   readonly authorityKeyIdentifier: string;
   readonly ocspServer: string;
   readonly issuingCertificateURL: string;
   readonly isCA: boolean;
   readonly maxPathLen: number;
   readonly basicConstraintsValid: boolean;
   readonly keyUsage: string[];
   readonly dnsNames: string[];
   readonly emailAddresses: string[];
   readonly ipAddresses: string[];
   readonly uris: string[];
   readonly validFrom: Date;
   readonly validTo: Date;
   readonly issuer: DistinguishedName;
   readonly subject: DistinguishedName;
   readonly extensions: Extension[];
   readonly publicKey: PublicKey;
   readonly publicKeyRaw: Buffer;
   //readonly tbsCertificate: ASN1;


   commonName: string,
   issuerCommonName: string,
   certificateContent: string,
   issuerDn: string,
   subjectDn: string,
   notBefore: string,
   notAfter: string,
   publicKeyAlgorithm: string,
   keySize: number,
   extendedKeyUsage?: string[],
   basicConstraints: string,
   status: "unknown",
   fingerprint: string,

}