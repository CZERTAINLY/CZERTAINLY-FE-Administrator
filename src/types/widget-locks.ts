export enum LockTypeEnum {
    GENERIC = "GENERIC",
    NETWORK = "NETWORK",
    PERMISSION = "PERMISSION",
    CLIENT = "CLIENT",
    SERVICE_ERROR = "SERVICE_ERROR",
    SERVER_ERROR = "SERVER_ERROR",
}

export const ErrorCodeMessageMap = {
    ACCESS_DENIED: "Access Denied",
};

export enum LockWidgetNameEnum {
    CryptographicKeysList = "CryptographicKeysList",
    ConnectorStoreList = "ConnectorStoreList",
}

export interface WidgetLockModel {
    widgetName: LockWidgetNameEnum;
    errorMessage: string;
    errorDetails: string;
    lockType: LockTypeEnum;
}

export interface ErrorMessageObjectModel {
    errorMessage: string;
    errorDetails: string;
    lockType: LockTypeEnum;
}
