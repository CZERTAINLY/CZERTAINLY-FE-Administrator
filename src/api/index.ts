import { AuditLogsApi, AuditLogsBackend, AuditLogsMock } from "./auditLogs";
import { UserManagementApi, UserManagementBackend, UserManagementMock } from "./users";
import { RolesManagementApi, RolesManagementBackend, RolesManagementMock } from "./roles";
import { ProfilesManagementApi, ProfilesManagementBackend, ProfilesManagementMock } from "./profiles";
import { CredentialManagementApi, CredentialManagementBackend, CredentialManagementMock } from "./credential";
import { EntityManagementApi, EntityManagementBackend, EntityManagementMock } from "./entity";
import { LocationManagementApi, LocationManagementBackend, LocationManagementMock } from "./location";
import { DashboardManagementApi, DashboardManagementBackend, DashboardManagementMock } from "./dashboard";
import { CertificateInventoryApi, CertificateInventoryBackend, CertificateInventoryMock } from "./certificates";
import { OperationsApi, OperationsBackend, OperationsMock } from "./operations";
import { AcmeAccountManagementApi, AcmeAccountManagementBackend, AcmeAccountManagementMock } from "./acme-account";
import { AcmeProfilesManagementApi, AcmeProfilesManagementBackend, AcmeProfilesManagementMock } from "./acme-profile";
import { GroupManagementApi, GroupManagementBackend, GroupManagementMock } from "./groups";
import { DiscoveryManagementApi, DiscoveryManagementBackend, DiscoveryManagementMock } from "./discovery";
import {
   ComplianceProfileManagementApi,
   ComplianceProfileManagementBackend,
   ComplianceProfileManagementMock
} from "./compliance-profile";
import { FetchHttpServiceImpl } from "utils/FetchHttpService";
import {
   AuthenticationManagementApi,
   AuthorityManagementApi,
   CallbackApi,
   Configuration,
   ConnectorManagementApi
} from "../types/openapi";


const fetchService = new FetchHttpServiceImpl((window as any).__ENV__.API_URL);
const configuration = new Configuration({ basePath: ((window as any).__ENV__.API_URL) });

export interface ApiClients {
   auth: AuthenticationManagementApi;
   users: UserManagementApi;
   roles: RolesManagementApi;
   auditLogs: AuditLogsApi;
   profiles: ProfilesManagementApi;
   credentials: CredentialManagementApi;
   connectors: ConnectorManagementApi;
   callback: CallbackApi;
   dashboard: DashboardManagementApi;
   authorities: AuthorityManagementApi;
   entities: EntityManagementApi;
   locations: LocationManagementApi;
   certificates: CertificateInventoryApi;
   acmeAccounts: AcmeAccountManagementApi;
   acmeProfiles: AcmeProfilesManagementApi;
   groups: GroupManagementApi;
   operations: OperationsApi;
   discoveries: DiscoveryManagementApi;
   complianceProfile: ComplianceProfileManagementApi;
}


export const backendClient: ApiClients = {
   auth: new AuthenticationManagementApi(configuration),
   users: new UserManagementBackend(fetchService),
   roles: new RolesManagementBackend(fetchService),
   certificates: new CertificateInventoryBackend(fetchService),
   auditLogs: new AuditLogsBackend(fetchService),
   profiles: new ProfilesManagementBackend(fetchService),
   credentials: new CredentialManagementBackend(fetchService),
   authorities: new AuthorityManagementApi(configuration),
   entities: new EntityManagementBackend(fetchService),
   locations: new LocationManagementBackend(fetchService),
   connectors: new ConnectorManagementApi(configuration),
   callback: new CallbackApi(configuration),
   dashboard: new DashboardManagementBackend(fetchService),
   acmeAccounts: new AcmeAccountManagementBackend(fetchService),
   acmeProfiles: new AcmeProfilesManagementBackend(fetchService),
   groups: new GroupManagementBackend(fetchService),
   operations: new OperationsBackend(fetchService),
   discoveries: new DiscoveryManagementBackend(fetchService),
   complianceProfile: new ComplianceProfileManagementBackend(fetchService),
};


export const mockClient: Partial<ApiClients> = {
   // auth: new AuthMock(),
   users: new UserManagementMock(),
   roles: new RolesManagementMock(),
   certificates: new CertificateInventoryMock(),
   auditLogs: new AuditLogsMock(),
   profiles: new ProfilesManagementMock(),
   credentials: new CredentialManagementMock(),
   // authorities: new AuthorityManagementMock(),
   entities: new EntityManagementMock(),
   locations: new LocationManagementMock(),
   // connectors: new ConnectorManagementMock(),
   dashboard: new DashboardManagementMock(),
   acmeAccounts: new AcmeAccountManagementMock(),
   acmeProfiles: new AcmeProfilesManagementMock(),
   groups: new GroupManagementMock(),
   operations: new OperationsMock(),
   discoveries: new DiscoveryManagementMock(),
   complianceProfile: new ComplianceProfileManagementMock(),
};
