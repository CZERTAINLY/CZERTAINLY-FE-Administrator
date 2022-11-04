import { Observable, of, throwError } from "rxjs";
import { delay, map } from "rxjs/operators";
import { HttpErrorResponse } from "utils/FetchHttpService";

import { dbData } from "api/_mocks/db";
import { randomDelay } from "utils/mock";
import * as model from "./model";


export class AuditLogsMock implements model.AuditLogsApi {


   getObjects(): Observable<string[]> {

      return of(
         dbData.auditLogsOrigins
      ).pipe(
         delay(randomDelay())
      );

   }


   getOperations(): Observable<string[]> {

      return of(
         dbData.auditLogsOperations
      ).pipe(
         delay(randomDelay())
      );

   }


   getStatuses(): Observable<string[]> {

      return of(
         dbData.auditLogsStatuses
      ).pipe(
         delay(randomDelay())
      );

   }


   getLogs(page: number, size: number): Observable<model.PagedAuditLog> {

      if (
         !Number.isInteger(page) ||
         !Number.isInteger(size) ||
         page < 0 ||
         size < 1
      ) {
         return throwError(new HttpErrorResponse({ status: 400 }));
      }

      const startIdx = page * size;
      const endIdx = startIdx + size;
      const totalPages = Math.ceil(dbData.auditLogs.length / size);

      return of(
         dbData.auditLogs
      ).pipe(
         delay(randomDelay()),
         map(
            logs => logs.slice(startIdx, endIdx)
         ),
         map(
            items => ({
               page,
               size,
               totalPages,
               items,
            })
         )
      );

   }

   purgeLogs(queryString: string): Observable<void> {

      return of();

   }
}
