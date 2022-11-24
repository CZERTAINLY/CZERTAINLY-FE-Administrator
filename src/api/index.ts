import { AuditLogsApi, AuditLogsBackend, AuditLogsMock } from "./auditLogs";
import { CredentialManagementApi, CredentialManagementBackend, CredentialManagementMock } from "./credential";
import { CertificateInventoryApi, CertificateInventoryBackend, CertificateInventoryMock } from "./certificates";
import { DiscoveryManagementApi, DiscoveryManagementBackend, DiscoveryManagementMock } from "./discovery";
import {
   ComplianceProfileManagementApi,
   ComplianceProfileManagementBackend,
   ComplianceProfileManagementMock
} from "./compliance-profile";
import { FetchHttpServiceImpl } from "utils/FetchHttpService";
import {
   ACMEAccountManagementApi,
   ACMEProfileManagementApi,
   AuthenticationManagementApi,
   AuthorityManagementApi,
   CallbackApi,
   CertificateGroupApi,
   ClientOperationsV2Api,
   Configuration,
   ConnectorManagementApi,
   EntityManagementApi,
   LocationManagementApi,
   RAProfileManagementApi,
   RoleManagementApi,
   StatisticsDashboardApi,
   UserManagementApi
} from "types/openapi";


const fetchService = new FetchHttpServiceImpl((window as any).__ENV__.API_URL);
const configuration = new Configuration({ basePath: ((window as any).__ENV__.API_URL) });

export interface ApiClients {
   auth: AuthenticationManagementApi;
   users: UserManagementApi;
   roles: RoleManagementApi;
   auditLogs: AuditLogsApi;
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
   certificates: new CertificateInventoryBackend(fetchService),
   auditLogs: new AuditLogsBackend(fetchService),
   raProfiles: new RAProfileManagementApi(configuration),
   credentials: new CredentialManagementBackend(fetchService),
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
   discoveries: new DiscoveryManagementBackend(fetchService),
   complianceProfile: new ComplianceProfileManagementBackend(fetchService),
};


export const mockClient: Partial<ApiClients> = {
   // auth: new AuthMock(),
   // users: new UserManagementMock(),
   // roles: new RolesManagementMock(),
   certificates: new CertificateInventoryMock(),
   auditLogs: new AuditLogsMock(),
   // profiles: new ProfilesManagementMock(),
   credentials: new CredentialManagementMock(),
   // authorities: new AuthorityManagementMock(),
   // entities: new EntityManagementMock(),
   // locations: new LocationManagementMock(),
   // connectors: new ConnectorManagementMock(),
   // statisticsDashboard: new DashboardManagementMock(),
   // acmeAccounts: new AcmeAccountManagementMock(),
   // acmeProfiles: new AcmeProfilesManagementMock(),
   // groups: new GroupManagementMock(),
   // operations: new OperationsMock(),
   discoveries: new DiscoveryManagementMock(),
   complianceProfile: new ComplianceProfileManagementMock(),
};
