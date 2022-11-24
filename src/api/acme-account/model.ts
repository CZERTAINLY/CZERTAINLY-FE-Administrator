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
   acmeProfileUuid: string;
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
