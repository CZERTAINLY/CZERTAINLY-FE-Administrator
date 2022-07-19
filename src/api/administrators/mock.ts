import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";
import { HttpErrorResponse } from "ts-rest-client";
import { randomDelay } from "utils/mock";
import { dbData } from "mocks/db";

import * as model from "./model";
import { getOrCreateCertificate } from "mocks/helpers";
import { AdministratorRole } from "models";
import { CertificateDTO } from "api/certificates";


export class AdministatorManagementMock implements model.AdministratorManagementApi {

   createAdmin(
      username: string,
      name: string,
      surname: string,
      email: string,
      description: string,
      role: AdministratorRole,
      enabled: boolean,
      certificateUuid?: string,
      adminCertificate?: CertificateDTO
   ): Observable<string> {

      return of(
         null
      ).pipe(

         delay(randomDelay()),
         map(

            () => {

               const uuid = crypto.randomUUID();

               const certificate = getOrCreateCertificate(adminCertificate?.certificateContent, certificateUuid);
               if (!certificate) throw new HttpErrorResponse({ status: 422, statusText: "Missing certificate or certificate does not exist." });

               dbData.administrators.push({
                  uuid,
                  username,
                  name,
                  surname,
                  email,
                  certificate,
                  description,
                  role,
                  enabled,
                  serialNumber: (Math.random() * 1000000000).toString()
               });

               return uuid;

            }

         )

      );

   }


   deleteAdmin(uuid: string): Observable<void> {

      return of(
         dbData.administrators.findIndex((a) => a.uuid === uuid[0])
      ).pipe(

         delay(randomDelay()),
         map(

            administratorIndex => {

               if (administratorIndex < 0) throw new HttpErrorResponse({ status: 404 });
               dbData.administrators.splice(administratorIndex, 1);

            }

         )

      );

   }


   disableAdmin(uuid: string): Observable<void> {

      return of(
         dbData.administrators.find(administrator => administrator.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            administrator => {

               if (!administrator) throw new HttpErrorResponse({ status: 404 });
               administrator.enabled = false;

            }

         )

      );

   }


   enableAdmin(uuid: string): Observable<void> {

      return of(
         dbData.administrators.find(administrator => administrator.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            administrator => {

               if (!administrator) throw new HttpErrorResponse({ status: 404 });
               administrator.enabled = true;

            }

         )

      );

   }


   bulkDeleteAdmin(uuids: string[]): Observable<void> {

      return of(
         uuids
      ).pipe(

         delay(randomDelay()),
         map(

            uuids => {

               uuids.forEach(

                  uuid => {

                     const index = dbData.administrators.findIndex(administrator => administrator.uuid === uuid);
                     if (index < 0) throw new HttpErrorResponse({ status: 404 });
                     dbData.administrators.splice(index, 1);

                  }

               )

            }
         )

      );

   }


   bulkDisableAdmin(uuids: string[]): Observable<void> {

      return of(
         uuids
      ).pipe(

         delay(randomDelay()),
         map(

            uuids => {

               uuids.forEach(

                  uuid => {

                     const administrator = dbData.administrators.find(administrator => administrator.uuid === uuid);
                     if (!administrator) throw new HttpErrorResponse({ status: 404 });
                     administrator.enabled = false;

                  }

               )

            }
         )

      );

   }


   bulkEnableAdmin(uuids: string[]): Observable<void> {

      return of(
         uuids
      ).pipe(

         delay(randomDelay()),
         map(

            uuids => {

               uuids.forEach(

                  uuid => {

                     const administrator = dbData.administrators.find(administrator => administrator.uuid === uuid);
                     if (!administrator) throw new HttpErrorResponse({ status: 404 });
                     administrator.enabled = false;

                  }

               )

            }

         )

      );


   }


   getAdminDetail(uuid: string): Observable<model.AdministratorDTO> {

      return of(
         dbData.administrators.find((administrator) => administrator.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            administrator => {

               if (!administrator) throw new HttpErrorResponse({ status: 404 });
               return administrator;

            }

         )

      );

   }


   getAdminsList(): Observable<model.AdministratorDTO[]> {

      return of(
         dbData.administrators
      ).pipe(
         delay(randomDelay())
      );

   }


   updateAdmin(
      uuid: string,
      username: string,
      name: string,
      surname: string,
      email: string,
      description: string,
      role: AdministratorRole,
      certificateUuid?: string,
      adminCertificate?: CertificateDTO
   ): Observable<model.AdministratorDTO> {

      return of(
         dbData.administrators.find(admin => admin.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            administrator => {

               if (!administrator) throw new HttpErrorResponse({ status: 404, statusText: "Administrator not found" });

               const cert = getOrCreateCertificate(adminCertificate?.certificateContent, certificateUuid);
               if (!cert) throw new HttpErrorResponse({ status: 404, statusText: "Missing certificate or certificate does not exist." });

               administrator.name = name;
               administrator.surname = surname;
               administrator.username = username;
               administrator.email = email;
               administrator.description = description;
               administrator.role = role;
               administrator.certificate = cert;

               return administrator;

            }

         )

      );

   }

}
