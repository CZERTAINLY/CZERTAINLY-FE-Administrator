import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";
import { HttpErrorResponse } from "ts-rest-client";
import { randomDelay } from "utils/mock";
import { dbData } from "mocks/db";

import * as model from "./model";
import { getOrCreateCertificate } from "mocks/helpers";
import { CertificateDTO } from "api/certificates";
import { DbUser } from "mocks/db-users";
import { RoleDTO } from "api/roles";


export class UserManagementMock implements model.UserManagementApi {


   list(): Observable<model.UserDTO[]> {

      return of(
         dbData.users.map(
            user => ({
               uuid: user.uuid,
               username: user.username,
               firstName: user.firstName,
               lastName: user.lastName,
               email: user.email,
               enabled: user.enabled,
               systemUser: user.systemUser
            })
         )
      ).pipe(
         delay(randomDelay())
      );

   }


   detail(uuid: string): Observable<model.UserDetailDTO> {

      return of(
         dbData.users.find(user => user.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            user => {

               if (!user) throw new HttpErrorResponse({ status: 404 });
               return user;

            }

         )

      );

   }


   create(
      username: string,
      firstName: string | undefined,
      lastName: string | undefined,
      email: string | undefined,
      enabled: boolean,
      certificateUuid?: string,
      certificate?: CertificateDTO,
   ): Observable<model.UserDetailDTO> {

      return of(
         null
      ).pipe(

         delay(randomDelay()),
         map(

            () => {

               const uuid = crypto.randomUUID();

               const cert = getOrCreateCertificate(certificate?.certificateContent, certificateUuid);
               if (!cert) throw new HttpErrorResponse({ status: 422, statusText: "Missing certificate or certificate does not exist." });

               const user: DbUser = {
                  uuid,
                  username,
                  firstName,
                  lastName,
                  email,
                  enabled,
                  certificate: {
                     uuid: cert.uuid,
                     fingerprint: cert.fingerprint,
                  },
                  roles: [],
                  systemUser: false
               }

               dbData.users.push(user);

               return user;

            }

         )

      );

   }


   update(
      uuid: string,
      firstName: string | undefined,
      lastName: string | undefined,
      email: string | undefined,
      enabled: boolean,
      certificateUuid?: string,
      certificate?: CertificateDTO,
   ): Observable<model.UserDetailDTO> {

      return of(
         dbData.users.find(user => user.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            user => {

               if (!user) throw new HttpErrorResponse({ status: 404, statusText: "User not found" });

               const cert = getOrCreateCertificate(certificate?.certificateContent, certificateUuid);
               if (!cert) throw new HttpErrorResponse({ status: 404, statusText: "Missing certificate or certificate does not exist." });

               user.firstName = firstName;
               user.lastName = lastName;
               user.email = email;
               user.enabled = enabled;
               user.certificate = cert || user.certificate;

               return user;

            }

         )

      );

   }


   delete(uuid: string): Observable<void> {

      return of(
         dbData.users.findIndex(u => u.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            index => {

               if (index < 0) throw new HttpErrorResponse({ status: 404 });
               dbData.users.splice(index, 1);

            }

         )

      );

   }


   disable(uuid: string): Observable<void> {

      return of(
         dbData.users.find(user => user.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            user => {

               if (!user) throw new HttpErrorResponse({ status: 404 });
               user.enabled = false;

            }

         )

      );

   }


   enable(uuid: string): Observable<void> {

      return of(
         dbData.users.find(user => user.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            user => {

               if (!user) throw new HttpErrorResponse({ status: 404 });
               user.enabled = true;

            }

         )

      );

   }


   getRoles(uuid: string): Observable<RoleDTO[]> {

      return of(
         dbData.users.find(user => user.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            user => {

               if (!user) throw new HttpErrorResponse({ status: 404 });
               return user.roles;

            }

         )

      );

   }


   updateRoles(userUuid: string, rolesUuids: string[]): Observable<model.UserDetailDTO> {

         return of(
            dbData.users.find(user => user.uuid === userUuid)
         ).pipe(

            delay(randomDelay()),
            map(

               user => {

                  if (!user) throw new HttpErrorResponse({ status: 404 });

                  user.roles = rolesUuids.map(
                     uuid => dbData.roles.find(role => role.uuid === uuid)
                  ).filter(role => !!role) as RoleDTO[];

                  return {
                     ...user,
                  };

               }

            )

         );

   }


   addRole(userUuid: string, roleUuid: string): Observable<void> {

      return of(
         dbData.users.find(user => user.uuid === userUuid)
      ).pipe(

         delay(randomDelay()),
         map(

            user => {

               if (!user) throw new HttpErrorResponse({ status: 404, statusText: "User not found" });

               const role = dbData.roles.find(role => role.uuid === roleUuid);
               if (!role) throw new HttpErrorResponse({ status: 404, statusText: "Role not found" });

               if (!user.roles.find(r => r.uuid === role.uuid)) user.roles.push(role);

            }

         )

      );


   }

   removeRole(userUuid: string, roleUuid: string): Observable<void> {

      return of(
         dbData.users.find(user => user.uuid === userUuid)
      ).pipe(

         delay(randomDelay()),
         map(

            user => {

               if (!user) throw new HttpErrorResponse({ status: 404, statusText: "User not found" });

               const index = user.roles.findIndex(role => role.uuid === roleUuid);
               if (index < 0) throw new HttpErrorResponse({ status: 404, statusText: "User role not found" });

               user.roles.splice(index, 1);

            }

         )

      );

   }


}
