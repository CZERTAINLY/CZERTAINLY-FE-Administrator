import { ConnectorConnectionDTO } from "api/connectors";
import { DBData } from "./DBData";

import { dbAcmeProfiles } from "./db-acme-profiles";
import { dbAcmeAccounts } from "./db-acme-accounts";
import { dbAdministrators } from "./db-administrators";
import { dbAuditLogs, dbAuditLogsOperationStatuses, dbAuditLogsOperations, dbAuditLogsOrigins } from "./db-audit-logs";

import { dbRaProfiles } from "./db-ra-profiles";
import { dbClients } from "./db-clients";
import { dbCertificates } from "./db-certificates";

import { CertificateDTO } from "api/certificates";
import { certificatePEM2CertificateDTO } from "utils/certificate";
import { dbAuthorities } from "./db-authorities";

// const certificate = `MIIE8zCCAtugAwIBAgIJAJUUUpnYuGibMA0GCSqGSIb3DQEBCwUAMIGQMQswCQYDVQQGEwJDWjEXMBUGA1UECAwOQ3plY2ggUmVwdWJsaWMxDzANBgNVBAcMBlByYWd1ZTEWMBQGA1UECgwNTHVrYXMgS29wZW5lYzEWMBQGA1UEAwwNTHVrYXMgS29wZW5lYzEnMCUGCSqGSIb3DQEJARYYbHVrYXMua29wZW5lY0BvdXRsb29rLmN6MB4XDTE4MTAyNzE4MTUzMFoXDTE5MDQyNzE4MTUzMFowgY0xCzAJBgNVBAYTAkNaMRcwFQYDVQQIDA5DemVjaCBSZXB1YmxpYzEPMA0GA1UEBwwGUHJhZ3VlMRcwFQYDVQQKDA5PbmxpbmVrdXJ6eS5jejESMBAGA1UEAwwJbG9jYWxob3N0MScwJQYJKoZIhvcNAQkBFhhsdWthcy5rb3BlbmVjQG91dGxvb2suY3owggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCbcChmJIAMp7k/3tB/D05PZ3BzSg1hz83EvjPAJ+pCJ8Ub4jvFwpbn/10fe60NZV+IEoL7t+i4fZruJc4k8Cyauc0x1179FWgSEw9rKeDlrS9yJ01cwsC0Wme6VVoJok9RSvhF4rahNhsEX+RUwa3Mo7pw+kmCNXo+32bEr09UuriES/YUt0KIpB8Si7Ta3buz5NVu0y5iKKP6+4Ab9haTFQmrJljL5q5mW+0TMZgK/d7Qpd7Q4jlvt5EjSBKl1RculOVpkpvXOAJD/vQ+xZP8DreOjR/QO8tOFQqhWvttSQVNbMloRinoWEAeRi9a/GkjAccMNlEh7PO6m2NZwQzfAgMBAAGjUTBPMB8GA1UdIwQYMBaAFJ8AR+Q931n61MeDPeHeBQAI02JxMAkGA1UdEwQCMAAwCwYDVR0PBAQDAgTwMBQGA1UdEQQNMAuCCWxvY2FsaG9zdDANBgkqhkiG9w0BAQsFAAOCAgEArYbPTb+d2hAuG5imd5i7srDd5IKvt4YpY/zdz+nAX6JPRwNyb7ssHEZ5UsKekFH2IuWRuWqyGBmb3AsnoEa4Ws3hG8HH+hivvYQ31No4KD1oHASwzJ7R7J6FXHksNQQkuE5qGybpHimU24MX34ThpglhbZVqcUNpjJLhchZ704GJB+SNMtDxdScpTQ2L4lk9PvBQFZYhMjOcygz0+JDKww9UCdLwbX3BSwcXBkGqAoS8CyE/nA1Bjrn+wUzcSRjewh1QkdcY3KLH3Hxv7Bs8mVsTlNS1t8ac7QwrXAp6+aqUCKx4Bec2KR37yD+IsMLBFKn4vzEOb+i7f7syfqzRr3Q1/lutor2BVsCx6eN2dFK2EXjqjG8sH8+9qIjXKuGjCVJ8fANLG4pYquxm3wPOMR3eYrykJnD5Bd9qNbl9/Awc7jWDnYtvNxh4iLSL68D4jHdJjSX6oyk5ipR6Czkx4oVa46oIavQyVCncjZRbj2wXsUxtMti3DdpwWE7eD8Bfg+JSa5QRlo2WlOPD5E7s3HlfHNn2r1UFfZ79Kq068n8Jh6m0h70anTo0Byfcnu+3xYsiG8eerJV6SANkHbTgD6q0CF2/r0xAWnbBAAQaGydkXTYwDeOn8fUd9ayBPUnoo5QU6I+8qVFjzyzEhTs5vOJfZ9Xy885LwPGXXMpTZQw=`;
export const dbData: DBData = {

   acmeAccounts: [
      dbAcmeAccounts["BeWgvKI160E"],
      dbAcmeAccounts["ZnaucX7UOFs"],
      dbAcmeAccounts["PrLHcY5PnnA"],
      dbAcmeAccounts["FQxkmEYae9g"],
      dbAcmeAccounts["ZeQgvUI12pE"]
   ],

   acmeProfiles: [
      dbAcmeProfiles["cm"],
      dbAcmeProfiles["ACME CZERTAINLY Profile"]
   ],

   administrators: [
      dbAdministrators["Lukáš"],
      dbAdministrators["Super_Administrator"]
   ],

   auditLogs: [
      dbAuditLogs[1],
      dbAuditLogs[2],
      dbAuditLogs[3],
      dbAuditLogs[4],
      dbAuditLogs[5],
      dbAuditLogs[6],
      dbAuditLogs[7],
      dbAuditLogs[8],
      dbAuditLogs[9],
      dbAuditLogs[10],
      dbAuditLogs[11],
      dbAuditLogs[12],
      dbAuditLogs[13],
      dbAuditLogs[14],
      dbAuditLogs[15],
      dbAuditLogs[16],
      dbAuditLogs[17],
      dbAuditLogs[18],
      dbAuditLogs[19],
      dbAuditLogs[20]
   ],

   auditLogsOperations: dbAuditLogsOperations,

   auditLogsStatuses: dbAuditLogsOperationStatuses,

   auditLogsOrigins: dbAuditLogsOrigins,

   authorities: [
      dbAuthorities["ejbca-ca-instance1"]
   ],

   certificates: [
      dbCertificates["Lukas Kopenec"],
      dbCertificates["CLIENT1"],
      dbCertificates["t1c.com"],
      dbCertificates["GTS Root R1C3"],
      dbCertificates["GTS Root R1"],
      dbCertificates["*.google.com"],
   ],

   clients: [
      dbClients["PT1"],
      dbClients["test-client1"],
      dbClients["TestClient"],
   ],

   credentials: [
   ],

   credentialProviders: [
      {
         uuid: "89",
         name: "TCP",
         functionGroups: [
            {
               id: 1,
               name: "credentialProvider",
               code: "credentialProvider",
               kinds: ["default"],
               endPoints: [
                  {
                     id: 1,
                     name: "listAttributeDefinitions",
                     context: "/v1/credentialProvider/attributes",
                     method: "GET",
                     required: true,
                  },
                  {
                     id: 3,
                     name: "listSupportedFunctions",
                     context: "/v1",
                     method: "GET",
                     required: true,
                  },
                  {
                     id: 2,
                     name: "validateAttributes",
                     context: "/v1/credentialProvider/attributes/validate",
                     method: "POST",
                     required: true,
                  },
               ],
            },
         ],
         url: "localhost:8081",
         status: "REGISTERED",
      },
   ],
   credentialProviderAttributes: [
      {
         uuid: "e334e055-900e-43f1-aedc-54e837028de0",
         name: "keyStoreType",
         label: "Key Store Type",
         type: "STRING",
         required: true,
         readOnly: false,
         editable: true,
         visible: true,
         multiValue: false,
         description: "",
         validationRegex: "",
         dependsOn: [],
         value: "",
      },
      {
         uuid: "6df7ace9-c501-4d58-953c-f8d53d4fb378",
         name: "keyStore",
         label: "Key Store",
         type: "STRING",
         required: true,
         readOnly: false,
         editable: true,
         visible: true,
         multiValue: false,
         description: "",
         validationRegex: "",
         dependsOn: [],
         value: "",
      },
      {
         uuid: "d975fe42-9d09-4740-a362-fc26f98e55ea",
         name: "keystoreStorePassword",
         label: "Key Store Password",
         type: "SECRET",
         required: true,
         readOnly: false,
         editable: false,
         visible: true,
         multiValue: false,
         description: "",
         validationRegex: "",
         dependsOn: [],
         value: "",
      },
   ],

   raProfiles: [
      dbRaProfiles["localhostProfile"],
      dbRaProfiles["DEMO-PROFILE"],
      dbRaProfiles["DEMO-RA-PROFILE2"]
   ],

   endEntityProfiles: [
      { id: 1, name: "Demo TLS End Entity Profile" },
      { id: 2, name: "Management End Entity Profile" },
      { id: 3, name: "MS Sub CA End Entity Profile" },
   ],
   certificateProfiles: [
      { id: 1, endEntityProfileId: 1, name: "Demo TLS Certificate Profile" },
      { id: 2, endEntityProfileId: 1, name: "Trial TLS Certificate Profile" },
      { id: 3, endEntityProfileId: 2, name: "Management Certificate Profile" },
      { id: 4, endEntityProfileId: 2, name: "Office Certificate Profile" },
      { id: 5, endEntityProfileId: 3, name: "MS Sub CA Certificate Profile" },
      { id: 6, endEntityProfileId: 3, name: "MS Super CA Certificate Profile" },
   ],
   certificationAuthorities: [
      { id: 1, endEntityProfileId: 1, name: "Demo Server CA" },
      { id: 2, endEntityProfileId: 1, name: "Demo Server Sub CA" },
      { id: 3, endEntityProfileId: 2, name: "Management CA" },
      { id: 4, endEntityProfileId: 2, name: "Management Super CA" },
      { id: 5, endEntityProfileId: 3, name: "MS CA" },
      { id: 6, endEntityProfileId: 3, name: "MS MY CA" },
   ],
   connectors: [
      {
         uuid: "asasas",
         name: "ejbca-cert",
         status: "REGISTERED",
         authType: "NONE",
         authAttributes: [],
         functionGroups: [
            {
               id: 1,
               name: "authorityProvider",
               code: "authorityProvider",
               kinds: ["default", "T1", "t2", "t3", "t4"],
               endPoints: [
                  {
                     id: 1,
                     name: "listAttributeDefinitions",
                     context: "/v1/attributes",
                     method: "GET",
                     required: true,
                  },
                  {
                     id: 3,
                     name: "listSupportedFunctions",
                     context: "/v1",
                     method: "GET",
                     required: true,
                  },
                  {
                     id: 2,
                     name: "validateAttributes",
                     context: "/v1/attributes/validate",
                     method: "POST",
                     required: true,
                  },
               ],
            },
            {
               id: 2,
               name: "credentialProvider",
               code: "credentialProvider",
               kinds: ["default", "T1", "t2", "t3", "t4"],
               endPoints: [
                  {
                     id: 1,
                     name: "listAttributeDefinitions",
                     context: "/v1/attributes",
                     method: "GET",
                     required: true,
                  },
                  {
                     id: 3,
                     name: "listSupportedFunctions",
                     context: "/v1",
                     method: "GET",
                     required: true,
                  },
                  {
                     id: 2,
                     name: "validateAttributes",
                     context: "/v1/attributes/validate",
                     method: "POST",
                     required: true,
                  },
               ],
            },
            {
               id: 3,
               name: "discoveryProvider",
               code: "discoveryProvider",
               kinds: ["default", "T1", "t2"],
               endPoints: [
                  {
                     id: 1,
                     name: "listAttributeDefinitions",
                     context: "/v1/attributes",
                     method: "GET",
                     required: true,
                  },
                  {
                     id: 3,
                     name: "listSupportedFunctions",
                     context: "/v1",
                     method: "GET",
                     required: true,
                  },
                  {
                     id: 2,
                     name: "validateAttributes",
                     context: "/v1/attributes/validate",
                     method: "POST",
                     required: true,
                  },
               ],
            },
         ],
         url: "http://localhost:8081",
      },
      {
         uuid: "29",
         name: "soft-ks-provider5",
         authType: "NONE",
         authAttributes: [],
         functionGroups: [
            {
               id: 1,
               name: "credentialProvider",
               code: "credentialProvider",
               kinds: ["default"],
               endPoints: [
                  {
                     id: 1,
                     name: "listAttributeDefinitions",
                     context: "/v1/attributes",
                     method: "GET",
                     required: true,
                  },
                  {
                     id: 3,
                     name: "listSupportedFunctions",
                     context: "/v1",
                     method: "GET",
                     required: true,
                  },
                  {
                     id: 2,
                     name: "validateAttributes",
                     context: "/v1/attributes/validate",
                     method: "POST",
                     required: true,
                  },
               ],
            },
         ],
         url: "http://localhost:8081",
         status: "REGISTERED",
      },
      {
         uuid: "31",
         name: "T123",
         authType: "NONE",
         authAttributes: [],
         functionGroups: [
            {
               id: 1,
               name: "credentialProvider",
               code: "credentialProvider",
               kinds: ["default"],
               endPoints: [
                  {
                     id: 1,
                     name: "listAttributeDefinitions",
                     context: "/v1/attributes",
                     method: "GET",
                     required: true,
                  },
                  {
                     id: 3,
                     name: "listSupportedFunctions",
                     context: "/v1",
                     method: "GET",
                     required: true,
                  },
                  {
                     id: 2,
                     name: "validateAttributes",
                     context: "/v1/attributes/validate",
                     method: "POST",
                     required: true,
                  },
               ],
            },
         ],
         url: "http://10.1.22.119:8080",
         status: "REGISTERED",
      },
      {
         uuid: "22",
         name: "testConnector1",
         authType: "NONE",
         authAttributes: [],
         functionGroups: [],
         url: "http://10.1.22.119:8080",
         status: "REGISTERED",
      },
   ],
   connectorAttributes: [
      {
         uuid: "e334e055-900e-43f1-aedc-54e837028de0",
         name: "keyStoreType",
         label: "Key Store Type",
         type: "LIST",
         required: true,
         readOnly: false,
         editable: true,
         visible: true,
         multiValue: false,
         value: ["PKCS12", "JKS"],
      },
      {
         uuid: "6df7ace9-c501-4d58-953c-f8d53d4fb378",
         name: "keyStore",
         label: "Key Store",
         type: "FILE",
         required: true,
         readOnly: false,
         editable: true,
         visible: true,
         multiValue: false,
      },
      {
         uuid: "d975fe42-9d09-4740-a362-fc26f98e55ea",
         name: "keystoreStorePassword",
         label: "Key Store Password",
         type: "SECRET",
         required: true,
         readOnly: false,
         editable: true,
         visible: true,
         multiValue: false,
      },
      {
         uuid: "c4454807-805a-44e2-81d1-94b56e993786",
         name: "trustStoreType",
         label: "Trust Store Type",
         type: "LIST",
         required: false,
         readOnly: false,
         editable: true,
         visible: true,
         multiValue: false,
         value: ["PKCS12", "JKS"],
      },
      {
         uuid: "6a245220-eaf4-44cb-9079-2228ad9264f5",
         name: "trustStore",
         label: "Trust Store",
         type: "FILE",
         required: false,
         readOnly: false,
         editable: true,
         visible: true,
         multiValue: false,
      },
      {
         uuid: "85a874da-1413-4770-9830-4188a37c95ee",
         name: "trustStorePassword",
         label: "Trust Store Password",
         type: "SECRET",
         required: false,
         readOnly: false,
         editable: true,
         visible: true,
         multiValue: false,
      },
   ],
   raProfilesAttributes: [
      {
         uuid: "72498bd8-37f9-4fcb-86cb-d23570cf916f",
         name: "tokenType",
         label: "Token Type",
         type: "LIST",
         required: true,
         readOnly: false,
         editable: true,
         visible: true,
         multiValue: false,
         value: ["JKS", "P12", "PEM", "USERGENERATED"],
         dependsOn: [],
         validationRegex: "",
      },
      {
         uuid: "223f2d64-3c70-40a2-9f51-255d32c897b8",
         name: "initialEndEntityStatus",
         label: "Initial End Entity Status",
         type: "LIST",
         required: true,
         readOnly: false,
         editable: true,
         visible: true,
         multiValue: false,
         description: "Initial state will be used when end entity is created.",
         value: ["NEW", "ANY"],
      },
      {
         uuid: "d5f1c8aa-c4b4-4cb5-bf66-b8563c6647f1",
         name: "description",
         label: "Description",
         type: "STRING",
         required: false,
         readOnly: false,
         editable: true,
         visible: true,
         multiValue: false,
         description: "Description / Comment",
      },
      {
         uuid: "baf2d142-f35a-437f-81c7-35c128881fc0",
         name: "endEntityProfileName",
         label: "End Entity Profile Name",
         type: "LIST",
         required: true,
         readOnly: false,
         editable: true,
         visible: true,
         multiValue: false,
         value: [
            { id: 810251114, name: "ISEndEntityProfile" },
            { id: 1058487535, name: "TestEndEntityProfile" },
            { id: 1283673753, name: "DemoOCSPResponderEndEntityProfile" },
            { id: 1003498224, name: "DemoDocumentSigningEndEntityProfile" },
            { id: 355266510, name: "DemoMSSubCAEEProfile" },
            { id: 1671421061, name: "certManager" },
            { id: 269092839, name: "DemoTLSServerEndEntityProfile" },
            { id: 1824207592, name: "DemoClientEndEntityProfile" },
            { id: 1540822843, name: "DemoExtendedPublisherEndEntityProfile" },
            { id: 1, name: "EMPTY" },
         ],
      },
      {
         uuid: "eb57a756-5a11-4d31-866b-e3f066f7a2b9",
         name: "certificateProfileName",
         label: "Certificate Profile Name",
         type: "LIST",
         required: true,
         readOnly: false,
         editable: true,
         visible: true,
         multiValue: false,
         attributeCallback: {
            callbackMethod: "listCertificateProfiles",
            mappings: [
               {
                  from: "authorityUuid",
                  to: "authorityUuid",
                  attributeType: "STRING",
                  targets: ["pathVariable"],
                  value: 19,
               },
               {
                  from: "endEntityProfileId",
                  to: "endEntityProfileName",
                  attributeType: "STRING",
                  targets: ["pathVariable"],
               },
            ],
         },
      },
      {
         uuid: "eb57a756-5a11-4d31-866b-e3f066f7a2b9",
         name: "certificationAuthorityName",
         label: "Certification Authority Name",
         type: "LIST",
         required: true,
         readOnly: false,
         editable: true,
         visible: true,
         multiValue: false,
         attributeCallback: {
            callbackMethod: "listCAsInProfile",
            mappings: [
               {
                  from: "authorityUuid",
                  to: "authorityUuid",
                  attributeType: "STRING",
                  targets: ["pathVariable"],
                  value: 19,
               },
               {
                  from: "endEntityProfileId",
                  to: "endEntityProfileName",
                  attributeType: "STRING",
                  targets: ["pathVariable"],
               },
            ],
         },
      },
      {
         uuid: "e0ab3b4e-7681-4a9f-aec5-e025eb1a56a4",
         name: "sendNotifications",
         label: "Send Notifications",
         type: "BOOLEAN",
         required: true,
         readOnly: false,
         editable: true,
         visible: true,
         multiValue: false,
         value: false,
      },
      {
         uuid: "417077da-bb2b-4f35-a0f7-abf824e345ec",
         name: "keyRecoverable",
         label: "Key Recoverable",
         type: "BOOLEAN",
         required: true,
         readOnly: false,
         editable: true,
         visible: true,
         multiValue: false,
         value: false,
      },
   ],
   allAttributeResponse: {
      authorityProvider: {
         ADCS: [
            {
               uuid: "93ca0ba2-3863-4ffa-a469-fd14ab3992bf",
               name: "address",
               label: "MS-ADCS Address",
               type: "STRING",
               required: true,
               readOnly: false,
               editable: true,
               visible: true,
               multiValue: false,
               description: "Address of ADCS server.",
               value: "",
               validationRegex:
                  "^((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])|(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\\-]*[a-zA-Z0-9])\\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\\-]*[A-Za-z0-9]))$",
            },
            {
               uuid: "d9f79ba6-47e5-437b-a7bc-82dbafa9cf01",
               name: "https",
               label: "HTTPS Enabled",
               type: "BOOLEAN",
               required: true,
               readOnly: false,
               editable: true,
               visible: true,
               multiValue: false,
               description: "Use https for connection with ADCS server.",
               value: false,
            },
            {
               uuid: "d9f79ba6-47e5-437b-a7bc-82dbafa9cf02",
               name: "kind",
               type: "STRING",
               label: "Credential Type",
               required: true,
               readOnly: true,
               editable: true,
               visible: false,
               multiValue: false,
               description: "Authentication to communicate with MS ADCS service",
               value: "basic",
            },
            {
               uuid: "d9f79ba6-47e5-437b-a7bc-82dbafa9cf03",
               name: "credential",
               label: "Credential Kind",
               type: "LIST",
               required: true,
               readOnly: false,
               editable: true,
               visible: true,
               multiValue: false,
               value: "",
               description: "Credential for the communication",
               attributeCallback: {
                  callbackMethod: "coreGetCredentials",
                  mappings: [
                     {
                        from: "credentialKind",
                        to: "credentialKind",
                        attributeType: "STRING",
                        targets: ["pathVariable"],
                        value: "basic",
                     },
                  ],
               },
            },
         ],
      },
      discoveryProvider: {
         ADCS: [
            {
               uuid: "87a94421-c5d8-4a23-bb2c-bbee76cb4eaa",
               name: "ca instance",
               label: "CA Instance",
               type: "LIST",
               required: true,
               readOnly: false,
               editable: true,
               visible: true,
               multiValue: false,
               value: [
                  "stolin",
                  "Test ADCS",
                  "ADCS-DEMO",
                  "ADCS-DEMO-CA",
                  "ADCS-DEMO-001",
                  "TESTING-AUTHORITY",
                  "TESTING-AUTHORITY-X",
               ],
            },
         ],
      },
   },
   acmeProfiles: [
      {
         uuid: "6fae456b-57ee-4cbe-b308-106fc8db8b1a",
         name: "asqwered1",
         description: "Demo Profile",
         raProfileName: "A",
         raProfileUuid: "883ef2c3-c9e3-460f-b55b-e00e19fea7a8",
         directoryUrl: "https://localhost:8443/api/acme/asqwered1/directory",
         enabled: false,
      },
   ],
   acmeProfileDetail: {
      uuid: "6fae456b-57ee-4cbe-b308-106fc8db8b1a",
      name: "asqwered1",
      description: "Demo Profile",
      dnsResolverIp: "127.0.0.1",
      dnsResolverPort: "53",
      raProfile: {
         uuid: "883ef2c3-c9e3-460f-b55b-e00e19fea7a8",
         name: "A",
         description: "",
         authorityInstanceUuid: "8ce1cc98-2853-48bf-a6be-5815bfe26568",
         authorityInstanceName: "A",
         attributes: [
            {
               uuid: "87a94421-c5d8-4a23-bb2c-bbee76cb4ea9",
               name: "template",
               label: "Template",
               type: "LIST",
               value: "Copy of Web Server",
               required: false,
               editable: true,
               multiValue: false,
               readOnly: false,
               visible: true
            },
            {
               uuid: "1467ffaa-445c-11ec-81d3-0242ac130003",
               name: "caAdcs",
               label: "Certification Authority",
               type: "LIST",
               value: "vmi307469.3key.local\\Demo MS Sub CA",
               required: false,
               editable: true,
               multiValue: false,
               readOnly: false,
               visible: true
            },
         ],
         enabled: true,
      },
      retryInterval: 30,
      termsOfServiceChangeDisable: false,
      termsOfServiceChangeUrl: "sample.org",
      validity: 3000,
      directoryUrl: "https://localhost:8443/api/acme/asqwered1/directory",
      enabled: false,
      requireContact: false,
      requireTermsOfService: true,
   },
};

export function createAdministrator(
   name: string,
   surname: string,
   username: string,
   email: string,
   certificate: string,
   description: string,
   role: string,
   enabled: boolean
): string {
   const id =
      dbData.administrators[dbData.administrators.length - 1]?.uuid + 1 || 1;

   return id.toString();
}

export function createClient(
   name: string,
   description: string,
   enabled: boolean
): string {
   const idSegments = [];
   for (let i = 0; i < 8; ++i) {
      idSegments.push(randomChar());
   }
   const id = idSegments.join("");

   dbData.clients.push({
      uuid: "12",
      name,
      serialNumber: "testSerial",
      certificate: undefined,
      description,
      enabled,
      auth: [],
   });

   return id.toString();
}

export function connectConnector(
   name: string,
   url: string
): ConnectorConnectionDTO[] {

   return [
      {
         functionGroup: {
            id: 1,
            kinds: ["SoftKeyStore"],
            name: "credentialProvider",
            functionGroupCode: "credentialProvider",
            endPoints: [
               {
                  id: 3,
                  name: "listSupportedFunctions",
                  context: "/v1",
                  method: "GET",
                  required: true,
               },
               {
                  id: 2,
                  name: "validateAttributes",
                  context: "/v1/attributes/validate",
                  method: "POST",
                  required: true,
               },
               {
                  id: 1,
                  name: "listAttributeDefinitions",
                  context: "/v1/attributes",
                  method: "GET",
                  required: true,
               },
            ],
         },
      },
      {
         functionGroup: {
            id: 2,
            name: "authorityProvider",
            functionGroupCode: "authorityProvider",
            kinds: ["default"],
            endPoints: [
               {
                  id: 3,
                  name: "listSupportedFunctions",
                  context: "/v1",
                  method: "GET",
                  required: true,
               },
               {
                  id: 2,
                  name: "validateAttributes",
                  context: "/v1/attributes/validate",
                  method: "POST",
                  required: true,
               },
               {
                  id: 1,
                  name: "listAttributeDefinitions",
                  context: "/v1/attributes",
                  method: "GET",
                  required: true,
               },
            ],
         },
      },
   ];

}

export function createCredential(
   name: string,
   kind: string,
   connectorUuid: string,
   attributes: any
): string {

   const uuid = crypto.randomUUID();

   dbData.credentials.push({
      uuid: uuid,
      kind: kind,
      name: name,
      attributes: [],
      connectorUuid: "1212",
      connectorName: "Name2",
   });

   return uuid;

}

export function createAuthority(
   name: string,
   attributes: any,
   credentialUuid: string,
   status: string,
   connectorUuid: string,
   kind: string
): string {

   const uuid = crypto.randomUUID();

   dbData.authorities.push({
      id: "12",
      uuid: "asasas",
      name: name,
      connectorUuid: "59",
      attributes: [],
      kind: kind,
      credential: { attributes: [] },
      connectorName: "Name2",
   });

   return uuid;

}

export function createConnector(
   name: string,
   url: string,
   status: string,
   functionGroups: any
): string {

   const uuid = crypto.randomUUID();

   dbData.connectors.push({
      uuid: "123",
      functionGroups: [],
      name: name,
      url: url,
      status: "In Progress",
      authType: "NONE",
      authAttributes: [],
   });

   return uuid;

}

export function createRaProfile(name: string, description: string): string {

   const uuid = crypto.randomUUID();

   dbData.raProfiles.push({
      uuid,
      enabled: true,
      name: name,
      description,
      authorityInstanceUuid: "21",
      authorityInstanceName: "Name2",
   });

   return uuid;

}

export function createAcmeProfile(name: string, description: string): string {

   const uuid = crypto.randomUUID();

   dbData.acmeProfiles.push({
      uuid,
      name: name,
      description: description,
      raProfileName: "A",
      raProfileUuid: "883ef2c3-c9e3-460f-b55b-e00e19fea7a8",
      directoryUrl: "https://localhost:8443/api/acme/asqwered1/directory",
      enabled: false,
   });

   return uuid;

}


export function getOrCreateCertificate(certificateContent: string | undefined, certificateUuid: string | undefined): CertificateDTO | undefined {

   let certificate: CertificateDTO | undefined;

   if (certificateUuid) {
      const crt = dbData.certificates.find(cerificate => cerificate.uuid === certificateUuid);
      certificate = crt;
   }

   if (!certificateContent) return certificate;

   const acrt = certificatePEM2CertificateDTO(certificateContent);
   const crt = dbData.certificates.find(certificate => certificate.fingerprint === acrt.fingerprint && certificate.serialNumber === acrt.serialNumber);

   if (crt) return crt;

   acrt.uuid = crypto.randomUUID();
   dbData.certificates.push(acrt);

   return acrt;

}