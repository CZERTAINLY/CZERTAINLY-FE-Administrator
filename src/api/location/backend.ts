import { Observable } from "rxjs";

import { HttpRequestOptions } from "ts-rest-client";
import { FetchHttpService } from "ts-rest-client-fetch";

import { AttributeDescriptorDTO, AttributeDTO } from "api/_common/attributeDTO";

import * as model from "./model";
import { createNewResource } from "utils/net";
import { map } from "rxjs/operators";


const baseUrl = "/api/v1/locations";
const extBaseUrl = "/api/v1/entities";


export class LocationManagementBackend implements model.LocationManagementApi {


   constructor() {
      this._fetchService = new FetchHttpService();
   }

   private _fetchService: FetchHttpService;


   listLocations(enabled?: boolean): Observable<model.LocationDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(
            `${baseUrl}${enabled !== undefined ? "?enabled=" + enabled.toString() : ""}`,
            "GET"
         )
      )

   }


   getLocationDetail(entityUuid: string, uuid: string): Observable<model.LocationDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(
            `${extBaseUrl}/${entityUuid}/locations/${uuid}`,
            "GET"
         )
      )

   }


   addLocation(entityUuid: string, name: string, description: string, attributes: AttributeDTO[], enabled: boolean): Observable<string> {

      return createNewResource(`${extBaseUrl}/${entityUuid}/locations`, {
            name,
            description,
            attributes,
            enabled
         }
      ).pipe(
         map(
            uuid => {
               if (!uuid) throw new Error("Unexpected response returned from server");
               return uuid;
            }
         )
      );

   }


   editLocation(uuid: string, entityUuid: string, description: string, attributes: AttributeDTO[], enabled: boolean): Observable<model.LocationDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(
            `${extBaseUrl}/${entityUuid}/locations/${uuid}`,
            "PUT", {
            description,
            attributes,
            enabled
         }
         )
      )


   }


   deleteLocation(entityUuid: string, uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(
            `${extBaseUrl}/${entityUuid}/locations/${uuid}`,
            "DELETE"
         )
      )

   }


   enableLocation(entityUuid: string, uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(
            `${extBaseUrl}/${entityUuid}/locations/${uuid}/enable`,
            "PATCH"
         )
      )

   }


   disableLocation(entityUuid: string, uuid: string): Observable<void> {

      return this._fetchService.request(
         new HttpRequestOptions(
            `${extBaseUrl}/${entityUuid}/locations/${uuid}/disable`,
            "PATCH"
         )
      )

   }


   syncLocation(entityUuid: string, uuid: string): Observable<model.LocationDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(
            `${extBaseUrl}/${entityUuid}/locations/${uuid}/sync`,
            "PUT"
         )
      )

   }


   getPushAttributes(entityUuid: string, uuid: string): Observable<AttributeDescriptorDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(
            `${extBaseUrl}/${entityUuid}/locations/${uuid}/attributes/push`,
            "GET"
         )
      )

   }


   getCSRAttributes(entityUuid: string, uuid: string): Observable<AttributeDescriptorDTO[]> {

      return this._fetchService.request(
         new HttpRequestOptions(
            `${extBaseUrl}/${entityUuid}/locations/${uuid}/attributes/issue`,
            "GET"
         )
      )

   }


   pushCertificate(entityUuid: string, locationUuid: string, certificateUuid: string, attributes: AttributeDTO[]): Observable<model.LocationDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(
            `${extBaseUrl}/${entityUuid}/locations/${locationUuid}/certificates/${certificateUuid}`,
            "PUT", {
               attributes
            }
         )
      )

   }


   issueCertificate(entityUuid: string, locationUuid: string, raProfileUuid: string, csrAttributes: AttributeDTO[], issueAttributes: AttributeDTO[]): Observable<model.LocationDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(
            `${extBaseUrl}/${entityUuid}/locations/${locationUuid}/certificates`,
            "POST",
            {
               raProfileUuid,
               csrAttributes,
               issueAttributes
            }
         )
      )

   }


   autoRenewCertificate(entityUuid: string, locationUuid: string, certificateUuid: string): Observable<model.LocationDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(
            `${extBaseUrl}/${entityUuid}/locations/${locationUuid}/certificates/${certificateUuid}`,
            "PATCH"
         )
      )

   }


   removeCertificate(entityUuid: string, locationUuid: string, certificateUuid: string): Observable<model.LocationDTO> {

      return this._fetchService.request(
         new HttpRequestOptions(
            `${extBaseUrl}/${entityUuid}/locations/${locationUuid}/certificates/${certificateUuid}`,
            "DELETE"
         )
      )

   }

}
