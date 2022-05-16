import { AttributeDescriptorDTO } from "../api/.common/AttributeDTO";

export interface RaProfile {
   uuid: string;
   name: string;
   enabled: boolean;
   authorityInstanceUuid: string;
   description?: string;
   authorityInstanceName: string;
   enabledProtocols?: string[];
}

export interface RaProfileDetail {
   uuid: string;
   name: string;
   description?: string;
   authorityInstanceUuid: string;
   attributes?: AttributeDescriptorDTO[];
   enabled: boolean;
   authorityInstanceName: string;
}

export interface RaAcmeLink {
   uuid: string;
   name: string;
   directoryUrl?: string;
   acmeAvailable: boolean;
   issueCertificateAttributes: any;
   revokeCertificateAttributes: any;
}
