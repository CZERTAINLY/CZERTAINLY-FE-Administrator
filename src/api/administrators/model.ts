import { CertificateDetailResponse } from "models";
import { Observable } from "rxjs";

export interface AdminDetailResponse {
  certificate: CertificateDetailResponse;
  name: string;
  surname: string;
  username: string;
  email: string;
  description: string;
  role: string;
  enabled: boolean;
  serialNumber?: string;
}

export interface AdminInfoResponse {
  uuid: string;
  name: string;
  surname: string;
  username: string;
  certificate: CertificateDetailResponse;
  role: string;
  enabled: boolean;
  serialNumber?: string;
}

export interface AdministratorManagementApi {
  createAdmin(
    name: string,
    surname: string,
    username: string,
    email: string,
    certificate: string,
    description: string,
    role: string,
    enabled: boolean,
    certificateUuid: string
  ): Observable<string>;
  deleteAdmin(uuid: string): Observable<void>;
  disableAdmin(uuid: string): Observable<void>;
  enableAdmin(uuid: string): Observable<void>;
  bulkDeleteAdmin(uuid: string[]): Observable<void>;
  bulkDisableAdmin(uuid: string[]): Observable<void>;
  bulkEnableAdmin(uuid: string[]): Observable<void>;
  getAdminDetail(uuid: string): Observable<AdminDetailResponse>;
  getAdminsList(): Observable<AdminInfoResponse[]>;
  updateAdmin(
    uuid: string,
    name: string,
    surname: string,
    username: string,
    email: string,
    certificate: string | undefined,
    description: string,
    role: string,
    certificateUuid: string
  ): Observable<AdminDetailResponse>;
}
