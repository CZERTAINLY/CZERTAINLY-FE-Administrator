import { Observable, of, throwError } from "rxjs";
import { delay, map } from "rxjs/operators";
import { HttpErrorResponse } from "ts-rest-client";

import { dbData } from "mocks/db";
import { randomDelay } from "utils/mock";
import * as model from "./model";

const operationValues = [
  "AUTH",
  "CHANGE",
  "CREATE",
  "DELETE",
  "DISABLE",
  "ENABLE",
  "ISSUE",
  "REQUEST",
  "RESET",
  "REVOKE",
  "START",
  "STOP",
];
const operationStatusValues = ["FAILURE", "SUCCESS"];
const originationValues = [
  "ACCESS",
  "ADMINISTRATOR",
  "AUDIT_LOG",
  "BE",
  "CA",
  "CLIENT",
  "END_ENTITY",
  "END_ENTITY_CERTIFICATE",
  "END_ENTITY_PROFILE",
  "FE",
  "RA_PROFILE",
];

export class AuditLogsMock implements model.AuditLogsApi {
  getObjects(): Observable<string[]> {
    return of(originationValues).pipe(delay(randomDelay()));
  }
  getOperations(): Observable<string[]> {
    return of(operationValues).pipe(delay(randomDelay()));
  }
  getStatuses(): Observable<string[]> {
    return of(operationStatusValues).pipe(delay(randomDelay()));
  }
  getLogs(page: number, size: number): Observable<model.AuditLogResponse> {
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

    return of(dbData.auditLogs).pipe(
      delay(randomDelay()),
      map((logs) => logs.slice(startIdx, endIdx)),
      map((items) => ({
        page,
        size,
        totalPages,
        items,
      }))
    );
  }
}
