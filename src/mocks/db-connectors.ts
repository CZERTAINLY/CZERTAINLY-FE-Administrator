import { ConnectorDTO } from "api/connectors"


export interface DbConnector extends ConnectorDTO {
}


interface DbConnectors {
   [key: string]: DbConnector;
}

export const dbConnectors: DbConnectors = {

   "Common-Credential-Provider": {
      uuid: "2793f559-65b6-4f1a-8877-dc93bc596b41",
      name: "Common-Credential-Provider",
      url: "http://common-credential-provider-service:8080",
      authType: "none",
      authAttributes: [],
      status: "connected",
      functionGroups: [
         {
            functionGroupCode: "credentialProvider",
            kinds: ["SoftKeyStore", "Basic", "ApiKey"],
            uuid: "e8ae0a8c-ed12-4f63-804f-2659ee9dff6e",
            name: "credentialProvider",
            endPoints: [
               {
                  uuid: "45c825bb-5e3a-42f4-8808-9107d4966078",
                  name: "validateAttributes",
                  context: "/v1/credentialProvider/{kind}/attributes/validate",
                  method: "POST",
                  required: true
               },
               {
                  uuid: "886eee93-8a82-4fa0-bee0-60eb4bed766f",
                  name: "listSupportedFunctions",
                  context: "/v1",
                  method: "GET",
                  required: false
               },
               {
                  uuid: "eb159884-f7ee-457e-918c-5f7f6e2f2597",
                  name: "listAttributeDefinitions",
                  context: "/v1/credentialProvider/{kind}/attributes",
                  method: "GET",
                  required: true
               }
            ]
         }
      ]
   },

   "Network-Discovery-Provider": {
      uuid: "26c5b011-cd13-4f93-8e04-14020c192430",
      name: "Network-Discovery-Provider",
      url: "http://ip-discovery-service:8080",
      authType: "none",
      authAttributes: [],
      status: "connected",
      functionGroups: [
         {
            functionGroupCode: "discoveryProvider",
            kinds: [ "IP-Hostname" ],
            uuid: "a6c4042f-9465-4476-9528-1efd6caaf944",
            name: "discoveryProvider",
            endPoints: [
               {
                  uuid: "eb8645ee-5def-4b77-8c66-f8c85da88132",
                  name: "listSupportedFunctions",
                  context: "/v1",
                  method: "GET",
                  required: false
               },
               {
                  uuid: "61f1096e-5798-40cd-874b-de7b782f1d17",
                  name: "validateAttributes",
                  context: "/v1/discoveryProvider/{kind}/attributes/validate",
                  method: "POST",
                  required: true
               },
               {
                  uuid: "784f8681-e3ea-4d8d-938a-ce315752cd80",
                  name: "discoverCertificate",
                  context: "/v1/discoveryProvider/discover",
                  method: "POST",
                  required: true
               },
               {
                  uuid: "8995b6ef-ea7c-417b-a298-f0a4a8a4f55c",
                  name: "listAttributeDefinitions",
                  context: "/v1/discoveryProvider/{kind}/attributes",
                  method: "GET",
                  required: true
               }
            ]
         }
      ]
   },

   "Cryptosense-Discovery-Provider": {
      uuid: "ee290a3e-3165-4fda-87f1-5fae39e200b1",
      name: "Cryptosense-Discovery-Provider",
      url: "http://cryptosense-discovery-service:8080",
      authType: "none",
      authAttributes: [],
      status: "connected",
      functionGroups: [
         {
            functionGroupCode: "discoveryProvider",
            kinds: [ "Cryptosense" ],
            uuid: "a6c4042f-9465-4476-9528-1efd6caaf944",
            name: "discoveryProvider",
            endPoints: [
               {
                  uuid: "eb8645ee-5def-4b77-8c66-f8c85da88132",
                  name: "listSupportedFunctions",
                  context: "/v1",
                  method: "GET",
                  required: false
               },
               {
                  uuid: "61f1096e-5798-40cd-874b-de7b782f1d17",
                  name: "validateAttributes",
                  context: "/v1/discoveryProvider/{kind}/attributes/validate",
                  method: "POST",
                  required: true
               },
               {
                  uuid: "784f8681-e3ea-4d8d-938a-ce315752cd80",
                  name: "discoverCertificate",
                  context: "/v1/discoveryProvider/discover",
                  method: "POST",
                  required: true
               },
               {
                  uuid: "8995b6ef-ea7c-417b-a298-f0a4a8a4f55c",
                  name: "listAttributeDefinitions",
                  context: "/v1/discoveryProvider/{kind}/attributes",
                  method: "GET",
                  required: true
               }
            ]
         }
      ],
   },

   "MS-ADCS-Connector": {
      uuid: "6c086333-6dd7-4231-8093-ed21f4e2ff9f",
      name: "MS-ADCS-Connector",
      url: "http://ms-adcs-connector-service:8080",
      authType: "none",
      authAttributes: [],
      status: "connected",
      functionGroups: [
         {
            uuid: "736b0fd6-5ea0-4e10-abe7-cfed39cc2a1a",
            name: "authorityProvider",
            functionGroupCode: "authorityProvider",
            kinds: [ "ADCS" ],
            endPoints: [
               {
                  uuid: "0288132c-5d9c-4db8-97a1-7ef977b45b17",
                  name: "listIssueCertificateAttributes",
                  context: "/v2/authorityProvider/authorities/{uuid}/certificates/issue/attributes",
                  method: "GET",
                  required: true
               },
               {
                  uuid: "e3521dd0-e150-4676-a79c-30a33e62889c",
                  name: "listAuthorityInstances",
                  context: "/v1/authorityProvider/authorities",
                  method: "GET",
                  required: true
               },
               {
                  uuid: "d9e162ae-2d50-4e98-bc37-62d015c43199",
                  name: "revokeCertificate",
                  context: "/v2/authorityProvider/authorities/{uuid}/certificates/revoke",
                  method: "POST",
                  required: true
               },
               {
                  uuid: "ecdf6214-a491-4a0f-9084-7b502a16315e",
                  name: "listSupportedFunctions",
                  context: "/v1",
                  method: "GET",
                  required: false
               },
               {
                  uuid: "2dcc528b-9e16-46c6-877e-74eae258173f",
                  name: "listRevokeCertificateAttributes",
                  context: "/v2/authorityProvider/authorities/{uuid}/certificates/revoke/attributes",
                  method: "GET",
                  required: true
               },
               {
                  uuid: "924ac89a-7376-4ac8-8c15-ecb7d9e8ca16",
                  name: "getAuthorityInstance",
                  context: "/v1/authorityProvider/authorities/{uuid}",
                  method: "GET",
                  required: true
               },
               {
                  uuid: "59070334-e550-466c-b538-bd8d2d9b06e5",
                  name: "validateAttributes",
                  context: "/v1/authorityProvider/{kind}/attributes/validate",
                  method: "POST",
                  required: true
               },
               {
                  uuid: "e43155b6-51ad-46e0-a60c-176ee5e6dfea",
                  name: "listRAProfileAttributes",
                  context: "/v1/authorityProvider/authorities/{uuid}/raProfile/attributes",
                  method: "GET",
                  required: true
               },
               {
                  uuid: "f28a2c14-1183-430d-a908-85bcfda56dab",
                  name: "validateRevokeCertificateAttributes",
                  context: "/v2/authorityProvider/authorities/{uuid}/certificates/revoke/attributes/validate",
                  method: "POST",
                  required: true
               },
               {
                  uuid: "f83d858a-d63b-48e7-b22c-fdb7f7e3d9b1",
                  name: "removeAuthorityInstance",
                  context: "/v1/authorityProvider/authorities/{uuid}",
                  method: "DELETE",
                  required: false
               },
               {
                  uuid: "9bf9cd3b-73de-4c1c-a712-7396e9dc78e5",
                  name: "createAuthorityInstance",
                  context: "/v1/authorityProvider/authorities",
                  method: "POST",
                  required: true
               },
               {
                  uuid: "7085fad6-df6e-4697-9c8e-7c80c2a12bd7",
                  name: "revokeCertificate",
                  context: "/v2/authorityProvider/authorities/{uuid}/certificates/revoke",
                  method: "POST",
                  required: true
               },
               {
                  uuid: "072349d4-d1a0-4398-b4e5-88fba454d815",
                  name: "listAttributeDefinitions",
                  context: "/v1/authorityProvider/{kind}/attributes",
                  method: "GET",
                  required: true
               },
               {
                  uuid: "355d306e-75f7-4b85-848b-58bddf95c582",
                  name: "validateIssueCertificateAttributes",
                  context: "/v2/authorityProvider/authorities/{uuid}/certificates/issue/attributes/validate",
                  method: "POST",
                  required: true
               },
               {
                  uuid: "065dbfba-63f9-4011-abe4-f2ca6d224521",
                  name: "issueCertificate",
                  context: "/v2/authorityProvider/authorities/{uuid}/certificates/issue",
                  method: "POST",
                  required: true
               },
               {
                  uuid: "51c5b673-0e6e-4b8d-a31b-1b35835b4025",
                  name: "updateAuthorityInstance",
                  context: "/v1/authorityProvider/authorities/{uuid}",
                  method: "POST",
                  required: true
               },
               {
                  uuid: "efdb9bcd-4f7c-473b-8704-77b12b3f6d33",
                  name: "renewCertificate",
                  context: "/v2/authorityProvider/authorities/{uuid}/certificates/renew",
                  method: "POST",
                  required: true
               }
            ]
         },
         {
            functionGroupCode: "discoveryProvider",
            kinds: [ "ADCS" ],
            endPoints: [
               {
                  uuid: "eb8645ee-5def-4b77-8c66-f8c85da88132",
                  name: "listSupportedFunctions",
                  context: "/v1",
                  method: "GET",
                  required: false
               },
               {
                  uuid: "61f1096e-5798-40cd-874b-de7b782f1d17",
                  name: "validateAttributes",
                  context: "/v1/discoveryProvider/{kind}/attributes/validate",
                  method: "POST",
                  required: true
               },
               {
                  uuid: "784f8681-e3ea-4d8d-938a-ce315752cd80",
                  name: "discoverCertificate",
                  context: "/v1/discoveryProvider/discover",
                  method: "POST",
                  required: true
               },
               {
                  uuid: "8995b6ef-ea7c-417b-a298-f0a4a8a4f55c",
                  name: "listAttributeDefinitions",
                  context: "/v1/discoveryProvider/{kind}/attributes",
                  method: "GET",
                  required: true
               }
            ],
            uuid: "a6c4042f-9465-4476-9528-1efd6caaf944",
            name: "discoveryProvider"
         }
      ]
   },

   "EJBCA-Legacy-Connector": {
      uuid: "e39189b6-6368-4419-9d97-e9435f54c02f",
      name: "EJBCA-Legacy-Connector",
      url: "http://ejbca-connector-service:8080",
      authType: "none",
      authAttributes: [],
      status: "connected",
      functionGroups: [
         {
            functionGroupCode: "legacyAuthorityProvider",
            kinds: [ "LegacyEjbca" ],
            uuid: "435ee47f-fd03-4c50-ae6f-ca60f4829023",
            name: "legacyAuthorityProvider",
            endPoints: [
               {
                  uuid: "a91dd6df-cd2c-46f4-af09-3693a167118d",
                  name: "issueCertificate",
                  context: "/v1/authorityProvider/authorities/{uuid}/endEntityProfiles/{endEntityProfileName}/certificates/issue",
                  method: "POST",
                  required: false
               },
               {
                  uuid: "06f1f14f-328b-40f7-8f34-f168619e3a3a",
                  name: "updateAuthorityInstance",
                  context: "/v1/authorityProvider/authorities/{uuid}",
                  method: "POST",
                  required: true
               },
               {
                  uuid: "4bef1a55-4725-48af-911e-9a051784c4c4",
                  name: "listCAsInProfile",
                  context: "/v1/authorityProvider/authorities/{uuid}/endEntityProfiles/{endEntityProfileId}/cas",
                  method: "GET",
                  required: false
               },
               {
                  uuid: "a8b1d647-6a8e-46fd-b4e1-844b30df4dcc",
                  name: "getEndEntity",
                  context: "/v1/authorities/{uuid}/endEntityProfiles/{endEntityProfileName}/endEntities/{endEntityName}",
                  method: "GET",
                  required: false
               },
               {
                  uuid: "57320a6d-3763-4a25-bdae-4a2a92a67487",
                  name: "updateEndEntity",
                  context: "/v1/authorities/{uuid}/endEntityProfiles/{endEntityProfileName}/endEntities/{endEntityName}",
                  method: "POST",
                  required: false
               },
               {
                  uuid: "656e4414-d735-457f-ad43-f921c5af4507",
                  name: "revokeCertificate",
                  context: "/v1/authorityProvider/authorities/{uuid}/endEntityProfiles/{endEntityProfileName}/certificates/revoke",
                  method: "POST",
                  required: false
               },
               {
                  uuid: "e13b274b-bdbd-4b4d-a5fa-875f0a6594e9",
                  name: "listEntityProfiles",
                  context: "/v1/authorityProvider/authorities/{uuid}/endEntityProfiles",
                  method: "GET",
                  required: false
               },
               {
                  uuid: "ca07a81d-724f-4304-8ffa-3cb405766301",
                  name: "validateAttributes",
                  context: "/v1/authorityProvider/{kind}/attributes/validate",
                  method: "POST",
                  required: false
               },
               {
                  uuid: "5a78b374-3113-4310-a35d-45a8a2a04eca",
                  name: "listEndEntities",
                  context: "/v1/authorityProvider/authorities/{uuid}/endEntityProfiles/{endEntityProfileName}/endEntities",
                  method: "GET",
                  required: false
               },
               {
                  uuid: "5f61c054-0d68-44b1-b326-2ed28a2a55fa",
                  name: "createEndEntity",
                  context: "/v1/authorities/{uuid}/endEntityProfiles/{endEntityProfileName}/endEntities",
                  method: "POST",
                  required: false
               },
               {
                  uuid: "ca0595ad-36e5-4060-a19d-e80b8f7461fd",
                  name: "listAttributeDefinitions",
                  context: "/v1/authorityProvider/{kind}/attributes",
                  method: "GET",
                  required: false
               },
               {
                  uuid: "f2a6f043-3fb2-4f9d-9996-ce8cf68d2ad9",
                  name: "resetPassword",
                  context: "/v1/authorityProvider/authorities/{uuid}/endEntityProfiles/{endEntityProfileName}/endEntities/{endEntityName}/resetPassword",
                  method: "PUT",
                  required: false
               },
               {
                  uuid: "1692cec0-50aa-46a3-be7f-b32e6a752d2a",
                  name: "getAuthorityInstance",
                  context: "/v1/authorityProvider/authorities/{uuid}",
                  method: "GET",
                  required: true
               },
               {
                  uuid: "cb1ae7eb-a97b-44bd-bf76-46ae96e32985",
                  name: "listAuthorityInstances",
                  context: "/v1/authorityProvider/authorities",
                  method: "GET",
                  required: true
               },
               {
                  uuid: "e881624f-af84-41fd-aeb8-a90e342bb131",
                  name: "removeEndEntity",
                  context: "/v1/authorityProvider/authorities/{uuid}/endEntityProfiles/{endEntityProfileName}/endEntities/{endEntityName}",
                  method: "DELETE",
                  required: false
               },
               {
                  uuid: "b2a2a828-598b-47dd-a1c5-ce877989153f",
                  name: "listCertificateProfiles",
                  context: "/v1/authorityProvider/authorities/{uuid}/endEntityProfiles/{endEntityProfileId}/certificateprofiles",
                  method: "GET",
                  required: false
               },
               {
                  uuid: "b3592167-af2a-44b3-89d2-e4bfd000caa4",
                  name: "removeAuthorityInstance",
                  context: "/v1/authorityProvider/authorities/{uuid}",
                  method: "DELETE",
                  required: false
               },
               {
                  uuid: "cf4af237-164e-4326-8a34-80c90d53b2d7",
                  name: "listSupportedFunctions",
                  context: "/v1",
                  method: "GET",
                  required: false
               },
               {
                  uuid: "6350c3bb-57ef-4416-964b-0254df28131e",
                  name: "createAuthorityInstance",
                  context: "/v1/authorityProvider/authorities",
                  method: "POST",
                  required: true
               }
            ]
         }
      ]
   },

   "EJBCA-NG-Connector": {
      uuid: "7c17620f-2818-47b2-a41b-946e8b421436",
      name: "EJBCA-NG-Connector",
      url: "http://ejbca-ng-connector-service:8080",
      authType: "none",
      authAttributes: [],
      status: "connected",
      functionGroups: [
         {
            uuid: "736b0fd6-5ea0-4e10-abe7-cfed39cc2a1a",
            name: "authorityProvider",
            functionGroupCode: "authorityProvider",
            kinds: [ "EJBCA" ],
            endPoints: [
               {
                  uuid: "0288132c-5d9c-4db8-97a1-7ef977b45b17",
                  name: "listIssueCertificateAttributes",
                  context: "/v2/authorityProvider/authorities/{uuid}/certificates/issue/attributes",
                  method: "GET",
                  required: true
               },
               {
                  uuid: "e3521dd0-e150-4676-a79c-30a33e62889c",
                  name: "listAuthorityInstances",
                  context: "/v1/authorityProvider/authorities",
                  method: "GET",
                  required: true
               },
               {
                  uuid: "d9e162ae-2d50-4e98-bc37-62d015c43199",
                  name: "revokeCertificate",
                  context: "/v2/authorityProvider/authorities/{uuid}/certificates/revoke",
                  method: "POST",
                  required: true
               },
               {
                  uuid: "ecdf6214-a491-4a0f-9084-7b502a16315e",
                  name: "listSupportedFunctions",
                  context: "/v1",
                  method: "GET",
                  required: false
               },
               {
                  uuid: "2dcc528b-9e16-46c6-877e-74eae258173f",
                  name: "listRevokeCertificateAttributes",
                  context: "/v2/authorityProvider/authorities/{uuid}/certificates/revoke/attributes",
                  method: "GET",
                  required: true
               },
               {
                  uuid: "924ac89a-7376-4ac8-8c15-ecb7d9e8ca16",
                  name: "getAuthorityInstance",
                  context: "/v1/authorityProvider/authorities/{uuid}",
                  method: "GET",
                  required: true
               },
               {
                  uuid: "59070334-e550-466c-b538-bd8d2d9b06e5",
                  name: "validateAttributes",
                  context: "/v1/authorityProvider/{kind}/attributes/validate",
                  method: "POST",
                  required: true
               },
               {
                  uuid: "e43155b6-51ad-46e0-a60c-176ee5e6dfea",
                  name: "listRAProfileAttributes",
                  context: "/v1/authorityProvider/authorities/{uuid}/raProfile/attributes",
                  method: "GET",
                  required: true
               },
               {
                  uuid: "f28a2c14-1183-430d-a908-85bcfda56dab",
                  name: "validateRevokeCertificateAttributes",
                  context: "/v2/authorityProvider/authorities/{uuid}/certificates/revoke/attributes/validate",
                  method: "POST",
                  required: true
               },
               {
                  uuid: "f83d858a-d63b-48e7-b22c-fdb7f7e3d9b1",
                  name: "removeAuthorityInstance",
                  context: "/v1/authorityProvider/authorities/{uuid}",
                  method: "DELETE",
                  required: false
               },
               {
                  uuid: "9bf9cd3b-73de-4c1c-a712-7396e9dc78e5",
                  name: "createAuthorityInstance",
                  context: "/v1/authorityProvider/authorities",
                  method: "POST",
                  required: true
               },
               {
                  uuid: "7085fad6-df6e-4697-9c8e-7c80c2a12bd7",
                  name: "revokeCertificate",
                  context: "/v2/authorityProvider/authorities/{uuid}/certificates/revoke",
                  method: "POST",
                  required: true
               },               {
                  uuid: "072349d4-d1a0-4398-b4e5-88fba454d815",
                  name: "listAttributeDefinitions",
                  context: "/v1/authorityProvider/{kind}/attributes",
                  method: "GET",
                  required: true
               },
               {
                  uuid: "355d306e-75f7-4b85-848b-58bddf95c582",
                  name: "validateIssueCertificateAttributes",
                  context: "/v2/authorityProvider/authorities/{uuid}/certificates/issue/attributes/validate",
                  method: "POST",
                  required: true
               },
               {
                  uuid: "065dbfba-63f9-4011-abe4-f2ca6d224521",
                  name: "issueCertificate",
                  context: "/v2/authorityProvider/authorities/{uuid}/certificates/issue",
                  method: "POST",
                  required: true
               },
               {
                  uuid: "51c5b673-0e6e-4b8d-a31b-1b35835b4025",
                  name: "updateAuthorityInstance",
                  context: "/v1/authorityProvider/authorities/{uuid}",
                  method: "POST",
                  required: true
               },
               {
                  uuid: "efdb9bcd-4f7c-473b-8704-77b12b3f6d33",
                  name: "renewCertificate",
                  context: "/v2/authorityProvider/authorities/{uuid}/certificates/renew",
                  method: "POST",
                  required: true
               }
            ]
         }
      ]
   }
}