import { ConnectorFunctionGroupDTO } from "api/connectors";
import { AttributeDescriptorDTO } from "../api/.common/AttributeDTO";

export interface Authority {
  uuid: string;
  name: string;
  connectorUuid: string;
  kind: string;
  connectorName: string;
}

export interface AuthorityProviders {
  uuid: string;
  name: string;
  status?: string;
  url: string;
  functionGroups: ConnectorFunctionGroupDTO[];
}

export interface AuthorityDetails {
  uuid: string;
  name?: string;
  attributes?: AttributeDescriptorDTO[];
  connectorUuid: string;
  credential?: any;
  kind: string;
  connectorName: string;
}
