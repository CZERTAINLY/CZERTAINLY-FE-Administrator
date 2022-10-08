import { Observable } from "rxjs";

import { FetchHttpService, HttpRequestOptions } from "utils/FetchHttpService";
import { createNewResource } from "utils/net";

import * as model from "./model";
import { AttributeDescriptorDTO, AttributeDTO } from "api/_common/attributeDTO";


const baseUrl = "/v1/entities";


export class EntityManagementBackend implements model.EntityManagementApi {


   private _fetchService: FetchHttpService;


   constructor(fetchService: FetchHttpService) {

      this._fetchService = fetchService;

   }


   validateLocationAttributes(uuid: string, attributes: AttributeDTO[]): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(
            `${baseUrl}/${uuid}/location/attributes/validate`,
            "POST",
            attributes
         )
      )

   }


   listEntities(): Observable<model.EntityDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(baseUrl, "GET")
      );

   }


   getEntityDetail(uuid: string): Observable<model.EntityDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "GET")
      );

   }


   addEntity(name: string, attributes: AttributeDTO[], connectorUuid: string, kind: string): Observable<{ uuid: string}> {

      return createNewResource(baseUrl, {
         name,
         attributes,
         connectorUuid,
         kind
      });

   }


   updateEntity(uuid: string, attributes: AttributeDTO[]): Observable<model.EntityDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "PUT", attributes)
      );

   }


   removeEntity(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "DELETE")
      );

   }

   listLocationAttributeDescriptors(uuid: string): Observable<AttributeDescriptorDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/attributes/location`, "GET")
      );

   }


}
