import {
   AuthorityRequestDto,
   AuthorityRequestModel,
   AuthorityResponseDto,
   AuthorityResponseModel
} from "types/authorities";
import { transformAttributeRequestModelToDto, transformAttributeResponseDtoToModel } from "./attributes";

export function transformAuthorityResponseDtoToModel(authorityResponseDto: AuthorityResponseDto): AuthorityResponseModel {

   return {
      ...authorityResponseDto,
      attributes: authorityResponseDto.attributes ?? [],
      customAttributes: authorityResponseDto.customAttributes?.map(transformAttributeResponseDtoToModel)
   }

}

export function transformAuthorityRequestModelToDto(authority: AuthorityRequestModel): AuthorityRequestDto {
   return {
      ...authority,
      attributes: authority.attributes.map(transformAttributeRequestModelToDto),
      customAttributes: authority.customAttributes.map(transformAttributeRequestModelToDto)
   }
}