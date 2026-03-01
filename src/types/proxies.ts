import {
    BulkActionMessageDto,
    ProxyDto,
    ProxyListDto as ProxyListDtoOpenApi,
    ProxyRequestDto as ProxyRequestDtoOpenApi,
    ProxyUpdateRequestDto as ProxyUpdateRequestDtoOpenApi,
} from './openapi';

export type BulkActionDto = BulkActionMessageDto;
export type BulkActionModel = BulkActionDto;

export type ProxyRequestDto = ProxyRequestDtoOpenApi;
export type ProxyRequestModel = ProxyRequestDto;

export type ProxyUpdateRequestDto = ProxyUpdateRequestDtoOpenApi;
export type ProxyUpdateRequestModel = ProxyUpdateRequestDto;

export type ProxyResponseDto = ProxyDto;
export type ProxyResponseModel = ProxyDto;

export type ProxyListDto = ProxyListDtoOpenApi;
export type ProxyListModel = ProxyListDtoOpenApi;
