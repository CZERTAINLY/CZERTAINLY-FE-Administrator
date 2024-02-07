import { AttributeRequestModel, AttributeResponseModel } from './attributes';
import {
    BulkActionMessageDto,
    CallbackRequest,
    ConnectDto,
    ConnectorDto,
    ConnectorRequestDto as ConnectorRequestDtoOpenApi,
    ConnectorUpdateRequestDto as ConnectorUpdateRequestDtoOpenApi,
    ConnectRequestDto as ConnectRequestDtoOpenApi,
    EndpointDto as EndpointDtoOpenApi,
    FunctionGroupDto as FunctionGroupDtoOpenApi,
    HealthDto as HealthDtoOpenApi,
    RequestAttributeCallback,
    ResourceCallbackRequest,
} from './openapi';

export type BulkActionDto = BulkActionMessageDto;
export type BulkActionModel = BulkActionDto;

export type EndpointDto = EndpointDtoOpenApi;
export type EndpointModel = EndpointDto;

export type FunctionGroupDto = FunctionGroupDtoOpenApi;
export type FunctionGroupModel = Omit<FunctionGroupDto, 'endPoints'> & { endPoints: Array<EndpointModel> };

export type ConnectorRequestDto = ConnectorRequestDtoOpenApi;
export type ConnectorRequestModel = Omit<ConnectorRequestDto, 'authAttributes | customAttributes'> & {
    authAttributes?: Array<AttributeRequestModel>;
    customAttributes?: Array<AttributeRequestModel>;
};

export type ConnectorUpdateRequestDto = ConnectorUpdateRequestDtoOpenApi;
export type ConnectorUpdateRequestModel = Omit<ConnectorUpdateRequestDto, 'authAttributes | customAttributes'> & {
    authAttributes?: Array<AttributeRequestModel>;
    customAttributes?: Array<AttributeRequestModel>;
};

export type ConnectorResponseDto = ConnectorDto;
export type ConnectorResponseModel = Omit<ConnectorResponseDto, 'functionGroups | authAttributes | customAttributes'> & {
    functionGroups: Array<FunctionGroupModel>;
    authAttributes?: Array<AttributeResponseModel>;
    customAttributes?: Array<AttributeResponseModel>;
};

export type HealthDto = HealthDtoOpenApi;
export type HealthModel = Omit<HealthDto, 'parts'> & { parts?: { [key: string]: HealthModel } };

export type ConnectRequestDto = ConnectRequestDtoOpenApi;
export type ConnectRequestModel = Omit<ConnectRequestDto, 'authAttributes'> & { authAttributes?: Array<AttributeRequestModel> };

export type ConnectResponseDto = ConnectDto;
export type ConnectResponseModel = Omit<ConnectResponseDto, 'functionGroup'> & { functionGroup: FunctionGroupModel };

export type CallbackAttributeDto = RequestAttributeCallback;
export type CallbackAttributeModel = CallbackAttributeDto;

export type CallbackConnectorDto = CallbackRequest;
export type CallbackConnectorModel = Omit<CallbackConnectorDto, 'requestAttributeCallback'> & {
    requestAttributeCallback: CallbackAttributeModel;
};

export type CallbackResourceDto = ResourceCallbackRequest;
export type CallbackResourceModel = Omit<CallbackResourceDto, 'requestAttributeCallback'> & {
    requestAttributeCallback: CallbackAttributeModel;
};
