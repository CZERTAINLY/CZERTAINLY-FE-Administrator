import { AuthApi, AuthBackend, AuthMock } from "./auth";
import { AdministratorManagementApi, AdministratorsManagementBackend, AdministatorManagementMock, } from "./administrators";
import { AuditLogsApi, AuditLogsBackend, AuditLogsMock } from "./auditLogs";
import { ClientManagementApi, ClientManagementBackend, ClientManagementMock } from "./clients";
import { ProfilesManagementApi, ProfilesManagementBackend, ProfilesManagementMock } from "./profiles";
import { CredentialManagementApi, CredentialManagementBackend, CredentialManagementMock } from "./credential";
import { AuthorityManagementApi, AuthorityManagementBackend, AuthorityManagementMock } from "./authority";
import { ConnectorManagementApi, ConnectorManagementBackend, ConnectorManagementMock } from "./connectors";
<<<<<<< HEAD
import { CertificateInventoryApi, CertificateInventoryBackend, CertificateInventoryMock } from "./certificates";
=======
import { DashboardManagementApi, DashboardManagementBackend, DashboardManagementMock } from "./dashboard";
import { CertificateManagementApi, CertificateManagementBackend, CertificateManagementMock } from "./certificates";
>>>>>>> b0ce50b (Add dashboard to the FE)
import { AcmeAccountManagementApi, AcmeAccountManagementBackend, AcmeAccountManagementMock } from "./acme-account";
import { AcmeProfilesManagementApi, AcmeProfilesManagementBackend, AcmeProfilesManagementMock } from "./acme-profile";
import { GroupManagementApi, GroupManagementBackend, GroupManagementMock } from "./groups";

export interface ApiClients {
   auth: AuthApi;
   admins: AdministratorManagementApi;
   auditLogs: AuditLogsApi;
   clients: ClientManagementApi;
   profiles: ProfilesManagementApi;
   credentials: CredentialManagementApi;
   connectors: ConnectorManagementApi;
   dashboard: DashboardManagementApi;
   authorities: AuthorityManagementApi;
   certificates: CertificateInventoryApi;
   acmeAccounts: AcmeAccountManagementApi;
   acmeProfiles: AcmeProfilesManagementApi;
   groups: GroupManagementApi;
}

export const backendClient: ApiClients = {
   auth: new AuthBackend(),
   admins: new AdministratorsManagementBackend(),
   certificates: new CertificateInventoryBackend(),
   auditLogs: new AuditLogsBackend(),
   clients: new ClientManagementBackend(),
   profiles: new ProfilesManagementBackend(),
   credentials: new CredentialManagementBackend(),
   authorities: new AuthorityManagementBackend(),
   connectors: new ConnectorManagementBackend(),
   dashboard: new DashboardManagementBackend(),
   acmeAccounts: new AcmeAccountManagementBackend(),
   acmeProfiles: new AcmeProfilesManagementBackend(),
   groups: new GroupManagementBackend(),
};

export const mockClient: ApiClients = {
   auth: new AuthMock(),
   admins: new AdministatorManagementMock(),
   certificates: new CertificateInventoryMock(),
   auditLogs: new AuditLogsMock(),
   clients: new ClientManagementMock(),
   profiles: new ProfilesManagementMock(),
   credentials: new CredentialManagementMock(),
   authorities: new AuthorityManagementMock(),
   connectors: new ConnectorManagementMock(),
   dashboard: new DashboardManagementMock(),
   acmeAccounts: new AcmeAccountManagementMock(),
   acmeProfiles: new AcmeProfilesManagementMock(),
   groups: new GroupManagementMock(),
};
