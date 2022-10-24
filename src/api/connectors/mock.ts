import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";
import { HttpErrorResponse } from "utils/FetchHttpService";

import { randomDelay } from "utils/mock";

import { AttributeDescriptorCollectionDTO, AttributeDescriptorDTO, AttributeDTO } from "api/_common/attributeDTO";
import { DeleteObjectErrorDTO } from "api/_common/deleteObjectErrorDTO";
import { dbData } from "mocks/db";

import * as model from "./model";
import { AuthType, FunctionGroupCode } from "types/connectors";


export class ConnectorManagementMock implements model.ConnectorManagementApi {

   createNewConnector(name: string, url: string, authType: AuthType, authAttributes: AttributeDTO[]): Observable<{ uuid: string}> {

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

               return { uuid };

            }

         )

      )

   }


   connectToConnector(url: string, authType: AuthType, authAttributes?: AttributeDTO[], uuid?: string): Observable<model.ConnectionDTO[]> {

      return of(
         dbData.connectorsRemote.find(connector => connector.url === url)
      ).pipe(

         delay(randomDelay()),
         map(

            connectorRemote => {
               if (!connectorRemote) throw new HttpErrorResponse({ status: 404, statusText: "Failed to connect to the connector" });
               return connectorRemote.functionGroups.map(functionGroup => ({ functionGroup }));
            }

         )

      );

   }


   getConnectorsList(functionGroupCode?: FunctionGroupCode, kind?: string): Observable<model.ConnectorDTO[]> {

      return of(

         dbData.connectors.filter(

            connector => {

               if (!functionGroupCode) return true;

               const fgc = functionGroupCode;

               for (const functionGroup of connector.functionGroups) {
                  if (functionGroup.functionGroupCode !== fgc) return false;
                  if (!kind) return true;
                  if (functionGroup.kinds.indexOf(kind) >= 0) return true;
               }

               return false;

            }

         )

      )

   }


   getConnectorAttributes(uuid: string, functionGroupCode: FunctionGroupCode, kind: string): Observable<AttributeDescriptorDTO[]> {

      return of(
         dbData.connectors.find(connector => connector.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            connector => {

               if (!connector) throw new HttpErrorResponse({ status: 404, statusText: "Connector not found." });

               const connectorRemote = dbData.connectorsRemote.find(connectorRemote => connectorRemote.url === connector.url);
               if (!connectorRemote) throw new HttpErrorResponse({ status: 404, statusText: "Failed to connect to remote connector" });

               if (!connectorRemote.attributes.hasOwnProperty(functionGroupCode)) throw new HttpErrorResponse({ status: 404, statusText: "Invalid function group" });

               const fg = functionGroupCode;
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


   deleteConnector(uuid: string): Observable<void> {

      return of(
         dbData.connectors.findIndex(connector => connector.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            connectorIndex => {
               if (connectorIndex < 0) throw new HttpErrorResponse({ status: 404, statusText: "Connector not found" });
               dbData.connectors.splice(connectorIndex, 1);
               return;
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


   reconnectConnector(uuid: string): Observable<model.ConnectionDTO[]> {

      return of(
         dbData.connectors.find(connector => connector.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(

            connector => {
               if (!connector) throw new HttpErrorResponse({ status: 404, statusText: "Connector not found" });

               const remoteConnector = dbData.connectorsRemote.find(connectorRemote => connectorRemote.url === connector.url);
               if (!remoteConnector) throw new HttpErrorResponse({ status: 404, statusText: "Failed to connect to remote connector" });

               return remoteConnector.functionGroups.map(functionGroup => ({ functionGroup }));
            }

         )

      );

   }


   bulkDeleteConnectors(uuids: string[]): Observable<DeleteObjectErrorDTO[]> {

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


   bulkForceDeleteConnectors(uuids: string[]): Observable<void> {

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


   bulkAuthorizeConnectors(uuids: string[]): Observable<void> {

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


   bulkReconnectConnectors(uuids: string[]): Observable<void> {

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


   updateConnector(uuid: string, url: string, authType: AuthType, authAttributes?: AttributeDTO[]): Observable<model.ConnectorDTO> {

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


   callback(url: string, data: model.AttributeCallbackDataDTO): Observable<any> {

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
