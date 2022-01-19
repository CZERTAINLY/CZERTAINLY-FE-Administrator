import { AttributeResponse } from "./attributes";

export interface RaProfile {
  uuid: string;
  name: string;
  enabled: boolean;
  authorityInstanceUuid: string;
  description?: string;
  authorityInstanceName: string;
}

export interface RaProfileDetail {
  uuid: string;
  name: string;
  description?: string;
  authorityInstanceUuid: string;
  attributes?: AttributeResponse[];
  enabled: boolean;
  authorityInstanceName: string;
}

export interface RaAcmeLink {
  directoryUrl?: string;
  uuid: string;
  name: string;
  acmeAvailable: boolean;
  issueCertificateAttributes: any;
  revokeCertificateAttributes: any;
}
