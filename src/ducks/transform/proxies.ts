import {
    ProxyListDto,
    ProxyListModel,
    ProxyRequestDto,
    ProxyRequestModel,
    ProxyResponseDto,
    ProxyResponseModel,
    ProxyUpdateRequestDto,
    ProxyUpdateRequestModel,
} from 'types/proxies';

export function transformProxyResponseDtoToModel(proxy: ProxyResponseDto): ProxyResponseModel {
    return { ...proxy };
}

export function transformProxyListDtoToModel(proxy: ProxyListDto): ProxyListModel {
    return { ...proxy };
}

export function transformProxyRequestModelToDto(proxy: ProxyRequestModel): ProxyRequestDto {
    return { ...proxy };
}

export function transformProxyUpdateRequestModelToDto(proxy: ProxyUpdateRequestModel): ProxyUpdateRequestDto {
    return { ...proxy };
}
