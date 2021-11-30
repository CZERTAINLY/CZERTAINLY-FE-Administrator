import { CertificateDetailResponse } from "models";
import { Observable } from "rxjs";

export interface ClientInfoResponse {
  uuid: string;
  name: string;
  certificate?: CertificateDetailResponse;
  enabled: boolean;
}

export interface ClientDetailResponse {
  uuid: string;
  enabled: boolean;
  serialNumber: string;
  certificate?: CertificateDetailResponse;
  name?: string;
  description?: string;
}

export interface ClientAuthorizationsReponse {
  uuid: string;
  name: string;
}

export interface ClientManagementApi {
  authorizeProfile(clientId: string, profileId: string): Observable<void>;
  createNewClient(
    name: string,
    clientCertificate: string,
    description: string,
    enabled: boolean,
    certificateUuid: string
  ): Observable<string>;
  deleteClient(uuid: string): Observable<void>;
  enableClient(uuid: string): Observable<void>;
  disableClient(uuid: string): Observable<void>;
  bulkDeleteClient(uuid: string[]): Observable<void>;
  bulkEnableClient(uuid: string[]): Observable<void>;
  bulkDisableClient(uuid: string[]): Observable<void>;
  getClientsList(): Observable<ClientInfoResponse[]>;
  getClientDetail(uuid: string): Observable<ClientDetailResponse>;
  getClientAuth(uuid: string): Observable<ClientAuthorizationsReponse[]>;
  unauthorizeProfile(clientId: string, profileId: string): Observable<void>;
  updateClient(
    uuid: string,
    clientCertificate: string | undefined,
    description: string,
    certificateUuid: string
  ): Observable<ClientDetailResponse>;
}
