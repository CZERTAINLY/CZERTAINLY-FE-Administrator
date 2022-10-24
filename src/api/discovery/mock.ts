import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";

import { dbData } from "mocks/db";
import { randomDelay } from "utils/mock";
import * as model from "./model";
import { HttpErrorResponse } from "utils/FetchHttpService";
import { ConnectorDTO } from "api/connectors";
import { AttributeDTO } from "api/_common/attributeDTO";

export class DiscoveryManagementMock implements model.DiscoveryManagementApi {
  createNewDiscovery(
    name: string,
    kind: string,
    connectorUuid: number | string,
    attributes: any
  ): Observable<{ uuid: string}> {
    return of(null).pipe(
      delay(randomDelay()),
      map(() => {
      const uuid = crypto.randomUUID();
      dbData.discoveries.push({
        uuid: uuid,
        name: name,
        kind: kind,
        status: "completed",
        startTime: "2022-01-05T13:55:50.534+00:00",
        endTime: "2022-01-05T13:55:56.712+00:00",
        totalCertificatesDiscovered: 3,
        connectorUuid: "26c5b011-cd13-4f93-8e04-14020c192430",
        connectorName: "Network-Discovery-Provider",
        certificate: [],
        attributes: [
            {
                "uuid": "1b6c48ad-c1c7-4c82-91ef-3b61bc9f52ac",
                "name": "ip",
                "label": "IP/Hostname",
                "type": "STRING",
                "content": {
                    "value": "www.czertainly.com"
                }
            }
        ],
        meta: {
            "totalUrls": 1,
            "successUrls": 1,
            "failedUrls": 0
        }
      })
      return { uuid };
    }),
    );
  }

  getDiscoveryList(): Observable<model.DiscoveryDTO[]> {
    return of(
      dbData.discoveries
   ).pipe(
      delay(randomDelay())
   );
  }

  getDiscoveryProviderList(): Observable<ConnectorDTO[]> {
    return of(dbData.connectors).pipe(
      delay(randomDelay())
    );
  }

  getDiscoveryProviderAttributes(
    uuid: string
  ): Observable<AttributeDTO[]> {
    return of(
      dbData.discoveries.find(discovery => discovery.uuid === uuid)
   ).pipe(

      delay(randomDelay()),
      map(

         authority => {
            if (!authority) throw new HttpErrorResponse({ status: 404 });
            return authority.attributes || [];
         }

      )

   )
  }

  getDiscoveryDetail(uuid: string): Observable<model.DiscoveryDTO> {
    return of(
      dbData.discoveries.find((c) => c.uuid.toString() === uuid.toString())
    ).pipe(
      delay(randomDelay()),
      map(

        discovery => {
           if (!discovery) throw new HttpErrorResponse({ status: 404 });
           return discovery;
        }

     )
    );
  }

  deleteDiscovery(uuid: string): Observable<void> {
    return of(null).pipe(
      delay(randomDelay()),
      map(function (): void {
        const discoveryIdx = dbData.discoveries.findIndex(
          (c) => c.uuid.toString() === uuid.toString()
        );
        if (discoveryIdx < 0) {
          throw new HttpErrorResponse({ status: 404 });
        }

        dbData.discoveries.splice(discoveryIdx, 1);
      })
    );
  }

  bulkDeleteDiscovery(uuids: string[]): Observable<void> {
    return of(uuids
   ).pipe(

      delay(randomDelay()),
      map(

         uuids => {

            uuids.forEach(

               uuid => {

                  const discoveryIndex = dbData.discoveries.findIndex(discovery => discovery.uuid === uuid);

                  if (discoveryIndex < 0) {
                     return;
                  }

                  dbData.discoveries.splice(discoveryIndex, -1);

               }

            );
         }
      )
   )
}
}
