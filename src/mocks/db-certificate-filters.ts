import { AvailableCertificateFilterDTO } from "api/certificates";

export interface DbCertificateFilter extends AvailableCertificateFilterDTO {
}


interface DbCertificateFilterList {
   [key: string]: DbCertificateFilter;
}


export const dbCertificateFilters: DbCertificateFilterList = {

   commonName: {
      "field": "commonName",
      "label": "Common Name",
      "type": "string",
      "conditions": [
         "CONTAINS",
         "NOT_CONTAINS",
         "EQUALS",
         "NOT_EQUALS",
         "EMPTY",
         "NOT_EMPTY",
         "STARTS_WITH",
         "ENDS_WITH"
      ],
      "multiValue": false
   },

   serialNumber: {

      "field": "serialNumber",
      "label": "Serial Number",
      "type": "string",
      "conditions": [
         "CONTAINS",
         "NOT_CONTAINS",
         "EQUALS",
         "NOT_EQUALS",
         "EMPTY",
         "NOT_EMPTY",
         "STARTS_WITH",
         "ENDS_WITH"
      ],
      "multiValue": false
   },

   issuerSerialNumber: {
      "field": "issuerSerialNumber",
      "label": "Issuer Serial Number",
      "type": "string",
      "conditions": [
         "CONTAINS",
         "NOT_CONTAINS",
         "EQUALS",
         "NOT_EQUALS",
         "EMPTY",
         "NOT_EMPTY",
         "STARTS_WITH",
         "ENDS_WITH"
      ],
      "multiValue": false
   },

   raProfile: {
      "field": "raProfile",
      "label": "RA Profile",
      "type": "list",
      "conditions": [
         "EQUALS",
         "NOT_EQUALS",
         "EMPTY",
         "NOT_EMPTY"
      ],
      "value": [
         "1",
         "fsg",
         "raprofile",
         "ppp",
         "qwe",
         "aabbccdd",
         "NG-RA-Profile1",
         "tst-adcs",
         "Web Server RA Profile",
         "Testing-RA-Profile",
         "test123",
         "czertainly",
         "lab02-ADCS-WebServer",
         "ejbca-ng-test"
      ],
      "multiValue": true
   },

   group: {
      "field": "group",
      "label": "Group",
      "type": "list",
      "conditions": [
         "EQUALS",
         "NOT_EQUALS",
         "EMPTY",
         "NOT_EMPTY"
      ],
      "value": [
         "Dummy",
         "aaa",
         "qwe"
      ],
      "multiValue": true
   },

   owner: {
      "field": "owner",
      "label": "Owner",
      "type": "string",
      "conditions": [
         "CONTAINS",
         "NOT_CONTAINS",
         "EQUALS",
         "NOT_EQUALS",
         "EMPTY",
         "NOT_EMPTY",
         "STARTS_WITH",
         "ENDS_WITH"
      ],
      "multiValue": false
   },

   status: {
      "field": "status",
      "label": "Status",
      "type": "list",
      "conditions": [
         "EQUALS",
         "NOT_EQUALS"
      ],
      "value": [
         "REVOKED",
         "EXPIRED",
         "EXPIRING",
         "VALID",
         "INVALID",
         "NEW",
         "UNKNOWN"
      ],
      "multiValue": true
   },

   complianceStatus: {
      "field": "complianceStatus",
      "label": "Compliance Status",
      "type": "list",
      "conditions": [
         "EQUALS",
         "NOT_EQUALS"
      ],
      "value": [
         "OK",
         "NOK",
         "NA"
      ],
      "multiValue": true
   },

   issuerCommonName: {
      "field": "issuerCommonName",
      "label": "Issuer Common Name",
      "type": "string",
      "conditions": [
         "CONTAINS",
         "NOT_CONTAINS",
         "EQUALS",
         "NOT_EQUALS",
         "EMPTY",
         "NOT_EMPTY",
         "STARTS_WITH",
         "ENDS_WITH"
      ],
      "multiValue": false
   },

   fingerprint: {
      "field": "fingerprint",
      "label": "Fingerprint",
      "type": "string",
      "conditions": [
         "CONTAINS",
         "NOT_CONTAINS",
         "EQUALS",
         "NOT_EQUALS",
         "EMPTY",
         "NOT_EMPTY",
         "STARTS_WITH",
         "ENDS_WITH"
      ],
      "multiValue": false
   },

   signatureAlgorithm: {
      "field": "signatureAlgorithm",
      "label": "Signature Algorithm",
      "type": "list",
      "conditions": [
         "EQUALS",
         "NOT_EQUALS"
      ],
      "value": [
         "SHA256withECDSA",
         "SHA384withRSA",
         "SHA256withRSA",
         "SHA256WITHDSA",
         "SHA1withRSA",
         "SHA512withRSA",
         "SHA384withECDSA",
         "SHA512WITHRSA",
         "SHA256WITHRSA",
         "MD5withRSA"
      ],
      "multiValue": true
   },

   notAfter: {
      "field": "notAfter",
      "label": "Expires At",
      "type": "date",
      "conditions": [
         "GREATER",
         "LESSER"
      ],
      "multiValue": false
   },

   notBefore: {
      "field": "notBefore",
      "label": "Valid From",
      "type": "date",
      "conditions": [
         "GREATER",
         "LESSER"
      ],
      "multiValue": false
   },

   subjectDn: {
      "field": "subjectDn",
      "label": "Subject DN",
      "type": "string",
      "conditions": [
         "CONTAINS",
         "NOT_CONTAINS",
         "EQUALS",
         "NOT_EQUALS",
         "EMPTY",
         "NOT_EMPTY",
         "STARTS_WITH",
         "ENDS_WITH"
      ],
      "multiValue": false
   },

   issuerDn: {
      "field": "issuerDn",
      "label": "Issuer DN",
      "type": "string",
      "conditions": [
         "CONTAINS",
         "NOT_CONTAINS",
         "EQUALS",
         "NOT_EQUALS",
         "EMPTY",
         "NOT_EMPTY",
         "STARTS_WITH",
         "ENDS_WITH"
      ],
      "multiValue": false
   },

   meta: {
      "field": "meta",
      "label": "Meta Data",
      "type": "string",
      "conditions": [
         "CONTAINS",
         "NOT_CONTAINS",
         "EMPTY",
         "NOT_EMPTY"
      ],
      "multiValue": false
   },

   subjectAlternativeNames: {
      "field": "subjectAlternativeNames",
      "label": "Subject Alternative Name",
      "type": "string",
      "conditions": [
         "CONTAINS",
         "NOT_CONTAINS",
         "EMPTY",
         "NOT_EMPTY"
      ],
      "multiValue": false
   },

   ocspValidation: {
      "field": "ocspValidation",
      "label": "OCSP Validation",
      "type": "string",
      "conditions": [
         "SUCCESS",
         "FAILED",
         "UNKNOWN",
         "EMPTY"
      ],
      "multiValue": false
   },

   crlValidation: {
      "field": "crlValidation",
      "label": "CRL Validation",
      "type": "string",
      "conditions": [
         "SUCCESS",
         "FAILED",
         "UNKNOWN",
         "EMPTY"
      ],
      "multiValue": false
   },

   signatureValidation: {
      "field": "signatureValidation",
      "label": "Signature Validation",
      "type": "string",
      "conditions": [
         "SUCCESS",
         "FAILED",
         "UNKNOWN"
      ],
      "multiValue": false
   },

   publicKeyAlgorithm: {
      "field": "publicKeyAlgorithm",
      "label": "Public Key Algorithm",
      "type": "list",
      "conditions": [
         "EQUALS",
         "NOT_EQUALS"
      ],
      "value": [
         "DSA",
         "EC",
         "RSA"
      ],
      "multiValue": true
   },

   keySize: {
      "field": "keySize",
      "label": "Key Size",
      "type": "list",
      "conditions": [
         "EQUALS",
         "NOT_EQUALS"
      ],
      "value": [
         384,
         2048,
         1024,
         3072,
         4096,
         512,
         256
      ],
      "multiValue": true
   },

   keyUsage: {
      "field": "keyUsage",
      "label": "Key Usage",
      "type": "list",
      "conditions": [
         "CONTAINS",
         "NOT_CONTAINS"
      ],
      "value": [
         "digitalSignature",
         "nonRepudiation",
         "keyEncipherment",
         "keyCertSign",
         "cRLSign"
      ],
      "multiValue": false
   }

}