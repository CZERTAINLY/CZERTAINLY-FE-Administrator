import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";

import { dbData, createCredential } from "mocks/db";
import { randomDelay } from "utils/mock";
import * as model from "./model";
import { HttpErrorResponse } from "ts-rest-client";
import { ErrorDeleteObject } from "models";

export class CredentialManagementMock implements model.CredentialManagementApi {
  createNewCredential(
    name: string,
    kind: string,
    connectorUuid: string,
    attributes: any
  ): Observable<string> {
    return of(null).pipe(
      delay(randomDelay()),
      map(() => createCredential(name, kind, connectorUuid, attributes))
    );
  }

  getCredentialsList(): Observable<model.CredentialInfoResponse[]> {
    return of(dbData.credentials).pipe(
      delay(randomDelay()),
      map((credentials) =>
        credentials.map(
          ({ uuid, name, kind, connectorUuid, connectorName }) => ({
            uuid,
            name,
            kind,
            connectorUuid,
            connectorName,
          })
        )
      )
    );
  }

  getCredentialProviderList(): Observable<model.CredentialProviderResponse[]> {
    return of(dbData.credentialProviders).pipe(
      delay(randomDelay()),
      map((credentialProviders) =>
        credentialProviders.map(
          ({ uuid, name, status, url, functionGroups }) => ({
            uuid,
            name,
            status,
            url,
            functionGroups,
          })
        )
      )
    );
  }

  getCredentialProviderAttributes(
    uuid: string
  ): Observable<model.CredentialProviderAttributes[]> {
    return of(dbData.credentialProviderAttributes).pipe(
      delay(randomDelay()),
      map((credentialProviderAttributes) =>
        credentialProviderAttributes.map(
          ({
            id,
            name,
            type,
            label,
            required,
            readOnly,
            editable,
            visible,
            multiValue,
            description,
            validationRegex,
            dependsOn,
            value,
          }) => ({
            id,
            name,
            type,
            label,
            required,
            readOnly,
            editable,
            visible,
            multiValue,
            description,
            validationRegex,
            dependsOn,
            value,
          })
        )
      )
    );
  }

  getCredentialDetail(
    uuid: string
  ): Observable<model.CredentialDetailResponse> {
    return of(
      dbData.credentials.find((c) => c.uuid.toString() === uuid.toString())
    ).pipe(
      delay(randomDelay()),
      map((detail) => {
        if (detail) {
          return {
            uuid: detail.uuid,
            kind: detail.kind,
            name: detail.name,
            attributes: detail.attributes,
            connectorUuid: detail.connectorUuid,
            connectorName: detail.connectorName,
          };
        }

        throw new HttpErrorResponse({
          status: 404,
        });
      })
    );
  }

  deleteCredential(uuid: number | string): Observable<ErrorDeleteObject[]> {
    return of([]).pipe(
      delay(randomDelay()),
      map(function (): any {
        const credentialIdx = dbData.credentials.findIndex(
          (c) => c.uuid.toString() === uuid.toString()
        );
        if (credentialIdx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.credentials.splice(credentialIdx, 1);
      })
    );
  }

  forceDeleteCredential(uuid: number | string): Observable<void> {
    return of([]).pipe(
      delay(randomDelay()),
      map(function (): void {
        const credentialIdx = dbData.credentials.findIndex(
          (c) => c.uuid.toString() === uuid.toString()
        );
        if (credentialIdx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.credentials.splice(credentialIdx, 1);
      })
    );
  }

  bulkDeleteCredential(
    uuid: (number | string)[]
  ): Observable<ErrorDeleteObject[]> {
    return of([]).pipe(
      delay(randomDelay()),
      map(function (): any {
        const credentialIdx = dbData.credentials.findIndex(
          (c) => c.uuid.toString() === uuid.toString()
        );
        if (credentialIdx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.credentials.splice(credentialIdx, 1);
      })
    );
  }

  bulkForceDeleteCredential(uuid: (number | string)[]): Observable<void> {
    return of([]).pipe(
      delay(randomDelay()),
      map(function (): void {
        const credentialIdx = dbData.credentials.findIndex(
          (c) => c.uuid.toString() === uuid.toString()
        );
        if (credentialIdx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.credentials.splice(credentialIdx, 1);
      })
    );
  }

  updateCredential(
    uuid: string,
    name: string,
    kind: string,
    connectorUuid: string,
    attributes: any
  ): Observable<model.CredentialDetailResponse> {
    return of(
      dbData.credentials.findIndex((c) => c.uuid.toString() === uuid.toString())
    ).pipe(
      delay(randomDelay()),
      map((idx) => {
        if (idx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }
        console.log(attributes);
        console.log("Updated credentials");
        let detail = dbData.credentials[idx];
        return detail;
      })
    );
  }
}
