import { AttributeDTO } from "api/_common/attributeDTO";


export interface AuthorityDTO {
   uuid: string;
   name: string;
   attributes?: AttributeDTO[];
   status: string;
   connectorUuid: string;
   connectorName: string;
   kind: string;
}
