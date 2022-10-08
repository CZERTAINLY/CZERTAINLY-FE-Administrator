import { Observable } from "rxjs";

import { FetchHttpService, HttpRequestOptions } from "utils/FetchHttpService";
import { createNewResource } from "utils/net";

import * as model from "./model";
import { AttributeDescriptorCollectionDTO, AttributeDescriptorDTO, AttributeDTO } from "api/_common/attributeDTO";
import { DeleteObjectErrorDTO } from "api/_common/deleteObjectErrorDTO";
import { AuthType, FunctionGroupCode } from "types/connectors";
import { functionGroupCodeToGroupFilter } from "ducks/transform/connectors";

const baseUrl = "/v1/connectors";
const callbackBaseUrl = "/v1";

export class ConnectorManagementBackend implements model.ConnectorManagementApi {

   private _fetchService: FetchHttpService;


   constructor(fetchService: FetchHttpService) {

      this._fetchService = fetchService;

   }


   createNewConnector(name: string, url: string, authType: AuthType, authAttributes?: AttributeDTO[]): Observable<{ uuid: string}> {

      return createNewResource(
         baseUrl,
         {
            name,
            url,
            authType,
            authAttributes
         }
      );

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

      const fgf = functionGroupCode ? `functionGroup=${functionGroupCodeToGroupFilter[functionGroupCode]}` : "";
      const k = kind ? `kind=${kind}` : "";

      const search = fgf ? `?${fgf}` + (k ? `&kind=${k}` : "") : "";

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

      //const fg = functionGroupCodeToGroupFilter[functionGroupCode];

      return this._fetchService.request(
         new HttpRequestOptions(
            `${baseUrl}/${uuid}/attributes/${functionGroupCode}/${kind}`,
            "GET"
         )
      );

   }


   getConnectorAllAttributes(uuid: string): Observable<AttributeDescriptorCollectionDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/attributes`, "GET")
      );

   }


   deleteConnector(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "DELETE")
      );

   }



   authorizeConnector(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}/approve`, "PUT")
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
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "PUT", {
            uuid,
            url,
            authType,
            authAttributes
         })
      );

   }


   callback(url: string, data: model.AttributeCallbackDataDTO): Observable<any> {

      return this._fetchService.request(

         new HttpRequestOptions(
            `${callbackBaseUrl}/${url}`,
            "POST",
            data
         )

      );


   }

}
