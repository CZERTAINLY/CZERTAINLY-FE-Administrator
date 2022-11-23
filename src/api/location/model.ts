import { AttributeDTO } from "api/_common/attributeDTO";


export interface LocationCertificateDTO {
   certificateUuid: string;
   commonName: string;
   serialNumber: string;
   metadata: { [key: string]: any; };
   pushAttributes?: AttributeDTO[];
   csrAttributes?: AttributeDTO[];
   withKey?: boolean;
}


export interface LocationDTO {
   uuid: string;
   name: string;
   description?: string;
   entityInstanceUuid: string;
   entityInstanceName: string;
   attributes: AttributeDTO[];
   enabled: boolean;
   supportMultipleEntries: boolean;
   supportKeyManagement: boolean;
   certificates: LocationCertificateDTO[];
   metadata?: { [key: string]: any };
}
