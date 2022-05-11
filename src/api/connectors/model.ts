import { Observable } from "rxjs";

import { AllAttributeDTO, AttributeDescriptorDTO } from "api/.common/AttributeDTO";
import { DeleteObjectErrorDTO } from "api/.common/DeleteObjectErrorDTO";


export interface ConnectorInfoDTO {
   uuid: string;
   name: string;
   functionGroups?: ConnectorFunctionGroupDTO[];
   url: string;
   status?: string;
}

export interface ConnectorDetailDTO {
   uuid: string;
   name?: string;
   functionGroups?: ConnectorFunctionGroupDTO[];
   url: string;
   status?: string;
   authType: string;
   authAttributes: AttributeDescriptorDTO[];
   // attributes?: AttributeDTO[];
}

export interface ConnectorFunctionalityDTO {
   id?: string | number;
   name: string;
   context: string;
   method: string;
   required: boolean;
}

export interface ConnectorFunctionGroupDTO {
   functionGroupCode?: string;
   endPoints?: ConnectorFunctionalityDTO[];
   endpoints?: ConnectorFunctionalityDTO[];
   id?: string | number;
   name?: string;
   kinds: string[];
}

export interface ConnectorConnectionDTO {
   functionGroup?: ConnectorFunctionGroupDTO;
}

export interface ConnectorHealthDTO {
   status: string;
   parts?: OConnectorHealthPartDTO;
}

export interface OConnectorHealthPartDTO {
   [key: string]: ConnectorHealthPartDTO;
}

export interface ConnectorHealthPartDTO {
   status: string;
   description: string;
}


export interface ConnectorManagementApi {

   createNewConnector(
      name: string,
      url: string,
      authType: string,
      authAttributes: any
   ): Observable<string>;

   connectNewConnector(
      name: string,
      url: string,
      authType: string,
      authAttributes: any,
      uuid: string
   ): Observable<ConnectorConnectionDTO[]>;

   getConnectorsList(): Observable<ConnectorInfoDTO[]>;

   getConnectorHealth(uuid: string): Observable<ConnectorHealthDTO>;

   getConnectorDetail(uuid: string): Observable<ConnectorDetailDTO>;

   deleteConnector(uuid: string | number): Observable<DeleteObjectErrorDTO[]>;

   forceDeleteConnector(uuid: string | number): Observable<void>;

   authorizeConnector(uuid: string): Observable<void>;

   reconnectConnector(uuid: string): Observable<void>;

   bulkDeleteConnector(uuid: (string | number)[]): Observable<DeleteObjectErrorDTO[]>;

   bulkForceDeleteConnector(uuid: (string | number)[]): Observable<void>;

   bulkAuthorizeConnector(uuid: string[]): Observable<void>;

   bulkReconnectConnector(uuid: string[]): Observable<void>;

   updateConnector(
      uuid: string,
      name: string,
      url: string,
      authType: string,
      authAttributes: any
   ): Observable<string>;

   getConnectorAttributes(
      uuid: string,
      code: string,
      kinds: string
   ): Observable<AttributeDescriptorDTO[]>;

   getConnectorAllAttributes(uuid: string): Observable<AllAttributeDTO>;

   getCallback(
      connectorUuid: string,
      request: any,
      functionGroup: string,
      kind: string,
      authorityUuid: string
   ): Observable<any>;

}
