import { EntityDTO } from "api/entity";

export interface DbEntity extends EntityDTO {
}

export interface DbEntities {
   [key: string]: DbEntity;
}

export const dbEntities: DbEntities = {

   "entity1": {
      uuid: "aab53f2c-a6b9-49f0-ad99-418d5fe2b298",
      name: "Entity 1",
      attributes: [
      ],
      status: "ACTIVE",
      connectorUuid: "aab53f2c-a6b9-49f0-ad99-418d5fe2b298",
      connectorName: "Connector 1",
      kind: "LOCATION",
   }

}