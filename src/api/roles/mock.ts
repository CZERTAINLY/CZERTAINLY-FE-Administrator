import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { HttpErrorResponse } from 'ts-rest-client';

import { dbData } from 'mocks/db';
import { randomDelay } from 'utils/mock';
import * as model from './model';

export class RoleMock implements model.RoleApi {

   listRoles(): Observable<model.RoleDTO[]> {

      return of(
         []
      ).pipe(

         delay(randomDelay())

      );

   }

}
