import { AuthType, FunctionGroupCode, Status } from "types/connectors";
import { AttributeModel } from "./attributes/AttributeModel";


export interface EndpointModel {
   uuid?: string;
   name: string;
   context: string;
   method: string;
   required: boolean;
}


export interface FunctionGroupModel {
   uuid: string;
   name: string;
   functionGroupCode: FunctionGroupCode;
   kinds: string[];
   endPoints: EndpointModel[];
}


export interface ConnectorModel {
   uuid: string;
   name: string;
   functionGroups: FunctionGroupModel[];
   url: string;
   status: Status;
   authType: AuthType;
   authAttributes?: AttributeModel[];
}


export interface ConnectorHealthPartModel {
   [key: string]: ConnectorHealthModel;
}


export interface ConnectorHealthModel {
   status: "down" | "failed" | "notOk" | "nok" | "nOk" | "ok" | "nok" | "unknown";
   description?: string;
   parts?: ConnectorHealthPartModel;
}
