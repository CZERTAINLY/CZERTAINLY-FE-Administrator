import { AuthApi, AuthBackend, AuthMock } from "./auth";
import { AuditLogsApi, AuditLogsBackend, AuditLogsMock } from "./auditLogs";
import { UserManagementApi, UserManagementBackend, UserManagementMock } from "./users";
import { ProfilesManagementApi, ProfilesManagementBackend, ProfilesManagementMock } from "./profiles";
import { CredentialManagementApi, CredentialManagementBackend, CredentialManagementMock } from "./credential";
import { AuthorityManagementApi, AuthorityManagementBackend, AuthorityManagementMock } from "./authority";
import { EntityManagementApi, EntityManagementBackend, EntityManagementMock } from "./entity";
import { LocationManagementApi, LocationManagementBackend, LocationManagementMock } from "./location";
import { ConnectorManagementApi, ConnectorManagementBackend, ConnectorManagementMock } from "./connectors";
import { DashboardManagementApi, DashboardManagementBackend, DashboardManagementMock } from "./dashboard";
import { CertificateInventoryApi, CertificateInventoryBackend, CertificateInventoryMock } from "./certificates";
import { OperationsApi, OperationsBackend, OperationsMock } from "./operations";
import { AcmeAccountManagementApi, AcmeAccountManagementBackend, AcmeAccountManagementMock } from "./acme-account";
import { AcmeProfilesManagementApi, AcmeProfilesManagementBackend, AcmeProfilesManagementMock } from "./acme-profile";
import { GroupManagementApi, GroupManagementBackend, GroupManagementMock } from "./groups";
import { DiscoveryManagementApi, DiscoveryManagementBackend, DiscoveryManagementMock } from "./discovery";
import { ComplianceProfileManagementApi, ComplianceProfileManagementBackend, ComplianceProfileManagementMock } from "./compliance-profile";

export interface ApiClients {
   auth: AuthApi;
   users: UserManagementApi;
   auditLogs: AuditLogsApi;
   profiles: ProfilesManagementApi;
   credentials: CredentialManagementApi;
   connectors: ConnectorManagementApi;
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
   auth: new AuthBackend(),
   users: new UserManagementBackend(),
   certificates: new CertificateInventoryBackend(),
   auditLogs: new AuditLogsBackend(),
   profiles: new ProfilesManagementBackend(),
   credentials: new CredentialManagementBackend(),
   authorities: new AuthorityManagementBackend(),
   entities: new EntityManagementBackend(),
   locations: new LocationManagementBackend(),
   connectors: new ConnectorManagementBackend(),
   dashboard: new DashboardManagementBackend(),
   acmeAccounts: new AcmeAccountManagementBackend(),
   acmeProfiles: new AcmeProfilesManagementBackend(),
   groups: new GroupManagementBackend(),
   operations: new OperationsBackend(),
   discoveries: new DiscoveryManagementBackend(),
   complianceProfile: new ComplianceProfileManagementBackend(),
};

export const mockClient: ApiClients = {
   auth: new AuthMock(),
   users: new UserManagementMock(),
   certificates: new CertificateInventoryMock(),
   auditLogs: new AuditLogsMock(),
   profiles: new ProfilesManagementMock(),
   credentials: new CredentialManagementMock(),
   authorities: new AuthorityManagementMock(),
   entities: new EntityManagementMock(),
   locations: new LocationManagementMock(),
   connectors: new ConnectorManagementMock(),
   dashboard: new DashboardManagementMock(),
   acmeAccounts: new AcmeAccountManagementMock(),
   acmeProfiles: new AcmeProfilesManagementMock(),
   groups: new GroupManagementMock(),
   operations: new OperationsMock(),
   discoveries: new DiscoveryManagementMock(),
   complianceProfile: new ComplianceProfileManagementMock(),
};
