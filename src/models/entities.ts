import { AttributeModel } from "./attributes/AttributeModel";


export interface EntityModel {
   uuid: string;
   name: string;
   attributes?: AttributeModel[];
   status: string;
   connectorUuid: string;
   connectorName: string;
   kind: string;
}
