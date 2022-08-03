import { AcmeProfileDTO } from "api/acme-profile"
import { ComplianceGroupsDTO, ComplianceGroupsListItemDTO, ComplianceProfileDTO, ComplianceProfileListItemDTO, ComplianceRulesDTO, ComplianceRulesListItemDTO } from "api/compliance-profile";
import { dbRaProfiles } from "./db-ra-profiles";


export interface DbComplianceProfileList extends ComplianceProfileListItemDTO {
}

export interface DbComplianceProfile extends ComplianceProfileDTO {
}

export interface DbComplianceRule extends ComplianceRulesListItemDTO {
}

export interface DbComplianceGroup extends ComplianceGroupsListItemDTO {
}


interface DbComplianceProfileListItem {
   [key: string]: DbComplianceProfileList;
}

interface DbComplianceProfiles {
   [key: string]: DbComplianceProfile;
}



export const dbComplianceProfilesListItem: DbComplianceProfileListItem = {

   "Profile1": {
      "uuid": "466b14f5-7c6e-428c-8a64-3b6ba1cb3922",
      "name": "Profile1",
      "rules": [
         {
            "connectorName": "COMP",
            "numberOfRules": 3,
            "numberOfGroups": 1
         }
      ]
   },

   "Profile2": {
      "uuid": "466b14f5-7c6e-428c-8a64-3b6ba1cb3923",
      "name": "Profile2",
      "rules": [
         {
            "connectorName": "COMP",
            "numberOfRules": 65,
            "numberOfGroups": 2
         }
      ]
   },
   "Profile3": {
      "uuid": "466b14f5-7c6e-428c-8a64-3b6ba1cb3924",
      "name": "Profile3",
      "rules": [
         {
            "connectorName": "COMP",
            "numberOfRules": 3,
            "numberOfGroups": 1
         },
         {
            "connectorName": "Connector2",
            "numberOfRules": 12,
            "numberOfGroups": 12
         }
      ]
   },
   "Profile4": {
      "uuid": "466b14f5-7c6e-428c-8a64-3b6ba1cb3925",
      "name": "Profile4",
      "rules": [
         {
            "connectorName": "COMP",
            "numberOfRules": 3,
            "numberOfGroups": 1
         }
      ]
   },
}


export const dbComplianceProfiles: DbComplianceProfiles = {
   "Profile1": {
      "uuid": "466b14f5-7c6e-428c-8a64-3b6ba1cb3922",
      "name": "Profile1",
      "description": "Hello There!",
      "rules": [
         {
            "connectorName": "COMP",
            "connectorUuid": "6a4bceef-5eb4-4b35-b3c5-b664a6be4d72",
            "kind": "x509",
            "rules": [
               {
                  "uuid": "40f0ac56-ddc1-11ec-9825-34cff65c6ee3",
                  "name": "w_tls_server_cert_valid_time_longer_than_397_days",
                  "description": "Hello There!"
               }
            ]
         }
      ],
      "groups": [
         {
            "connectorName": "COMP",
            "connectorUuid": "6a4bceef-5eb4-4b35-b3c5-b66416be4d72",
            "kind": "x509",
            "groups": [
               {
                  "uuid": "52350996-ddb2-11ec-9d64-0242ac120002",
                  "name": "Profile1"
               }
            ]
         }
      ],
      "raProfiles": [
         {
            "uuid": "59ee9171-f1ca-4c36-8bdd-f8b53001d772",
            "name": "czertainly",
            "enabled": true
         },
         {
            "uuid": "5c0deb4e-a22d-475b-aefc-8021dd5631d6",
            "name": "lab02-ADCS-WebServer",
            "enabled": true
         }
      ]
   },
   "Profile2": {
      "uuid": "466b14f5-7c6e-428c-8a64-3b6ba1cb3923",
      "name": "Profile2",
      "description": "Hello There!",
      "rules": [
         {
            "connectorName": "COMP",
            "connectorUuid": "6a4bceef-5eb4-4b35-b3c5-b664a6be4d72",
            "kind": "x509",
            "rules": [
               {
                  "uuid": "40f0ac56-ddc1-11ec-9825-34cff65c6ee3",
                  "name": "w_tls_server_cert_valid_time_longer_than_397_days",
                  "description": "Hello There!"
               }
            ]
         }
      ],
      "groups": [
      ],
      "raProfiles": [
      ]
   }
}

export const dbComplianceRules: DbComplianceRule[] = [
   {
       "connectorName": "COMP",
       "connectorUuid": "6a4bceef-5eb4-4b35-b3c5-b664a6be4d72",
       "kind": "x509",
       "rules": [
           {
               "uuid": "40f084cc-ddc1-11ec-9d7f-34cff65c6ee3",
               "groupUuid": "5235104e-ddb2-11ec-9d64-0242ac120002",
               "name": "e_algorithm_identifier_improper_encoding",
               "certificateType": "X509",
               "description": "Encoded AlgorithmObjectIdentifier objects inside a SubjectPublicKeyInfo field MUST comply with specified byte sequences."
           },
           {
               "uuid": "40f084cd-ddc1-11ec-82b0-34cff65c6ee3",
               "groupUuid": "523513dc-ddb2-11ec-9d64-0242ac120002",
               "name": "e_basic_constraints_not_critical",
               "certificateType": "X509",
               "description": "basicConstraints MUST appear as a critical extension"
           },
           {
               "uuid": "40f084ce-ddc1-11ec-a645-34cff65c6ee3",
               "groupUuid": "5235104e-ddb2-11ec-9d64-0242ac120002",
               "name": "e_br_prohibit_dsa_usage",
               "certificateType": "X509",
               "description": "DSA was removed from the Baseline Requirements as a valid signature algorithm in 1.7.1."
           },
           {
               "uuid": "40f084cf-ddc1-11ec-b4e7-34cff65c6ee3",
               "groupUuid": "5235104e-ddb2-11ec-9d64-0242ac120002",
               "name": "e_ca_common_name_missing",
               "certificateType": "X509",
               "description": "CA Certificates common name MUST be included."
           },
           {
               "uuid": "40f084d0-ddc1-11ec-b971-34cff65c6ee3",
               "groupUuid": "5235104e-ddb2-11ec-9d64-0242ac120002",
               "name": "e_ca_country_name_invalid",
               "certificateType": "X509",
               "description": "Root and Subordinate CA certificates MUST have a two-letter country code specified in ISO 3166-1"
           },
           {
               "uuid": "40f084d1-ddc1-11ec-97de-34cff65c6ee3",
               "groupUuid": "5235104e-ddb2-11ec-9d64-0242ac120002",
               "name": "e_ca_country_name_missing",
               "certificateType": "X509",
               "description": "Root and Subordinate CA certificates MUST have a countryName present in subject information"
           },
           {
               "uuid": "40f084d2-ddc1-11ec-b959-34cff65c6ee3",
               "groupUuid": "5235104e-ddb2-11ec-9d64-0242ac120002",
               "name": "e_ca_crl_sign_not_set",
               "certificateType": "X509",
               "description": "Root and Subordinate CA certificate keyUsage extension's crlSign bit MUST be set"
           },
           {
               "uuid": "40f084d3-ddc1-11ec-8c9a-34cff65c6ee3",
               "groupUuid": "5235104e-ddb2-11ec-9d64-0242ac120002",
               "name": "e_ca_is_ca",
               "certificateType": "X509",
               "description": "Root and Sub CA Certificate: The CA field MUST be set to true."
           },
           {
               "uuid": "40f084d4-ddc1-11ec-95d4-34cff65c6ee3",
               "groupUuid": "5235104e-ddb2-11ec-9d64-0242ac120002",
               "name": "e_ca_key_cert_sign_not_set",
               "certificateType": "X509",
               "description": "Root CA Certificate: Bit positions for keyCertSign and cRLSign MUST be set."
           },
           {
               "uuid": "40f084d5-ddc1-11ec-8e3c-34cff65c6ee3",
               "groupUuid": "5235104e-ddb2-11ec-9d64-0242ac120002",
               "name": "e_ca_key_usage_missing",
               "certificateType": "X509",
               "description": "Root and Subordinate CA certificate keyUsage extension MUST be present"
           },
           {
               "uuid": "40f084d6-ddc1-11ec-9b8c-34cff65c6ee3",
               "groupUuid": "5235104e-ddb2-11ec-9d64-0242ac120002",
               "name": "e_ca_key_usage_not_critical",
               "certificateType": "X509",
               "description": "Root and Subordinate CA certificate keyUsage extension MUST be marked as critical"
           },
           {
               "uuid": "40f084d7-ddc1-11ec-abc2-34cff65c6ee3",
               "groupUuid": "5235104e-ddb2-11ec-9d64-0242ac120002",
               "name": "e_ca_organization_name_missing",
               "certificateType": "X509",
               "description": "Root and Subordinate CA certificates MUST have a organizationName present in subject information"
           },
           {
               "uuid": "40f084d8-ddc1-11ec-a8de-34cff65c6ee3",
               "groupUuid": "523513dc-ddb2-11ec-9d64-0242ac120002",
               "name": "e_ca_subject_field_empty",
               "certificateType": "X509",
               "description": "CA Certificates subject field MUST not be empty and MUST have a non-empty distinguished name"
           },
           {
               "uuid": "40f084d9-ddc1-11ec-a971-34cff65c6ee3",
               "groupUuid": "5235104e-ddb2-11ec-9d64-0242ac120002",
               "name": "e_cab_dv_conflicts_with_locality",
               "certificateType": "X509",
               "description": "If certificate policy 2.23.140.1.2.1 (CA/B BR domain validated) is included, locality name MUST NOT be included in subject"
           },
           {
               "uuid": "40f084da-ddc1-11ec-8877-34cff65c6ee3",
               "groupUuid": "5235104e-ddb2-11ec-9d64-0242ac120002",
               "name": "e_cab_dv_conflicts_with_org",
               "certificateType": "X509",
               "description": "If certificate policy 2.23.140.1.2.1 (CA/B BR domain validated) is included, organization name MUST NOT be included in subject"
           },
           {
               "uuid": "40f084db-ddc1-11ec-8f46-34cff65c6ee3",
               "groupUuid": "5235104e-ddb2-11ec-9d64-0242ac120002",
               "name": "e_cab_dv_conflicts_with_postal",
               "certificateType": "X509",
               "description": "If certificate policy 2.23.140.1.2.1 (CA/B BR domain validated) is included, postalCode MUST NOT be included in subject"
           },
           {
               "uuid": "40f084dc-ddc1-11ec-b6ee-34cff65c6ee3",
               "groupUuid": "5235104e-ddb2-11ec-9d64-0242ac120002",
               "name": "e_cab_dv_conflicts_with_province",
               "certificateType": "X509",
               "description": "If certificate policy 2.23.140.1.2.1 (CA/B BR domain validated) is included, stateOrProvinceName MUST NOT be included in subject"
           },
           {
               "uuid": "40f084dd-ddc1-11ec-b000-34cff65c6ee3",
               "groupUuid": "5235104e-ddb2-11ec-9d64-0242ac120002",
               "name": "e_cab_dv_conflicts_with_street",
               "certificateType": "X509",
               "description": "If certificate policy 2.23.140.1.2.1 (CA/B BR domain validated) is included, streetAddress MUST NOT be included in subject"
           },
           {
               "uuid": "40f084de-ddc1-11ec-9abb-34cff65c6ee3",
               "groupUuid": "5235104e-ddb2-11ec-9d64-0242ac120002",
               "name": "e_cab_iv_requires_personal_name",
               "certificateType": "X509",
               "description": "If certificate policy 2.23.140.1.2.3 is included, either organizationName or givenName and surname MUST be included in subject"
           },
           {
               "uuid": "40f084df-ddc1-11ec-9f27-34cff65c6ee3",
               "groupUuid": "5235104e-ddb2-11ec-9d64-0242ac120002",
               "name": "e_cab_ov_requires_org",
               "certificateType": "X509",
               "description": "If certificate policy 2.23.140.1.2.2 is included, organizationName MUST be included in subject"
           },
           {
               "uuid": "40f0ac54-ddc1-11ec-8e15-34cff65c6ee3",
               "groupUuid": "523513dc-ddb2-11ec-9d64-0242ac120002",
               "name": "w_subject_given_name_recommended_max_length",
               "certificateType": "X509",
               "description": "X.411 (1988) describes ub-common-name-length to be 64 bytes long. As systems may have targeted this length, for compatibility purposes it may be prudent to limit given names to this length."
           },
           {
               "uuid": "40f0ac55-ddc1-11ec-b953-34cff65c6ee3",
               "groupUuid": "523513dc-ddb2-11ec-9d64-0242ac120002",
               "name": "w_subject_surname_recommended_max_length",
               "certificateType": "X509",
               "description": "X.411 (1988) describes ub-common-name-length to be 64 bytes long. As systems may have targeted this length, for compatibility purposes it may be prudent to limit surnames to this length."
           },
           {
               "uuid": "40f0ac56-ddc1-11ec-9825-34cff65c6ee3",
               "groupUuid": "52350996-ddb2-11ec-9d64-0242ac120002",
               "name": "w_tls_server_cert_valid_time_longer_than_397_days",
               "certificateType": "X509",
               "description": "TLS server certificates issued on or after September 1, 2020 00:00 GMT/UTC should not have a validity period greater than 397 days"
           },
           {
               "uuid": "6dcf0d44-ddc3-11ec-9d64-0242ac120002",
               "name": "cus_public_key_algorithm",
               "certificateType": "X509",
               "attributes": [
                   {
                       "uuid": "166b5cf52-63f2-11ec-90d6-0242ac120013",
                       "name": "condition",
                       "content": [
                           {
                               "value": "Equals"
                           },
                           {
                               "value": "NotEquals"
                           }
                       ],
                       "label": "Condition",
                       "type": "STRING",
                       "required": true,
                       "readOnly": false,
                       "visible": true,
                       "list": true,
                       "multiSelect": false
                   },
                   {
                       "uuid": "166b5cf52-63f2-11ec-90d6-0242ac120003",
                       "name": "algorithm",
                       "content": [
                           {
                               "value": "RSA"
                           },
                           {
                               "value": "DSA"
                           },
                           {
                               "value": "ECDSA"
                           }
                       ],
                       "label": "Public Key Algorithm",
                       "type": "STRING",
                       "required": true,
                       "readOnly": false,
                       "visible": true,
                       "list": true,
                       "multiSelect": true
                   }
               ],
               "description": "Public key algorithm of the certificate"
           },
           {
               "uuid": "b44d3ba2-e65a-11ec-8fea-0242ac120002",
               "name": "cus_hashing_algorithm",
               "certificateType": "X509",
               "attributes": [
                   {
                       "uuid": "b44d3f44-e65a-11ec-8fea-0242ac120002",
                       "name": "condition",
                       "content": [
                           {
                               "value": "Equals"
                           },
                           {
                               "value": "NotEquals"
                           }
                       ],
                       "label": "Condition",
                       "type": "STRING",
                       "required": true,
                       "readOnly": false,
                       "visible": true,
                       "list": true,
                       "multiSelect": false
                   },
                   {
                       "uuid": "b44d408e-e65a-11ec-8fea-0242ac120002",
                       "name": "algorithm",
                       "content": [
                           {
                               "value": "MD5-RSA"
                           },
                           {
                               "value": "SHA1-RSA"
                           },
                           {
                               "value": "SHA224-RSA"
                           },
                           {
                               "value": "SHA256-RSA"
                           },
                           {
                               "value": "SHA384-RSA"
                           },
                           {
                               "value": "SHA512-RSA"
                           },
                           {
                               "value": "ECDSA-SHA1"
                           },
                           {
                               "value": "ECDSA-SHA224"
                           },
                           {
                               "value": "ECDSA-SHA256"
                           },
                           {
                               "value": "ECDSA-SHA384"
                           },
                           {
                               "value": "ECDSA-SHA512"
                           }
                       ],
                       "label": "Hashing Algorithm",
                       "type": "STRING",
                       "required": true,
                       "readOnly": false,
                       "visible": true,
                       "list": true,
                       "multiSelect": true
                   }
               ],
               "description": "Hashing algorithm of the certificate"
           },
           {
               "uuid": "5f6baae8-e663-11ec-8fea-0242ac120002",
               "name": "cus_elliptic_curve",
               "certificateType": "X509",
               "attributes": [
                   {
                       "uuid": "5f6bad5e-e663-11ec-8fea-0242ac120002",
                       "name": "condition",
                       "content": [
                           {
                               "value": "Equals"
                           },
                           {
                               "value": "NotEquals"
                           }
                       ],
                       "label": "Condition",
                       "type": "STRING",
                       "required": true,
                       "readOnly": false,
                       "visible": true,
                       "list": true,
                       "multiSelect": false
                   },
                   {
                       "uuid": "5f6bb196-e663-11ec-8fea-0242ac120002",
                       "name": "curve",
                       "content": [
                           {
                               "value": "P-224"
                           },
                           {
                               "value": "P-256"
                           },
                           {
                               "value": "P-384"
                           },
                           {
                               "value": "P-521"
                           }
                       ],
                       "label": "Curve",
                       "type": "STRING",
                       "required": true,
                       "readOnly": false,
                       "visible": true,
                       "list": true,
                       "multiSelect": true
                   }
               ],
               "description": "Elliptic Curve of the certificate created with EC key"
           },
           {
               "uuid": "7ed00480-e706-11ec-8fea-0242ac120002",
               "name": "cus_key_length",
               "certificateType": "X509",
               "attributes": [
                   {
                       "uuid": "7ed00782-e706-11ec-8fea-0242ac120002",
                       "name": "condition",
                       "content": [
                           {
                               "value": "Equals"
                           },
                           {
                               "value": "NotEquals"
                           },
                           {
                               "value": "Greater"
                           },
                           {
                               "value": "Lesser"
                           }
                       ],
                       "label": "Condition",
                       "type": "STRING",
                       "required": true,
                       "readOnly": false,
                       "visible": true,
                       "list": true,
                       "multiSelect": false
                   },
                   {
                       "uuid": "7ed00886-e706-11ec-8fea-0242ac120002",
                       "name": "length",
                       "label": "Key Length",
                       "type": "INTEGER",
                       "required": true,
                       "readOnly": false,
                       "visible": true,
                       "list": false,
                       "multiSelect": false
                   }
               ],
               "description": "Public Key length of the certificate should be"
           }
       ]
   }
]

export const dbComplianceGroups: DbComplianceGroup[] = [
   {
       "connectorName": "COMP",
       "connectorUuid": "6a4bceef-5eb4-4b35-b3c5-b664a6be4d72",
       "kind": "x509",
       "groups": [
           {
               "uuid": "52350996-ddb2-11ec-9d64-0242ac120002",
               "name": "Apple's CT Policy",
               "description": "https://support.apple.com/en-us/HT205280#:~:text=Apple's%20policy%20requires%20at%20least,extension%20or%20OCSP%20Stapling%3B%20or"
           },
           {
               "uuid": "52350df6-ddb2-11ec-9d64-0242ac120002",
               "name": "Mozilla's PKI Policy",
               "description": "https://www.mozilla.org/en-US/about/governance/policies/security-group/certs/policy/"
           },
           {
               "uuid": "52350f36-ddb2-11ec-9d64-0242ac120002",
               "name": "ETSI ESI",
               "description": "https://www.etsi.org/committee/esi"
           },
           {
               "uuid": "5235104e-ddb2-11ec-9d64-0242ac120002",
               "name": "CAB - Baseline Requirements",
               "description": "https://cabforum.org/baseline-requirements-documents/"
           },
           {
               "uuid": "52351170-ddb2-11ec-9d64-0242ac120002",
               "name": "CAB - Extended Validity Guidelines",
               "description": "https://cabforum.org/extended-validation/"
           },
           {
               "uuid": "523512b0-ddb2-11ec-9d64-0242ac120002",
               "name": "ZLint Community Guidelines",
               "description": "https://github.com/zmap/zlint/blob/master/CONTRIBUTING.md"
           },
           {
               "uuid": "523513dc-ddb2-11ec-9d64-0242ac120002",
               "name": "RFC 5280",
               "description": "https://datatracker.ietf.org/doc/html/rfc5280"
           },
           {
               "uuid": "e1d0ad66-ddb3-11ec-9d64-0242ac120002",
               "name": "RFC 5480",
               "description": "https://datatracker.ietf.org/doc/html/rfc5480"
           },
           {
               "uuid": "e1d0af6e-ddb3-11ec-9d64-0242ac120002",
               "name": "RFC 5891",
               "description": "https://datatracker.ietf.org/doc/html/rfc5891"
           }
       ]
   }
]