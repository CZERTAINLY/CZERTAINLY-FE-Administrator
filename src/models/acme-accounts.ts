import { AcmeAccountStatus } from "api/acme-account";

export interface AcmeAccountListModel {
   accountId: string;
   uuid: string;
   enabled: boolean;
   totalOrders: number;
   status: AcmeAccountStatus;
   raProfileName: string;
   acmeProfileName: string;
}

export interface AcmeAccountModel {
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