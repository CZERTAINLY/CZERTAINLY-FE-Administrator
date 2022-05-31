import { CertificateDTO } from "api/certificates";
import { Observable } from "rxjs";


export interface ClientDTO {
   uuid: string;
   name: string;
   enabled: boolean;
   serialNumber: string;
   certificate: CertificateDTO;
   description: string;
}


export interface AuthorizedRAProfileDTO {
   uuid: string;
   name: string;
   enabled: boolean;
}


export interface ClientManagementApi {

   unauthorizeClient(clientUuid: string, profileUuid: string): Observable<void>;

   enableClient(uuid: string): Observable<void>;

   disableClient(uuid: string): Observable<void>;

   authorizeClient(clientUuid: string, profileUuid: string): Observable<void>;

   bulkEnableClient(uuids: string[]): Observable<void>;

   bulkDisableClient(uuids: string[]): Observable<void>;

   getClientDetail(uuid: string): Observable<ClientDTO>;

   updateClient(uuid: string, description?: string, certificateUuid?: string, certificate?: CertificateDTO): Observable<ClientDTO>;

   deleteClient(uuid: string): Observable<void>;

   getClientsList(): Observable<ClientDTO[]>;

   createNewClient(name: string, description?: string, enabled?: boolean, certificateUuid?: string, certificate?: CertificateDTO): Observable<string>;

   bulkDeleteClient(uuids: string[]): Observable<void>;

   getAuthorizedProfiles(uuid: string): Observable<AuthorizedRAProfileDTO[]>;


}
