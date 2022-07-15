export type CertificateEvent =
   "Issue Certificate" |
   "Renew Certificate" |
   "Revoke Certificate" |
   "Delete Certificate" |
   "Update RA Profile" |
   "Update Entity" |
   "Update Group" |
   "Update Owner" |
   "Upload Certificate" |
   "Certificate Discovered"
   ;


export type CertificateRevocationReason =
   "UNSPECIFIED" |
   "KEY_COMPROMISE" |
   "CA_COMPROMISE" |
   "AFFILIATION_CHANGED" |
   "SUPERSEDED" |
   "CESSATION_OF_OPERATION" |
   "CERTIFICATE_HOLD" |
   "REMOVE_FROM_CRL" |
   "PRIVILEGES_WITHDRAWN" |
   "AA_COMPROMISE"
   ;


export type CertificateFilterCondition =
   "EQUALS" |
   "NOT_EQUALS" |
   "GREATER" |
   "LESSER" |
   "CONTAINS" |
   "NOT_CONTAINS" |
   "STARTS_WITH" |
   "ENDS_WITH" |
   "EMPTY" |
   "NOT_EMPTY" |
   "SUCCESS" |
   "FAILED" |
   "UNKNOWN" |
   "NOT_CHECKED"
   ;


export type CertificateFilterField =
   "commonName" |
   "serialNumber" |
   "raProfile" |
   "entity" |
   "status" |
   "group" |
   "owner" |
   "issuerCommonName" |
   "signatureAlgorithm" |
   "fingerprint" |
   "notAfter" |
   "notBefore" |
   "publicKeyAlgorithm" |
   "keySize" |
   "keyUsage" |
   "basicConstraints" |
   "meta" |
   "subjectAlternativeNames" |
   "subjectDn" |
   "issuerDn" |
   "issuerSerialNumber" |
   "ocspValidation" |
   "crlValidation" |
   "signatureValidation"
   ;