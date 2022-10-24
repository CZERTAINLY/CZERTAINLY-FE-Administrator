import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";

import * as model from "./model";

import { dbData } from "mocks/db";
import { randomDelay } from "utils/mock";
import { HttpErrorResponse } from "utils/FetchHttpService";

import { AttributeDescriptorDTO, AttributeDTO } from "api/_common/attributeDTO";


export class LocationManagementMock implements model.LocationManagementApi {


   listLocations(enabled?: boolean): Observable<model.LocationDTO[]> {

      return of(
         enabled !== undefined ? dbData.locations.filter(loc => loc.enabled === enabled) : dbData.locations
      ).pipe(

         delay(randomDelay())

      )

   }


   getLocationDetail(entityUuid: string, uuid: string): Observable<model.LocationDTO> {

      return of(
         dbData.locations.find(location => location.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(
            location => {
               if (!location) throw new HttpErrorResponse({ status: 404 });
               return location;
            }
         )

      )

   }


   addLocation(entityUuid: string, name: string, description: string, attributes: AttributeDTO[], enabled: boolean): Observable<{ uuid: string}> {

      return of(
         dbData
      ).pipe(

         delay(randomDelay()),
         map(

            db => {

               const entity = dbData.entities.find(entity => entity.uuid === entityUuid);
               if (!entity) throw new HttpErrorResponse({ status: 404, statusText: "Entity not found" });

               const location: model.LocationDTO = {
                  uuid: crypto.randomUUID(),
                  name,
                  description,
                  attributes,
                  enabled,
                  metadata: {},
                  certificates: [],
                  entityInstanceName: entity.name,
                  entityInstanceUuid: entity.uuid,
                  supportKeyManagement: false,
                  supportMultipleEntries: false
               };

               db.locations.push(location);

               return { uuid: location.uuid };

            }


         )

      )

   }


   editLocation(uuid: string, entityUuid: string, description: string, attributes: AttributeDTO[], enabled: boolean): Observable<model.LocationDTO> {

      return of(
         dbData.locations.find(location => location.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(
            location => {
               if (!location) throw new HttpErrorResponse({ status: 404 });
               return location;
            }
         )

      )


   }


   deleteLocation(entityUuid: string, uuid: string): Observable<void> {

      return of(
         dbData.locations.findIndex(location => location.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(
            locationIndex => {

               if (locationIndex < 0) throw new HttpErrorResponse({ status: 404 });
               dbData.locations.splice(locationIndex, 1);

            }
         )

      )
   }


   enableLocation(entityUuid: string, uuid: string): Observable<void> {

      return of(
         dbData.locations.find(location => location.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(
            location => {
               if (!location) throw new HttpErrorResponse({ status: 404 });
               location.enabled = true;
            }
         )

      )

   }


   disableLocation(entityUuid: string, uuid: string): Observable<void> {

      return of(
         dbData.locations.find(location => location.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(
            location => {
               if (!location) throw new HttpErrorResponse({ status: 404 });
               location.enabled = false;
            }

         )

      )

   }


   syncLocation(entityUuid: string, uuid: string): Observable<model.LocationDTO> {

      return of(
         dbData.locations.find(location => location.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(
            location => {
               if (!location) throw new HttpErrorResponse({ status: 404 });
               return location;
            }
         )

      )
   }


   getPushAttributes(entityUuid: string, uuid: string): Observable<AttributeDescriptorDTO[]> {

      return of(
         dbData.locations.find(location => location.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(
            location => {
               if (!location) throw new HttpErrorResponse({ status: 404 });
               return [];
            }
         )

      )

   }


   getCSRAttributes(entityUuid: string, uuid: string): Observable<AttributeDescriptorDTO[]> {

      return of(
         dbData.locations.find(location => location.uuid === uuid)
      ).pipe(

         delay(randomDelay()),
         map(
            location => {
               if (!location) throw new HttpErrorResponse({ status: 404 });
               return [];
            }
         )

      )

   }


   pushCertificate(entityUuid: string, locationUuid: string, certificateUuid: string, pushAttributes: AttributeDTO[]): Observable<model.LocationDTO> {

      return of(
         dbData.locations.find(location => location.uuid === locationUuid)
      ).pipe(

         delay(randomDelay()),
         map(
            location => {
               if (!location) throw new HttpErrorResponse({ status: 404 });

               const certificate = dbData.certificates.find(certificate => certificate.uuid === certificateUuid);
               if (!certificate) throw new HttpErrorResponse({ status: 404, statusText: "Certificate not found" });

               location.certificates.push({
                  certificateUuid: certificate.uuid,
                  pushAttributes: [],
                  commonName: certificate.commonName,
                  csrAttributes: [],
                  metadata: certificate.meta || {},
                  serialNumber: certificate.serialNumber,
                  withKey: false
               });
               return location;
            }
         )

      )

   }


   issueCertificate(entityUuid: string, locationUuid: string, raProfileUuid: string, csrAttributes: AttributeDTO[], issueAttributes: AttributeDTO[]): Observable<model.LocationDTO> {


      return of(
         dbData.locations.find(location => location.uuid === locationUuid)
      ).pipe(

         delay(randomDelay()),
         map(
            location => {
               if (!location) throw new HttpErrorResponse({ status: 404 });

               const raProfile = dbData.raProfiles.find(raProfile => raProfile.uuid === raProfileUuid);
               if (!raProfile) throw new HttpErrorResponse({ status: 404, statusText: "RA Profile not found" });

               location.certificates.push({
                  certificateUuid: crypto.randomUUID(),
                  pushAttributes: [],
                  commonName: "",
                  csrAttributes,
                  metadata: {},
                  serialNumber: "",
                  withKey: true
               });
               return location;
            }
         )

      )


   }


   autoRenewCertificate(entityUuid: string, locationUuid: string, certificateUuid: string): Observable<model.LocationDTO> {

      return of(
         dbData.locations.find(location => location.uuid === locationUuid)
      ).pipe(

         delay(randomDelay()),
         map(

            location => {
               if (!location) throw new HttpErrorResponse({ status: 404 });

               const certificate = location.certificates.find(certificate => certificate.certificateUuid === certificateUuid);
               if (!certificate) throw new HttpErrorResponse({ status: 404, statusText: "Certificate not found" });

               // ...

               return location;
            }
         )

      )

   }


   removeCertificate(entityUuid: string, locationUuid: string, certificateUuid: string): Observable<model.LocationDTO> {

      return of(
         dbData.locations.find(location => location.uuid === locationUuid)
      ).pipe(

         delay(randomDelay()),
         map(
            location => {
               if (!location) throw new HttpErrorResponse({ status: 404 });

               const certificate = location.certificates.find(certificate => certificate.certificateUuid === certificateUuid);
               if (!certificate) throw new HttpErrorResponse({ status: 404, statusText: "Certificate not found" });

               location.certificates.splice(location.certificates.indexOf(certificate), 1);
               return location;
            }
         )

      )


   }



}
