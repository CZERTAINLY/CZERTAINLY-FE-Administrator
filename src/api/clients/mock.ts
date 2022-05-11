import { Observable, of, throwError } from "rxjs";
import { delay, map } from "rxjs/operators";

import { dbData, createClient } from "mocks/db";
import { randomDelay } from "utils/mock";
import * as model from "./model";
import { HttpErrorResponse } from "ts-rest-client";
import { certificatePEM2CertificateDTO } from "utils/certificate";
import { CertificateDTO } from "api/certificates";


export class ClientManagementMock implements model.ClientManagementApi {


   unauthorizeClient(clientId: string, profileId: string): Observable<void> {

      return of(
         dbData.clients.find((c) => c.uuid === clientId)
      ).pipe(

         delay(randomDelay()),
         map(

            client => {

               if (!client) { throw new HttpErrorResponse({ status: 404, }); }

               const profileIdx = client.auth.findIndex(auth => auth.uuid === profileId)
               if (profileIdx < 0) { throw new HttpErrorResponse({ status: 404, }); }

               client.auth.splice(profileIdx, 1);

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


   authorizeClient(clientId: string, profileId: string): Observable<void> {

      return of(
         dbData.clients.find(client => client.uuid === clientId)
      ).pipe(

         delay(randomDelay()),
         map(

            client => {

               const profile = dbData.raProfiles.find(profile => profile.uuid === profileId);

               if (!client || !profile) throw new HttpErrorResponse({ status: 404 });

               client.auth.push({
                  uuid: crypto.randomUUID(),
                  name: profile.name,
                  enabled: true
               });

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

                  client.certificate = certificatePEM2CertificateDTO(certificate);
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

                  cert = certificatePEM2CertificateDTO(certificate);
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



   getClientAuth(uuid: string): Observable<model.ClientAuthorizationsDTO[]> {

      return of(
         dbData.clients.find(client => client.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            client => {
               if (!client) throw new HttpErrorResponse({ status: 404 });
               return client.auth;
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
