import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { HttpErrorResponse } from "utils/FetchHttpService";

import { dbData } from 'api/_mocks/db';
import { randomDelay } from 'utils/mock';
import * as model from './model';
import { UserDTO } from 'api/users';

export class RolesManagementMock {

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


   getUsers(uuid: string): Observable<UserDTO[]> {

      return of(
         dbData.roles.find(role => role.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            role => {

               if (!role) throw new HttpErrorResponse({ status: 404, statusText: 'Role not found' });

               return role.users;

            }

         )

      );

   }


   updateUsers(uuid: string, userUuids: string[]): Observable<model.RoleDetailDTO> {

      return of(
         dbData.roles.find(role => role.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            role => {

               if (!role) throw new HttpErrorResponse({ status: 404, statusText: 'Role not found' });

               role.users = userUuids.map(
                  uuid => {
                     const user = dbData.users.find(user => user.uuid === uuid);
                     if (!user) throw new HttpErrorResponse({ status: 404, statusText: 'User not found' });
                     return user;
                  }
               );

               return role;

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


   getResourcePermissions(uuid: string, resourceName: string): Observable<model.ResourcePermissionsDTO> {

      return of(
         dbData.roles.find(role => role.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            role => {

               if (!role) throw new HttpErrorResponse({ status: 404, statusText: 'Role not found' });

               const dbPerms = dbData.permissions.find(p => p.uuid === uuid);
               if (!dbPerms) throw new HttpErrorResponse({ status: 404, statusText: 'Role permissions found' });

               const resourcePerms = dbPerms.permissions.resources.find(rp => rp.name === resourceName);
               if (!resourcePerms) throw new HttpErrorResponse({ status: 404, statusText: 'Resource permissions not found' });

               return resourcePerms;

            }

         )

      );

   }


   getResourceObjectsPermissions(uuid: string, resourceName: string): Observable<model.ObjectPermissionsDTO[]> {

      return of(
         dbData.roles.find(role => role.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            role => {

               if (!role) throw new HttpErrorResponse({ status: 404, statusText: 'Role not found' });

               const dbPerms = dbData.permissions.find(p => p.uuid === uuid);
               if (!dbPerms) throw new HttpErrorResponse({ status: 404, statusText: 'Role permissions found' });

               const resourcePerms = dbPerms.permissions.resources.find(rp => rp.name === resourceName);
               if (!resourcePerms) throw new HttpErrorResponse({ status: 404, statusText: 'Resource permissions not found' });

               return resourcePerms.objects || [];

            }

         )

      );


   }


   addResourceObjectsPermissions(uuid: string, resourceName: string, objectUuid: string, permissions: model.ObjectPermissionsDTO[]): Observable<void> {

      return of(
         dbData.roles.find(role => role.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            role => {

               if (!role) throw new HttpErrorResponse({ status: 404, statusText: 'Role not found' });

               const dbPerms = dbData.permissions.find(p => p.uuid === uuid);
               if (!dbPerms) throw new HttpErrorResponse({ status: 404, statusText: 'Role permissions found' });

               const resourcePerms = dbPerms.permissions.resources.find(rp => rp.name === resourceName);
               if (!resourcePerms) throw new HttpErrorResponse({ status: 404, statusText: 'Resource permissions not found' });

               const objectPerms = resourcePerms.objects?.find(op => op.uuid === objectUuid);
               if (objectPerms) throw new HttpErrorResponse({ status: 409, statusText: 'Object permissions already exist' });

               resourcePerms.objects ? resourcePerms.objects.push(...permissions) : resourcePerms.objects = [ ...permissions ];

            }

         )

      );


   }


   updateResourceObjectsPermissions(uuid: string, resourceName: string, objectUuid: string, permissions: model.ObjectPermissionsDTO): Observable<void> {

      return of(
         dbData.roles.find(role => role.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            role => {

               if (!role) throw new HttpErrorResponse({ status: 404, statusText: 'Role not found' });

               const dbPerms = dbData.permissions.find(p => p.uuid === uuid);
               if (!dbPerms) throw new HttpErrorResponse({ status: 404, statusText: 'Role permissions found' });

               const resourcePerms = dbPerms.permissions.resources.find(rp => rp.name === resourceName);
               if (!resourcePerms) throw new HttpErrorResponse({ status: 404, statusText: 'Resource permissions not found' });

               const objectPerms = resourcePerms.objects?.find(op => op.uuid === objectUuid);
               if (!objectPerms) throw new HttpErrorResponse({ status: 404, statusText: 'Object permissions not found' });

               objectPerms.allow = [ ...permissions.allow ];
               objectPerms.deny = [ ...permissions.deny ];

            }

         )

      );

   }


   removeResourceObjectsPermissions(uuid: string, resourceName: string, objectUuid: string): Observable<void> {

      return of(
         dbData.roles.find(role => role.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            role => {

               if (!role) throw new HttpErrorResponse({ status: 404, statusText: 'Role not found' });

               const dbPerms = dbData.permissions.find(p => p.uuid === uuid);
               if (!dbPerms) throw new HttpErrorResponse({ status: 404, statusText: 'Role permissions found' });

               const resourcePerms = dbPerms.permissions.resources.find(rp => rp.name === resourceName);
               if (!resourcePerms) throw new HttpErrorResponse({ status: 404, statusText: 'Resource permissions not found' });

               const objectPerms = resourcePerms.objects?.find(op => op.uuid === objectUuid);
               if (!objectPerms) throw new HttpErrorResponse({ status: 404, statusText: 'Object permissions not found' });

               resourcePerms.objects = resourcePerms.objects!.filter(op => op.uuid !== objectUuid);

            }

         )

      );


   }


}


