import CredentialForm from 'components/_pages/credentials/form';

export enum LockTypeEnum {
    GENERIC,
    NETWORK,
    PERMISSION,
    CLIENT,
    SERVICE_ERROR,
    SERVER_ERROR,
}

export const ErrorCodeTexteMap = {
    ACCESS_DENIED: 'Access Denied',
    ENTITY_NOT_FOUND: 'Not Found',
    ENTITY_NOT_UNIQUE: 'Not Unique',
    INVALID_ACTION: 'Invalid Action',
    INVALID_FORMAT: 'Invalid Format',
    UNAUTHORIZED: 'Unauthorized',
    INTERNAL_SERVER_ERROR: 'Internal Server Error',
    NOT_IMPLEMENTED: 'Not Implemented',
    BAD_REQUEST: 'Bad Request',
    NOT_FOUND: 'Not Found',
};

export const ErrorCodeDetailMap = {
    ACCESS_DENIED: 'Please contact your admin to get access',
};
export enum LockWidgetNameEnum {
    ConnectorAttributes,
    NotificationStore,
    ApprovalProfileDetails,
    ListOfApprovals,
    ListOfApprovalProfiles,
    ListOfCertificates,
    CertificateDetailsWidget,
    CertificateEventHistory,
    CertificationLocations,
    ListOfKeys,
    keyDetails,
    DiscoveriesStore,
    DiscoveryDetails,
    ConnectorStore,
    ConnectorDetails,
    ListOfUsers,
    UserDetails,
    ListOfRoles,
    RoleDetails,
    ListOfRAProfiles,
    RaProfileDetails,
    ListOfTokenProfiles,
    TokenProfileDetails,
    ListOfComplianceProfiles,
    ComplianceProfileDetails,
    RaProfileComplianceDetails,
    CredentialStore,
    CredentialDetails,
    AuthorityStore,
    CertificationAuthorityDetails,
    TokenStore,
    TokenDetails,
    ListOfGroups,
    GroupDetails,
    EntityStore,
    EntityDetails,
    LocationsStore,
    LocationDetails,
    ListOfACMEAccounts,
    ACMEAccountDetails,
    ListOfACMEProfiles,
    ACMEProfileDetails,
    ListOfSCEPProfiles,
    SCEPProfileDetails,
    PlatformSettings,
    ListOfCustomAttributes,
    CustomAttributeDetails,
    ListOfGlobalMetadata,
    GlobalMetadataDetails,
    AuditLogs,
    ListOfScheduler,
    ListOfSchedulerHistory,
    SchedulerJobDetail,
    ListOfNotifications,
    NotificationsOverview,
}

export interface WidgetLockModel {
    widgetName: LockWidgetNameEnum;
    lockTitle: string;
    lockText: string;
    lockDetails?: string;
    lockType: LockTypeEnum;
}

export interface WidgetLockErrorModel {
    lockTitle: string;
    lockText: string;
    lockDetails?: string;
    lockType: LockTypeEnum;
}

export interface GlobalModalModel {
    title?: string;
    size?: 'sm' | 'lg';
    content: string | JSX.Element | undefined;
    type?: 'success' | 'error' | 'warning' | 'info' | 'confirm' | 'question';
    isOpen: boolean;
    showCancelButton?: boolean;
    showOkButton?: boolean;
    okButtonCallback?: () => void;
    cancelButtonCallback?: () => void;
}

export interface AddNewAttributeType {
    name: string;
    content: JSX.Element;
}

export const AddNewAttributeList: AddNewAttributeType[] = [
    {
        name: 'credential',
        content: <CredentialForm usesGlobalModal />,
    },
];
