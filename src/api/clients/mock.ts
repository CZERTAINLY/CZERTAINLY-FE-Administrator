import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";

import * as model from "./model";

import { dbData } from "mocks/db";
import { randomDelay } from "utils/mock";
import { HttpErrorResponse } from "ts-rest-client";
import { certificatePEM2CertificateModel } from "utils/certificate";
import { CertificateDTO } from "api/certificates";


export class ClientManagementMock implements model.ClientManagementApi {


   unauthorizeClient(clientUuid: string, profileUuid: string): Observable<void> {

      return of(
         dbData.clients.find(client => client.uuid === clientUuid)
      ).pipe(

         delay(randomDelay()),
         map(

            client => {

               if (!client) { throw new HttpErrorResponse({ status: 404, statusText: "Client not found!" }); }

               const profileIdx = client.authorizedProfiles.findIndex(puuid => puuid === profileUuid)
               if (profileIdx < 0) { throw new HttpErrorResponse({ status: 404, statusText: "Profile authorization not found" }); }

               client.authorizedProfiles.splice(profileIdx, 1);

            }

         )
      );

   }


   enableClient(uuid: string): Observable<void> {

      return of(
         dbData.clients.find((c) => c.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            client => {

               if (!client) throw new HttpErrorResponse({ status: 404 });
               client.enabled = true;

            }

         )
      );

   }


   disableClient(uuid: string): Observable<void> {

      return of(
         dbData.clients.find((c) => c.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            client => {

               if (!client) throw new HttpErrorResponse({ status: 404 });
               client.enabled = false;
            }

         )
      );

   }


   authorizeClient(clientUuid: string, profileUuid: string): Observable<void> {

      return of(
         dbData.clients.find(client => client.uuid === clientUuid)
      ).pipe(

         delay(randomDelay()),
         map(

            client => {
               if (!client) throw new HttpErrorResponse({ status: 404, statusText: "Client not found" });

               const profile = dbData.raProfiles.find(profile => profile.uuid === profileUuid);
               if (!profile) throw new HttpErrorResponse({ status: 404,statusText: "Profile not found" });

               if (client.authorizedProfiles.indexOf(profileUuid) >= 0) throw new HttpErrorResponse({ status: 404,statusText: "Client authorized already" });

               client.authorizedProfiles.push(profileUuid);

            }
         )

      );

   }


   bulkEnableClient(uuids: string[]): Observable<void> {

      return of(
         uuids
      ).pipe(

         delay(randomDelay()),
         map(

            uuids => {

               uuids.forEach(

                  uuid => {

                     const client = dbData.clients.find(client => client.uuid === uuid);
                     if (!client) throw new HttpErrorResponse({ status: 404 });
                     client.enabled = true;

                  }

               )

            }

         )

      );

   }


   bulkDisableClient(uuids: string[]): Observable<void> {

      return of(
         uuids
      ).pipe(

         delay(randomDelay()),
         map(

            uuids => {

               uuids.forEach(

                  uuid => {

                     const client = dbData.clients.find(client => client.uuid === uuid);
                     if (!client) throw new HttpErrorResponse({ status: 404 });
                     client.enabled = true;

                  }

               )

            }

         )

      );


   }


   getClientDetail(uuid: string): Observable<model.ClientDTO> {

      return of(
         dbData.clients.find(client => client.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            client => {

               if (!client) throw new HttpErrorResponse({ status: 404 });
               return client;

            }

         )

      );

   }


   updateClient(uuid: string, certificate?: string, description?: string, certificateUuid?: string): Observable<model.ClientDTO> {

      return of(
         dbData.clients.find(client => client.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            client => {

               if (!client) throw new HttpErrorResponse({ status: 404 });

               if (description) client.description = description;

               if (certificate) {

                  const mcrt = certificatePEM2CertificateModel(certificate);

                  client.certificate =  {
                     ...mcrt,
                     subjectAlternativeNames: {
                        dNSName:  mcrt.subjectAlternativeNames?.dNSName || [],
                        directoryName: mcrt.subjectAlternativeNames?.directoryName || [],
                        ediPartyName: mcrt.subjectAlternativeNames?.ediPartyName || [],
                        iPAddress: mcrt.subjectAlternativeNames?.iPAddress || [],
                        otherName: mcrt.subjectAlternativeNames?.otherName || [],
                        registeredID: mcrt.subjectAlternativeNames?.registeredID || [],
                        rfc822Name: mcrt.subjectAlternativeNames?.rfc822Name || [],
                        uniformResourceIdentifier: mcrt.subjectAlternativeNames?.uniformResourceIdentifier || [],
                        x400Address: mcrt.subjectAlternativeNames?.x400Address || [],
                     }
                  }

                  dbData.certificates.push({
                     ...client.certificate,
                     uuid: crypto.randomUUID()
                  })

               }

               if (certificateUuid) {

                  const certificate = dbData.certificates.find(certificate => certificate.uuid === certificateUuid);
                  if (!certificate) throw new HttpErrorResponse({ status: 404, statusText: "Certificate not found!" });
                  client.certificate = certificate;

               }

               return client;

            }

         )

      );

   }


   deleteClient(uuid: string): Observable<void> {

      return of(
         dbData.clients.findIndex(client => client.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            clientIndex => {

               if (clientIndex < 0) throw new HttpErrorResponse({ status: 404 });
               dbData.clients.splice(clientIndex, 1);

            }

         )
      );

   }


   getClientsList(): Observable<model.ClientDTO[]> {

      return of(dbData.clients);

   }


   createNewClient(name: string, description?: string, enabled?: boolean, certificate?: string, certificateUuid?: string): Observable<string> {

      return of(
         null
      ).pipe(

         delay(randomDelay()),
         map(

            () => {

               const uuid = crypto.randomUUID();

               let cert: CertificateDTO | undefined;

               if (certificate) {

                  const mcrt = certificatePEM2CertificateModel(certificate);

                  cert =  {
                     ...mcrt,
                     subjectAlternativeNames: {
                        dNSName:  mcrt.subjectAlternativeNames?.dNSName || [],
                        directoryName: mcrt.subjectAlternativeNames?.directoryName || [],
                        ediPartyName: mcrt.subjectAlternativeNames?.ediPartyName || [],
                        iPAddress: mcrt.subjectAlternativeNames?.iPAddress || [],
                        otherName: mcrt.subjectAlternativeNames?.otherName || [],
                        registeredID: mcrt.subjectAlternativeNames?.registeredID || [],
                        rfc822Name: mcrt.subjectAlternativeNames?.rfc822Name || [],
                        uniformResourceIdentifier: mcrt.subjectAlternativeNames?.uniformResourceIdentifier || [],
                        x400Address: mcrt.subjectAlternativeNames?.x400Address || [],
                     }
                  }

                  dbData.certificates.push({
                     ...cert,
                     uuid: crypto.randomUUID()
                  })

               }

               if (certificateUuid) {
                  cert = dbData.certificates.find(certificate => certificate.uuid === certificateUuid);
               }

               if (!cert) throw new HttpErrorResponse({ status: 404, statusText: "Certificate is missing or not found" });

               const client: model.ClientDTO = {
                  uuid,
                  name,
                  serialNumber: crypto.randomUUID(),
                  description: description || "",
                  enabled: enabled || true,
                  certificate: cert
               }

               return client.uuid;

            }

         )

      );

   }



   getAuthorizedProfiles(uuid: string): Observable<model.AuthorizedProfilesDTO[]> {

      return of(
         dbData.clients.find(client => client.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            client => {

               if (!client) throw new HttpErrorResponse({ status: 404 });

               return client.authorizedProfiles.map(

                  uuid => {

                     const profile = dbData.raProfiles.find(profile => profile.uuid === uuid);
                     if (!profile) throw new HttpErrorResponse({ status: 404, statusText: "Authorized profile not found."});

                     return {
                        uuid,
                        name: profile.name,
                        enabled: profile.enabled
                     }

                  }

               );

            }

         )

      )

   }


   bulkDeleteClient(uuids: string[]): Observable<void> {

      return of(
         uuids
      ).pipe(

         delay(randomDelay()),
         map(

            uuids => {

               uuids.forEach(

                  uuid => {

                     const clientIndex = dbData.clients.findIndex(client => client.uuid === uuid);
                     if (clientIndex < 0) throw new HttpErrorResponse({ status: 404 });
                     dbData.clients.splice(clientIndex, 1);

                  }

               )

            }

         )

      );

   }





}
