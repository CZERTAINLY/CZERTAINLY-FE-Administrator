import { FunctionGroupDTO } from "api/connectors";
import { AttributeDescriptorDTO } from "../api/.common/AttributeDTO";

export interface Credential {
  uuid: string;
  name: string;
  kind: string;
  connectorUuid: string;
  connectorName: string;
}

export interface CredentialProviders {
  uuid: string;
  name: string;
  status?: string;
  url: string;
  functionGroups: FunctionGroupDTO[];
}

export interface CredentialDetails {
  uuid: string;
  name?: string;
  kind: string;
  attributes: AttributeDescriptorDTO[];
  connectorUuid: string;
  connectorName: string;
}
