export type AttributeCallbackMappingTarget_AttributeCallbackDTO = "pathVariables" | "requestParameters" | "requestBody";
export type AttributeCallbackMappingTarget_AttributeCallbackModel = "pathVariable" | "queryParameter" | "body";

export type AttributeListValue = {
   id: number;
   name: string;
}
export type AttributeValue = string | number | boolean | AttributeListValue;

export type AttributeType = "BOOLEAN" | "INTEGER" | "FLOAT" | "STRING" | "TEXT" | "DATE" | "TIME" | "DATETIME" | "FILE" | "SECRET" | "CREDENTIAL" | "JSON";

