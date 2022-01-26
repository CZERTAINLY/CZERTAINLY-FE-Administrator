import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";
import { HttpErrorResponse } from "ts-rest-client";

import { dbData } from "mocks/db";
import { randomDelay } from "utils/mock";
import * as model from "./model";

export class AcmeAccountManagementMock
  implements model.AcmeAccountManagementApi
{
  getAcmeAccountList(): Observable<model.AcmeAccountListResponse[]> {
    return of(dbData.acmeAccount);
  }

  getAcmeDetails(
    uuid: string | number
  ): Observable<model.AcmeAccountDetailResponse> {
    return of(dbData.acmeAccountDetail);
  }

  deleteAcmeAccount(uuid: string | number): Observable<void> {
    return of(null).pipe(
      delay(randomDelay()),
      map(function (): void {
        const profileIdx = dbData.acmeAccount.findIndex(
          (p) => p.uuid.toString() === uuid
        );
        if (profileIdx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.acmeAccount.splice(profileIdx, 1);
      })
    );
  }

  enableAcmeAccount(uuid: string | number): Observable<void> {
    return of(null).pipe(
      delay(randomDelay()),
      map(function (): void {
        const profileIdx = dbData.acmeAccount.findIndex(
          (p) => p.uuid.toString() === uuid
        );
        if (profileIdx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.acmeAccount[profileIdx].enabled = true;
      })
    );
  }

  disableAcmeAccount(uuid: string | number): Observable<void> {
    return of(null).pipe(
      delay(randomDelay()),
      map(function (): void {
        const profileIdx = dbData.acmeAccount.findIndex(
          (p) => p.uuid.toString() === uuid
        );
        if (profileIdx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.acmeAccount[profileIdx].enabled = false;
      })
    );
  }

  bulkDeleteAcmeAccount(uuid: (string | number)[]): Observable<void> {
    return of(null).pipe(
      delay(randomDelay()),
      map(function (): void {
        const profileIdx = dbData.acmeAccount.findIndex(
          (p) => p.uuid.toString() === uuid[0]
        );
        if (profileIdx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.acmeAccount.splice(profileIdx, 1);
      })
    );
  }

  bulkEnableAcmeAccount(uuid: (string | number)[]): Observable<void> {
    return of(null).pipe(
      delay(randomDelay()),
      map(function (): void {
        const profileIdx = dbData.acmeAccount.findIndex(
          (p) => p.uuid.toString() === uuid[0]
        );
        if (profileIdx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.acmeAccount[profileIdx].enabled = true;
      })
    );
  }

  bulkDisableAcmeAccount(uuid: (string | number)[]): Observable<void> {
    return of(null).pipe(
      delay(randomDelay()),
      map(function (): void {
        const profileIdx = dbData.acmeAccount.findIndex(
          (p) => p.uuid.toString() === uuid[0]
        );
        if (profileIdx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.acmeAccount[profileIdx].enabled = false;
      })
    );
  }
}
