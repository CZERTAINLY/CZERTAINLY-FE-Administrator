import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";
import { HttpErrorResponse } from "ts-rest-client";

import { randomDelay } from "utils/mock";

import { AllAttributeDTO, AttributeDescriptorDTO } from "api/.common/AttributeDTO";
import { DeleteObjectErrorDTO } from "api/.common/DeleteObjectErrorDTO";
import { dbData, createConnector, connectConnector } from "mocks/db";
import * as model from "./model";


export class ConnectorManagementMock implements model.ConnectorManagementApi {

   createNewConnector(
      name: string,
      url: string,
      status: string,
      functionGroups: any
   ): Observable<string> {

      return of(null).pipe(
         delay(randomDelay()),
         map(() => createConnector(name, url, status, functionGroups))
      );

   }


   connectNewConnector(
      name: string,
      url: string
   ): Observable<model.ConnectorConnectionDTO[]> {

      return of(null).pipe(
         delay(randomDelay()),
         map(() => connectConnector(name, url))
      );

   }


   getConnectorsList(): Observable<model.ConnectorInfoDTO[]> {

      return of(dbData.connectors).pipe(
         delay(randomDelay()),
         map((connectors) =>
            connectors.map(({ uuid, name, functionGroups, url, status }) => ({
               uuid,
               name,
               functionGroups,
               url,
               status,
            }))
         )
      );

   }


   getConnectorAttributes(): Observable<AttributeDescriptorDTO[]> {

      return of(dbData.connectorAttributes).pipe(
         delay(randomDelay()),
         map((attributes) => attributes)
      );

   }


   getConnectorAllAttributes(): Observable<AllAttributeDTO> {

      return of(dbData.allAttributeResponse).pipe(
         delay(randomDelay()),
         map((attributes) => attributes)
      );

   }


   getConnectorHealth(uuid: string): Observable<model.ConnectorHealthDTO> {

      return of({ status: "UP" });

   }


   getConnectorDetail(uuid: string): Observable<model.ConnectorDetailDTO> {

      return of(
         dbData.connectors.find((c) => c.uuid.toString() === uuid.toString())
      ).pipe(
         delay(randomDelay()),
         map((detail) => {
            if (detail) {
               return {
                  uuid: detail.uuid,
                  functionGroups: detail.functionGroups,
                  name: detail.name,
                  url: detail.url,
                  status: detail.status,
                  authType: detail.authType,
                  authAttributes: detail.authAttributes,
               };
            }

            throw new HttpErrorResponse({
               status: 404,
            });
         })
      );

   }


   deleteConnector(uuid: string | number): Observable<DeleteObjectErrorDTO[]> {

      return of([]).pipe(
         delay(randomDelay()),
         map(function (): any {
            const connectorUuidx = dbData.connectors.findIndex(
               (c) => c.uuid.toString() === uuid.toString()
            );
            if (connectorUuidx < 0) {
               throw new HttpErrorResponse({ status: 404 });
            }

            dbData.connectors.splice(connectorUuidx, 1);
         })
      );

   }


   forceDeleteConnector(uuid: string | number): Observable<void> {

      return of(null).pipe(
         delay(randomDelay()),
         map(function (): any {
            const connectorUuidx = dbData.connectors.findIndex(
               (c) => c.uuid.toString() === uuid.toString()
            );
            if (connectorUuidx < 0) {
               throw new HttpErrorResponse({ status: 404 });
            }

            dbData.connectors.splice(connectorUuidx, 1);
         })
      );

   }


   authorizeConnector(uuid: string): Observable<void> {

      return of(null).pipe(
         delay(randomDelay()),
         map(function (): void {
            const connectorUuidx = dbData.connectors.findIndex(
               (c) => c.uuid.toString() === uuid.toString()
            );
            if (connectorUuidx < 0) {
               throw new HttpErrorResponse({ status: 404 });
            }

            dbData.connectors[connectorUuidx].status = "In Progress";
         })
      );

   }


   reconnectConnector(uuid: string): Observable<void> {

      return of(null).pipe(
         delay(randomDelay()),
         map(function (): void {
            const connectorUuidx = dbData.connectors.findIndex(
               (c) => c.uuid.toString() === uuid.toString()
            );
            if (connectorUuidx < 0) {
               throw new HttpErrorResponse({ status: 404 });
            }

            dbData.connectors[connectorUuidx].status = "In Progress";
         })
      );

   }


   bulkDeleteConnector(
      uuid: (string | number)[]
   ): Observable<DeleteObjectErrorDTO[]> {

      return of([]).pipe(
         delay(randomDelay()),
         map(function (): any {
            const connectorUuidx = dbData.connectors.findIndex(
               (c) => c.uuid.toString() === uuid.toString()
            );
            if (connectorUuidx < 0) {
               throw new HttpErrorResponse({ status: 404 });
            }

            dbData.connectors.splice(connectorUuidx, 1);
         })
      );

   }


   bulkForceDeleteConnector(uuid: (string | number)[]): Observable<void> {

      return of(null).pipe(
         delay(randomDelay()),
         map(function (): any {
            const connectorUuidx = dbData.connectors.findIndex(
               (c) => c.uuid.toString() === uuid.toString()
            );
            if (connectorUuidx < 0) {
               throw new HttpErrorResponse({ status: 404 });
            }

            dbData.connectors.splice(connectorUuidx, 1);
         })
      );

   }


   bulkAuthorizeConnector(uuid: string[]): Observable<void> {

      return of(null).pipe(
         delay(randomDelay()),
         map(function (): void {
            const connectorUuidx = dbData.connectors.findIndex(
               (c) => c.uuid.toString() === uuid.toString()
            );
            if (connectorUuidx < 0) {
               throw new HttpErrorResponse({ status: 404 });
            }

            dbData.connectors[connectorUuidx].status = "In Progress";
         })
      );

   }


   bulkReconnectConnector(uuid: string[]): Observable<void> {

      return of(null).pipe(
         delay(randomDelay()),
         map(function (): void {
            const connectorUuidx = dbData.connectors.findIndex(
               (c) => c.uuid.toString() === uuid.toString()
            );
            if (connectorUuidx < 0) {
               throw new HttpErrorResponse({ status: 404 });
            }

            dbData.connectors[connectorUuidx].status = "In Progress";
         })
      );

   }


   updateConnector(
      uuid: string,
      name: string,
      url: string,
      status: string,
      functionGroups: model.ConnectorFunctionGroupDTO[]
   ): Observable<string> {

      return of(
         dbData.connectors.findIndex((c) => c.uuid.toString() === uuid.toString())
      ).pipe(
         delay(randomDelay()),
         map((idx) => {
            if (idx < 0) {
               throw new HttpErrorResponse({ status: 404 });
            }
            console.log([uuid, url, name, "Updated Mock"]);
            return uuid.toString();
         })
      );

   }


   getCallback(connectorUuid: string, request: any): Observable<any> {

      return of([
         {
            id: 1532628438,
            name: "DemoTLSServerEECertificateProfile",
         },
         {
            id: 1131465145,
            name: "DemoTLSServerEECertificateProfileWithApprovals",
         },
      ]);

   }


}
