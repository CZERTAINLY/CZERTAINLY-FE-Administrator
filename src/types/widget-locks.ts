export enum LockTypeEnum {
    GENERIC,
    NETWORK,
    PERMISSION,
    CLIENT,
    SERVICE_ERROR,
    SERVER_ERROR,
}

export const ErrorCodeTexteMap = {
    ACCESS_DENIED: "Access Denied",
    ENTITY_NOT_FOUND: "Not Found",
    ENTITY_NOT_UNIQUE: "Not Unique",
    INVALID_ACTION: "Invalid Action",
    INVALID_FORMAT: "Invalid Format",
    UNAUTHORIZED: "Unauthorized",
    INTERNAL_SERVER_ERROR: "Internal Server Error",
    NOT_IMPLEMENTED: "Not Implemented",
    BAD_REQUEST: "Bad Request",
    NOT_FOUND: "Not Found",
};

export const ErrorCodeDetailMap = {
    ACCESS_DENIED: "Please contact your admin to get access",
};
export enum LockWidgetNameEnum {
    ListOfCertificates,
    ListOfKeys,
    DiscoveriesStore,
    ConnectorStore,
    ListOfUsers,
    ListOfRoles,
    ListOfRAProfiles,
    ListOfTokenProfiles,
    ListOfComplianceProfiles,
    CredentialStore,
    AuthorityStore,
    TokenStore,
    ListOfGroups,
    EntityStore,
    LocationsStore,
    ListOfACMEAccounts,
    ListOfACMEProfiles,
    ListOfSCEPProfiles,
    PlatformSettings,
    ListOfCustomAttributes,
    ListOfGlobalMetadata,
    AuditLogs,
    ListOfScheduler,
    ListOfSchedulerHistory,
    SchedulerJobDetail,
}

export interface WidgetLockModel {
    widgetName: LockWidgetNameEnum;
    lockTitle: string;
    lockText: string;
    lockDetails?: string;
    lockType: LockTypeEnum;
}

export interface ErrorMessageObjectModel {
    lockTitle: string;
    lockText: string;
    lockDetails?: string;
    lockType: LockTypeEnum;
}
