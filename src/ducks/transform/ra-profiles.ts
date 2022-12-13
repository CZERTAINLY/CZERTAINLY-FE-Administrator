import { transformAttributeRequestModelToDto, transformAttributeResponseDtoToModel } from "./attributes";
import {
   ComplianceProfileSimplifiedDto, ComplianceProfileSimplifiedModel,
   RaProfileAcmeDetailResponseDto,
   RaProfileAcmeDetailResponseModel,
   RaProfileActivateAcmeRequestDto,
   RaProfileActivateAcmeRequestModel,
   RaProfileAddRequestDto,
   RaProfileAddRequestModel,
   RaProfileEditRequestDto,
   RaProfileEditRequestModel,
   RaProfileResponseDto,
   RaProfileResponseModel
} from "types/ra-profiles";

export function transformRaProfileResponseDtoToModel(raResponse: RaProfileResponseDto): RaProfileResponseModel {
   return {
      ...raResponse,
      attributes: raResponse.attributes.map(transformAttributeResponseDtoToModel),
      customAttributes: raResponse.customAttributes?.map(transformAttributeResponseDtoToModel)
   }
}

export function transformRaProfileActivateAcmeRequestModelToDto(raAcmeRequest: RaProfileActivateAcmeRequestModel): RaProfileActivateAcmeRequestDto {
   return {
      ...raAcmeRequest,
      issueCertificateAttributes: raAcmeRequest.issueCertificateAttributes.map(transformAttributeRequestModelToDto),
      revokeCertificateAttributes: raAcmeRequest.revokeCertificateAttributes.map(transformAttributeRequestModelToDto)
   }
}

export function transformRaProfileAcmeDetailResponseDtoToModel(raAcmeResponse: RaProfileAcmeDetailResponseDto): RaProfileAcmeDetailResponseModel {
   return {
      ...raAcmeResponse,
      issueCertificateAttributes: raAcmeResponse.issueCertificateAttributes.map(transformAttributeResponseDtoToModel),
      revokeCertificateAttributes: raAcmeResponse.revokeCertificateAttributes.map(transformAttributeResponseDtoToModel)
   }
}

export function transformRaProfileAddRequestModelToDto(raAddReq: RaProfileAddRequestModel): RaProfileAddRequestDto {
   return {
      ...raAddReq,
      attributes: raAddReq.attributes.map(transformAttributeRequestModelToDto),
      customAttributes: raAddReq.customAttributes?.map(transformAttributeRequestModelToDto)
   }
}

export function transformRaProfileEditRequestModelToDto(raEditReq: RaProfileEditRequestModel): RaProfileEditRequestDto {
   return {
      ...raEditReq,
      attributes: raEditReq.attributes.map(transformAttributeRequestModelToDto),
      customAttributes: raEditReq.customAttributes?.map(transformAttributeRequestModelToDto)
   }
}

export function transformComplianceProfileSimplifiedDtoToModel(complianceProfile: ComplianceProfileSimplifiedDto): ComplianceProfileSimplifiedModel {
   return { ...complianceProfile }
}

