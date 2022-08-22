import { Observable } from "rxjs";

import { HttpRequestOptions } from "ts-rest-client";
import { FetchHttpService } from "ts-rest-client-fetch";

import { AttributeDescriptorDTO, AttributeDTO } from "api/_common/attributeDTO";

import * as model from "./model";


const baseUrl = "/api/v1/entities";


export class EntityManagementBackend implements model.EntityManagementApi {

   constructor() {
      this._fetchService = new FetchHttpService();
   }

   private _fetchService: FetchHttpService;


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


   addEntity(name: string, attributes: AttributeDTO[], connectorUuid: string, kind: string): Observable<string> {

      return this._fetchService.request(
         new HttpRequestOptions(baseUrl, "POST", {
            name,
            attributes,
            connectorUuid,
            kind
         })
      );

   }


   updateEntity(uuid: string, attributes: AttributeDTO[]): Observable<model.EntityDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "PATCH", attributes)
      );

   }


   removeEntity(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "DELETE")
      );

   }

   listLocationAttributes(uuid: string): Observable<AttributeDescriptorDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/location/attributes`, "GET")
      );

   }


}
