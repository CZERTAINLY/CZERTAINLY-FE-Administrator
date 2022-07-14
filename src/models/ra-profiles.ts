import { AttributeModel } from "./attributes/AttributeModel";

export interface RaProfileModel {
   uuid: string;
   name: string;
   enabled: boolean;
   description?: string;
   authorityInstanceUuid: string;
   authorityInstanceName: string;
   attributes: AttributeModel[];
   enabledProtocols?: string[];
}


export interface RaAuthorizedClientModel {
   uuid: string;
   name: string;
   enabled: boolean;
}


export interface RaAcmeLinkModel {
   uuid?: string;
   name?: string;
   directoryUrl?: string;
   issueCertificateAttributes?: AttributeModel[];
   revokeCertificateAttributes?: AttributeModel[];
   acmeAvailable: boolean;
}