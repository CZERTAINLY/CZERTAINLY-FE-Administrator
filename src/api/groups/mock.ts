import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";

import { dbData } from "mocks/db";
import { randomDelay } from "utils/mock";
import * as model from "./model";
import { HttpErrorResponse } from "ts-rest-client";

export class GroupManagementMock implements model.GroupManagementApi {
  createNewGroup(name: string, description: string): Observable<string> {
    return of(null).pipe(
      delay(randomDelay()),
         map(
            () => {
              const uuid = crypto.randomUUID();
              dbData.groups.push({
                uuid,
                name,
                description
              });
              return uuid;
          }
        )
      );
  }


  getGroupsList(): Observable<model.GroupDTO[]> {
    return of(dbData.groups).pipe(
      delay(randomDelay()),
      map((groups) =>
        groups.map(({ name, description, uuid }) => ({
          name,
          description,
          uuid,
        }))
      )
    );
  }

  getGroupDetail(uuid: string): Observable<model.GroupDTO> {
    return of(
      dbData.groups.find((c) => c.uuid.toString() === uuid.toString())
    ).pipe(
      delay(randomDelay()),
      map((detail) => {
        if (detail) {
          return {
            description: detail.description,
            name: detail.name,
            uuid: detail.uuid,
          };
        }

        throw new HttpErrorResponse({
          status: 404,
        });
      })
    );
  }

  deleteGroup(uuid: string): Observable<void> {
    return of(null).pipe(
      delay(randomDelay()),
      map(function (): void {
        const groupUuidx = dbData.groups.findIndex(
          (c) => c.uuid.toString() === uuid.toString()
        );
        if (groupUuidx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.groups.splice(groupUuidx, 1);
      })
    );
  }

  bulkDeleteGroup(uuid: string[]): Observable<void> {
    return of(null).pipe(
      delay(randomDelay()),
      map(function (): void {
        const groupUuidx = dbData.groups.findIndex(
          (c) => c.uuid.toString() === uuid.toString()
        );
        if (groupUuidx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.groups.splice(groupUuidx, 1);
      })
    );
  }

  updateGroup(
    uuid: string,
    name: string,
    description: string
  ): Observable<model.GroupDTO> {
    return of(
      dbData.groups.findIndex((c) => c.uuid.toString() === uuid.toString())
    ).pipe(
      delay(randomDelay()),
      map((idx) => {
        if (idx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }
        let detail = dbData.groups[idx];
        detail.name = name;
        detail.description = description;
        return detail;
      })
    );
  }
}
