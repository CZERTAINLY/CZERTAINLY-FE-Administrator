import { FunctionGroup } from "api/connectors";
import { AttributeResponse } from "./attributes";

export interface Credential {
  uuid: string;
  name: string;
  credentialType: string;
  connectorUuid: string;
  connectorName: string;
}

export interface CredentialProviders {
  uuid: string;
  name: string;
  status?: string;
  url: string;
  functionGroups: FunctionGroup[];
}

export interface CredentialDetails {
  uuid: string;
  name?: string;
  credentialType: string;
  attributes: AttributeResponse[];
  connectorUuid: string;
  connectorName: string;
}
