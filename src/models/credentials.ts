import { AttributeModel } from "./attributes";

export interface CredentialModel {
   uuid: string;
   name: string;
   kind: string;
   attributes: AttributeModel[];
   enabled: boolean;
   connectorUuid: string;
   connectorName: string;
}
