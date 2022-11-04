import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";
import { HttpErrorResponse } from "utils/FetchHttpService";

import { dbData } from "api/_mocks/db";
import { randomDelay } from "utils/mock";

import { DeleteObjectErrorDTO } from "api/_common/deleteObjectErrorDTO";

import * as model from "./model";
import { AttributeDTO } from "api/_common/attributeDTO";


export class CredentialManagementMock implements model.CredentialManagementApi {

   enableCredential(uuid: string): Observable<void> {

      return of(
         dbData.credentials.find(credential => credential.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            credential => {

               if (!credential) throw new HttpErrorResponse({ status: 404, statusText: `Credential ${uuid} not found` });
               credential.enabled = true;

            }

         )

      )

   }


   disableCredential(uuid: string): Observable<void> {

      return of(
         dbData.credentials.find(credential => credential.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            credential => {

               if (!credential) throw new HttpErrorResponse({ status: 404, statusText: `Credential ${uuid} not found` });
               credential.enabled = false;

            }

         )

      )

   }


   getCredentialDetail(uuid: string): Observable<model.CredentialDTO> {

      return of(
         dbData.credentials.find(credential => credential.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            credential => {

               if (!credential) throw new HttpErrorResponse({ status: 404, statusText: `Credential ${uuid} not found` });
               return credential;

            }

         )
      );

   }


   updateCredential(uuid: string, attributes: AttributeDTO[]): Observable<model.CredentialDTO> {

      return of(
         dbData.credentials.find(credential => credential.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            credential => {

               if (!credential) throw new HttpErrorResponse({ status: 404, statusText: `Credential ${uuid} not found` });

               credential.attributes = attributes;

               return credential;

            }

         )
      );

   }


   deleteCredential(uuid: string): Observable<DeleteObjectErrorDTO[]> {

      return of(
         dbData.credentials.findIndex(credential => credential.uuid === uuid)
      ).pipe(

         delay(randomDelay()),

         map(

            credentialIndex => {

               if (credentialIndex) throw new HttpErrorResponse({ status: 404, statusText: `Credential ${uuid} not found` });

               dbData.credentials.splice(credentialIndex, 1);
               return [];

            }

         )

      );

   }


   getCredentialsList(): Observable<model.CredentialDTO[]> {

      return of(
         dbData.credentials
      ).pipe(
         delay(randomDelay())
      );

   }


   createNewCredential(name: string, kind: string, connectorUuid: string, attributes: AttributeDTO[]): Observable<{ uuid: string}> {

      return of(
         null
      ).pipe(
         delay(randomDelay()),
         map(
            () => {

               const connector = dbData.connectors.find(connector => connector.uuid === connectorUuid);
               if (!connector) throw new HttpErrorResponse({ status: 404, statusText: `Connector ${connectorUuid} not found` });

               const uuid = crypto.randomUUID();

               dbData.credentials.push({
                  uuid,
                  name,
                  kind,
                  connectorName: connector.name,
                  connectorUuid: connector.uuid,
                  attributes,
                  enabled: true
               })

               return { uuid };

            }
         )
      );

   }


   forceDeleteCredential(uuid: string): Observable<void> {

      return of(
         dbData.credentials.findIndex(credential => credential.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            credentialIndex => {

               if (credentialIndex < 0) throw new HttpErrorResponse({ status: 404, statusText: `Credential ${uuid} not found` });
               dbData.credentials.splice(credentialIndex, 1);

            }

         )
      );

   }


   bulkDeleteCredentials(uuids: string[]): Observable<DeleteObjectErrorDTO[]> {

      return of(
         uuids
      ).pipe(

         delay(randomDelay()),
         map(

            uuids => {

               uuids.forEach(

                  uuid => {

                     const credentialIndex = dbData.credentials.findIndex(credential => credential.uuid === uuid);
                     if (credentialIndex < 0) throw new HttpErrorResponse({ status: 404, statusText: `Credential ${uuid} not found` });

                     dbData.credentials.splice(credentialIndex, 1);

                  }

               )

               return [];

            }

         )
      );

   }

   bulkForceDeleteCredentials(uuids: string[]): Observable<void> {

      return of(
         uuids
      ).pipe(

         delay(randomDelay()),
         map(

            uuids => {

               uuids.forEach(

                  uuid => {

                     const credentialIndex = dbData.credentials.findIndex(credential => credential.uuid === uuid);
                     if (credentialIndex < 0) throw new HttpErrorResponse({ status: 404, statusText: `Credential ${uuid} not found` });

                     dbData.credentials.splice(credentialIndex, 1);

                  }

               )

            }

         )
      );

   }


}
