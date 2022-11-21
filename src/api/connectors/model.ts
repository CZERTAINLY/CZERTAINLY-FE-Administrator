import { AttributeDTO } from "api/_common/attributeDTO";
import { AuthType, Status } from "types/connectors";
import { FunctionGroupCode } from "types/openapi";


export interface EndpointDTO {
   uuid?: string;
   name: string;
   context: string;
   method: string;
   required: boolean;
}


export interface FunctionGroupDTO {
   uuid: string;
   name: string;
   functionGroupCode: FunctionGroupCode;
   kinds: string[];
   endPoints: EndpointDTO[];
}


export interface ConnectionDTO {
   functionGroup: FunctionGroupDTO
}


export interface ConnectorDTO {
   uuid: string;
   name: string;
   functionGroups: FunctionGroupDTO[];
   url: string;
   status: Status;
   authType: AuthType;
   authAttributes?: AttributeDTO[];
}


export interface ConnectorHealthPartDTO {
   [key: string]: ConnectorHealthDTO;
}


export interface ConnectorHealthDTO {
   status: "ok" | "nok" | "unknown";
   description?: string;
   parts?: ConnectorHealthPartDTO;
}


export interface AttributeCallbackDataDTO {
   uuid: string,
   name: string,
   pathVariables: { [key: string]: any },
   queryParameters: { [key: string]: any },
   requestBody: { [key: string]: any }
}

