import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";
import { HttpErrorResponse } from "ts-rest-client";

import { createAdministrator, dbData } from "mocks/db";
import { randomDelay } from "utils/mock";
import * as model from "./model";

export class AdministatorManagementMock
  implements model.AdministratorManagementApi
{
  createAdmin(
    name: string,
    surname: string,
    username: string,
    email: string,
    certificate: string,
    description: string,
    role: string,
    enabled: boolean
  ): Observable<string> {
    return of(null).pipe(
      delay(randomDelay()),
      map(() =>
        createAdministrator(
          name,
          surname,
          username,
          email,
          certificate,
          description,
          role,
          enabled
        ).toString()
      )
    );
  }

  deleteAdmin(uuid: string): Observable<void> {
    return of(null).pipe(
      delay(randomDelay()),
      map(function (): void {
        const idx = dbData.administrators.findIndex((a) => a.uuid === uuid[0]);
        if (idx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.administrators.splice(idx, 1);
      })
    );
  }

  disableAdmin(uuid: string): Observable<void> {
    return of(null).pipe(
      delay(randomDelay()),
      map(function (): void {
        const idx = dbData.administrators.findIndex((a) => a.uuid === uuid[0]);
        if (idx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }
        dbData.administrators[idx].enabled = false;
      })
    );
  }

  enableAdmin(uuid: string): Observable<void> {
    return of(null).pipe(
      delay(randomDelay()),
      map(function (): void {
        const idx = dbData.administrators.findIndex((a) => a.uuid === uuid[0]);
        if (idx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.administrators[idx].enabled = true;
      })
    );
  }

  bulkDeleteAdmin(uuid: string[]): Observable<void> {
    return of(null).pipe(
      delay(randomDelay()),
      map(function (): void {
        const idx = dbData.administrators.findIndex((a) => a.uuid === uuid[0]);
        if (idx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.administrators.splice(idx, 1);
      })
    );
  }

  bulkDisableAdmin(uuid: string[]): Observable<void> {
    return of(null).pipe(
      delay(randomDelay()),
      map(function (): void {
        const idx = dbData.administrators.findIndex((a) => a.uuid === uuid[0]);
        if (idx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }
        dbData.administrators[idx].enabled = false;
      })
    );
  }

  bulkEnableAdmin(uuid: string[]): Observable<void> {
    return of(null).pipe(
      delay(randomDelay()),
      map(function (): void {
        const idx = dbData.administrators.findIndex((a) => a.uuid === uuid[0]);
        if (idx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.administrators[idx].enabled = true;
      })
    );
  }

  getAdminDetail(uuid: string): Observable<model.AdminDetailResponse> {
    return of(dbData.administrators.find((a) => a.uuid === uuid)).pipe(
      delay(randomDelay()),
      map((detail) => {
        if (detail) {
          return {
            certificate: detail.certificate,
            name: detail.name,
            surname: detail.surname,
            username: detail.username,
            email: detail.email,
            description: detail.description,
            role: detail.role,
            enabled: detail.enabled,
            serialNumber: detail.serialNumber,
          };
        }

        throw new HttpErrorResponse({
          status: 404,
        });
      })
    );
  }

  getAdminsList(): Observable<model.AdminInfoResponse[]> {
    return of(dbData.administrators).pipe(
      delay(randomDelay()),
      map((administrators) =>
        administrators.map(
          ({ uuid, name, surname, username, certificate, role, enabled }) => ({
            uuid: uuid as any,
            name,
            surname,
            username,
            certificate,
            role,
            enabled,
          })
        )
      )
    );
  }

  updateAdmin(
    uuid: string,
    name: string,
    surname: string,
    username: string,
    email: string,
    certificate: string | undefined,
    description: string,
    role: string
  ): Observable<model.AdminDetailResponse> {
    return of(dbData.administrators.findIndex((a) => a.uuid === uuid)).pipe(
      delay(randomDelay()),
      map((idx) => {
        if (idx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        let detail = dbData.administrators[idx];
        dbData.administrators[idx] = detail;

        return {
          certificate: detail.certificate,
          adminDn: "",
          name: detail.name,
          surname: detail.surname,
          username: detail.username,
          email: detail.email,
          description: detail.description,
          role: detail.role,
          enabled: detail.enabled,
          serialNumber: detail.serialNumber,
        };
      })
    );
  }
}
