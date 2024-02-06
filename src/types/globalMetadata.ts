import {
    AttributeDefinitionDto,
    ConnectorMetadataResponseDto as ConnectorMetadataResponseDtoOpenApi,
    GlobalMetadataCreateRequestDto as GlobalMetadataCreateRequestDtoOpenApi,
    GlobalMetadataDefinitionDetailDto,
    GlobalMetadataUpdateRequestDto as GlobalMetadataUpdateRequestDtoOpenApi,
} from './openapi';

export type GlobalMetadataResponseDto = AttributeDefinitionDto;
export type GlobalMetadataResponseModel = GlobalMetadataResponseDto;

export type GlobalMetadataDetailResponseDto = GlobalMetadataDefinitionDetailDto;
export type GlobalMetadataDetailResponseModel = GlobalMetadataDetailResponseDto;

export type GlobalMetadataCreateRequestDto = GlobalMetadataCreateRequestDtoOpenApi;
export type GlobalMetadataCreateRequestModel = GlobalMetadataCreateRequestDto;

export type GlobalMetadataUpdateRequestDto = GlobalMetadataUpdateRequestDtoOpenApi;
export type GlobalMetadataUpdateRequestModel = GlobalMetadataUpdateRequestDto;

export type ConnectorMetadataResponseDto = ConnectorMetadataResponseDtoOpenApi;
export type ConnectorMetadataResponseModel = ConnectorMetadataResponseDto;
