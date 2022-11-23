import { AttributeDescriptorDTO, AttributeDTO } from "api/_common/attributeDTO";
import { Observable } from "rxjs";


export interface RaProfileDTO {
   uuid: string;
   name: string;
   enabled: boolean;
   description?: string;
   authorityInstanceUuid: string;
   authorityInstanceName: string;
   attributes: AttributeDTO[];
   enabledProtocols?: string[];
   complianceProfiles?: raComplianceProfileDTO[];
}

export interface raComplianceProfileDTO {
   uuid: string;
   name: string;
   description?: string;
}


export interface RaAuthorizedClientDTO {
   uuid: string;
   name: string;
   enabled: boolean;
}


export interface RaAcmeLinkDTO {
   uuid?: string;
   name?: string;
   directoryUrl?: string;
   issueCertificateAttributes?: AttributeDTO[];
   revokeCertificateAttributes?: AttributeDTO[];
   acmeAvailable: boolean;
}

