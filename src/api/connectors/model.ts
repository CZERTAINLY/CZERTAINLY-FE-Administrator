import { Observable } from "rxjs";

import { AttributeDescriptorCollectionDTO, AttributeDescriptorDTO, AttributeDTO } from "api/_common/attributeDTO";
import { DeleteObjectErrorDTO } from "api/_common/deleteObjectErrorDTO";
import { AuthType, FunctionGroupCode, Status } from "types/connectors";


export interface EndpointDTO {
   uuid?: string;
   name: string;
   context: string;
   method: string;
   required: boolean;
}


export interface FunctionGroupDTO {
   uuid: string;
   name: string;
   functionGroupCode: FunctionGroupCode;
   kinds: string[];
   endPoints: EndpointDTO[];
}


export interface ConnectionDTO {
   functionGroup: FunctionGroupDTO
}


export interface ConnectorDTO {
   uuid: string;
   name: string;
   functionGroups: FunctionGroupDTO[];
   url: string;
   status: Status;
   authType: AuthType;
   authAttributes?: AttributeDTO[];
}


export interface ConnectorHealthPartDTO {
   [key: string]: ConnectorHealthDTO;
}


export interface ConnectorHealthDTO {
   status: "ok" | "nok" | "unknown";
   description?: string;
   parts?: ConnectorHealthPartDTO;
}


export interface ConnectorManagementApi {

   getConnectorsList(functionGroupCode?: FunctionGroupCode, kind?: string): Observable<ConnectorDTO[]>;

   getConnectorDetail(uuid: string): Observable<ConnectorDTO>;

   getConnectorHealth(uuid: string): Observable<ConnectorHealthDTO>;

   getConnectorAttributes(uuid: string, functionGroup: FunctionGroupCode, kind: string): Observable<AttributeDescriptorDTO[]>;

   getConnectorAllAttributes(uuid: string): Observable<AttributeDescriptorCollectionDTO>;

   createNewConnector(name: string, url: string, authType: AuthType, authAttributes?: AttributeDTO[]): Observable<string>;

   updateConnector(uuid: string, url: string, authType: AuthType, authAttributes?: AttributeDTO[]): Observable<ConnectorDTO>;

   deleteConnector(uuid: string): Observable<void>;

   bulkDeleteConnectors(uuids: string[]): Observable<DeleteObjectErrorDTO[]>;

   bulkForceDeleteConnectors(uuids: string[]): Observable<void>;

   connectToConnector(url: string, authType: AuthType, authAttributes?: AttributeDTO[], uuid?: string): Observable<ConnectionDTO[]>;

   reconnectConnector(uuid: string): Observable<ConnectionDTO[]>;

   bulkReconnectConnectors(uuids: string[]): Observable<void>;

   authorizeConnector(uuid: string): Observable<void>;

   bulkAuthorizeConnectors(uuids: string[]): Observable<void>;

   /*callback(
      connectorUuid: string,
      functionGroup: string,
      kind: string,
      request: {
         uuid: string,
         name: string,
         pathVariables: any,
         queryParameters: any,
         requestBody: any
      },
   ): Observable<any>;*/

}
