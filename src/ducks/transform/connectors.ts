import {
    BulkActionDto,
    BulkActionModel,
    ConnectorRequestDto,
    ConnectorRequestModel,
    ConnectorResponseDto,
    ConnectorResponseModel,
    ConnectorUpdateRequestDto,
    ConnectorUpdateRequestModel,
    EndpointDto,
    EndpointModel,
    FunctionGroupDto,
    FunctionGroupModel,
} from 'types/connectors';
import { transformAttributeRequestModelToDto, transformAttributeResponseDtoToModel } from './attributes';

export function transformBulkActionDtoToModel(error: BulkActionDto): BulkActionModel {
    return { ...error };
}

export function transformEndpointDtoToModel(endPoint: EndpointDto): EndpointModel {
    return { ...endPoint };
}

export function transformFunctionGroupDtoToModel(functionGroup: FunctionGroupDto): FunctionGroupModel {
    return {
        ...functionGroup,
        kinds: functionGroup.kinds ?? [],
        endPoints: functionGroup.endPoints.map((endpoint) => transformEndpointDtoToModel(endpoint)),
    };
}

export function transformConnectorResponseDtoToModel(connector: ConnectorResponseDto): ConnectorResponseModel {
    return {
        ...connector,
        authAttributes: connector.authAttributes?.map((attr) => transformAttributeResponseDtoToModel(attr)),
        functionGroups: connector.functionGroups.map((group) => transformFunctionGroupDtoToModel(group)),
        customAttributes: connector.customAttributes?.map(transformAttributeResponseDtoToModel),
    };
}

export function transformConnectorRequestModelToDto(connector: ConnectorRequestModel): ConnectorRequestDto {
    return {
        ...connector,
        authAttributes: connector.authAttributes?.map(transformAttributeRequestModelToDto),
        customAttributes: connector.customAttributes?.map(transformAttributeRequestModelToDto),
    };
}

export function transformConnectorUpdateRequestModelToDto(connector: ConnectorUpdateRequestModel): ConnectorUpdateRequestDto {
    return {
        ...connector,
        authAttributes: connector.authAttributes?.map(transformAttributeRequestModelToDto),
        customAttributes: connector.customAttributes?.map(transformAttributeRequestModelToDto),
    };
}
