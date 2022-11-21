import { AuthType, Status } from "types/connectors";
import { AttributeModel } from "./attributes/AttributeModel";
import { FunctionGroupCode } from "../types/openapi";

// TODO remove
export interface EndpointModel {
   uuid?: string;
   name: string;
   context: string;
   method: string;
   required: boolean;
}


// TODO remove
export interface FunctionGroupModel {
   uuid: string;
   name: string;
   functionGroupCode: FunctionGroupCode;
   kinds: string[];
   endPoints: EndpointModel[];
}


// TODO remove
export interface ConnectorModel {
   uuid: string;
   name: string;
   functionGroups: FunctionGroupModel[];
   url: string;
   status: Status;
   authType: AuthType;
   authAttributes?: AttributeModel[];
}


// TODO remove
export interface ConnectorHealthPartModel {
   [key: string]: ConnectorHealthModel;
}


// TODO remove
export interface ConnectorHealthModel {
   status: "down" | "failed" | "notOk" | "nok" | "nOk" | "ok" | "nok" | "unknown";
   description?: string;
   parts?: ConnectorHealthPartModel;
}
