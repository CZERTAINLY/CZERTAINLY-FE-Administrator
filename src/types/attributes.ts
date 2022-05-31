

export type AttributeCallbackMappingTarget = "pathVariable" | "requestParameter" | "body";

export type AttributeType = "STRING" | "NUMBER" | "BOOLEAN" | "DROPDOWN" | "LIST" | "FILE" | "CREDENTIAL" | "SECRET";

export type AttributeListValue = {
   id: number;
   name: string;
}


export type AttributeValue = string | number | boolean | AttributeListValue | string[] | number[] | boolean[] | AttributeListValue[];
