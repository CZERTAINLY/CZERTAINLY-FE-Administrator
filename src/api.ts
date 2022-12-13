import {
   ACMEAccountManagementApi,
   ACMEProfileManagementApi, AuditLogApi,
   AuthenticationManagementApi,
   AuthorityManagementApi,
   CallbackApi,
   CertificateGroupApi, CertificateInventoryApi,
   ClientOperationsV2Api, ComplianceProfileManagementApi,
   Configuration,
   ConnectorManagementApi, CredentialManagementApi, DiscoveryManagementApi,
   EntityManagementApi,
   LocationManagementApi,
   RAProfileManagementApi,
   RoleManagementApi,
   StatisticsDashboardApi,
   UserManagementApi
} from "types/openapi";


const configuration = new Configuration({ basePath: ((window as any).__ENV__.API_URL) });

export interface ApiClients {
   auth: AuthenticationManagementApi;
   users: UserManagementApi;
   roles: RoleManagementApi;
   auditLogs: AuditLogApi;
   raProfiles: RAProfileManagementApi;
   credentials: CredentialManagementApi;
   connectors: ConnectorManagementApi;
   callback: CallbackApi;
   statisticsDashboard: StatisticsDashboardApi;
   authorities: AuthorityManagementApi;
   entities: EntityManagementApi;
   locations: LocationManagementApi;
   certificates: CertificateInventoryApi;
   acmeAccounts: ACMEAccountManagementApi;
   acmeProfiles: ACMEProfileManagementApi;
   certificateGroups: CertificateGroupApi;
   clientOperations: ClientOperationsV2Api;
   discoveries: DiscoveryManagementApi;
   complianceProfile: ComplianceProfileManagementApi;
}


export const backendClient: ApiClients = {
   auth: new AuthenticationManagementApi(configuration),
   users: new UserManagementApi(configuration),
   roles: new RoleManagementApi(configuration),
   certificates: new CertificateInventoryApi(configuration),
   auditLogs: new AuditLogApi(configuration),
   raProfiles: new RAProfileManagementApi(configuration),
   credentials: new CredentialManagementApi(configuration),
   authorities: new AuthorityManagementApi(configuration),
   entities: new EntityManagementApi(configuration),
   locations: new LocationManagementApi(configuration),
   connectors: new ConnectorManagementApi(configuration),
   callback: new CallbackApi(configuration),
   statisticsDashboard: new StatisticsDashboardApi(configuration),
   acmeAccounts: new ACMEAccountManagementApi(configuration),
   acmeProfiles: new ACMEProfileManagementApi(configuration),
   certificateGroups: new CertificateGroupApi(configuration),
   clientOperations: new ClientOperationsV2Api(configuration),
   discoveries: new DiscoveryManagementApi(configuration),
   complianceProfile: new ComplianceProfileManagementApi(configuration),
};
