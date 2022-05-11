// import { ConnectorAttributes } from "api/connectors";
import { ConnectorFunctionGroupDTO } from "api/connectors";
import { AttributeDescriptorDTO } from "../api/.common/AttributeDTO";

export interface Connector {
  uuid: string;
  name: string;
  functionGroups?: ConnectorFunctionGroupDTO[];
  url: string;
  status?: string | "";
}

export interface ConnectorDetails {
  uuid: string;
  name?: string;
  functionGroups?: ConnectorFunctionGroupDTO[];
  url: string;
  status?: string | "";
  authType: string;
  authAttributes: AttributeDescriptorDTO[];
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
