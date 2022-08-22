import { Observable } from "rxjs";
import { AttributeDescriptorDTO, AttributeDTO } from "api/_common/attributeDTO";


export interface EntityDTO {
   uuid: string;
   name: string;
   attributes?: AttributeDTO[];
   status: string;
   connectorUuid: string;
   connectorName: string;
   kind: string;
}


export interface EntityManagementApi {

   validateLocationAttributes(uuid: string, attributes: AttributeDTO[]): Observable<void>;

   listEntities(): Observable<EntityDTO[]>;

   getEntityDetail(uuid: string): Observable<EntityDTO>;

   addEntity(name: string, attributes: AttributeDTO[], connectorUuid: string, kind: string): Observable<string>;

   updateEntity(uuid: string, attributes: AttributeDTO[]): Observable<EntityDTO>;

   removeEntity(uuid: string): Observable<void>;

   listLocationAttributes(uuid: string): Observable<AttributeDescriptorDTO[]>;

}
