import { AttributeDescriptorCollectionDTO, AttributeDTO } from "api/.common/AttributeDTO";
import { AuthType, ConnectorHealthDTO, FunctionGroupDTO } from "api/connectors";


export interface DbRemoteConnector {
   url: string;
   health: ConnectorHealthDTO;
   authType: AuthType;
   authAttributes: AttributeDTO[];
   attributes: AttributeDescriptorCollectionDTO;
   functionGroups: FunctionGroupDTO[];
}


interface DbRemoteConnectors {
   [url: string]: DbRemoteConnector;
}


export const dbRemoteConnectors: DbRemoteConnectors = {

   "http://localhost:1": {

      url: "http://localhost:1",

      health: {
         status: "nok"
      },

      authType: "none",
      authAttributes: [],

      functionGroups: [
      ],

      attributes: {

         credentialProvider: {

            Test: [
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
               }

            ]
         }

      }
   },

   "http://localhost:10000": {

      url: "http://localhost:10000",
      health: {
         status: "ok"
      },

      authType: "none",
      authAttributes: [],

      attributes: {

         credentialProvider: {
            Basic: [
               {
                  uuid: "fe2d6d35-fb3d-4ea0-9f0b-7e39be93beeb",
                  name: "username",
                  label: "Username",
                  type: "STRING",
                  required: true,
                  readOnly: false,
                  editable: true,
                  visible: true,
                  multiValue: false
               },
               {
                  uuid: "04506d45-c865-4ddc-b6fc-117ee5d5c8e7",
                  name: "password",
                  label: "Password",
                  type: "SECRET",
                  required: true,
                  readOnly: false,
                  editable: true,
                  visible: true,
                  multiValue: false
               }
            ],
            ApiKey: [
               {
                  uuid: "aac5c2d5-5dc3-4ddb-9dfa-3d76b99135f8",
                  name: "apiKey",
                  label: "API Key",
                  type: "SECRET",
                  required: true,
                  readOnly: false,
                  editable: true,
                  visible: true,
                  multiValue: false
               }
            ],
            SoftKeyStore: [
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
                  value: [
                     "PKCS12",
                     "JKS"
                  ]
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
                  multiValue: false
               },
               {
                  uuid: "d975fe42-9d09-4740-a362-fc26f98e55ea",
                  name: "keyStorePassword",
                  label: "Key Store Password",
                  type: "SECRET",
                  required: true,
                  readOnly: false,
                  editable: true,
                  visible: true,
                  multiValue: false
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
                  value: [
                     "PKCS12",
                     "JKS"
                  ]
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
                  multiValue: false
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
                  multiValue: false
               }
            ]
         }

      },

      functionGroups: [
         {
            uuid: "e8ae0a8c-ed12-4f63-804f-2659ee9dff6e",
            name: "credentialProvider",
            functionGroupCode: "credentialProvider",
            kinds: ["SoftKeyStore", "Basic", "ApiKey"],
            endPoints: [
               {
                  name: "listAttributeDefinitions",
                  context: "/v1/credentialProvider/{kind}/attributes",
                  method: "GET",
                  required: false
               },
               {
                  name: "validateAttributes",
                  context: "/v1/credentialProvider/{kind}/attributes/validate",
                  method: "POST",
                  required: false
               }
            ],
         }
      ],

   },

   "http://localhost:10001": {

      url: "http://localhost:10001",
      health: {
         status: "unknown"
      },

      authType: "none",
      authAttributes: [],

      attributes: {
         discoveryProvider: {
            "IP-Hostname": [
               {
                  uuid: "1b6c48ad-c1c7-4c82-91ef-3b61bc9f52ac",
                  name: "ip",
                  label: "IP/Hostname",
                  type: "STRING",
                  required: true,
                  readOnly: false,
                  editable: true,
                  visible: true,
                  multiValue: false,
                  description: "Multiple values can be given seperated by comma ','."
               },
               {
                  uuid: "a9091e0d-f9b9-4514-b275-1dd52aa870ec",
                  name: "port",
                  label: "Port",
                  type: "STRING",
                  required: false,
                  readOnly: false,
                  editable: true,
                  visible: true,
                  multiValue: false,
                  description: "Multiple values can be given seperated by comma ','.",
                  value: "443"
               },
               {
                  uuid: "3c70d728-e8c3-40f9-b9b2-5d7256f89ef0",
                  name: "allPorts",
                  label: "All Ports?",
                  type: "LIST",
                  required: false,
                  readOnly: false,
                  editable: true,
                  visible: true,
                  multiValue: false,
                  description: "Select to discover certificates from all ports.",
                  value: [
                     "No",
                     "Yes"
                  ]
               }
            ]
         }

      },

      functionGroups: [
         {
            uuid: "a6c4042f-9465-4476-9528-1efd6caaf944",
            name: "discoveryProvider",
            functionGroupCode: "discoveryProvider",
            kinds: ["IP-Hostname"],
            endPoints: [
               {
                  name: "discoverCertificate",
                  context: "/v1/discoveryProvider/discover",
                  method: "POST",
                  required: false
               },
               {
                  name: "listAttributeDefinitions",
                  context: "/v1/discoveryProvider/{kind}/attributes",
                  method: "GET",
                  required: false
               },
               {
                  name: "getDiscovery",
                  context: "/v1/discoveryProvider/discover/{uuid}",
                  method: "POST",
                  required: false
               },
               {
                  name: "validateAttributes",
                  context: "/v1/discoveryProvider/{kind}/attributes/validate",
                  method: "POST",
                  required: false
               },
               {
                  name: "listSupportedFunctions",
                  context: "/v1",
                  method: "GET",
                  required: false
               }
            ],
         }
      ],

   },

   "http://localhost:10002": {

      url: "http://localhost:10002",
      health: {
         status: "ok"
      },

      authType: "none",
      authAttributes: [],

      attributes: {
         discoveryProvider: {
            Cryptosense: [
               {
                  uuid: "1b6c48ad-c1c7-4c82-91ef-3e61bc9f52ac",
                  name: "apiUrl",
                  label: "Analyzer API URL",
                  type: "STRING",
                  required: true,
                  readOnly: false,
                  editable: true,
                  visible: true,
                  multiValue: false,
                  description: "Cryptosense Analyzer URL to access the API",
                  validationRegex: "^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$",
                  value: "https://analyzer.cryptosense.com/api/v2"
               },
               {
                  uuid: "9379ca2c-aa51-42c8-8afd-2e2d16c99c56",
                  name: "credentialKind",
                  label: "Credential Kind",
                  type: "STRING",
                  required: false,
                  readOnly: true,
                  editable: true,
                  visible: false,
                  multiValue: false,
                  description: "API Key to authorize communication with the Analyzer",
                  value: "ApiKey"
               },
               {
                  uuid: "9379ca2c-aa51-42c8-8afd-2a2d16c99c57",
                  name: "apiKey",
                  label: "API Key",
                  type: "CREDENTIAL",
                  required: true,
                  readOnly: false,
                  editable: true,
                  visible: true,
                  multiValue: false,
                  description: "Credential for the communication",
                  attributeCallback: {
                     callbackContext: "core/getCredentials",
                     callbackMethod: "GET",
                     mappings: [
                        {
                           to: "credentialKind",
                           targets: ["pathVariable"],
                           value: "ApiKey"
                        }
                     ]
                  }
               },
               {
                  uuid: "131f64b8-52e4-4cb8-b7de-63ca61c35209",
                  name: "project",
                  label: "Project",
                  type: "LIST",
                  required: true,
                  readOnly: false,
                  editable: true,
                  visible: true,
                  multiValue: false,
                  description: "List of available projects",
                  attributeCallback: {
                     callbackContext: "/v1/discoveryProvider/listAvailableProjects",
                     callbackMethod: "POST",
                     mappings: [
                        {
                           from: "apiUrl",
                           to: "apiUrl",
                           targets: ["body"]
                        },
                        {
                           from: "apiKey",
                           attributeType: "CREDENTIAL",
                           to: "credentialKind",
                           targets: ["body"]
                        }
                     ]
                  },
                  value: true
               },
               {
                  uuid: "131f64b8-52e4-4db8-b7de-63ca61c35209",
                  name: "report",
                  label: "Report",
                  type: "LIST",
                  required: true,
                  readOnly: false,
                  editable: true,
                  visible: true,
                  multiValue: false,
                  description: "List of available reports",
                  attributeCallback: {
                     callbackContext: "/v1/discoveryProvider/listAvailableReports/{projectId}",
                     callbackMethod: "POST",
                     mappings: [
                        {
                           from: "apiUrl",
                           to: "apiUrl",
                           targets: ["body"]
                        },
                        {
                           from: "project",
                           to: "projectId",
                           targets: ["pathVariable"]
                        },
                        {
                           from: "apiKey",
                           attributeType: "CREDENTIAL",
                           to: "credentialKind",
                           targets: ["body"]
                        }
                     ]
                  },
                  value: true
               }
            ]
         }
      },

      functionGroups: [
         {
            uuid: "a6c4042f-9465-4476-9528-1efd6caaf944",
            name: "discoveryProvider",
            functionGroupCode: "discoveryProvider",
            kinds: ["Cryptosense"],
            endPoints: [
               {
                  name: "listAvailableProjects",
                  context: "/v1/discoveryProvider/listAvailableProjects",
                  method: "POST",
                  required: false
               },
               {
                  name: "listAvailableReports",
                  context: "/v1/discoveryProvider/listAvailableReports/{projectId}",
                  method: "POST",
                  required: false
               },
               {
                  name: "discoverCertificate",
                  context: "/v1/discoveryProvider/discover",
                  method: "POST",
                  required: false
               },
               {
                  name: "listAttributeDefinitions",
                  context: "/v1/discoveryProvider/{kind}/attributes",
                  method: "GET",
                  required: false
               },
               {
                  name: "listCertificates",
                  context: "/v1/discoveryProvider/listCertificates/{reportId}",
                  method: "POST",
                  required: false
               },
               {
                  name: "getDiscovery",
                  context: "/v1/discoveryProvider/discover/{uuid}",
                  method: "POST",
                  required: false
               },
               {
                  name: "validateAttributes",
                  context: "/v1/discoveryProvider/{kind}/attributes/validate",
                  method: "POST",
                  required: false
               },
               {
                  name: "listSupportedFunctions",
                  context: "/v1",
                  method: "GET",
                  required: false
               },
               {
                  name: "checkHealth",
                  context: "/v1/health",
                  method: "GET",
                  required: false
               }
            ],
         }
      ]

   },

   "http://localhost:10003": {

      url: "http://localhost:10003",

      health: {

         status: "nok",

         parts: {

            "db": {
               status: "ok"
            },

            "authority-lab02-ADCS": {
               status: "ok"
            },

            "authority-xx": {
               status: "ok"
            },

            "authority-test": {
               status: "ok"
            },

            "authority-11": {
               status: "nok",
               description: "SunCertPathBuilderException: unable to find valid certification path to requested target"
            },

            "authority-12": {
               status: "ok"
            },

            "authority-111": {
               status: "ok"
            }

         }

      },

      authType: "none",
      authAttributes: [],

      attributes: {
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
                  validationRegex: "^((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])|(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\\-]*[a-zA-Z0-9])\\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\\-]*[A-Za-z0-9]))$"
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
                  value: false
               },
               {
                  uuid: "9587a320-a487-4084-9645-0b6c24636fa6",
                  name: "port",
                  label: "Port",
                  type: "NUMBER",
                  required: true,
                  readOnly: false,
                  editable: true,
                  visible: true,
                  multiValue: false,
                  description: "Define WinRM port, default port for http is 5985 and for https 5986.",
                  value: 5985
               },
               {
                  uuid: "d9f79ba6-47e5-437b-a7bc-82dbafa9cf03",
                  name: "credential",
                  label: "Credential",
                  type: "CREDENTIAL",
                  required: true,
                  readOnly: false,
                  editable: true,
                  visible: true,
                  multiValue: false,
                  description: "Credential for the communication",
                  attributeCallback: {
                     callbackContext: "core/getCredentials",
                     callbackMethod: "GET",
                     mappings: [
                        {
                           to: "credentialKind",
                           targets: ["pathVariable"],
                           value: "Basic"
                        }
                     ]
                  }
               }
            ]
         },
         discoveryProvider: {
            ADCS: [
               {
                  uuid: "87a94421-c5d8-4a23-bb2c-bbee76cb4eaa",
                  name: "caInstance",
                  label: "CA Instance",
                  type: "LIST",
                  required: true,
                  readOnly: false,
                  editable: true,
                  visible: true,
                  multiValue: false,
                  value: [
                     "lab02-ADCS",
                     "xx",
                     "test",
                     "11",
                     "12",
                     "111"
                  ]
               },
               {
                  uuid: "25b35cf2-45cb-4e4c-b5b3-a99ecb8aa8e6",
                  name: "caAdcs",
                  label: "Certificate Authority",
                  type: "LIST",
                  required: false,
                  readOnly: false,
                  editable: true,
                  visible: true,
                  multiValue: true,
                  attributeCallback: {
                     callbackContext: "/v1/discoveryProvider/listCertificateAuthority/{caInstance}",
                     callbackMethod: "GET",
                     mappings: [
                        {
                           from: "caInstance",
                           to: "caInstance",
                           targets: ["pathVariable"]
                        }
                     ]
                  },
                  value: []
               },
               {
                  uuid: "83c0f20b-4789-44f2-abd2-a84c131d5e97",
                  name: "template",
                  label: "Template",
                  type: "LIST",
                  required: false,
                  readOnly: false,
                  editable: true,
                  visible: true,
                  multiValue: true,
                  attributeCallback: {
                     callbackContext: "/v1/discoveryProvider/listTemplate/{caInstance}",
                     callbackMethod: "GET",
                     mappings: [
                        {
                           from: "caInstance",
                           to: "caInstance",
                           targets: ["pathVariable"]
                        }
                     ]
                  },
                  value: []
               }
            ]
         }
      },

      functionGroups: [
         {
            uuid: "736b0fd6-5ea0-4e10-abe7-cfed39cc2a1a",
            name: "authorityProvider",
            functionGroupCode: "authorityProvider",
            kinds: ["ADCS"],
            endPoints: [
               {
                  name: "getConnection",
                  context: "/v1/authorityProvider/authorities/{uuid}/connect",
                  method: "GET",
                  required: false
               },
               {
                  name: "listIssueCertificateAttributes",
                  context: "/v2/authorityProvider/authorities/{uuid}/certificates/issue/attributes",
                  method: "GET",
                  required: false
               },
               {
                  name: "issueCertificate",
                  context: "/v2/authorityProvider/authorities/{uuid}/certificates/issue",
                  method: "POST",
                  required: false
               },
               {
                  name: "renewCertificate",
                  context: "/v2/authorityProvider/authorities/{uuid}/certificates/renew",
                  method: "POST",
                  required: false
               },
               {
                  name: "updateAuthorityInstance",
                  context: "/v1/authorityProvider/authorities/{uuid}",
                  method: "POST",
                  required: false
               },
               {
                  name: "removeAuthorityInstance",
                  context: "/v1/authorityProvider/authorities/{uuid}",
                  method: "DELETE",
                  required: false
               },
               {
                  name: "validateAttributes",
                  context: "/v1/authorityProvider/{kind}/attributes/validate",
                  method: "POST",
                  required: false
               },
               {
                  name: "validateRevokeCertificateAttributes",
                  context: "/v2/authorityProvider/authorities/{uuid}/certificates/revoke/attributes/validate",
                  method: "POST",
                  required: false
               },
               {
                  name: "createAuthorityInstance",
                  context: "/v1/authorityProvider/authorities",
                  method: "POST",
                  required: false
               },
               {
                  name: "listRevokeCertificateAttributes",
                  context: "/v2/authorityProvider/authorities/{uuid}/certificates/revoke/attributes",
                  method: "GET",
                  required: false
               },
               {
                  name: "getAuthorityInstance",
                  context: "/v1/authorityProvider/authorities/{uuid}",
                  method: "GET",
                  required: false
               },
               {
                  name: "listAuthorityInstances",
                  context: "/v1/authorityProvider/authorities",
                  method: "GET",
                  required: false
               },
               {
                  name: "listRAProfileAttributes",
                  context: "/v1/authorityProvider/authorities/{uuid}/raProfile/attributes",
                  method: "GET",
                  required: false
               },
               {
                  name: "revokeCertificate",
                  context: "/v2/authorityProvider/authorities/{uuid}/certificates/revoke",
                  method: "POST",
                  required: false
               },
               {
                  name: "listAttributeDefinitions",
                  context: "/v1/authorityProvider/{kind}/attributes",
                  method: "GET",
                  required: false
               },
               {
                  name: "validateIssueCertificateAttributes",
                  context: "/v2/authorityProvider/authorities/{uuid}/certificates/issue/attributes/validate",
                  method: "POST",
                  required: false
               },
               {
                  name: "validateRAProfileAttributes",
                  context: "/v1/authorityProvider/authorities/{uuid}/raProfile/attributes/validate",
                  method: "POST",
                  required: false
               }
            ]
         },
         {
            uuid: "a6c4042f-9465-4476-9528-1efd6caaf944",
            name: "discoveryProvider",
            functionGroupCode: "discoveryProvider",
            kinds: ["ADCS"],
            endPoints: [
               {
                  name: "discoverCertificate",
                  context: "/v1/discoveryProvider/discover",
                  method: "POST",
                  required: false
               },
               {
                  name: "validateAttributes",
                  context: "/v1/discoveryProvider/{kind}/attributes/validate",
                  method: "POST",
                  required: false
               },
               {
                  name: "listCAs",
                  context: "/v1/discoveryProvider/listCertificateAuthority/{caInstance}",
                  method: "GET",
                  required: false
               },
               {
                  name: "listAttributeDefinitions",
                  context: "/v1/discoveryProvider/{kind}/attributes",
                  method: "GET",
                  required: false
               },
               {
                  name: "listTemplates",
                  context: "/v1/discoveryProvider/listTemplate/{caInstance}",
                  method: "GET",
                  required: false
               },
               {
                  name: "getDiscovery",
                  context: "/v1/discoveryProvider/discover/{uuid}",
                  method: "POST",
                  required: false
               }

            ]
         }
      ],

   },

   "http://localhost:10004": {

      url: "http://localhost:10004",
      health: {
         status: "unknown"
      },

      authType: "none",
      authAttributes: [],

      attributes: {
         legacyAuthorityProvider: {
            LegacyEjbca: [
               {
                  uuid: "87e968ca-9404-4128-8b58-3ab5db2ba06e",
                  name: "url",
                  label: "EJBCA URL",
                  type: "STRING",
                  required: true,
                  readOnly: false,
                  editable: true,
                  visible: true,
                  multiValue: false,
                  description: "URL of EJBCA web service"
               },
               {
                  uuid: "9379ca2c-aa51-42c8-8afd-2a2d16c99c57",
                  name: "credential",
                  label: "Credential",
                  type: "CREDENTIAL",
                  required: true,
                  readOnly: false,
                  editable: true,
                  visible: true,
                  multiValue: false,
                  description: "Credential for the communication",
                  attributeCallback: {
                     callbackContext: "core/getCredentials",
                     callbackMethod: "GET",
                     mappings: [
                        {
                           to: "credentialKind",
                           targets: ["pathVariable"],
                           value: "SoftKeyStore"
                        }
                     ]
                  }
               }
            ]
         }
      },

      functionGroups: [
         {
            uuid: "435ee47f-fd03-4c50-ae6f-ca60f4829023",
            name: "legacyAuthorityProvider",
            functionGroupCode: "legacyAuthorityProvider",
            kinds: ["LegacyEjbca"],
            endPoints: [
               {
                  name: "getEndEntity",
                  context: "/v1/authorityProvider/authorities/{uuid}/endEntityProfiles/{endEntityProfileName}/endEntities/{endEntityName}",
                  method: "GET",
                  required: false
               },
               {
                  name: "validateRAProfileAttributes",
                  context: "/v1/legacyAuthorityProvider/authorities/{uuid}/raProfile/attributes/validate",
                  method: "POST",
                  required: false
               },
               {
                  name: "updateAuthorityInstance",
                  context: "/v1/authorityProvider/authorities/{uuid}",
                  method: "POST",
                  required: false
               },
               {
                  name: "revokeCertificate",
                  context: "/v1/authorityProvider/authorities/{uuid}/endEntityProfiles/{endEntityProfileName}/certificates/revoke",
                  method: "POST",
                  required: false
               },
               {
                  name: "resetPassword",
                  context: "/v1/authorityProvider/authorities/{uuid}/endEntityProfiles/{endEntityProfileName}/endEntities/{endEntityName}/resetPassword",
                  method: "PUT",
                  required: false
               },
               {
                  name: "listCertificateProfiles",
                  context: "/v1/authorityProvider/authorities/{uuid}/endEntityProfiles/{endEntityProfileId}/certificateprofiles",
                  method: "GET",
                  required: false
               },
               {
                  name: "listAttributeDefinitions",
                  context: "/v1/legacyAuthorityProvider/{kind}/attributes",
                  method: "GET",
                  required: false
               },
               {
                  name: "listEntityProfiles",
                  context: "/v1/authorityProvider/authorities/{uuid}/endEntityProfiles",
                  method: "GET",
                  required: false
               },
               {
                  name: "listAuthorityInstances",
                  context: "/v1/authorityProvider/authorities",
                  method: "GET",
                  required: false
               },
               {
                  name: "createAuthorityInstance",
                  context: "/v1/authorityProvider/authorities",
                  method: "POST",
                  required: false
               },
               {
                  name: "removeAuthorityInstance",
                  context: "/v1/authorityProvider/authorities/{uuid}",
                  method: "DELETE",
                  required: false
               },
               {
                  name: "issueCertificate",
                  context: "/v1/authorityProvider/authorities/{uuid}/endEntityProfiles/{endEntityProfileName}/certificates/issue",
                  method: "POST",
                  required: false
               },
               {
                  name: "getAuthorityInstance",
                  context: "/v1/authorityProvider/authorities/{uuid}",
                  method: "GET",
                  required: false
               },
               {
                  name: "getConnection",
                  context: "/v1/authorityProvider/authorities/{uuid}/connect",
                  method: "GET",
                  required: false
               },
               {
                  name: "listSupportedFunctions",
                  context: "/v1",
                  method: "GET",
                  required: false
               },
               {
                  name: "updateEndEntity",
                  context: "/v1/authorityProvider/authorities/{uuid}/endEntityProfiles/{endEntityProfileName}/endEntities/{endEntityName}",
                  method: "POST",
                  required: false
               },
               {
                  name: "removeEndEntity",
                  context: "/v1/authorityProvider/authorities/{uuid}/endEntityProfiles/{endEntityProfileName}/endEntities/{endEntityName}",
                  method: "DELETE",
                  required: false
               },
               {
                  name: "validateAttributes",
                  context: "/v1/legacyAuthorityProvider/{kind}/attributes/validate",
                  method: "POST",
                  required: false
               },
               {
                  name: "createEndEntity",
                  context: "/v1/authorityProvider/authorities/{uuid}/endEntityProfiles/{endEntityProfileName}/endEntities",
                  method: "POST",
                  required: false
               },
               {
                  name: "listCAsInProfile",
                  context: "/v1/authorityProvider/authorities/{uuid}/endEntityProfiles/{endEntityProfileId}/cas",
                  method: "GET",
                  required: false
               },
               {
                  name: "listRAProfileAttributes",
                  context: "/v1/authorityProvider/authorities/{uuid}/raProfile/attributes",
                  method: "GET",
                  required: false
               },
               {
                  name: "listEndEntities",
                  context: "/v1/authorityProvider/authorities/{uuid}/endEntityProfiles/{endEntityProfileName}/endEntities",
                  method: "GET",
                  required: false
               }
            ]
         }
      ]
   },

   "http://localhost:10005": {

      url: "http://localhost:10005",
      health: {
         status: "ok",
         parts: {
            "database": {
               status: "ok",
               description: "Database connection ok"
            }
         }
      },

      authType: "none",
      authAttributes: [],

      attributes: {
         authorityProvider: {
            EJBCA: [
               {
                  uuid: "87e968ca-9404-4128-8b58-3ab5db2ba06e",
                  name: "url",
                  label: "EJBCA WS URL",
                  type: "STRING",
                  required: true,
                  readOnly: false,
                  editable: true,
                  visible: true,
                  multiValue: false,
                  description: "URL of EJBCA web services"
               },
               {
                  uuid: "9379ca2c-aa51-42c8-8afd-2a2d16c99c57",
                  name: "credential",
                  label: "Credential",
                  type: "CREDENTIAL",
                  required: true,
                  readOnly: false,
                  editable: true,
                  visible: true,
                  multiValue: false,
                  description: "SoftKeyStore Credential representing EJBCA administrator for the communication",
                  attributeCallback: {
                     callbackContext: "core/getCredentials",
                     callbackMethod: "GET",
                     mappings: [
                        {
                           to: "credentialKind",
                           targets: ["pathVariable"],
                           value: "SoftKeyStore"
                        }
                     ]
                  }
               }
            ]
         }
      },

      functionGroups: [
         {
            uuid: "736b0fd6-5ea0-4e10-abe7-cfed39cc2a1a",
            name: "authorityProvider",
            functionGroupCode: "authorityProvider",
            kinds: [
               "EJBCA"
            ],
            endPoints: [
               {
                  name: "listEntityProfiles",
                  context: "/v1/authorityProvider/authorities/{uuid}/endEntityProfiles",
                  method: "GET",
                  required: false
               },
               {
                  name: "listAuthorityInstances",
                  context: "/v1/authorityProvider/authorities",
                  method: "GET",
                  required: false
               },
               {
                  name: "listIssueCertificateAttributes",
                  context: "/v2/authorityProvider/authorities/{uuid}/certificates/issue/attributes",
                  method: "GET",
                  required: false
               },
               {
                  name: "getAuthorityInstance",
                  context: "/v1/authorityProvider/authorities/{uuid}",
                  method: "GET",
                  required: false
               },
               {
                  name: "createAuthorityInstance",
                  context: "/v1/authorityProvider/authorities",
                  method: "POST",
                  required: false
               },
               {
                  name: "listCAsInProfile",
                  context: "/v1/authorityProvider/authorities/{uuid}/endEntityProfiles/{endEntityProfileId}/cas",
                  method: "GET",
                  required: false
               },
               {
                  name: "renewCertificate",
                  context: "/v2/authorityProvider/authorities/{uuid}/certificates/renew",
                  method: "POST",
                  required: false
               },
               {
                  name: "listAttributeDefinitions",
                  context: "/v1/authorityProvider/{kind}/attributes",
                  method: "GET",
                  required: false
               },
               {
                  name: "checkHealth",
                  context: "/v1/health",
                  method: "GET",
                  required: false
               },
               {
                  name: "listCertificateProfiles",
                  context: "/v1/authorityProvider/authorities/{uuid}/endEntityProfiles/{endEntityProfileId}/certificateprofiles",
                  method: "GET",
                  required: false
               },
               {
                  name: "issueCertificate",
                  context: "/v2/authorityProvider/authorities/{uuid}/certificates/issue",
                  method: "POST",
                  required: false
               },
               {
                  name: "updateAuthorityInstance",
                  context: "/v1/authorityProvider/authorities/{uuid}",
                  method: "POST",
                  required: false
               },
               {
                  name: "removeAuthorityInstance",
                  context: "/v1/authorityProvider/authorities/{uuid}",
                  method: "DELETE",
                  required: false
               },
               {
                  name: "validateIssueCertificateAttributes",
                  context: "/v2/authorityProvider/authorities/{uuid}/certificates/issue/attributes/validate",
                  method: "POST",
                  required: false
               },
               {
                  name: "validateRAProfileAttributes",
                  context: "/v1/authorityProvider/authorities/{uuid}/raProfile/attributes/validate",
                  method: "POST",
                  required: false
               },
               {
                  name: "listSupportedFunctions",
                  context: "/v1",
                  method: "GET",
                  required: false
               },
               {
                  name: "validateAttributes",
                  context: "/v1/authorityProvider/{kind}/attributes/validate",
                  method: "POST",
                  required: false
               },
               {
                  name: "listRAProfileAttributes",
                  context: "/v1/authorityProvider/authorities/{uuid}/raProfile/attributes",
                  method: "GET",
                  required: false
               },
               {
                  name: "revokeCertificate",
                  context: "/v2/authorityProvider/authorities/{uuid}/certificates/revoke",
                  method: "POST",
                  required: false
               },
               {
                  name: "getConnection",
                  context: "/v1/authorityProvider/authorities/{uuid}/connect",
                  method: "GET",
                  required: false
               },
               {
                  name: "listRevokeCertificateAttributes",
                  context: "/v2/authorityProvider/authorities/{uuid}/certificates/revoke/attributes",
                  method: "GET",
                  required: false
               },
               {
                  name: "validateRevokeCertificateAttributes",
                  context: "/v2/authorityProvider/authorities/{uuid}/certificates/revoke/attributes/validate",
                  method: "POST",
                  required: false
               }
            ]
         }
      ]

   }

}
