import { Observable, of, throwError } from "rxjs";
import { delay, map } from "rxjs/operators";
import { HttpErrorResponse } from "ts-rest-client";

import { dbData, createRaProfile } from "mocks/db";
import { randomDelay } from "utils/mock";
import * as model from "./model";
import { AttributeResponse } from "models/attributes";

export class ProfilesManagementMock implements model.ProfilesManagementApi {
  createRaProfile(
    caInstanceUuid: string,
    name: string,
    description: string,
    attributes: AttributeResponse[]
  ): Observable<string> {
    return of(null).pipe(
      delay(randomDelay()),
      map(() => createRaProfile(name, description))
    );
  }

  deleteRaProfile(uuid: string | number): Observable<void> {
    return of(null).pipe(
      delay(randomDelay()),
      map(function (): void {
        const profileIdx = dbData.raProfiles.findIndex(
          (p) => p.uuid.toString() === uuid
        );
        if (profileIdx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.raProfiles.splice(profileIdx, 1);
      })
    );
  }

  enableRaProfile(uuid: string | number): Observable<void> {
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

  disableRaProfile(uuid: string | number): Observable<void> {
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

  bulkDeleteRaProfile(uuid: (string | number)[]): Observable<void> {
    return of(null).pipe(
      delay(randomDelay()),
      map(function (): void {
        const profileIdx = dbData.raProfiles.findIndex(
          (p) => p.uuid.toString() === uuid[0]
        );
        if (profileIdx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.raProfiles.splice(profileIdx, 1);
      })
    );
  }

  bulkEnableRaProfile(uuid: (string | number)[]): Observable<void> {
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

  bulkDisableRaProfile(uuid: (string | number)[]): Observable<void> {
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

  getRaProfilesList(): Observable<model.RaProfileResponse[]> {
    return of(dbData.raProfiles).pipe(
      delay(randomDelay()),
      map((profiles) =>
        profiles.map(
          ({
            uuid,
            name,
            description,
            enabled,
            caInstanceUuid,
            caInstanceName,
          }) => ({
            uuid,
            name,
            description,
            enabled,
            caInstanceUuid,
            caInstanceName,
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
            attributeCallback,
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
            attributeCallback,
          })
        )
      )
    );
  }

  getRaProfileDetail(uuid: string): Observable<model.RaProfileDetailResponse> {
    return of(
      dbData.raProfiles.find((p) => p.uuid.toString() === uuid.toString())
    ).pipe(
      delay(randomDelay()),
      map((detail) => {
        if (detail) {
          return {
            ...detail,
          };
        }

        throw new HttpErrorResponse({
          status: 404,
        });
      })
    );
  }

  getAuthorizedClients(
    uuid: string
  ): Observable<model.RaProfileAuthorizationsReponse[]> {
    const profile = dbData.raProfiles.find(
      (p) => p.uuid.toString() === uuid.toString()
    );
    if (!profile) {
      return throwError(new HttpErrorResponse({ status: 404 }));
    }
    const clients = dbData.clients.filter((c) => c.auth.includes(uuid));

    return of(clients).pipe(delay(randomDelay()));
  }

  getEndEntityProfiles(): Observable<model.EntityProfileResponse[]> {
    return of(dbData.endEntityProfiles).pipe(delay(randomDelay()));
  }

  getCertificateProfiles(
    endEntityProfileId: number
  ): Observable<model.EntityProfileResponse[]> {
    return of(dbData.certificateProfiles).pipe(
      delay(randomDelay()),
      map((profiles) =>
        profiles.filter((p) => p.endEntityProfileId === endEntityProfileId)
      )
    );
  }

  getCertificationAuthorities(
    endEntityProfileId: number
  ): Observable<model.EntityProfileResponse[]> {
    return of(dbData.certificationAuthorities).pipe(
      delay(randomDelay()),
      map((cas) =>
        cas.filter((ca) => ca.endEntityProfileId === endEntityProfileId)
      )
    );
  }

  updateRaProfile(
    caInstanceUuid: string,
    uuid: string,
    name: string,
    description: string,
    attributes: AttributeResponse[]
  ): Observable<model.RaProfileDetailResponse> {
    return of(
      dbData.raProfiles.findIndex((p) => p.uuid.toString() === uuid.toString())
    ).pipe(
      delay(randomDelay()),
      map((profileIdx) => {
        if (profileIdx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        const detail = dbData.raProfiles[profileIdx];
        return {
          ...detail,
        };
      })
    );
  }
}
