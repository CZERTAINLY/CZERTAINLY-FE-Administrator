import { BaseAttributeContentModel } from './attributes';
import {
    CustomAttributeCreateRequestDto as CustomAttributeCreateRequestDtoOpenApi,
    CustomAttributeDefinitionDetailDto,
    CustomAttributeDefinitionDto,
    CustomAttributeUpdateRequestDto as CustomAttributeUpdateRequestDtoOpenApi,
} from './openapi';

export type CustomAttributeResponseDto = CustomAttributeDefinitionDto;
export type CustomAttributeResponseModel = CustomAttributeResponseDto;

export type CustomAttributeDetailResponseDto = CustomAttributeDefinitionDetailDto;
export type CustomAttributeDetailResponseModel = Omit<CustomAttributeDetailResponseDto, 'content'> & {
    content?: Array<BaseAttributeContentModel>;
};

export type CustomAttributeCreateRequestDto = CustomAttributeCreateRequestDtoOpenApi;
export type CustomAttributeCreateRequestModel = Omit<CustomAttributeCreateRequestDto, 'content'> & {
    content?: Array<BaseAttributeContentModel>;
};

export type CustomAttributeUpdateRequestDto = CustomAttributeUpdateRequestDtoOpenApi;
export type CustomAttributeUpdateRequestModel = Omit<CustomAttributeUpdateRequestDto, 'content'> & {
    content?: Array<BaseAttributeContentModel>;
};
