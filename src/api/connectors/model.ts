import {
  AllAttributeResponse,
  ConnectorHealth,
  ErrorDeleteObject,
} from "models";
import { AttributeResponse } from "models/attributes";
import { Observable } from "rxjs";

export interface ConnectorInfoResponse {
  uuid: string;
  name: string;
  functionGroups?: FunctionGroup[];
  url: string;
  status?: string;
}

export interface ConnectorDetailResponse {
  uuid: string;
  name?: string;
  functionGroups?: FunctionGroup[];
  url: string;
  status?: string;
  authType: string;
  authAttributes: AttributeResponse[];
  // attributes?: ConnectorAttributes[];
}

export interface FunctionalityListResponse {
  id?: string | number;
  name: string;
  context: string;
  method: string;
  required: boolean;
}

export interface FunctionGroup {
  functionGroupCode?: string;
  endPoints?: FunctionalityListResponse[];
  endpoints?: FunctionalityListResponse[];
  id?: string | number;
  name?: string;
  kinds: string[];
}

export interface ConnectorConnectionResponse {
  functionGroup?: FunctionGroup;
}

export interface ConnectorAttributes {
  uuid: string | number;
  name: string;
  type: string;
  label: string;
  required: boolean;
  readOnly: boolean;
  editable: boolean;
  visible: boolean;
  multiValue: boolean;
  description?: string;
  validationRegex?: string;
  dependsOn?: any;
  value?: any;
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
  ): Observable<ConnectorConnectionResponse[]>;
  getConnectorsList(): Observable<ConnectorInfoResponse[]>;
  getConnectorHealth(uuid: string): Observable<ConnectorHealth>;
  getConnectorDetail(uuid: string): Observable<ConnectorDetailResponse>;

  deleteConnector(uuid: string | number): Observable<ErrorDeleteObject[]>;
  forceDeleteConnector(uuid: string | number): Observable<void>;
  authorizeConnector(uuid: string): Observable<void>;
  reconnectConnector(uuid: string): Observable<void>;

  bulkDeleteConnector(
    uuid: (string | number)[]
  ): Observable<ErrorDeleteObject[]>;
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
  ): Observable<ConnectorAttributes[]>;
  getConnectorAllAttributes(uuid: string): Observable<AllAttributeResponse>;
  getCallback(
    connectorUuid: string,
    request: any,
    functionGroup: string,
    kind: string,
    authorityUuid: string
  ): Observable<any>;
}
