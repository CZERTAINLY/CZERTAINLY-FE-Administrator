import { ListLocationAttributes200ResponseInner, RequestAttributeDto, ResponseAttributeDto } from "./openapi";

export type AttributeCallbackMappingTarget_AttributeCallbackModel = "pathVariable" | "requestParameter" | "body";

export type AttributeListValue = {
   id: number;
   name: string;
}
export type AttributeValue = string | number | boolean | AttributeListValue;

export type AttributeType = "BOOLEAN" | "INTEGER" | "FLOAT" | "STRING" | "TEXT" | "DATE" | "TIME" | "DATETIME" | "FILE" | "SECRET" | "CREDENTIAL" | "JSON";

export type AttributeRequestDto = RequestAttributeDto;
export type AttributeRequestModel = AttributeRequestDto;

export type AttributeResponseDto = ResponseAttributeDto;
export type AttributeResponseModel = AttributeResponseDto;

export type AttributeDescriptorDto = ListLocationAttributes200ResponseInner;
export type AttributeDescriptorModelNew = AttributeDescriptorDto;

export type AttributeDescriptorCollectionDto = {
   [functionGroup: string]: {
      [kind: string]: AttributeDescriptorDto[];
   }
}

export type AttributeDescriptorCollectionModelNew = {
   [functionGroup: string]: {
      [kind: string]: AttributeDescriptorModelNew[];
   }
}
// TODO@dmaixner fix with some real type check
// export const isDataAttribute = (attribute: AttributeDescriptorDto | AttributeDescriptorModelNew): attribute is DataAttribute => {
//    return 'constraints' in attribute;
// }
//
// export const isInfoAttribute = (attribute: AttributeDescriptorDto | AttributeDescriptorModelNew): attribute is InfoAttribute => {
//    return 'properties' in attribute;
// }
//
// export const isGroupAttribute = (attribute: AttributeDescriptorDto | AttributeDescriptorModelNew): attribute is GroupAttribute => {
//    return attribute.type === GroupAttributeTypeEnum.Group;
// }