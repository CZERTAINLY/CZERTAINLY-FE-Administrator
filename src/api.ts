import {
    ACMEAccountManagementApi,
    ACMEProfileManagementApi,
    ApprovalInventoryApi,
    ApprovalProfileInventoryApi,
    AuditLogApi,
    AuthenticationManagementApi,
    AuthorityManagementApi,
    CBOMManagementApi,
    CMPProfileManagementApi,
    CallbackApi,
    CertificateInventoryApi,
    GroupManagementApi,
    ClientOperationsV2Api,
    ComplianceManagementV2Api,
    ComplianceProfileManagementV2Api,
    Configuration,
    ConnectorManagementApi,
    ConnectorManagementV2Api,
    CredentialManagementApi,
    CryptographicKeyManagementApi,
    CryptographicOperationsControllerApi,
    CustomAttributesApi,
    CustomOIDManagementApi,
    DiscoveryManagementApi,
    EntityManagementApi,
    EnumsApi,
    ExternalNotificationManagementApi,
    GlobalMetadataApi,
    InfoApi,
    InternalNotificationApi,
    LocationManagementApi,
    NotificationProfileInventoryApi,
    ProxyManagementApi,
    OAuth2LoginManagementV2Api,
    RAProfileManagementApi,
    ResourceManagementApi,
    RoleManagementApi,
    SCEPProfileManagementApi,
    ScheduledJobsManagementApi,
    SettingsApi,
    StatisticsDashboardApi,
    TokenProfileManagementApi,
    UserManagementApi,
    WorkflowActionsManagementApi,
    WorkflowRulesManagementApi,
    WorkflowTriggersManagementApi,
    SecretManagementApi,
    VaultInstanceManagementApi,
    VaultProfileManagementApi,
    TrustedCertificateManagementApi,
} from 'types/openapi';
import { TokenInstanceControllerApi } from 'types/openapi/apis/TokenInstanceControllerApi';
import {
    ActuatorApi,
    CertificateUtilsAPIApi,
    CertificationRequestUtilsAPIApi,
    Configuration as ConfigurationUtils,
    OIDUtilsAPIApi,
} from 'types/openapi/utils';

const apiUrl = typeof window !== 'undefined' ? window?.__ENV__?.API_URL || '/api' : '/api';
const configuration = new Configuration({ basePath: apiUrl });

export interface ApiClients {
    auth: AuthenticationManagementApi;
    users: UserManagementApi;
    roles: RoleManagementApi;
    actions: WorkflowActionsManagementApi;
    rules: WorkflowRulesManagementApi;
    triggers: WorkflowTriggersManagementApi;
    auditLogs: AuditLogApi;
    raProfiles: RAProfileManagementApi;
    credentials: CredentialManagementApi;
    connectors: ConnectorManagementApi;
    connectorsV2: ConnectorManagementV2Api;
    proxies: ProxyManagementApi;
    callback: CallbackApi;
    statisticsDashboard: StatisticsDashboardApi;
    authorities: AuthorityManagementApi;
    cbomManagement: CBOMManagementApi;
    entities: EntityManagementApi;
    resources: ResourceManagementApi;
    locations: LocationManagementApi;
    login: OAuth2LoginManagementV2Api;
    notificationProfiles: NotificationProfileInventoryApi;
    certificates: CertificateInventoryApi;
    acmeAccounts: ACMEAccountManagementApi;
    acmeProfiles: ACMEProfileManagementApi;
    scepProfiles: SCEPProfileManagementApi;
    cmpProfiles: CMPProfileManagementApi;
    certificateGroups: GroupManagementApi;
    clientOperations: ClientOperationsV2Api;
    discoveries: DiscoveryManagementApi;
    complianceProfile: ComplianceProfileManagementV2Api;
    complianceManagement: ComplianceManagementV2Api;
    customAttributes: CustomAttributesApi;
    globalMetadata: GlobalMetadataApi;
    settings: SettingsApi;
    scheduler: ScheduledJobsManagementApi;
    approvalProfiles: ApprovalProfileInventoryApi;
    approvals: ApprovalInventoryApi;
    internalNotificationApi: InternalNotificationApi;
    externalNotificationManagementApi: ExternalNotificationManagementApi;
    enums: EnumsApi;
    info: InfoApi;
    tokenInstances: TokenInstanceControllerApi;
    tokenProfiles: TokenProfileManagementApi;
    cryptographicKeys: CryptographicKeyManagementApi;
    cryptographicOperations: CryptographicOperationsControllerApi;
    trustedCertificates: TrustedCertificateManagementApi;
    utilsOid?: OIDUtilsAPIApi;
    utilsActuator?: ActuatorApi;
    utilsCertificate?: CertificateUtilsAPIApi;
    utilsCertificateRequest?: CertificationRequestUtilsAPIApi;
    oids: CustomOIDManagementApi;
    vaults: VaultInstanceManagementApi;
    vaultProfiles: VaultProfileManagementApi;
    secrets: SecretManagementApi;
}

type ApiClientKey = keyof ApiClients;

const factories: Partial<Record<ApiClientKey, () => unknown>> = {
    auth: () => new AuthenticationManagementApi(configuration),
    users: () => new UserManagementApi(configuration),
    roles: () => new RoleManagementApi(configuration),
    actions: () => new WorkflowActionsManagementApi(configuration),
    rules: () => new WorkflowRulesManagementApi(configuration),
    triggers: () => new WorkflowTriggersManagementApi(configuration),
    certificates: () => new CertificateInventoryApi(configuration),
    auditLogs: () => new AuditLogApi(configuration),
    raProfiles: () => new RAProfileManagementApi(configuration),
    credentials: () => new CredentialManagementApi(configuration),
    authorities: () => new AuthorityManagementApi(configuration),
    cbomManagement: () => new CBOMManagementApi(configuration),
    entities: () => new EntityManagementApi(configuration),
    resources: () => new ResourceManagementApi(configuration),
    locations: () => new LocationManagementApi(configuration),
    login: () => new OAuth2LoginManagementV2Api(configuration),
    notificationProfiles: () => new NotificationProfileInventoryApi(configuration),
    connectors: () => new ConnectorManagementApi(configuration),
    connectorsV2: () => new ConnectorManagementV2Api(configuration),
    proxies: () => new ProxyManagementApi(configuration),
    callback: () => new CallbackApi(configuration),
    statisticsDashboard: () => new StatisticsDashboardApi(configuration),
    acmeAccounts: () => new ACMEAccountManagementApi(configuration),
    acmeProfiles: () => new ACMEProfileManagementApi(configuration),
    scepProfiles: () => new SCEPProfileManagementApi(configuration),
    cmpProfiles: () => new CMPProfileManagementApi(configuration),
    certificateGroups: () => new GroupManagementApi(configuration),
    clientOperations: () => new ClientOperationsV2Api(configuration),
    discoveries: () => new DiscoveryManagementApi(configuration),
    complianceProfile: () => new ComplianceProfileManagementV2Api(configuration),
    complianceManagement: () => new ComplianceManagementV2Api(configuration),
    customAttributes: () => new CustomAttributesApi(configuration),
    globalMetadata: () => new GlobalMetadataApi(configuration),
    settings: () => new SettingsApi(configuration),
    scheduler: () => new ScheduledJobsManagementApi(configuration),
    approvalProfiles: () => new ApprovalProfileInventoryApi(configuration),
    approvals: () => new ApprovalInventoryApi(configuration),
    internalNotificationApi: () => new InternalNotificationApi(configuration),
    externalNotificationManagementApi: () => new ExternalNotificationManagementApi(configuration),
    enums: () => new EnumsApi(configuration),
    info: () => new InfoApi(configuration),
    tokenInstances: () => new TokenInstanceControllerApi(configuration),
    tokenProfiles: () => new TokenProfileManagementApi(configuration),
    cryptographicKeys: () => new CryptographicKeyManagementApi(configuration),
    cryptographicOperations: () => new CryptographicOperationsControllerApi(configuration),
    oids: () => new CustomOIDManagementApi(configuration),
    trustedCertificates: () => new TrustedCertificateManagementApi(configuration),
    vaults: () => new VaultInstanceManagementApi(configuration),
    vaultProfiles: () => new VaultProfileManagementApi(configuration),
    secrets: () => new SecretManagementApi(configuration),
};

const overrides: Partial<Record<ApiClientKey, unknown>> = {};
const cache = new Map<ApiClientKey, unknown>();

export const backendClient: ApiClients = new Proxy({} as ApiClients, {
    get(_target, prop: string | symbol) {
        const key = prop as ApiClientKey;
        if (key in overrides) return overrides[key];
        if (cache.has(key)) return cache.get(key);
        const factory = factories[key];
        if (factory) {
            const instance = factory();
            cache.set(key, instance);
            return instance;
        }
        return undefined;
    },
    set(_target, prop: string | symbol, value) {
        const key = prop as ApiClientKey;
        overrides[key] = value;
        return true;
    },
    has(_target, prop: string | symbol) {
        const key = prop as ApiClientKey;
        return key in overrides || cache.has(key) || key in factories;
    },
});

export const updateBackendUtilsClients = (url: string | undefined) => {
    if (url && url !== '') {
        const configuration = new ConfigurationUtils({ basePath: url });
        backendClient.utilsCertificate = new CertificateUtilsAPIApi(configuration);
        backendClient.utilsOid = new OIDUtilsAPIApi(configuration);
        backendClient.utilsCertificateRequest = new CertificationRequestUtilsAPIApi(configuration);
        backendClient.utilsActuator = new ActuatorApi(configuration);
    } else {
        backendClient.utilsCertificate = undefined;
        backendClient.utilsOid = undefined;
        backendClient.utilsCertificateRequest = undefined;
        backendClient.utilsActuator = undefined;
    }
};
