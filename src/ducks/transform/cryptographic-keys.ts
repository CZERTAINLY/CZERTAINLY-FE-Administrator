import { transformAttributeRequestModelToDto, transformAttributeResponseDtoToModel } from "./attributes";
import {
   CryptographicKeyAddRequestDto,
   CryptographicKeyAddRequestModel,
   CryptographicKeyEditRequestDto,
   CryptographicKeyEditRequestModel,
   CryptographicKeyResponseDto,
   CryptographicKeyResponseModel,
   CryptographicKeyDetailResponseDto,
   CryptographicKeyDetailResponseModel,
   CryptographicKeyKeyUsageUpdateRequestModel,
   CryptographicKeyKeyUsageUpdateRequestDto,
   CryptographicKeyKeyUsageBulkUpdateRequestModel,
   CryptographicKeyKeyUsageBulkUpdateRequestDto,
   CryptographicKeyHistoryDto,
   CryptographicKeyHistoryModel,
   CryptographicKeyItemResponseDto,
   CryptographicKeyItemResponseModel,
   CryptographicKeyItemSummaryDto,
   CryptographicKeyItemSummaryModel,
   CryptographicKeyCompromiseRequestDto,
   CryptographicKeyCompromiseRequestModel,
   CryptographicKeyBulkCompromiseRequestModel,
   CryptographicKeyBulkCompromiseRequestDto,
   CryptographicKeyItemBulkCompromiseRequestModel,
   CryptographicKeyItemBulkCompromiseRequestDto,
} from "types/cryptographic-keys";


export function transformCryptographicKeyResponseDtoToModel(keyResponse: CryptographicKeyResponseDto): CryptographicKeyResponseModel {
   return {
      ...keyResponse,
      items: keyResponse.items.map(transformCryptographicKeyItemSummaryDtoToModel),
   }
}

export function transformCryptographicKeyDetailResponseDtoToModel(keyResponse: CryptographicKeyDetailResponseDto): CryptographicKeyDetailResponseModel {
   return {
      ...keyResponse,
      items: keyResponse.items.map(transformCryptographicKeyItemResponseDtoToModel),
      attributes: keyResponse.attributes.map(transformAttributeResponseDtoToModel),
      customAttributes: keyResponse.customAttributes?.map(transformAttributeResponseDtoToModel)
   }
}

export function transformCryptographicKeyItemResponseDtoToModel(keyResponse: CryptographicKeyItemResponseDto): CryptographicKeyItemResponseModel {
   return {
      ...keyResponse,
   }
}

export function transformCryptographicKeyItemSummaryDtoToModel(keyResponse: CryptographicKeyItemSummaryDto): CryptographicKeyItemSummaryModel {
   return {
      ...keyResponse,
   }
}


export function transformCryptographicKeyAddRequestModelToDto(keyAddReq: CryptographicKeyAddRequestModel): CryptographicKeyAddRequestDto {
   return {
      ...keyAddReq,
      attributes: keyAddReq.attributes.map(transformAttributeRequestModelToDto),
      customAttributes: keyAddReq.customAttributes?.map(transformAttributeRequestModelToDto)
   }
}

export function transformCryptographicKeyEditRequestModelToDto(keyEditReq: CryptographicKeyEditRequestModel): CryptographicKeyEditRequestDto {
   return {
      ...keyEditReq,
      customAttributes: keyEditReq.customAttributes?.map(transformAttributeRequestModelToDto)
   }
}

export function transformCryptographicKeyKeyUsageRequestModelToDto(keyUsageRequest: CryptographicKeyKeyUsageUpdateRequestModel): CryptographicKeyKeyUsageUpdateRequestDto {
   return {
      ...keyUsageRequest,
   }
}

export function transformCryptographicKeyBulkKeyUsageRequestModelToDto(keyUsageRequest: CryptographicKeyKeyUsageBulkUpdateRequestModel): CryptographicKeyKeyUsageBulkUpdateRequestDto {
   return {
      ...keyUsageRequest,
   }
}

export function transformCryptographicKeyCompromiseModelToDto(request: CryptographicKeyCompromiseRequestModel): CryptographicKeyCompromiseRequestDto {
   return {
      ...request,
   }
}

export function transformCryptographicKeyBulkCompromiseModelToDto(request: CryptographicKeyBulkCompromiseRequestModel): CryptographicKeyBulkCompromiseRequestDto {
   return {
      ...request,
   }
}


export function transformCryptographicKeyItemBulkCompromiseModelToDto(request: CryptographicKeyItemBulkCompromiseRequestModel): CryptographicKeyItemBulkCompromiseRequestDto {
   return {
      ...request,
   }
}

export function transformKeyHistoryDtoToModel(history: CryptographicKeyHistoryDto): CryptographicKeyHistoryModel {
   return { ...history };
}
