import { AttributeDescriptorCollectionDTO, AttributeDescriptorDTO, AttributeDTO } from "api/_common/attributeDTO";
import { DeleteObjectErrorDTO } from "api/_common/deleteObjectErrorDTO";
import { functionGroupCodeToGroupFilter } from "ducks/transform/connectors";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { HttpErrorResponse, HttpRequestOptions } from "ts-rest-client";
import { FetchHttpService } from "ts-rest-client-fetch";
import { AuthType, FunctionGroupCode } from "types/connectors";

import { createNewResource } from "utils/net";

import * as model from "./model";

const baseUrl = "/api/v1/connectors";

export class ConnectorManagementBackend implements model.ConnectorManagementApi {

   constructor() {
      this._fetchService = new FetchHttpService();
   }

   private _fetchService: FetchHttpService;


   createNewConnector(name: string, url: string, authType: AuthType, authAttributes?: AttributeDTO[]): Observable<string> {

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


   connectToConnector(url: string, authType: AuthType, authAttributes?: AttributeDTO[], uuid?: string): Observable<model.ConnectionDTO[]> {

      return this._fetchService.request(

         new HttpRequestOptions(`${baseUrl}/connect`, "PUT", {
            uuid,
            url,
            authType,
            authAttributes
         })

      );

   }


   getConnectorsList(functionGroupCode?: FunctionGroupCode, kind?: string): Observable<model.ConnectorDTO[]> {

      const fgf = functionGroupCode ? `functionGroupFilter=${functionGroupCodeToGroupFilter[functionGroupCode]}` : "";
      const k = kind ? `kind=${kind}` : "";

      const search = fgf ? `?${fgf}` + k ? `&kind=${k}` : "" : "";

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}${search}`, "GET")
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

   getConnectorAttributes(uuid: string, functionGroupCode: FunctionGroupCode, kind: string): Observable<AttributeDescriptorDTO[]> {

      const fg = functionGroupCodeToGroupFilter[functionGroupCode];

      return this._fetchService.request(
         new HttpRequestOptions(
            `${baseUrl}/${uuid}/${fg}/${kind}/attributes`,
            "GET"
         )
      );

   }


   getConnectorAllAttributes(uuid: string): Observable<AttributeDescriptorCollectionDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/attributes-all`, "GET")
      );

   }


   deleteConnector(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "DELETE")
      );

   }



   authorizeConnector(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "PUT")
      );

   }


   reconnectConnector(uuid: string): Observable<model.ConnectionDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/reconnect`, "PUT")
      );

   }


   bulkDeleteConnectors(uuids: string[]): Observable<DeleteObjectErrorDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}`, "DELETE", uuids)
      );

   }


   bulkForceDeleteConnectors(uuids: string[]): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/force`, "DELETE", uuids)
      );

   }


   bulkAuthorizeConnectors(uuids: string[]): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/approve`, "PUT", uuids)
      );

   }


   bulkReconnectConnectors(uuids: string[]): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/reconnect`, "PUT", uuids)
      );

   }


   updateConnector(uuid: string, url: string, authType: AuthType, authAttributes?: AttributeDTO[]): Observable<model.ConnectorDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "POST", {
            uuid,
            url,
            authType,
            authAttributes
         })
      );

   }


   /*allback(
      connectorUuid: string,
      functionGroup: string,
      kind: string,
      request: {
         uuid: string,
         name: string,
         pathVariables: any,
         queryParameters: any,
         requestBody: any
      },
   ): Observable<any> {

      // Authority calback API
      if (authorityUuid) {

         return this._fetchService.request(
            new HttpRequestOptions(
               `${baseUrlCallback}/${authorityUuid}/callback`,
               "POST",
               requestBody
            )
         );

      }

      // RA Profile callback API
      return this._fetchService.request(
         new HttpRequestOptions(
            `${baseUrl}/${connectorUuid}/${functionGroup}/${kind}/callback`,
            "POST",
            requestBody
         )
      );

   }*/

}
