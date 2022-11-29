import {
   CredentialCreateRequestDto,
   CredentialCreateRequestModel,
   CredentialEditRequestDto,
   CredentialEditRequestModel,
   CredentialResponseDto,
   CredentialResponseModel
} from "types/credentials";
import { transformAttributeRequestModelToDto, transformAttributeResponseDtoToModel } from "./attributes";

export function transformCredentialResponseDtoToModel(credential: CredentialResponseDto): CredentialResponseModel {
   return {
      ...credential,
      attributes: credential.attributes.map(transformAttributeResponseDtoToModel)
   }
}

export function transformCredentialCreateRequestModelToDto(credential: CredentialCreateRequestModel): CredentialCreateRequestDto {
   return {
      ...credential,
      attributes: credential.attributes.map(transformAttributeRequestModelToDto)
   }
}

export function transformCredentialEditRequestModelToDto(credential: CredentialEditRequestModel): CredentialEditRequestDto {
   return {
      ...credential,
      attributes: credential.attributes.map(transformAttributeRequestModelToDto)
   }
}