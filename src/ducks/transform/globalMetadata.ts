import {
    ConnectorMetadataResponseDto,
    ConnectorMetadataResponseModel,
    GlobalMetadataCreateRequestDto,
    GlobalMetadataCreateRequestModel,
    GlobalMetadataDetailResponseDto,
    GlobalMetadataDetailResponseModel,
    GlobalMetadataResponseDto,
    GlobalMetadataResponseModel,
    GlobalMetadataUpdateRequestDto,
    GlobalMetadataUpdateRequestModel,
} from 'types/globalMetadata';

export function transformGlobalMetadataResponseDtoToModel(metadata: GlobalMetadataResponseDto): GlobalMetadataResponseModel {
    return { ...metadata };
}

export function transformGlobalMetadataDetailResponseDtoToModel(
    metadata: GlobalMetadataDetailResponseDto,
): GlobalMetadataDetailResponseModel {
    return { ...metadata };
}

export function transformGlobalMetadataCreateRequestModelToDto(metadata: GlobalMetadataCreateRequestModel): GlobalMetadataCreateRequestDto {
    return { ...metadata };
}

export function transformGlobalMetadataUpdateRequestModelToDto(metadata: GlobalMetadataUpdateRequestModel): GlobalMetadataUpdateRequestDto {
    return { ...metadata };
}

export function transformConnectorMetadataResponseDtoToModel(metadata: ConnectorMetadataResponseDto): ConnectorMetadataResponseModel {
    return { ...metadata };
}
