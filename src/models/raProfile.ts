import { AttributeModel } from "./attributes";

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