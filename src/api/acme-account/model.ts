import { Observable } from "rxjs";

export interface AcmeAccountListResponse {
  accountId: string;
  uuid: string;
  totalOrders: number;
  status?: string | "";
  raProfileName: string;
  acmeProfileName: string;
  enabled: boolean;
}

export interface AcmeAccountDetailResponse {
  accountId: string;
  uuid: string;
  totalOrders: number;
  successfulOrders: number;
  failedOrders: number;
  pendingOrders: number;
  validOrders: number;
  processingOrders: number;
  status: string;
  contact: string[];
  termsOfServiceAgreed: boolean;
  raProfileName: string;
  raProfileUuid: string;
  acmeProfileName: string;
  acmeProfileUuid: string;
  enabled: boolean;
}

export interface AcmeAccountManagementApi {
  getAcmeAccountList(): Observable<AcmeAccountListResponse[]>;
  getAcmeDetails(uuid: string | number): Observable<AcmeAccountDetailResponse>;
  deleteAcmeAccount(uuid: string | number): Observable<void>;
  enableAcmeAccount(uuid: string | number): Observable<void>;
  disableAcmeAccount(uuid: string | number): Observable<void>;
  bulkDeleteAcmeAccount(uuids: (string | number)[]): Observable<void>;
  bulkEnableAcmeAccount(uuids: (string | number)[]): Observable<void>;
  bulkDisableAcmeAccount(uuids: (string | number)[]): Observable<void>;
}
