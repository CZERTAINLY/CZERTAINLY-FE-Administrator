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
   supportKeyMannagement: boolean;
   certificates: LocationCertificateDTO[];
   metadata?: { [key: string]: any };
}


export interface LocationManagementApi {

   listLocations(enabled?: boolean): Observable<LocationDTO[]>;

   getLocationDetail(uuid: string): Observable<LocationDTO>;
   addLocation(entityUuid: string, name: string, description: string, attributes: AttributeDTO[], enabled: boolean): Observable<string>;
   editLocation(uuid: string, entityUuid: string, description: string, attributes: AttributeDTO[], enabled: boolean): Observable<LocationDTO>;
   deleteLocation(uuid: string): Observable<void>;

   enableLocation(uuid: string): Observable<void>;
   disableLocation(uuid: string): Observable<void>;

   syncLocation(uuid: string): Observable<LocationDTO>;

   getPushAttributes(uuid: string): Observable<AttributeDescriptorDTO[]>;
   getCSRAttributes(uuid: string): Observable<AttributeDescriptorDTO[]>;

   pushCertificate(locationUuid: string, certificateUuid: string, pushAttributes: AttributeDTO[]): Observable<LocationDTO>;
   issueCertificate(locationUuid: string, raProfileUuid: string, csrAttributes: AttributeDTO[], issueAttributes: AttributeDTO[]): Observable<LocationDTO>;
   autoRenewCertificate(locationUuid: string, certificateUuid: string): Observable<LocationDTO>;

   removeCertificate(locationUuid: string, certificateUuid: string): Observable<LocationDTO>;

}
