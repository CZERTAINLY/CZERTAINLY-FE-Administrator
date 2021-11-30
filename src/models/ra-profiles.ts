import { AttributeResponse } from "./attributes";

export interface RaProfile {
  uuid: string;
  name: string;
  enabled: boolean;
  caInstanceUuid: string;
  description?: string;
  caInstanceName: string;
}

export interface RaProfileDetail {
  uuid: string;
  name: string;
  description?: string;
  caInstanceUuid: string;
  attributes?: AttributeResponse[];
  enabled: boolean;
  caInstanceName: string;
}
