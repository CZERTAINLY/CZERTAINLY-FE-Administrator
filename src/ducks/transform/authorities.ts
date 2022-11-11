import { AuthorityResponseDto, AuthorityResponseModel } from "types/authorities";

export function transformAuthorityResponseDtoToModel(authorityResponseDto: AuthorityResponseDto): AuthorityResponseModel {

   return {
      ...authorityResponseDto,
      attributes: authorityResponseDto.attributes ?? [],
   }

}