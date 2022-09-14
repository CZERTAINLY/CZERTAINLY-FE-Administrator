import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";

import * as model from "./model";

import { dbData } from "mocks/db";
import { randomDelay } from "utils/mock";
import { HttpErrorResponse } from "ts-rest-client";

import { AttributeDescriptorDTO, AttributeDTO } from "api/_common/attributeDTO";


export class EntityManagementMock implements model.EntityManagementApi {


   validateLocationAttributes(uuid: string, attributes: AttributeDTO[]): Observable<void> {

      return of(
         dbData.entities.find(entity => entity.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(
            entity => {
               if (!entity) throw new HttpErrorResponse({ status: 404 });
            }
         )

      )

   }


   listEntities(): Observable<model.EntityDTO[]> {

      return of(
         dbData.entities
      ).pipe(
         delay(randomDelay()),
         map(
            entities => entities
         )
      )

   }


   getEntityDetail(uuid: string): Observable<model.EntityDTO> {

      return of(
         dbData.entities.find(entity => entity.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(
            entity => {
               if (!entity) throw new HttpErrorResponse({ status: 404 });
               return entity;
            }
         )

      );

   }


   addEntity(name: string, attributes: AttributeDTO[], connectorUuid: string, kind: string): Observable<string> {

      return of(
         dbData
      ).pipe(

         delay(randomDelay()),
         map(
            db => {

               const connector = dbData.connectors.find(connector => connector.uuid === connectorUuid);
               if (!connector) throw new HttpErrorResponse({ status: 404, statusText: "Connector not found" });

               if (!connector.functionGroups.find(fg => fg.functionGroupCode === "entityProvider")) throw new HttpErrorResponse({ status: 403, statusText: "Connector does not support entity management" });

               const entity = {
                  uuid: crypto.randomUUID(),
                  name: name,
                  attributes: attributes,
                  status: "ACTIVE",
                  connectorUuid: connector.uuid,
                  connectorName: connector.name,
                  kind: kind
               };

               db.entities.push();

               return entity.uuid
            }
         )
      )

   }


   updateEntity(uuid: string, attributes: AttributeDTO[]): Observable<model.EntityDTO> {


      return of(
         dbData.entities.find(entity => entity.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(
            entity => {
               if (!entity) throw new HttpErrorResponse({ status: 404 });
               entity.attributes = attributes;
               return entity;
            }
         )

      );

   }


   removeEntity(uuid: string): Observable<void> {

      return of(
         dbData.entities.findIndex(entity => entity.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(
            entityIndex => {

               if (entityIndex < 0) throw new HttpErrorResponse({ status: 404 });
               dbData.entities.splice(entityIndex, 1);

            }
         )

      )
   }


   listLocationAttributeDescriptors(uuid: string): Observable<AttributeDescriptorDTO[]> {

      return of(
         dbData.entities.find(entity => entity.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(
            entity => {
               if (!entity) throw new HttpErrorResponse({ status: 404 });
               return [];
            }
         )

      )

   }






}
