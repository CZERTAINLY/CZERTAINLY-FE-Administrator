import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";
import { HttpErrorResponse } from "ts-rest-client";

import { dbData } from "mocks/db";
import { randomDelay } from "utils/mock";

import * as model from "./model";
import { AttributeDTO } from "api/_common/attributeDTO";
import { RaProfileDTO } from "api/profiles";
import { DeleteObjectErrorDTO } from "api/_common/deleteObjectErrorDTO";

export class AcmeProfilesManagementMock implements model.AcmeProfilesManagementApi {

   bulkForceDeleteAcmeProfiles(uuids: string[]): Observable<void> {

      return of(
         uuids
      ).pipe(

         delay(randomDelay()),
         map(

            uuids => uuids.forEach(

               uuid => {

                  const acmeProfileIndex = dbData.acmeProfiles.findIndex(acmeProfile => acmeProfile.uuid === uuid);
                  if (acmeProfileIndex < 0) throw new HttpErrorResponse({ status: 404, statusText: `acmeProfile ${uuid} not found` });
                  dbData.acmeProfiles.splice(acmeProfileIndex, -1);

               }

            )

         )

      )

   }


   createAcmeProfile(
      name: string,
      issueCertificateAttributes: AttributeDTO[],
      revokeCertificateAttributes: AttributeDTO[],
      description?: string,
      termsOfServiceUrl?: string,
      websiteUrl?: string,
      dnsResolverIp?: string,
      dnsResolverPort?: string,
      raProfileUuid?: string,
      retryInterval?: number,
      validity?: number,
      requireContact?: boolean,
      requireTermsOfService?: boolean,
   ): Observable<string> {

      return of(
         null
      ).pipe(

         delay(randomDelay()),
         map(

            () => {

               const uuid = crypto.randomUUID();

               const raProfile = dbData.raProfiles.find(raProfile => raProfile.uuid === raProfileUuid);
               if (!raProfile) throw new HttpErrorResponse({ status: 404, statusText: "RA Profile not found" });

               dbData.acmeProfiles.push({
                  uuid,
                  name,
                  issueCertificateAttributes,
                  revokeCertificateAttributes,
                  description,
                  termsOfServiceUrl,
                  websiteUrl,
                  dnsResolverIp,
                  dnsResolverPort,
                  raProfile,
                  retryInterval,
                  validity,
                  requireContact,
                  requireTermsOfService,
                  enabled: true
               })

               return uuid;

            }

         )

      );

   }


   deleteAcmeProfile(uuid: string): Observable<void> {

      return of(
         dbData.acmeProfiles.findIndex(acmeProfile => acmeProfile.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            acmeProfileIndex => {

               if (acmeProfileIndex < 0) throw new HttpErrorResponse({ status: 404 });
               dbData.acmeProfiles.splice(acmeProfileIndex, 1);

            }

         )

      )

   }


   enableAcmeProfile(uuid: string): Observable<void> {

      return of(
         dbData.acmeProfiles.find(acmeProfile => acmeProfile.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            acmeProfile => {

               if (!acmeProfile) throw new HttpErrorResponse({ status: 404 });
               acmeProfile.enabled = true;

            }

         )
      );

   }


   disableAcmeProfile(uuid: string): Observable<void> {

      return of(
         dbData.acmeProfiles.find(acmeProfile => acmeProfile.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            acmeProfile => {

               if (!acmeProfile) throw new HttpErrorResponse({ status: 404 });
               acmeProfile.enabled = false;

            }
         )

      );

   }


   bulkDeleteAcmeProfiles(uuids: string[]): Observable<DeleteObjectErrorDTO[]> {

      return of(
         uuids
      ).pipe(

         delay(randomDelay()),
         map(

            uuids => {

               uuids.forEach(

                  uuid => {
                     const acmeProfileIndex = dbData.acmeProfiles.findIndex(acmeProfile => acmeProfile.uuid === uuid);
                     if (acmeProfileIndex < 0) throw new HttpErrorResponse({ status: 404, statusText: `ACME profile ${uuid} not found` });
                     dbData.acmeProfiles.splice(acmeProfileIndex, -1);
                  }

               )

               return [];

            }

         )

      )

   }


   bulkEnableAcmeProfile(uuids: string[]): Observable<void> {

      return of(
         uuids
      ).pipe(

         delay(randomDelay()),
         map(

            uuids => {

               uuids.forEach(

                  uuid => {
                     const acmeProfile = dbData.acmeProfiles.find(acmeProfile => acmeProfile.uuid === uuid);
                     if (!acmeProfile) throw new HttpErrorResponse({ status: 404, statusText: `ACME profile ${uuid} not found` });
                     acmeProfile.enabled = true;
                  }

               )

            }

         )
      );

   }


   bulkDisableAcmeProfile(uuids: string[]): Observable<void> {

      return of(
         uuids
      ).pipe(

         delay(randomDelay()),
         map(

            uuids => {

               uuids.forEach(

                  uuid => {
                     const acmeProfile = dbData.acmeProfiles.find(acmeProfile => acmeProfile.uuid === uuid);
                     if (!acmeProfile) throw new HttpErrorResponse({ status: 404, statusText: `ACME profile ${uuid} not found` });
                     acmeProfile.enabled = false;
                  }

               )

            }

         )

      );

   }


   getAcmeProfilesList(): Observable<model.AcmeProfileListItemDTO[]> {

      return of(
         null
      ).pipe(

         delay(randomDelay()),
         map(

            () => {

               return dbData.acmeProfiles.map(

                  acmeProfile => ({
                     uuid: acmeProfile.uuid,
                     name: acmeProfile.name,
                     enabled: acmeProfile.enabled,
                     description: acmeProfile.description,
                     raProfileName: acmeProfile.raProfile?.name,
                     raProfileUuid: acmeProfile.raProfile?.uuid,
                     directoryUrl: acmeProfile.directoryUrl
                  })

               )

            }

         )

      );
   }


   getAcmeProfileDetail(uuid: string): Observable<model.AcmeProfileDTO> {

      return of(
         null
      ).pipe(

         delay(randomDelay()),
         map(

            () => {
               const acmeProfile = dbData.acmeProfiles.find(acmeProfile => acmeProfile.uuid === uuid);
               if (!acmeProfile) throw new HttpErrorResponse({ status: 404 });
               return acmeProfile;
            }

         )

      )

   }


   updateAcmeProfile(
      uuid: string,
      issueCertificateAttributes: AttributeDTO[],
      revokeCertificateAttributes: AttributeDTO[],
      description?: string,
      termsOfServiceUrl?: string,
      websiteUrl?: string,
      dnsResolverIp?: string,
      dnsResolverPort?: string,
      raProfileUuid?: string,
      retryInterval?: number,
      termsOfServiceChangeDisable?: boolean,
      termsOfServiceChangeUrl?: string,
      validity?: number,
      requireContact?: boolean,
      requireTermsOfService?: boolean,
   ): Observable<model.AcmeProfileDTO> {

      return of(
         null
      ).pipe(

         delay(randomDelay()),
         map(

            () => {

               const acmeProfile = dbData.acmeProfiles.find(acmeProfile => acmeProfile.uuid === uuid);
               if (!acmeProfile) throw new HttpErrorResponse({ status: 404, statusText: "ACME profile not found" });

               let raProfile: RaProfileDTO | undefined;

               if (raProfileUuid) {
                  raProfile = dbData.raProfiles.find(raProfile => raProfile.uuid === raProfileUuid);
                  if (!raProfile) throw new HttpErrorResponse({ status: 404, statusText: "RA Profile not found" });
               }

               acmeProfile.issueCertificateAttributes = issueCertificateAttributes;
               acmeProfile.revokeCertificateAttributes = revokeCertificateAttributes;

               if (description) acmeProfile.description = description;
               if (termsOfServiceUrl) acmeProfile.termsOfServiceUrl = termsOfServiceUrl;

               if (websiteUrl) acmeProfile.websiteUrl = websiteUrl;
               if (dnsResolverIp) acmeProfile.dnsResolverIp = dnsResolverIp;
               if (dnsResolverPort) acmeProfile.dnsResolverPort = dnsResolverPort;
               if (retryInterval) acmeProfile.retryInterval = retryInterval;
               if (termsOfServiceChangeDisable) acmeProfile.termsOfServiceChangeDisable = termsOfServiceChangeDisable;
               if (termsOfServiceChangeUrl) acmeProfile.termsOfServiceChangeUrl = termsOfServiceChangeUrl;
               if (validity) acmeProfile.validity = validity;
               if (requireContact) acmeProfile.requireContact = requireContact;
               if (requireTermsOfService) acmeProfile.requireTermsOfService = requireTermsOfService;
               if (raProfile) acmeProfile.raProfile = raProfile;

               return acmeProfile;

            }

         )

      );

   }

   updateRAProfileForAcmeProfile(uuid: string, raProfileUuid: string): Observable<void> {

      return of(
         null
      ).pipe(

         delay(randomDelay()),
         map(

            () => {

               const acmeProfile = dbData.acmeProfiles.find(acmeProfile => acmeProfile.uuid === uuid);
               if (!acmeProfile) throw new HttpErrorResponse({ status: 404, statusText: "ACME profile not found" });

               if (acmeProfile.raProfile?.uuid !== raProfileUuid) throw new HttpErrorResponse({ status: 404, statusText: "Invalid RA Profile for ACME profile" });

               acmeProfile.issueCertificateAttributes = [];
               acmeProfile.revokeCertificateAttributes = [];
               acmeProfile.raProfile = undefined;

            }

         )

      )

   }

}
