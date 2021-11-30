import { Observable, of, throwError } from "rxjs";
import { delay, map } from "rxjs/operators";

import { dbData, createClient } from "mocks/db";
import { randomDelay } from "utils/mock";
import * as model from "./model";
import { HttpErrorResponse } from "ts-rest-client";

export class ClientManagementMock implements model.ClientManagementApi {
  authorizeProfile(clientId: string, profileId: string): Observable<void> {
    return of(null).pipe(
      delay(randomDelay()),
      map(function (): void {
        const client = dbData.clients.find((c) => c.uuid === clientId);
        const profile = dbData.raProfiles.find(
          (p) => p.uuid?.toString() === profileId
        );

        if (!client || !profile) {
          throw new HttpErrorResponse({
            status: 404,
          });
        }

        client.auth.push(profileId);
      })
    );
  }

  createNewClient(
    name: string,
    clientCertificate: string,
    description: string,
    enabled: boolean
  ): Observable<string> {
    return of(null).pipe(
      delay(randomDelay()),
      map(() => createClient(name, description, enabled))
    );
  }

  getClientsList(): Observable<model.ClientInfoResponse[]> {
    return of(dbData.clients).pipe(
      delay(randomDelay()),
      map((clients) =>
        clients.map(({ uuid, name, certificate, enabled }) => ({
          uuid,
          name,
          certificate,
          enabled,
        }))
      )
    );
  }

  getClientDetail(uuid: string): Observable<model.ClientDetailResponse> {
    return of(dbData.clients.find((c) => c.uuid === uuid)).pipe(
      delay(randomDelay()),
      map((detail) => {
        if (detail) {
          return {
            name: detail.name,
            certificate: detail.certificate,
            enabled: detail.enabled,
            serialNumber: detail.serialNumber,
            uuid: detail.uuid,
            description: detail.description,
          };
        }

        throw new HttpErrorResponse({
          status: 404,
        });
      })
    );
  }

  getClientAuth(uuid: string): Observable<model.ClientAuthorizationsReponse[]> {
    const client = dbData.clients.find((c) => c.uuid === uuid);
    if (!client) {
      return throwError(new HttpErrorResponse({ status: 404 }));
    }
    const profiles = dbData.raProfiles.filter((p) =>
      client.auth.includes(p.uuid.toString())
    );

    return of(profiles).pipe(
      delay(randomDelay()),
      map((auths) =>
        auths.map(({ uuid, name }) => ({
          uuid,
          name,
        }))
      )
    );
  }

  unauthorizeProfile(clientId: string, profileId: string): Observable<void> {
    return of(null).pipe(
      delay(randomDelay()),
      map(function (): void {
        const client = dbData.clients.find((c) => c.uuid === clientId);
        if (!client) {
          throw new HttpErrorResponse({
            status: 404,
          });
        }

        const profileIdx = client.auth.indexOf(profileId);
        if (profileIdx < 0) {
          throw new HttpErrorResponse({
            status: 404,
          });
        }

        client.auth.splice(profileIdx, 1);
      })
    );
  }

  deleteClient(uuid: string): Observable<void> {
    return of(null).pipe(
      delay(randomDelay()),
      map(function (): void {
        const clientIdx = dbData.clients.findIndex((c) => c.uuid === uuid[0]);
        if (clientIdx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.clients.splice(clientIdx, 1);
      })
    );
  }

  enableClient(uuid: string): Observable<void> {
    return of(null).pipe(
      delay(randomDelay()),
      map(function (): void {
        const clientIdx = dbData.clients.findIndex((c) => c.uuid === uuid[0]);
        if (clientIdx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.clients[clientIdx].enabled = true;
      })
    );
  }

  disableClient(uuid: string): Observable<void> {
    return of(null).pipe(
      delay(randomDelay()),
      map(function (): void {
        const clientIdx = dbData.clients.findIndex((c) => c.uuid === uuid[0]);
        if (clientIdx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.clients[clientIdx].enabled = false;
      })
    );
  }

  bulkDeleteClient(uuid: string[]): Observable<void> {
    return of(null).pipe(
      delay(randomDelay()),
      map(function (): void {
        const clientIdx = dbData.clients.findIndex((c) => c.uuid === uuid[0]);
        if (clientIdx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.clients.splice(clientIdx, 1);
      })
    );
  }

  bulkEnableClient(uuid: string[]): Observable<void> {
    return of(null).pipe(
      delay(randomDelay()),
      map(function (): void {
        const clientIdx = dbData.clients.findIndex((c) => c.uuid === uuid[0]);
        if (clientIdx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.clients[clientIdx].enabled = true;
      })
    );
  }

  bulkDisableClient(uuid: string[]): Observable<void> {
    return of(null).pipe(
      delay(randomDelay()),
      map(function (): void {
        const clientIdx = dbData.clients.findIndex((c) => c.uuid === uuid[0]);
        if (clientIdx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.clients[clientIdx].enabled = false;
      })
    );
  }

  updateClient(
    uuid: string,
    clientCertificate: string | undefined,
    description: string
  ): Observable<model.ClientDetailResponse> {
    return of(dbData.clients.findIndex((c) => c.uuid === uuid)).pipe(
      delay(randomDelay()),
      map((idx) => {
        if (idx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        let detail = dbData.clients[idx];

        detail = {
          ...detail,
          description,
        };
        dbData.clients[idx] = detail;

        return detail;
      })
    );
  }
}
