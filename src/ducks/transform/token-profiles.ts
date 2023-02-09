import { transformAttributeRequestModelToDto, transformAttributeResponseDtoToModel } from "./attributes";
import {
   TokenProfileAddRequestDto,
   TokenProfileAddRequestModel,
   TokenProfileEditRequestDto,
   TokenProfileEditRequestModel,
   TokenProfileResponseDto,
   TokenProfileResponseModel,
   TokenProfileDetailResponseDto,
   TokenProfileDetailResponseModel,
   TokenProfileKeyUsageUpdateRequestModel,
   TokenProfileKeyUsageUpdateRequestDto,
   TokenProfileKeyUsageBulkUpdateRequestModel,
   TokenProfileKeyUsageBulkUpdateRequestDto,
} from "types/token-profiles";


export function transformTokenProfileResponseDtoToModel(tokenResponse: TokenProfileResponseDto): TokenProfileResponseModel {
   return {
      ...tokenResponse,
   }
}

export function transformTokenProfileDetailResponseDtoToModel(tokenResponse: TokenProfileDetailResponseDto): TokenProfileDetailResponseModel {
   return {
      ...tokenResponse,
      attributes: tokenResponse.attributes.map(transformAttributeResponseDtoToModel),
      customAttributes: tokenResponse.customAttributes?.map(transformAttributeResponseDtoToModel)
   }
}

export function transformTokenProfileAddRequestModelToDto(tokenAddReq: TokenProfileAddRequestModel): TokenProfileAddRequestDto {
   return {
      ...tokenAddReq,
      attributes: tokenAddReq.attributes.map(transformAttributeRequestModelToDto),
      customAttributes: tokenAddReq.customAttributes?.map(transformAttributeRequestModelToDto)
   }
}

export function transformTokenProfileEditRequestModelToDto(tokenEditReq: TokenProfileEditRequestModel): TokenProfileEditRequestDto {
   return {
      ...tokenEditReq,
      attributes: tokenEditReq.attributes.map(transformAttributeRequestModelToDto),
      customAttributes: tokenEditReq.customAttributes?.map(transformAttributeRequestModelToDto)
   }
}

export function transformTokenProfileKeyUsageRequestModelToDto(keyUsageRequest: TokenProfileKeyUsageUpdateRequestModel): TokenProfileKeyUsageUpdateRequestDto {
   return {
      ...keyUsageRequest,
   }
}

export function transformTokenProfileBulkKeyUsageRequestModelToDto(keyUsageRequest: TokenProfileKeyUsageBulkUpdateRequestModel): TokenProfileKeyUsageBulkUpdateRequestDto {
   return {
      ...keyUsageRequest,
   }
}


