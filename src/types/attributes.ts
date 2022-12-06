import { AttributeType, BaseAttributeDto, DataAttribute, RequestAttributeDto, ResponseAttributeDto } from "./openapi";

//TODO remove
export type AttributeCallbackMappingTarget_AttributeCallbackModel = "pathVariable" | "requestParameter" | "body";

//TODO remove
export type AttributeListValue = {
   id: number;
   name: string;
}
//TODO remove
export type AttributeValue = string | number | boolean | AttributeListValue;

//TODO remove
// export type AttributeType = "BOOLEAN" | "INTEGER" | "FLOAT" | "STRING" | "TEXT" | "DATE" | "TIME" | "DATETIME" | "FILE" | "SECRET" | "CREDENTIAL" | "JSON";

export type AttributeRequestDto = RequestAttributeDto;
export type AttributeRequestModel = AttributeRequestDto;

export type AttributeResponseDto = ResponseAttributeDto;
export type AttributeResponseModel = AttributeResponseDto;

export type AttributeDescriptorDto = BaseAttributeDto;
export type AttributeDescriptorModelNew = AttributeDescriptorDto; // TODO rename

export type AttributeDescriptorCollectionDto = {
   [functionGroup: string]: {
      [kind: string]: AttributeDescriptorDto[];
   }
}

// TODO rename
export type AttributeDescriptorCollectionModelNew = {
   [functionGroup: string]: {
      [kind: string]: AttributeDescriptorModelNew[];
   }
}

export const isDataAttribute = (attribute: AttributeDescriptorModelNew): attribute is DataAttribute => {
   return attribute.type === AttributeType.Data;
}
