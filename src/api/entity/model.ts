import { AttributeDTO } from "api/_common/attributeDTO";


export interface EntityDTO {
   uuid: string;
   name: string;
   attributes?: AttributeDTO[];
   status: string;
   connectorUuid: string;
   connectorName: string;
   kind: string;
}

