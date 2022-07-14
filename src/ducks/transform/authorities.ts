import { AuthorityDTO } from "api/authority";
import { AuthorityModel } from "models/authorities";

export function transformAuthorityDtoToModel(authorityDto: AuthorityDTO): AuthorityModel {

   return {
      uuid: authorityDto.uuid,
      name: authorityDto.name,
      attributes: authorityDto.attributes || [],
      status: authorityDto.status,
      connectorUuid: authorityDto.connectorUuid,
      connectorName: authorityDto.connectorName,
      kind: authorityDto.kind
   }

}