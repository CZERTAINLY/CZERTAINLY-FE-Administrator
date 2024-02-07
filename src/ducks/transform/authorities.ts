import {
    AuthorityRequestDto,
    AuthorityRequestModel,
    AuthorityResponseDto,
    AuthorityResponseModel,
    AuthorityUpdateRequestDto,
    AuthorityUpdateRequestModel,
} from 'types/authorities';
import { transformAttributeRequestModelToDto, transformAttributeResponseDtoToModel } from './attributes';

export function transformAuthorityResponseDtoToModel(authorityResponseDto: AuthorityResponseDto): AuthorityResponseModel {
    return {
        ...authorityResponseDto,
        attributes: authorityResponseDto.attributes ?? [],
        customAttributes: authorityResponseDto.customAttributes?.map(transformAttributeResponseDtoToModel),
    };
}

export function transformAuthorityRequestModelToDto(authority: AuthorityRequestModel): AuthorityRequestDto {
    return {
        ...authority,
        attributes: authority.attributes.map(transformAttributeRequestModelToDto),
        customAttributes: authority.customAttributes?.map(transformAttributeRequestModelToDto),
    };
}

export function transformAuthorityUpdateRequestModelToDto(authority: AuthorityUpdateRequestModel): AuthorityUpdateRequestDto {
    return {
        ...authority,
        attributes: authority.attributes.map(transformAttributeRequestModelToDto),
        customAttributes: authority.customAttributes?.map(transformAttributeRequestModelToDto),
    };
}
