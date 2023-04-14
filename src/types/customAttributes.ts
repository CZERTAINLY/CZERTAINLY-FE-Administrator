import { BaseAttributeContentModel } from "./attributes";
import {
    AttributeDefinitionDto,
    CustomAttributeCreateRequestDto as CustomAttributeCreateRequestDtoOpenApi,
    CustomAttributeDefinitionDetailDto,
    CustomAttributeUpdateRequestDto as CustomAttributeUpdateRequestDtoOpenApi,
} from "./openapi";

export type CustomAttributeResponseDto = AttributeDefinitionDto;
export type CustomAttributeResponseModel = CustomAttributeResponseDto;

export type CustomAttributeDetailResponseDto = CustomAttributeDefinitionDetailDto;
export type CustomAttributeDetailResponseModel = Omit<CustomAttributeDetailResponseDto, "content"> & {
    content?: Array<BaseAttributeContentModel>;
};

export type CustomAttributeCreateRequestDto = CustomAttributeCreateRequestDtoOpenApi;
export type CustomAttributeCreateRequestModel = Omit<CustomAttributeCreateRequestDto, "content"> & {
    content?: Array<BaseAttributeContentModel>;
};

export type CustomAttributeUpdateRequestDto = CustomAttributeUpdateRequestDtoOpenApi;
export type CustomAttributeUpdateRequestModel = Omit<CustomAttributeUpdateRequestDto, "content"> & {
    content?: Array<BaseAttributeContentModel>;
};
