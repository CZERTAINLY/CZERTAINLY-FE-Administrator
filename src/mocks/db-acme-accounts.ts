import { AcmeAccountDTO } from "api/acme-account"


export interface DbAcmeAccount extends AcmeAccountDTO {
}


interface DbAcmeAccounts {
   [key: string]: DbAcmeAccount
}


export const dbAcmeAccounts: DbAcmeAccounts = {

   "BeWgvKI160E": {
      accountId: "BeWgvKI160E",
      uuid: "2ede4715-326d-4d71-86a8-6cf4bf6642be",
      totalOrders: 42,
      successfulOrders: 1,
      failedOrders: 10,
      pendingOrders: 26,
      validOrders: 5,
      processingOrders: 0,
      status: "valid",
      contact: ["mailTo:demo@test.com", "mailTo:demo1@test.com"],
      termsOfServiceAgreed: true,
      acmeProfileUuid: "6fae456b-57ee-4cbe-b308-106fc8db8b1a",
      raProfileName: "localhostProfile",
      raProfileUuid: "aab53f2c-a6b9-49f0-ad99-418d5fe2b298",
      acmeProfileName: "BeWgvKI160E",
      enabled: true
   },

   "ZnaucX7UOFs": {

      accountId: "ZnaucX7UOFs",
      uuid: "5f8fd0f6-d7c4-4d09-b7da-0c5d4868ae8e",
      totalOrders: 91,
      successfulOrders: 1,
      failedOrders: 10,
      pendingOrders: 26,
      validOrders: 5,
      processingOrders: 0,
      status: "valid",
      contact: ["mailTo:demo@test.com", "mailTo:demo1@test.com"],
      termsOfServiceAgreed: true,
      acmeProfileUuid: "6fae456b-57ee-4cbe-b308-106fc8db8b1a",
      raProfileName: "localhostProfile",
      raProfileUuid: "aab53f2c-a6b9-49f0-ad99-418d5fe2b298",
      acmeProfileName: "ZnaucX7UOFs",
      enabled: true

   },

   "PrLHcY5PnnA": {

      accountId: "PrLHcY5PnnA",
      uuid: "8de3970c-187b-4de0-86a8-0af305f2179d",
      totalOrders: 5,
      successfulOrders: 1,
      failedOrders: 10,
      pendingOrders: 26,
      validOrders: 5,
      processingOrders: 0,
      status: "deactivated",
      contact: ["mailTo:demo@test.com", "mailTo:demo1@test.com"],
      termsOfServiceAgreed: true,
      acmeProfileUuid: "6fae456b-57ee-4cbe-b308-106fc8db8b1a",
      raProfileName: "localhostProfile",
      raProfileUuid: "aab53f2c-a6b9-49f0-ad99-418d5fe2b298",
      acmeProfileName: "PrLHcY5PnnA",
      enabled: true

   },

   "FQxkmEYae9g": {

      accountId: "FQxkmEYae9g",
      uuid: "b7d24af7-386d-4c2a-b497-a9d750819dac",
      totalOrders: 10,
      successfulOrders: 1,
      failedOrders: 10,
      pendingOrders: 26,
      validOrders: 5,
      processingOrders: 0,
      status: "revoked",
      contact: ["mailTo:demo@test.com", "mailTo:demo1@test.com"],
      termsOfServiceAgreed: true,
      acmeProfileUuid: "6fae456b-57ee-4cbe-b308-106fc8db8b1a",
      raProfileName: "localhostProfile",
      raProfileUuid: "aab53f2c-a6b9-49f0-ad99-418d5fe2b298",
      acmeProfileName: "FQxkmEYae9g",
      enabled: true

   },

   "ZeQgvUI12pE": {

      accountId: "ZeQgvUI12pE",
      uuid: "2401dc15-dca0-4aef-a839-66548ca909f7",
      totalOrders: 18,
      successfulOrders: 1,
      failedOrders: 10,
      pendingOrders: 26,
      validOrders: 5,
      processingOrders: 0,
      status: "valid",
      contact: ["mailTo:demo@test.com", "mailTo:demo1@test.com"],
      termsOfServiceAgreed: true,
      raProfileName: "A",
      raProfileUuid: "883ef2c3-c9e3-460f-b55b-e00e19fea7a8",
      acmeProfileName: "asqwered1",
      acmeProfileUuid: "6fae456b-57ee-4cbe-b308-106fc8db8b1a",
      enabled: true,
   }

}
