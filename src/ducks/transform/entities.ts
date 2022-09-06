import { EntityDTO } from "api/entity";
import { EntityModel } from "models/entities";

export function transformEntityDtoToModel(entity: EntityDTO): EntityModel {

   return {
      uuid: entity.uuid,
      name: entity.name,
      attributes: entity.attributes ? JSON.parse(JSON.stringify(entity.attributes)) : [],
      status: entity.status,
      connectorUuid: entity.connectorUuid,
      connectorName: entity.connectorName,
      kind: entity.kind
   };

}