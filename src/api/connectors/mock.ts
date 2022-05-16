import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";
import { HttpErrorResponse } from "ts-rest-client";

import { randomDelay } from "utils/mock";

import { AttributeDescriptorCollectionDTO, AttributeDescriptorDTO, AttributeDTO } from "api/.common/AttributeDTO";
import { DeleteObjectErrorDTO } from "api/.common/DeleteObjectErrorDTO";
import { dbData } from "mocks/db";

import * as model from "./model";


export class ConnectorManagementMock implements model.ConnectorManagementApi {

   createNewConnector(name: string, url: string, authType: model.AuthType, authAttributes: AttributeDTO[]): Observable<string> {

      return of(
         dbData.connectorsRemote.find(connector => connector.url === url)
      ).pipe(

         delay(randomDelay()),
         map(

            connectorRemote => {

               if (!connectorRemote) throw new HttpErrorResponse({ status: 404, statusText: "Failed to connect to the connector" });

               const uuid = crypto.randomUUID();

               dbData.connectors.push({
                  uuid,
                  name,
                  authType,
                  authAttributes,
                  url: connectorRemote.url,
                  functionGroups: connectorRemote.functionGroups,
                  status: "registered"
               });

               return uuid;

            }

         )

      )

   }


   connectToConnector(url: string, authType: model.AuthType, authAttributes?: AttributeDTO[], uuid?: string): Observable<model.FunctionGroupDTO[]> {

      return of(
         dbData.connectorsRemote.find(connector => connector.url === url)
      ).pipe(

         delay(randomDelay()),
         map(

            connectorRemote => {
               if (!connectorRemote) throw new HttpErrorResponse({ status: 404, statusText: "Failed to connect to the connector" });
               return connectorRemote.functionGroups;
            }

         )

      );

   }


   getConnectorsList(functionGroupFilter?: model.FunctionGroupFilter, kind?: string): Observable<model.ConnectorDTO[]> {

      return of(

         dbData.connectors.filter(

            connector => {

               if (!functionGroupFilter) return true;

               const fgc = model.FunctionGroupFilterToGroupCode[functionGroupFilter];

               for (const functionGroup of connector.functionGroups) {
                  if (functionGroup.functionGroupCode !== fgc) return;
                  if (!kind) return true;
                  if (functionGroup.kinds.indexOf(kind) >= 0) return true;
               }

            }

         )

      )

   }


   getConnectorAttributes(uuid: string, functionGroup: model.FunctionGroupFilter, kind: string): Observable<AttributeDescriptorDTO[]> {

      return of(
         dbData.connectors.find(connector => connector.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            connector => {

               if (!connector) throw new HttpErrorResponse({ status: 404, statusText: "Connector not found." });

               const connectorRemote = dbData.connectorsRemote.find(connectorRemote => connectorRemote.url === connector.url);
               if (!connectorRemote) throw new HttpErrorResponse({ status: 404, statusText: "Failed to connect to remote connector" });

               if (!connectorRemote.attributes.hasOwnProperty(functionGroup)) throw new HttpErrorResponse({ status: 404, statusText: "Invalid function group" });

               const fg = model.FunctionGroupFilterToGroupCode[functionGroup];
               if (!connectorRemote.attributes[fg]!.hasOwnProperty(kind)) throw new HttpErrorResponse({ status: 404, statusText: "Invalid kind" });

               return connectorRemote.attributes[fg]![kind];

            }

         )
      );

   }


   getConnectorAllAttributes(uuid: string): Observable<AttributeDescriptorCollectionDTO> {

      return of(
         dbData.connectors.find(connector => connector.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            connector => {

               if (!connector) throw new HttpErrorResponse({ status: 404, statusText: "Connector not found." });

               const connectorRemote = dbData.connectorsRemote.find(connectorRemote => connectorRemote.url === connector.url);
               if (!connectorRemote) throw new HttpErrorResponse({ status: 404, statusText: "Failed to connect to remote connector" });

               return connectorRemote.attributes;

            }

         )
      );

   }


   getConnectorHealth(uuid: string): Observable<model.ConnectorHealthDTO> {

      return of(
         dbData.connectors.find(connector => connector.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            connector => {

               if (!connector) throw new HttpErrorResponse({ status: 404, statusText: "Connector not found." });

               const connectorRemote = dbData.connectorsRemote.find(connectorRemote => connectorRemote.url === connector.url);
               if (!connectorRemote) return { status: "unknown" };

               return connectorRemote.health;

            }

         )
      );

   }


   getConnectorDetail(uuid: string): Observable<model.ConnectorDTO> {

      return of(
         dbData.connectors.find(connector => connector.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(
            connector => {
               if (!connector) throw new HttpErrorResponse({ status: 404, statusText: "Connector not found" });
               return connector;
            }
         )
      );

   }


   deleteConnector(uuid: string): Observable<DeleteObjectErrorDTO[]> {

      return of(
         dbData.connectors.findIndex(connector => connector.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            connectorIndex => {
               if (connectorIndex < 0) throw new HttpErrorResponse({ status: 404, statusText: "Connector not found" });
               dbData.connectors.splice(connectorIndex, 1);
               return [];
            }

         )

      );

   }


   authorizeConnector(uuid: string): Observable<void> {

      return of(
         dbData.connectors.find(connector => connector.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            connector => {
               if (!connector) throw new HttpErrorResponse({ status: 404, statusText: "Connector not found" });
               connector.status = "waitingForApproval";

            }

         )
      );

   }


   reconnectConnector(uuid: string): Observable<void> {

      return of(
         dbData.connectors.find(connector => connector.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            connector => {
               if (!connector) throw new HttpErrorResponse({ status: 404, statusText: "Failed to connect to the connector" });
               connector.status = "connected";
            }

         )

      );

   }


   bulkDeleteConnector(uuids: string[]): Observable<DeleteObjectErrorDTO[]> {

      return of(
         uuids
      ).pipe(

         delay(randomDelay()),
         map(

            uuids => {

               uuids.forEach(
                  uuid => {
                     const connectorIndex = dbData.connectors.findIndex(connector => connector.uuid === uuid);
                     if (connectorIndex < 0) throw new HttpErrorResponse({ status: 404 });
                     dbData.connectors.splice(connectorIndex, 1);
                  }
               )

               return [];

            }

         )
      );

   }


   bulkForceDeleteConnector(uuids: string[]): Observable<void> {

      return of(
         uuids
      ).pipe(

         delay(randomDelay()),
         map(

            uuids => {

               uuids.forEach(
                  uuid => {
                     const connectorIndex = dbData.connectors.findIndex(connector => connector.uuid === uuid);
                     if (connectorIndex < 0) throw new HttpErrorResponse({ status: 404 });
                     dbData.connectors.splice(connectorIndex, 1);
                  }
               )

            }

         )
      );

   }


   bulkAuthorizeConnector(uuids: string[]): Observable<void> {

      return of(
         uuids
      ).pipe(

         delay(randomDelay()),
         map(

            uuids => {

               uuids.forEach(

                  uuid => {
                     const connector = dbData.connectors.find(connector => connector.uuid === uuid);
                     if (!connector) throw new HttpErrorResponse({ status: 404, statusText: "Connector not found" });
                     connector.status = "waitingForApproval";
                  }

               )

            }

         )

      );

   }


   bulkReconnectConnector(uuids: string[]): Observable<void> {

      return of(
         uuids

      ).pipe(

         delay(randomDelay()),
         map(

            uuids => {

               uuids.forEach(

                  uuid => {

                     const connector = dbData.connectors.find(connector => connector.uuid === uuid);
                     if (!connector) throw new HttpErrorResponse({ status: 404, statusText: "Failed to connect to the connector" });
                     connector.status = "connected";

                  }

               )

            }

         )

      );

   }


   updateConnector(uuid: string, url: string, authType: model.AuthType, authAttributes?: AttributeDTO[]): Observable<model.ConnectorDTO> {

      return of(
         dbData.connectors.find(connector => connector.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            connector => {

               if (!connector) throw new HttpErrorResponse({ status: 404, statusText: "Connector not found"});

               const connectorRemote = dbData.connectorsRemote.find(connector => connector.url === url);
               if (!connectorRemote) throw new HttpErrorResponse({ status: 404, statusText: "Failed to connect to the connector" });

               connector.authType = authType;
               connector.authAttributes = authAttributes;
               connector.url = url;
               connector.functionGroups = connectorRemote.functionGroups;
               connector.status = "registered"

               return connector;

            }


         )
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
