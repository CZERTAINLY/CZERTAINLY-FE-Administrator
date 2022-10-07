import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { HttpErrorResponse } from 'ts-rest-client';

import { dbData } from 'mocks/db';
import { randomDelay } from 'utils/mock';
import * as model from './model';

export class RolesManagementMock implements model.RolesManagementApi {

   list(): Observable<model.RoleDTO[]> {

      return of(
         dbData.roles
      ).pipe(

         delay(randomDelay())

      );

   }


   getDetail(uuid: string): Observable<model.RoleDetailDTO> {

      return of(
         dbData.roles.find(role => role.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            role => {

               if (!role) throw new HttpErrorResponse({ status: 404 });
               return role;

            }

         )

      );

   }


   create(
      name: string,
      description?: string,
   ): Observable<model.RoleDetailDTO> {

      return of(
         dbData.roles.find(role => role.name === name)
      ).pipe(

         delay(randomDelay()),
         map(

            role => {

               if (role) throw new HttpErrorResponse({ status: 409 });

               const newRole = {
                  uuid: crypto.randomUUID(),
                  name,
                  description,
                  systemRole: false,
                  users: []
               };

               dbData.roles.push(newRole);

               return newRole;

            }

         )

      );

   }


   update(
      uuid: string,
      name: string,
      description?: string,
   ): Observable<model.RoleDetailDTO> {

      return of(
         dbData.roles.find(role => role.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            role => {

               if (!role) throw new HttpErrorResponse({ status: 404 });

               role.name = name;
               role.description = description || role.description;

               return role;

            }

         )

      );

   }


   delete(uuid: string): Observable<void> {

      return of(
         dbData.roles.find(role => role.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            role => {

               if (!role) throw new HttpErrorResponse({ status: 404 });

               dbData.roles = dbData.roles.filter(r => r.uuid !== uuid);

            }

         )

      );


   }


   getPermissions(uuid: string): Observable<model.SubjectPermissionsDTO> {

      return of(
         dbData.roles.find(role => role.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            role => {

               if (!role) throw new HttpErrorResponse({ status: 404, statusText: 'Role not found' });

               const dbPerms = dbData.permissions.find(p => p.uuid === uuid);
               if (!dbPerms) throw new HttpErrorResponse({ status: 404, statusText: 'Role permissions found' });

               return dbPerms.permissions;

            }

         )

      );

   }


   updatePermissions(uuid: string, permissions: model.SubjectPermissionsDTO): Observable<model.SubjectPermissionsDTO> {

      return of(
         dbData.roles.find(role => role.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            role => {

               if (!role) throw new HttpErrorResponse({ status: 404, statusText: 'Role not found' });

               let dbPerms = dbData.permissions.find(p => p.uuid === uuid);

               if (!dbPerms) {

                  dbPerms = {
                     uuid,
                     permissions
                  };

                  dbData.permissions.push(dbPerms);

                  return permissions;

               }

               dbPerms.permissions = permissions;

               return dbPerms.permissions;

            }

         )

      );


   }


}


