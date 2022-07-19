import { Observable } from "rxjs";

export type AcmeAccountStatus = "valid" | "deactivated" | "revoked"

export interface AcmeAccountListItemDTO {
   accountId: string;
   uuid: string;
   enabled: boolean;
   totalOrders: number;
   status: AcmeAccountStatus;
   raProfileName: string;
   acmeProfileName: string;
}

export interface AcmeAccountDTO {
   accountId: string;
   uuid: string;
   enabled: boolean;
   totalOrders: number;
   successfulOrders: number;
   failedOrders: number;
   pendingOrders: number;
   validOrders: number;
   processingOrders: number;
   status: AcmeAccountStatus;
   contact: string[];
   termsOfServiceAgreed: boolean;
   raProfileName: string;
   raProfileUuid: string;
   acmeProfileName: string;
   acmeProfileUuid: string;
}

export interface AcmeAccountManagementApi {
   enableAcmeAccount(uuid: string): Observable<void>;
   disableAcmeAccount(uuid: string): Observable<void>;
   bulkRevokeAcmeAccount(uuids: string[]): Observable<void>;
   bulkEnableAcmeAccount(uuids: string[]): Observable<void>;
   bulkDisableAcmeAccount(uuids: string[]): Observable<void>;
   getAcmeAccountDetails(uuid: string): Observable<AcmeAccountDTO>;
   revokeAcmeAccount(uuid: string): Observable<void>;
   getAcmeAccountList(): Observable<AcmeAccountListItemDTO[]>;
}
