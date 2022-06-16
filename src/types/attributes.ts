export type AttributeCallbackMappingTarget = "pathVariable" | "requestParameter" | "body";

export type AttributeListValue = {
   id: number;
   name: string;
}

export type AttributeValue = string | number | boolean | AttributeListValue | string[] | number[] | boolean[] | AttributeListValue[];

export type AttributeType = "BOOLEAN" | "INTEGER" | "FLOAT" | "STRING" | "TEXT" | "DATE" | "TIME" | "DATETIME" | "FILE" | "SECRET" | "CREDENTIAL" | "JSON";

export type AttributeMappingTarget = "pathVariable" | "requestParameter" | "body";
