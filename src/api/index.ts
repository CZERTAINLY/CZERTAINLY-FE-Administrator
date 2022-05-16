import { AuthApi, AuthBackend, AuthMock } from "./auth";
import { AdministratorManagementApi, AdministratorsManagementBackend, AdministatorManagementMock, } from "./administrators";
import { AuditLogsApi, AuditLogsBackend, AuditLogsMock } from "./auditLogs";
import { ClientManagementApi, ClientManagementBackend, ClientManagementMock } from "./clients";
import { ProfilesManagementApi, ProfilesManagementBackend, ProfilesManagementMock } from "./profiles";
import { CredentialManagementApi, CredentialManagementBackend, CredentialManagementMock } from "./credential";
import { AuthorityManagementApi, AuthorityManagementBackend, AuthorityManagementMock } from "./authority";
import { ConnectorManagementApi, ConnectorManagementBackend, ConnectorManagementMock } from "./connectors";
import { CertificateManagementApi, CertificateManagementBackend, CertificateManagementMock } from "./certificates";
import { AcmeAccountManagementApi, AcmeAccountManagementBackend, AcmeAccountManagementMock } from "./acme-account";
import { AcmeProfilesManagementApi, AcmeProfilesManagementBackend, AcmeProfilesManagementMock } from "./acme-profile";

export interface ApiClients {
   auth: AuthApi;
   admins: AdministratorManagementApi;
   auditLogs: AuditLogsApi;
   clients: ClientManagementApi;
   profiles: ProfilesManagementApi;
   credentials: CredentialManagementApi;
   connectors: ConnectorManagementApi;
   authorities: AuthorityManagementApi;
   certificates: CertificateManagementApi;
   acmeAccounts: AcmeAccountManagementApi;
   acmeProfiles: AcmeProfilesManagementApi;
}

export const backendClient: ApiClients = {
   auth: new AuthBackend(),
   admins: new AdministratorsManagementBackend(),
   certificates: new CertificateManagementBackend(),
   auditLogs: new AuditLogsBackend(),
   clients: new ClientManagementBackend(),
   profiles: new ProfilesManagementBackend(),
   credentials: new CredentialManagementBackend(),
   authorities: new AuthorityManagementBackend(),
   connectors: new ConnectorManagementBackend(),
   acmeAccounts: new AcmeAccountManagementBackend(),
   acmeProfiles: new AcmeProfilesManagementBackend(),
};

export const mockClient: ApiClients = {
   auth: new AuthMock(),
   admins: new AdministatorManagementMock(),
   certificates: new CertificateManagementMock(),
   auditLogs: new AuditLogsMock(),
   clients: new ClientManagementMock(),
   profiles: new ProfilesManagementMock(),
   credentials: new CredentialManagementMock(),
   authorities: new AuthorityManagementMock(),
   connectors: new ConnectorManagementMock(),
   acmeAccounts: new AcmeAccountManagementMock(),
   acmeProfiles: new AcmeProfilesManagementMock(),
};
