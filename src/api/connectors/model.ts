import { Observable } from "rxjs";

import { AttributeDescriptorCollectionDTO, AttributeDescriptorDTO, AttributeDTO } from "api/.common/AttributeDTO";
import { DeleteObjectErrorDTO } from "api/.common/DeleteObjectErrorDTO";


export type FunctionGroupCode = "credentialProvider" | "authorityProvider" | "legacyAuthorityProvider" | "discoveryProvider";

export type FunctionGroupFilter = "CREDENTIAL_PROVIDER" | "AUTHORITY_PROVIDER" | "LEGACY_AUTHORITY_PROVIDER" | "DISCOVERY_PROVIDER";

export type AuthType = "none" | "basic" | "certificate" | "apiKey" | "jwt";

export type Status = "waitingForApproval" | "registered" | "connected" | "unavailable" | "misconfigured" | "failed" | "offline";


export const FunctionGroupToGroupFilter: { [code in FunctionGroupCode]: FunctionGroupFilter } = {
   "credentialProvider": "CREDENTIAL_PROVIDER",
   "legacyAuthorityProvider": "AUTHORITY_PROVIDER",
   "authorityProvider": "LEGACY_AUTHORITY_PROVIDER",
   "discoveryProvider": "DISCOVERY_PROVIDER"
}


export const FunctionGroupFilterToGroupCode: { [filter in FunctionGroupFilter]: FunctionGroupCode } = {
   "CREDENTIAL_PROVIDER": "credentialProvider",
   "AUTHORITY_PROVIDER": "legacyAuthorityProvider",
   "LEGACY_AUTHORITY_PROVIDER": "authorityProvider",
   "DISCOVERY_PROVIDER": "discoveryProvider"
}


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


export interface ConnectorDTO {
   uuid: string;
   name: string;
   functionGroups: FunctionGroupDTO[];
   url: string;
   status: Status;
   authType: AuthType;
   authAttributes?: AttributeDTO[];
}


export interface ConnectorHealthDTO {
   status: "ok" | "nok" | "unknown";
   description?: string;
   parts?: ConnectorHealthPartDTO;
}


export interface ConnectorHealthPartDTO {
   [key: string]: ConnectorHealthDTO;
}



export interface ConnectorManagementApi {

   getConnectorsList(functionGroupFilter?: FunctionGroupFilter, kind?: string): Observable<ConnectorDTO[]>;

   getConnectorDetail(uuid: string): Observable<ConnectorDTO>;

   getConnectorHealth(uuid: string): Observable<ConnectorHealthDTO>;

   getConnectorAttributes(uuid: string, functionGroup: FunctionGroupFilter, kind: string): Observable<AttributeDescriptorDTO[]>;

   getConnectorAllAttributes(uuid: string): Observable<AttributeDescriptorCollectionDTO>;

   createNewConnector(name: string, url: string, authType: AuthType, authAttributes?: AttributeDTO[]): Observable<string>;

   updateConnector(uuid: string, url: string, authType: AuthType, authAttributes?: AttributeDTO[]): Observable<ConnectorDTO>;

   deleteConnector(uuid: string): Observable<DeleteObjectErrorDTO[]>;

   bulkDeleteConnector(uuids: string[]): Observable<DeleteObjectErrorDTO[]>;

   bulkForceDeleteConnector(uuids: string[]): Observable<void>;

   connectToConnector(url: string, authType: AuthType, authAttributes?: AttributeDTO[], uuid?: string): Observable<FunctionGroupDTO[]>;

   bulkReconnectConnector(uuids: string[]): Observable<void>;

   reconnectConnector(uuid: string): Observable<void>;

   authorizeConnector(uuid: string): Observable<void>;

   bulkAuthorizeConnector(uuids: string[]): Observable<void>;

   getCallback(
      connectorUuid: string,
      request: any,
      functionGroup: string,
      kind: string,
      authorityUuid: string
   ): Observable<any>;

}
