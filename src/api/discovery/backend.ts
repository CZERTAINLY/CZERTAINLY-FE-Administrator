import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { FetchHttpService, HttpRequestOptions } from "utils/FetchHttpService";
import { createNewResource } from "utils/net";

import * as model from "./model";
import { ConnectorDTO } from "api/connectors";
import { AttributeDTO } from "api/_common/attributeDTO";

const baseUrl = "/v1/discoveries";
const baseUrlDiscoveryProvider = "/v1/connectors";

export class DiscoveryManagementBackend implements model.DiscoveryManagementApi {


   private _fetchService: FetchHttpService;


   constructor(fetchService: FetchHttpService) {

      this._fetchService = fetchService;

   }


   createNewDiscovery(
      name: string,
      kind: string,
      connectorUuid: string,
      attributes: AttributeDTO[]
   ): Observable<string> {

      return createNewResource(baseUrl, {
         name,
         kind,
         connectorUuid,
         attributes: attributes,
      }).pipe(
         map((location) => location?.substr(location.lastIndexOf("/") + 1) || "")
      );

   }


   getDiscoveryList(): Observable<model.DiscoveryDTO[]> {

      return this._fetchService.request(new HttpRequestOptions(baseUrl, "GET"));

   }


   getDiscoveryProviderList(): Observable<ConnectorDTO[]> {

      return this._fetchService.request(

         new HttpRequestOptions(
            `${baseUrlDiscoveryProvider}?functionGroup=${encodeURIComponent(
               "DISCOVERY_PROVIDER"
            )}`,
            "GET"
         )

      );

   }


   getDiscoveryProviderAttributes(
      uuid: string,
      kind: string

   ): Observable<AttributeDTO[]> {

      return this._fetchService.request(

         new HttpRequestOptions(
            `${baseUrlDiscoveryProvider}/${uuid}/discoveryProvider/${kind}/attributes`,
            "GET"
         )

      );

   }


   getDiscoveryDetail(uuid: string): Observable<model.DiscoveryDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "GET")
      );

   }


   deleteDiscovery(uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}/${uuid}`, "DELETE")
      );

   }


   bulkDeleteDiscovery(uuid: string[]): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(`${baseUrl}`, "DELETE", uuid)
      );

   }

}
