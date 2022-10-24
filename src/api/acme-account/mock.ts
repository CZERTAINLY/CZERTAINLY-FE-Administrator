import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";
import { HttpErrorResponse } from "utils/FetchHttpService";

import { dbData } from "mocks/db";
import { randomDelay } from "utils/mock";
import * as model from "./model";

export class AcmeAccountManagementMock implements model.AcmeAccountManagementApi {

   getAcmeAccountList(): Observable<model.AcmeAccountListItemDTO[]> {

      return of(
         dbData.acmeAccounts
      ).pipe(

         delay(randomDelay()),
         map(

            acmeAccounts => acmeAccounts.map<model.AcmeAccountListItemDTO>(

               account => ({
                  accountId: account.accountId,
                  uuid: account.uuid,
                  enabled: account.enabled,
                  totalOrders: account.totalOrders,
                  status: account.status,
                  raProfileName: account.raProfileName,
                  acmeProfileName: account.acmeProfileName,
                  acmeProfileUuid: account.acmeProfileUuid,
               })

            )
         )

      );

   }


   getAcmeAccountDetails(acmeProfileUuid: string, uuid: string): Observable<model.AcmeAccountDTO> {

      return of(
         dbData.acmeAccounts.find(acmeAccount => acmeAccount.uuid === uuid)
      ).pipe(
         delay(randomDelay()),
         map(

            acmeAccount => {

               if (!acmeAccount) throw new HttpErrorResponse({ status: 404 });
               return acmeAccount;

            }

         )
      );

   }

   revokeAcmeAccount(acmeProfileUuid: string, uuid: string): Observable<void> {

      return of(
         dbData.acmeAccounts.findIndex(account => account.uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            acmeAccountIndex => {

               if (acmeAccountIndex < 0) throw new HttpErrorResponse({ status: 404 });
               dbData.acmeAccounts.splice(acmeAccountIndex, 1);

            }

         )
      );

   }


   enableAcmeAccount(acmeProfileUuid: string, uuid: string): Observable<void> {

      return of(
         dbData.acmeAccounts.find(account => account.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            acmeAccount => {

               if (!acmeAccount) throw new HttpErrorResponse({ status: 404 });
               acmeAccount.enabled = true;

            }

         )
      );

   }


   disableAcmeAccount(acmeProfileUuid: string, uuid: string): Observable<void> {

      return of(
         dbData.acmeAccounts.find(account => account.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            acmeAccount => {

               if (!acmeAccount) throw new HttpErrorResponse({ status: 404 });
               acmeAccount.enabled = false;

            }

         )
      );

   }


   bulkRevokeAcmeAccount(uuids: string[]): Observable<void> {

      return of(
         uuids
      ).pipe(

         delay(randomDelay()),
         map(

            uuids => uuids.forEach(

               uuid => {

                  const accountIndex = dbData.acmeAccounts.findIndex(account => account.uuid === uuid);
                  if (accountIndex < 0) throw new HttpErrorResponse({ status: 404, statusText: `AcmeAccount ${uuid} not found.` });
                  dbData.acmeAccounts.splice(accountIndex, 1);

               }

            )

         )
      );

   }


   bulkEnableAcmeAccount(uuids: string[]): Observable<void> {

      return of(
         uuids
      ).pipe(

         delay(randomDelay()),
         map(

            uuids => uuids.forEach(

               uuid => {

                  const account = dbData.acmeAccounts.find(account => account.uuid === uuid);
                  if (!account) throw new HttpErrorResponse({ status: 404, statusText: `AcmeAccount ${uuid} not found.` });
                  account.enabled = true;


               }

            )

         )

      );

   }


   bulkDisableAcmeAccount(uuids: string[]): Observable<void> {

      return of(
         uuids
      ).pipe(

         delay(randomDelay()),
         map(

            uuids => uuids.forEach(

               uuid => {

                  const account = dbData.acmeAccounts.find(account => account.uuid === uuid);
                  if (!account) throw new HttpErrorResponse({ status: 404, statusText: `AcmeAccount ${uuid} not found.` });
                  account.enabled = false;

               }

            )

         )
      );


   }

}
