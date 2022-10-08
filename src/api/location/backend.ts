import { Observable } from "rxjs";

import { FetchHttpService, HttpRequestOptions } from "utils/FetchHttpService";
import { createNewResource } from "utils/net";

import * as model from "./model";
import { AttributeDescriptorDTO, AttributeDTO } from "api/_common/attributeDTO";


const baseUrl = "/v1/locations";
const extBaseUrl = "/v1/entities";


export class LocationManagementBackend implements model.LocationManagementApi {


   private _fetchService: FetchHttpService;


   constructor(fetchService: FetchHttpService) {

      this._fetchService = fetchService;

   }


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


   addLocation(entityUuid: string, name: string, description: string, attributes: AttributeDTO[], enabled: boolean): Observable<{ uuid: string}> {

      return createNewResource(`${extBaseUrl}/${entityUuid}/locations`, {
            name,
            description,
            attributes,
            enabled
         }
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
