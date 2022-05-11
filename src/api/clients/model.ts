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


export interface ClientAuthorizationsDTO {
   uuid: string;
   name: string;
   enabled: boolean;
}


export interface ClientManagementApi {

   unauthorizeClient(clientId: string, profileId: string): Observable<void>;

   enableClient(uuid: string): Observable<void>;

   disableClient(uuid: string): Observable<void>;

   authorizeClient(clientId: string, profileId: string): Observable<void>;

   bulkEnableClient(uuids: string[]): Observable<void>;

   bulkDisableClient(uuids: string[]): Observable<void>;

   getClientDetail(uuid: string): Observable<ClientDTO>;

   updateClient(uuid: string, certificate?: string, description?: string, certificateUuid?: string): Observable<ClientDTO>;

   deleteClient(uuid: string): Observable<void>;

   getClientsList(): Observable<ClientDTO[]>;

   createNewClient(name: string, description?: string, enabled?: boolean, certificate?: string, certificateUuid?: string): Observable<string>;

   bulkDeleteClient(uuids: string[]): Observable<void>;

   getClientAuth(uuid: string): Observable<ClientAuthorizationsDTO[]>;


}
