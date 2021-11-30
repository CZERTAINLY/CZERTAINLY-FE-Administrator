// import { ConnectorAttributes } from "api/connectors";
import { FunctionGroup } from "api/connectors";
import { AttributeResponse } from "./attributes";

export interface Connector {
  uuid: string;
  name: string;
  functionGroups?: FunctionGroup[];
  url: string;
  status?: string | "";
}

export interface ConnectorDetails {
  uuid: string;
  name?: string;
  functionGroups?: FunctionGroup[];
  url: string;
  status?: string | "";
  authType: string;
  authAttributes: AttributeResponse[];
}

export interface ConnectorFunctionGroup {
  id?: string | number;
}

export interface AllAttributeResponse {
  [key: string]: any;
}

export interface ConnectorHealth {
  status: string;
  parts?: OConnectorHealthPart;
}

export interface OConnectorHealthPart {
  [key: string]: ConnectorHealthPart;
}

export interface ConnectorHealthPart {
  status: string;
  description: string;
}
