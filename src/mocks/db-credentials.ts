import { CredentialDTO } from "api/credential"

export interface DbCredential extends CredentialDTO {
}


interface DbCredentialList {
   [key: string]: DbCredential;
}


export const dbCredentials: DbCredentialList = {

   "ejbca-client-cert": {

      uuid: "3",
      name: "ejbca-client-cert",
      connectorName: "Name1",
      kind: "certificate",
      connectorUuid: "2",
      enabled: true,
      attributes: [
         {
            uuid: "f369cc23-f7cf-4027-8598-9f9453c25ce5",
            name: "type",
            label: "Type",
            type: "STRING",
            value: "certificate",
         },
         {
            uuid: "c8b6ae9a-ef4a-4d49-bd8b-8c9edcd50eaa",
            name: "name",
            label: "Name",
            type: "STRING",
            value: "ejbca-client-cert",
         },
         {
            uuid: "e334e055-900e-43f1-aedc-54e837028de0",
            name: "keyStoreType",
            label: "Key Store Type",
            type: "STRING",
            value: "PKCS12",
         },
         {
            uuid: "6df7ace9-c501-4d58-953c-f8d53d4fb378",
            name: "keyStore",
            label: "Key Store",
            type: "FILE",
            value: "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",
         },
         {
            uuid: "d975fe42-9d09-4740-a362-fc26f98e55ea",
            name: "keystoreStorePassword",
            label: "Key Store Password",
            type: "SECRET",
            value: "*GBkTvvKy8z!Z@7",
         },
      ],
   },

   "Cryptosense-API": {
      uuid: "0720a5fe-d945-49b4-946c-aecbdbc07721",
      name: "Cryptosense-API",
      kind: "ApiKey",
      attributes: [
         {
            uuid: "aac5c2d5-5dc3-4ddb-9dfa-3d76b99135f8",
            name: "apiKey",
            label: "API Key",
            type: "SECRET",
            value: "************"
         }
      ],
      enabled: true,
      connectorUuid: "2793f559-65b6-4f1a-8877-dc93bc596b41",
      connectorName: "Common-Credential-Provider"
   },

   "Basic": {
      uuid: "224c5e7e-b733-4441-922a-0158b4897886",
      name: "lab02-ADCS",
      kind: "Basic",
      attributes: [
         {
            uuid: "fe2d6d35-fb3d-4ea0-9f0b-7e39be93beeb",
            name: "username",
            label: "Username",
            type: "STRING",
            value: "nejaky.uzivatel"
         },
         {
            uuid: "04506d45-c865-4ddc-b6fc-117ee5d5c8e7",
            name: "password",
            label: "Password",
            type: "SECRET",
            value: "************"
         }
      ],
      enabled: true,
      connectorUuid: "2793f559-65b6-4f1a-8877-dc93bc596b41",
      connectorName: "Common-Credential-Provider"
   },

   "ejbca-admin": {

      uuid: "f48c2b7d-cf50-479f-a7b8-b27d3ac24ade",
      name: "ejbca-admin",
      kind: "SoftKeyStore",
      attributes: [
         {
            uuid: "e334e055-900e-43f1-aedc-54e837028de0",
            name: "keyStoreType",
            label: "Key Store Type",
            type: "LIST",
            value: "PKCS12"
         },
         {
            uuid: "6df7ace9-c501-4d58-953c-f8d53d4fb378",
            name: "keyStore",
            label: "Key Store",
            type: "FILE",
            value: "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"
         },
         {
            uuid: "d975fe42-9d09-4740-a362-fc26f98e55ea",
            name: "keyStorePassword",
            label: "Key Store Password",
            type: "SECRET",
            value: "************"
         }
      ],
      enabled: true,
      connectorUuid: "2793f559-65b6-4f1a-8877-dc93bc596b41",
      connectorName: "Common-Credential-Provider"
   }

}
