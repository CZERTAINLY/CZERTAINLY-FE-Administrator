import { TokenInstanceDetailDto, TokenInstanceDto } from "types/openapi";
import {
   TokenDetailResponseModel,
   TokenRequestDto,
   TokenRequestModel,
   TokenResponseDto,
   TokenResponseModel, 
   TokenUpdateRequestDto, 
   TokenUpdateRequestModel
} from "types/tokens";
import { transformAttributeRequestModelToDto, transformAttributeResponseDtoToModel } from "./attributes";

export function transformTokenResponseDtoToModel(tokenResponseDto: TokenInstanceDto): TokenResponseModel {

   return {
      ...tokenResponseDto,
   }

}


export function transformTokenDetailResponseDtoToModel(tokenResponseDto: TokenInstanceDetailDto): TokenDetailResponseModel {

   return {
      ...tokenResponseDto,
      attributes: tokenResponseDto.attributes ?? [],
      customAttributes: tokenResponseDto.customAttributes?.map(transformAttributeResponseDtoToModel)
   }

}

export function transformTokenRequestModelToDto(token: TokenRequestModel): TokenRequestDto {
   return {
      ...token,
      attributes: token.attributes.map(transformAttributeRequestModelToDto),
      customAttributes: token.customAttributes?.map(transformAttributeRequestModelToDto)
   }
}


export function transformTokenUpdateRequestModelToDto(token: TokenUpdateRequestModel): TokenUpdateRequestDto {
   return {
      ...token,
      attributes: token.attributes.map(transformAttributeRequestModelToDto),
      customAttributes: token.customAttributes?.map(transformAttributeRequestModelToDto)
   }
}