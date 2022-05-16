import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";
import { HttpErrorResponse } from "ts-rest-client";

import * as model from "./model";
import { dbData } from "mocks/db";
import { randomDelay } from "utils/mock";
import { AttributeDescriptorDTO, AttributeDTO } from "api/.common/AttributeDTO";

export class ProfilesManagementMock implements model.ProfilesManagementApi {


   getRaProfilesList(): Observable<model.RaProfileDTO[]> {

      return of(
         dbData.raProfiles
      ).pipe(
         delay(randomDelay())
      )

   }


   getRaProfileDetail(uuid: string): Observable<model.RaProfileDTO> {

      return of(
         dbData.raProfiles.find(profile => profile.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            profile => {

               if (!profile) throw new HttpErrorResponse({ status: 404 });
               return profile;

            }

         )
      );

   }

   getAuthorizedClients(uuid: string): Observable<model.RaAuthorizedClientDTO[]> {

      return of(
         dbData.raProfiles.find(profile => profile.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            profile => {

               if (!profile) throw new HttpErrorResponse({ status: 404 });

               const clients = dbData.clients.filter(
                  client => client.authorizedProfiles.includes(uuid)
               );

               return clients.map(

                  client => ({
                     uuid: client.uuid,
                     name: client.name,
                     enabled: client.enabled
                  })

               );

            }

         )

      )

   }

   getIssueAttributes(uuid: string): Observable<AttributeDescriptorDTO[]> {

      return of(
         dbData.raProfiles.find(profile => profile.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            profile => {

               if (!profile) throw new HttpErrorResponse({ status: 404, statusText: "Profile not found" });

               const authority = dbData.authorities.find(authority => authority.uuid === profile.authorityInstanceUuid);
               if (!authority) throw new HttpErrorResponse({ status: 404, statusText: "Authority not found" });

               return authority.issueAttributes;

            }


         )

      )

   }


   getRevocationAttributes(uuid: string): Observable<AttributeDescriptorDTO[]> {

      return of(
         dbData.raProfiles.find(profile => profile.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            profile => {

               if (!profile) throw new HttpErrorResponse({ status: 404, statusText: "Profile not found" });

               const authority = dbData.authorities.find(authority => authority.uuid === profile.authorityInstanceUuid);
               if (!authority) throw new HttpErrorResponse({ status: 404, statusText: "Authority not found" });

               return authority.revokeAttributes;

            }


         )

      )

   }


   getRaAcmeProfile(uuid: string): Observable<model.RaAcmeLinkDTO> {

      return of(
         dbData.raProfiles.find(profile => profile.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            profile => {

               if (!profile) throw new HttpErrorResponse({ status: 404, statusText: "Profile not found" });

               if (!profile.acmeProfileLink) return { acmeAvailable: false };

               return profile.acmeProfileLink;

            }

         )

      )

   }


   activateAcme(uuid: string, acmeProfileUuid: string, issueCertificateAttributes: AttributeDTO[], revokeCertificateAttributes: AttributeDTO[]): Observable<model.RaAcmeLinkDTO> {

      return of(
         dbData.raProfiles.find(profile => profile.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            profile => {

               if (!profile) throw new HttpErrorResponse({ status: 404, statusText: "Profile not found" });

               const acmeProfile = dbData.acmeProfiles.find(acmeProfile => acmeProfile.uuid === acmeProfileUuid);
               if (!acmeProfile) throw new HttpErrorResponse({ status: 404, statusText: "ACME Profile not found" });

               profile.acmeProfileLink = {
                  uuid: acmeProfile.uuid,
                  name: acmeProfile.name,
                  directoryUrl: acmeProfile.directoryUrl || "",
                  issueCertificateAttributes: issueCertificateAttributes,
                  revokeCertificateAttributes: revokeCertificateAttributes,
                  acmeAvailable: true
               }

               return profile.acmeProfileLink;

            }

         )

      )

   }


   deactivateAcme(uuid: string): Observable<void> {

      return of(
         dbData.raProfiles.find(profile => profile.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            profile => {

               if (!profile) throw new HttpErrorResponse({ status: 404, statusText: "Profile not found" });
               profile.acmeProfileLink = undefined;

            }

         )
      )

   }


   createRaProfile(authorityInstanceUuid: string, name: string, attributes: AttributeDTO[], description?: string, enabled?: boolean): Observable<string> {

      return of(
         dbData.authorities.find(authority => authority.uuid === authorityInstanceUuid)
      ).pipe(
         delay(randomDelay()),
         map(

            authority => {

               if (!authority) throw new HttpErrorResponse({ status: 404, statusText: "Authority not found" });

               const uuid = crypto.randomUUID();

               dbData.raProfiles.push({
                  uuid,
                  name,
                  attributes,
                  description,
                  enabled: enabled || true,
                  authorityInstanceUuid: authorityInstanceUuid,
                  authorityInstanceName: name,
               })

               return uuid;

            }
         )
      );

   }


   deleteRaProfile(uuid: string): Observable<void> {

      return of(
         dbData.raProfiles.findIndex(raProfile => raProfile.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            profileIndex => {
               if (profileIndex < 0) throw new HttpErrorResponse({ status: 404 });
               dbData.raProfiles.splice(profileIndex, 1);
            }

         )
      );

   }


   enableRaProfile(uuid: string): Observable<void> {

      return of(
         dbData.raProfiles.find(raProfile => raProfile.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            profile => {
               if (!profile) throw new HttpErrorResponse({ status: 404 });
               profile.enabled = true;
            }
         )

      );

   }


   disableRaProfile(uuid: string | number): Observable<void> {

      return of(
         dbData.raProfiles.find(raProfile => raProfile.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            profile => {
               if (!profile) throw new HttpErrorResponse({ status: 404 });
               profile.enabled = false;
            }
         )

      );

   }


   bulkDeleteRaProfile(uuids: string[]): Observable<void> {

      return of(
         uuids
      ).pipe(

         delay(randomDelay()),
         map(

            uuids => {

               uuids.forEach(

                  uuid => {

                     const profileIndex = dbData.raProfiles.findIndex(profile => profile.uuid === uuid);
                     if (profileIndex < 0) throw new HttpErrorResponse({ status: 404 });
                     dbData.raProfiles.splice(profileIndex, 1);

                  }

               )

            }

         )
      );

   }


   bulkEnableRaProfile(uuids: string[]): Observable<void> {

      return of(
         uuids
      ).pipe(

         delay(randomDelay()),
         map(

            uuids => {

               uuids.forEach(

                  uuid => {

                     const profile = dbData.raProfiles.find(profile => profile.uuid === uuid);
                     if (!profile) throw new HttpErrorResponse({ status: 404 });
                     profile.enabled = true;

                  }

               )

            }

         )
      );

   }


   bulkDisableRaProfile(uuids: string[]): Observable<void> {

      return of(
         uuids
      ).pipe(

         delay(randomDelay()),
         map(

            uuids => {

               uuids.forEach(

                  uuid => {

                     const profile = dbData.raProfiles.find(profile => profile.uuid === uuid);
                     if (!profile) throw new HttpErrorResponse({ status: 404 });
                     profile.enabled = false;

                  }

               )

            }

         )
      );

   }


   updateRaProfile(uuid: string, authorityInstanceUuid: string, attributes: AttributeDTO[], enabled?: boolean, description?: string): Observable<model.RaProfileDTO> {

      return of(
         dbData.raProfiles.find(profile => profile.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            profile => {

               if (!profile) throw new HttpErrorResponse({ status: 404, statusText: "Profile not found" });

               const authority = dbData.authorities.find(authority => authority.uuid === authorityInstanceUuid);
               if (!authority) throw new HttpErrorResponse({ status: 404, statusText: "Authority not found" });

               profile.authorityInstanceName = authority.name;
               profile.authorityInstanceUuid = authority.uuid;
               profile.attributes = attributes;
               profile.enabled = enabled || profile.enabled;
               profile.description = description || profile.description;

               return profile;

            }
         )

      );

   }

}
