import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";
import { HttpErrorResponse } from "ts-rest-client";

import { dbData, createAcmeProfile } from "mocks/db";
import { randomDelay } from "utils/mock";
import * as model from "./model";
import { AttributeResponse } from "models/attributes";
import { ErrorDeleteObject } from "models";

export class AcmeProfilesManagementMock
  implements model.AcmeProfilesManagementApi
{
  bulkForceDeleteAcmeProfile(uuid: (string | number)[]): Observable<void> {
    return of();
  }
  createAcmeProfile(name: string, description: string): Observable<string> {
    return of(null).pipe(
      delay(randomDelay()),
      map(() => createAcmeProfile(name, description))
    );
  }

  deleteAcmeProfile(uuid: string | number): Observable<ErrorDeleteObject[]> {
    return of([]);
  }

  enableAcmeProfile(uuid: string | number): Observable<void> {
    return of(null).pipe(
      delay(randomDelay()),
      map(function (): void {
        const profileIdx = dbData.raProfiles.findIndex(
          (p) => p.uuid.toString() === uuid
        );
        if (profileIdx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.raProfiles[profileIdx].enabled = true;
      })
    );
  }

  disableAcmeProfile(uuid: string | number): Observable<void> {
    return of(null).pipe(
      delay(randomDelay()),
      map(function (): void {
        const profileIdx = dbData.raProfiles.findIndex(
          (p) => p.uuid.toString() === uuid
        );
        if (profileIdx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.raProfiles[profileIdx].enabled = false;
      })
    );
  }

  bulkDeleteAcmeProfile(
    uuid: (string | number)[]
  ): Observable<ErrorDeleteObject[]> {
    return of([]);
  }

  bulkEnableAcmeProfile(uuid: (string | number)[]): Observable<void> {
    return of(null).pipe(
      delay(randomDelay()),
      map(function (): void {
        const profileIdx = dbData.raProfiles.findIndex(
          (p) => p.uuid.toString() === uuid[0]
        );
        if (profileIdx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.raProfiles[profileIdx].enabled = true;
      })
    );
  }

  bulkDisableAcmeProfile(uuid: (string | number)[]): Observable<void> {
    return of(null).pipe(
      delay(randomDelay()),
      map(function (): void {
        const profileIdx = dbData.raProfiles.findIndex(
          (p) => p.uuid.toString() === uuid[0]
        );
        if (profileIdx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.raProfiles[profileIdx].enabled = false;
      })
    );
  }

  getAcmeProfilesList(): Observable<model.AcmeProfileResponse[]> {
    return of(dbData.raProfiles).pipe(
      delay(randomDelay()),
      map((profiles) =>
        profiles.map(
          ({
            uuid,
            name,
            description,
            enabled,
            authorityInstanceUuid,
            authorityInstanceName,
          }) => ({
            uuid,
            name,
            description,
            enabled,
            authorityInstanceUuid,
            authorityInstanceName,
          })
        )
      )
    );
  }

  getAttributes(authorityUuid: string): Observable<AttributeResponse[]> {
    return of(dbData.raProfileAttribute).pipe(
      delay(randomDelay()),
      map((authorityProviderAttributes) =>
        authorityProviderAttributes.map(
          ({
            uuid,
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
            attributeCallback,
          }) => ({
            uuid,
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
            attributeCallback,
          })
        )
      )
    );
  }

  getAcmeProfileDetail(
    uuid: string
  ): Observable<model.AcmeProfileDetailResponse> {
    return of(dbData.acmeProfileDetail);
  }

  updateAcmeProfile(uuid: string): Observable<model.AcmeProfileDetailResponse> {
    return of(dbData.acmeProfileDetail);
  }
}
