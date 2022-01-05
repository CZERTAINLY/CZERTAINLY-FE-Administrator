import { FunctionGroup } from "api/connectors";
import { AttributeResponse } from "./attributes";

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
  functionGroups: FunctionGroup[];
}

export interface AuthorityDetails {
  uuid: string;
  name?: string;
  attributes?: AttributeResponse[];
  connectorUuid: string;
  credential?: any;
  kind: string;
  connectorName: string;
}
