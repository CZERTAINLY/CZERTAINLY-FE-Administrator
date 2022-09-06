import { AttributeModel } from "./attributes/AttributeModel";

export interface LocationCertificateModel {
   certificateUuid: string;
   commonName: string;
   serialNumber: string;
   metadata: { [key: string]: any; };
   pushAttributes?: AttributeModel[];
   csrAttributes?: AttributeModel[];
   withKey?: boolean;
}


export interface LocationModel {
   uuid: string;
   name: string;
   description?: string;
   entityInstanceUuid: string;
   entityInstanceName: string;
   attributes: AttributeModel[];
   enabled: boolean;
   supportMultipleEntries: boolean;
   supportKeyMannagement: boolean;
   certificates: LocationCertificateModel[];
   metadata?: { [key: string]: any };
}
