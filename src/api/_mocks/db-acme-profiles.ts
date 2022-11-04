import { AcmeProfileDTO } from "api/acme-profile"
import { dbRaProfiles } from "./db-ra-profiles";


export interface DbAcmeProfile extends AcmeProfileDTO {
}


interface DbAcmeProfiles {
   [key: string]: DbAcmeProfile;
}


export const dbAcmeProfiles: DbAcmeProfiles = {

   "cm": {

      uuid: "6800adb4-1e51-40d5-a37b-665915c08818",
      name: "cm",
      enabled: true,
      description: "",
      termsOfServiceUrl: "https://rpdev.3key.company",
      websiteUrl: "",
      dnsResolverIp: "",
      dnsResolverPort: "",
      raProfile: dbRaProfiles["lab02-ADCS-WebServer"],
      retryInterval: 15,
      termsOfServiceChangeDisable: false,
      validity: 36000,
      directoryUrl: "https://rpdev.3key.company/api/acme/cm/directory",
      termsOfServiceChangeUrl: "",
      requireContact: false,
      requireTermsOfService: false,
      issueCertificateAttributes: [],
      revokeCertificateAttributes: []

   },

   "ACME CZERTAINLY Profile": {
      uuid: "b6be5014-b8f8-4b4f-b96d-a54c38f54b48",
      name: "ACME CZERTAINLY Profile",
      enabled: false,
      description: "Sample ACME Profile",
      termsOfServiceUrl: "https://www.example.com/termsOfService",
      websiteUrl: "https://www.example.com",
      dnsResolverIp: "8.8.8.8",
      dnsResolverPort: "53",
      raProfile: dbRaProfiles["ejbca-ng-test"],
      retryInterval: 60,
      termsOfServiceChangeDisable: false,
      validity: 3000,
      directoryUrl: "https://rpdev.3key.company/api/acme/ACME CZERTAINLY Profile/directory",
      termsOfServiceChangeUrl: "",
      requireContact: true,
      requireTermsOfService: true,
      issueCertificateAttributes: [],
      revokeCertificateAttributes: []
  }


}