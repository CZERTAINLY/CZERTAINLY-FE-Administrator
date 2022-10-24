import { RaAcmeLinkDTO, RaProfileDTO } from "api/profiles";

export interface DbRaProfile extends RaProfileDTO {
   acmeProfileLink?: RaAcmeLinkDTO;
}


interface DbRaProfileList {
   [key: string]: DbRaProfile;
}


export const dbRaProfiles: DbRaProfileList = {

   "localhostProfile": {
      uuid: "aab53f2c-a6b9-49f0-ad99-418d5fe2b298",
      name: "localhostProfile",
      description: "localhostProfile",
      authorityInstanceName: "Name1",
      authorityInstanceUuid: "19",
      attributes: [
         {
            uuid: "72498bd8-37f9-4fcb-86cb-d23570cf916f",
            name: "tokenType",
            label: "Token Type",
            type: "STRING",
            content: { value: "P12" }
         },
         {
            uuid: "223f2d64-3c70-40a2-9f51-255d32c897b8",
            name: "initialEndEntityStatus",
            label: "Initial End Entity Status",
            type: "STRING",
            content: { value: "NEW" },
         },
         {
            uuid: "d5f1c8aa-c4b4-4cb5-bf66-b8563c6647f1",
            name: "description",
            label: "Description",
            type: "STRING",
            content: { value: "localhostProfile" },
         },
         {
            uuid: "baf2d142-f35a-437f-81c7-35c128881fc0",
            name: "endEntityProfile",
            label: "End Entity Profile",
            type: "STRING",
            content: { value: "1058487535" },
         },
         {
            uuid: "eb57a756-5a11-4d31-866b-e3f066f7a2b9",
            name: "certificateProfile",
            label: "Certificate Profile",
            type: "STRING",
            content: { value: "1987428585" },
         },
         {
            uuid: "eb57a756-5a11-4d31-866b-e3f066f7a2c8",
            name: "certificationAuthority",
            label: "Certification Authority",
            type: "BOOLEAN",
            content: { value: true }
         },
         {
            uuid: "417077da-bb2b-4f35-a0f7-abf824e345ec",
            name: "keyRecoverable",
            label: "Key Recoverable",
            type: "BOOLEAN",
            content: { value: true }
         },
      ],
      enabled: false,
      complianceProfiles: [
          {
            "uuid": "466b14f5-7c6e-428c-8a64-3b6ba1cb3922",
            "name": "Profile1",
            "description": "Hello There!"
         }
      ]
   },


   "DEMO-PROFILE": {
      uuid: "eb8519e2-b3dd-44ff-8689-9751fa249570",
      name: "DEMO-PROFILE",
      authorityInstanceName: "Name1",
      description: "DEMO RA Profile",
      authorityInstanceUuid: "18",
      enabled: true,
      attributes: []
   },


   "DEMO-RA-PROFILE2": {
      uuid: "4bded034-67e6-4e9a-834a-45caab1b2394",
      name: "DEMO-RA-PROFILE2",
      authorityInstanceName: "Name1",
      description: "",
      authorityInstanceUuid: "17",
      enabled: false,
      attributes: []
   },

   "lab02-ADCS-WebServer": {

      uuid: "5c0deb4e-a22d-475b-aefc-8021dd5631d6",
      name: "lab02-ADCS-WebServer",
      description: "",
      authorityInstanceUuid: "03fead87-1399-4e1a-b13b-8fff51231ef7",
      authorityInstanceName: "lab02-ADCS",
      attributes: [
         {
            uuid: "87a94421-c5d8-4a23-bb2c-bbee76cb4ea9",
            name: "template",
            label: "Template",
            type: "STRING",
            content: { value: "WebServer" }
         },
         {
            uuid: "1467ffaa- 445c - 11ec - 81d3 - 0242ac130003",
            name: "caAdcs",
            label: "Certification Authority",
            type: "STRING",
            content: { value: "vmi307469.3key.local\\Demo MS Sub CA" }
         }
      ],
      enabled: true

   },

   "ejbca-ng-test": {
      uuid: "dc7ebec1-67e5-4c9b-a75f-5ba7de83b6ad",
      name: "ejbca-ng-test",
      description: "",
      authorityInstanceUuid: "279547ae-62b1-4141-8aa1-a579eb343b74",
      authorityInstanceName: "EJBCA-NG-Authority",
      enabled: true,
      attributes: [
         {
            uuid: "baf2d142-f35a-437f-81c7-35c128881fc0",
            name: "endEntityProfile",
            label: "End Entity Profile",
            type: "JSON",
            content: {
               value: "Server",
               id: 729841090,
               name: "Server"
            }
         },
         {
            uuid: "eb57a756-5a11-4d31-866b-e3f066f7a2b9",
            name: "certificateProfile",
            label: "Certificate Profile",
            type: "JSON",
            content: {
               value: "Server",
               id: 9,
               name: "SERVER"
            }
         },
         {
            uuid: "edfd318a-8428-4fd1-b546-fd5238674f78",
            name: "certificationAuthority",
            label: "Certification Authority",
            type: "JSON",
            content: {
               value: "ManagementCA",
               id: 577762076,
               name: "ManagementCA"
            }
         },
         {
            uuid: "e0ab3b4e-7681-4a9f-aec5-e025eb1a56a4",
            name: "sendNotifications",
            label: "Send Notifications",
            type: "BOOLEAN",
            content:  { value: false }
         },
         {
            uuid: "417077da-bb2b-4f35-a0f7-abf824e345ec",
            name: "keyRecoverable",
            label: "Key Recoverable",
            type: "BOOLEAN",
            content: { value: true }
         },
         {
            uuid: "3655e4f5-61d8-49c9-b116-f466a9f8c6b4",
            name: "usernameGenMethod",
            label: "Username Generation Method",
            type: "STRING",
            content: { value: "RANDOM" }
         },
         {
            uuid: "c0c14dee-9319-4b03-af01-6a21bf30c1e3",
            name: "usernamePrefix",
            label: "Username Prefix",
            type: "STRING",
            content: { value: "czertainly-" }
         },
         {
            uuid: "5c94731f-621e-4851-b40d-b4f4897f0240",
            name: "usernamePostfix",
            label: "Username Postfix",
            type: "STRING",
            content: { value: "-generated" }
         }
      ],
   }

}