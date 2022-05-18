import { AttributeDescriptorCollectionDTO, AttributeDescriptorDTO, AttributeDTO } from "api/.common/AttributeDTO";
import { DeleteObjectErrorDTO } from "api/.common/DeleteObjectErrorDTO";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { HttpErrorResponse, HttpRequestOptions } from "ts-rest-client";
import { FetchHttpService } from "ts-rest-client-fetch";

import { createNewResource } from "utils/net";

import * as model from "./model";

const baseUrl = "/api/v1/connectors";
const baseUrlCallback = "/api/v1";


export class ConnectorManagementBackend implements model.ConnectorManagementApi {

   constructor() {
      this._fetchService = new FetchHttpService();
   }

   private _fetchService: FetchHttpService;


   createNewConnector(name: string, url: string, authType: model.AuthType, authAttributes?: AttributeDTO[]): Observable<string> {

      return createNewResource(
         baseUrl,
         {
            name,
            url,
            authType,
            authAttributes
         }
      ).pipe(

         map(
            result => {
               if (result === null) throw new HttpErrorResponse({ status: 404 });
               return result
            }
         )

      )

   }


   connectToConnector(url: string, authType: model.AuthType, authAttributes?: AttributeDTO[], uuid?: string): Observable<model.FunctionGroupDTO[]> {

      return this._fetchService.request(

         new HttpRequestOptions(`${baseUrl}/connect`, "PUT", {
            uuid,
            url,
            authType,
            authAttributes
         })

      );

   }


   getConnectorsList(functionGroupFilter?: model.FunctionGroupFilter, kind?: string): Observable<model.ConnectorDTO[]> {

      const fgf = functionGroupFilter ? `functionGroupFilter=${functionGroupFilter}` : "";
      const k = kind ? `kind=${kind}` : "";

      const search = fgf ? `?${fgf}` + k ? `&kind=${k}` : "" : "";

      return this._fetchService.request(
         new HttpRequestOptions(`baseUrl${search}`, "GET")
      );

   }


   getConnectorDetail(uuid: string): Observable<model.ConnectorDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "GET")
      );

   }


   getConnectorHealth(uuid: string): Observable<model.ConnectorHealthDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/health`, "GET")
      );

   }

   getConnectorAttributes(uuid: string, functionGroup: model.FunctionGroupFilter, kind: string): Observable<AttributeDescriptorDTO[]> {

      // const fg = model.FunctionGroupFilterToGroupCode[functionGroup];

      return this._fetchService.request(
         new HttpRequestOptions(
            `${baseUrl}/${uuid}/${functionGroup}/${kind}/attributes`,
            "GET"
         )
      );

   }


   getConnectorAllAttributes(uuid: string): Observable<AttributeDescriptorCollectionDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/attributes-all`, "GET")
      );

   }


   deleteConnector(uuid: string): Observable<DeleteObjectErrorDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "DELETE")
      );

   }



   authorizeConnector(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "PUT")
      );

   }


   reconnectConnector(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/reconnect`, "PUT")
      );

   }


   bulkDeleteConnector(uuids: string[]): Observable<DeleteObjectErrorDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}`, "DELETE", uuids)
      );

   }


   bulkForceDeleteConnector(uuids: string[]): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/force`, "DELETE", uuids)
      );

   }


   bulkAuthorizeConnector(uuids: string[]): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/approve`, "PUT", uuids)
      );

   }


   bulkReconnectConnector(uuids: string[]): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/reconnect`, "PUT", uuids)
      );

   }


   updateConnector(uuid: string, url: string, authType: model.AuthType, authAttributes?: AttributeDTO[]): Observable<model.ConnectorDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "POST", {
            uuid,
            url,
            authType,
            authAttributes
         })
      );

   }


   getCallback(
      connectorUuid: string,
      request: any,
      functionGroup: string,
      kind: string,
      authorityUuid: string
   ): Observable<any> {

      // Authority calback API
      if (authorityUuid) {

         return this._fetchService.request(
            new HttpRequestOptions(
               `${baseUrlCallback}/${authorityUuid}/callback`,
               "POST",
               request
            )
         );

      }

      // RA Profile callback API
      return this._fetchService.request(
         new HttpRequestOptions(
            `${baseUrl}/${connectorUuid}/${functionGroup}/${kind}/callback`,
            "POST",
            request
         )
      );

   }

}
