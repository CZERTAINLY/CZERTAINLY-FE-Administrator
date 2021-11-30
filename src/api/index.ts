import { AuthApi, AuthBackend, AuthMock } from "./auth";
import {
  AdministratorManagementApi,
  AdministratorsManagementBackend,
  AdministatorManagementMock,
} from "./administrators";
import { AuditLogsApi, AuditLogsBackend, AuditLogsMock } from "./auditLogs";
import {
  ClientManagementApi,
  ClientManagementBackend,
  ClientManagementMock,
} from "./clients";
import {
  ProfilesManagementApi,
  ProfilesManagementBackend,
  ProfilesManagementMock,
} from "./profiles";
import {
  CredentialManagementApi,
  CredentialManagementBackend,
  CredentialManagementMock,
} from "./credentials";

import {
  AuthorityManagementApi,
  AuthorityManagementBackend,
  AuthorityManagementMock,
} from "./authorities";

import {
  ConnectorManagementApi,
  ConnectorManagementBackend,
  ConnectorManagementMock,
} from "./connectors";
import {
  CertificateManagementApi,
  CertificateManagementBackend,
  CertificateManagementMock,
} from "./certificates";

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
};
