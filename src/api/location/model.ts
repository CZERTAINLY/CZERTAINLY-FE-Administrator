import { Observable } from "rxjs";
import { AttributeDescriptorDTO, AttributeDTO } from "api/_common/attributeDTO";


export interface LocationCertificateDTO {
   certificateUuid: string;
   commonName: string;
   serialNumber: string;
   metadata: { [key: string]: any; };
   pushAttributes?: AttributeDTO[];
   csrAttributes?: AttributeDTO[];
   withKey?: boolean;
}


export interface LocationDTO {
   uuid: string;
   name: string;
   description?: string;
   entityInstanceUuid: string;
   entityInstanceName: string;
   attributes: AttributeDTO[];
   enabled: boolean;
   supportMultipleEntries: boolean;
   supportKeyManagement: boolean;
   certificates: LocationCertificateDTO[];
   metadata?: { [key: string]: any };
}


export interface LocationManagementApi {

   listLocations(enabled?: boolean): Observable<LocationDTO[]>;

   getLocationDetail(entityUuid: string, uuid: string): Observable<LocationDTO>;
   addLocation(entityUuid: string, name: string, description: string, attributes: AttributeDTO[], enabled: boolean): Observable<{ uuid: string}>;
   editLocation(uuid: string, entityUuid: string, description: string, attributes: AttributeDTO[], enabled: boolean): Observable<LocationDTO>;
   deleteLocation(entityUuid: string, uuid: string): Observable<void>;

   enableLocation(entityUuid: string, uuid: string): Observable<void>;
   disableLocation(entityUuid: string, uuid: string): Observable<void>;

   syncLocation(entityUuid: string, uuid: string): Observable<LocationDTO>;

   getPushAttributes(entityUuid: string, uuid: string): Observable<AttributeDescriptorDTO[]>;
   getCSRAttributes(entityUuid: string, uuid: string): Observable<AttributeDescriptorDTO[]>;

   pushCertificate(entityUuid: string, locationUuid: string, certificateUuid: string, pushAttributes: AttributeDTO[]): Observable<LocationDTO>;
   issueCertificate(entityUuid: string, locationUuid: string, raProfileUuid: string, csrAttributes: AttributeDTO[], issueAttributes: AttributeDTO[]): Observable<LocationDTO>;
   autoRenewCertificate(entityUuid: string, locationUuid: string, certificateUuid: string): Observable<LocationDTO>;

   removeCertificate(entityUuid: string, locationUuid: string, certificateUuid: string): Observable<LocationDTO>;

}
