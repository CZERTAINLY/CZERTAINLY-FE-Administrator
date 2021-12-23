import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";

import { dbData, createAuthority } from "mocks/db";
import { randomDelay } from "utils/mock";
import * as model from "./model";
import { HttpErrorResponse } from "ts-rest-client";
import { ErrorDeleteObject } from "models";

export class AuthorityManagementMock implements model.AuthorityManagementApi {
  createNewAuthority(
    name: string,
    connectorUuid: string,
    credential: any,
    status: string,
    attributes: any,
    kind: string
  ): Observable<string> {
    return of(null).pipe(
      delay(randomDelay()),
      map(() =>
        createAuthority(
          name,
          attributes,
          credential,
          status,
          connectorUuid,
          kind
        )
      )
    );
  }

  getAuthoritiesList(): Observable<model.AuthorityInfoResponse[]> {
    return of(dbData.authorities).pipe(
      delay(randomDelay()),
      map((authorities) =>
        authorities.map(
          ({ uuid, name, connectorUuid, kind, connectorName }) => ({
            uuid,
            name,
            connectorUuid,
            kind,
            connectorName,
          })
        )
      )
    );
  }

  getAuthorityProviderList(): Observable<model.AuthorityProviderResponse[]> {
    return of(dbData.connectors).pipe(
      delay(randomDelay()),
      map((authorityProviders) =>
        authorityProviders.map(
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

  getAuthorityProviderAttributes(
    uuid: string,
    code: string
  ): Observable<model.AuthorityProviderAttributes[]> {
    return of(dbData.credentialProviderAttributes).pipe(
      delay(randomDelay()),
      map((authorityProviderAttributes) =>
        authorityProviderAttributes.map(
          ({
            id,
            name,
            label,
            type,
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
            label,
            type,
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

  getAuthorityDetail(uuid: string): Observable<model.AuthorityDetailResponse> {
    return of(
      dbData.authorities.find((c) => c.uuid.toString() === uuid.toString())
    ).pipe(
      delay(randomDelay()),
      map((detail) => {
        if (detail) {
          return {
            uuid: detail.uuid,
            name: detail.name,
            connectorUuid: detail.connectorUuid,
            attributes: detail.attributes,
            credential: detail.credential,
            kind: detail.kind,
            connectorName: detail.connectorName,
          };
        }

        throw new HttpErrorResponse({
          status: 404,
        });
      })
    );
  }

  deleteAuthority(uuid: number | string): Observable<ErrorDeleteObject[]> {
    return of([]).pipe(
      delay(randomDelay()),
      map(function (): any {
        const authorityIdx = dbData.authorities.findIndex(
          (c) => c.uuid.toString() === uuid.toString()
        );
        if (authorityIdx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.authorities.splice(authorityIdx, 1);
      })
    );
  }

  deleteBulkAuthority(
    uuid: (number | string)[]
  ): Observable<ErrorDeleteObject[]> {
    return of([]).pipe(
      delay(randomDelay()),
      map(function (): any {
        const authorityIdx = dbData.authorities.findIndex(
          (c) => c.uuid.toString() === uuid.toString()
        );
        if (authorityIdx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.authorities.splice(authorityIdx, 1);
      })
    );
  }

  forceDeleteAuthority(uuid: number | string): Observable<void> {
    return of(null).pipe(
      delay(randomDelay()),
      map(function (): void {
        const authorityIdx = dbData.authorities.findIndex(
          (c) => c.uuid.toString() === uuid.toString()
        );
        if (authorityIdx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.authorities.splice(authorityIdx, 1);
      })
    );
  }

  bulkForceDeleteAuthority(uuid: (number | string)[]): Observable<void> {
    return of(null).pipe(
      delay(randomDelay()),
      map(function (): void {
        const authorityIdx = dbData.authorities.findIndex(
          (c) => c.uuid.toString() === uuid.toString()
        );
        if (authorityIdx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.authorities.splice(authorityIdx, 1);
      })
    );
  }

  updateAuthority(
    uuid: string,
    connectorUuid: string,
    attributes: any,
    kind: string
  ): Observable<model.AuthorityDetailResponse> {
    return of(
      dbData.authorities.findIndex((c) => c.uuid.toString() === uuid.toString())
    ).pipe(
      delay(randomDelay()),
      map((idx) => {
        if (idx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }
        console.log(attributes);
        console.log("Updated authorities");
        let detail = dbData.authorities[idx];
        return detail;
      })
    );
  }
}
