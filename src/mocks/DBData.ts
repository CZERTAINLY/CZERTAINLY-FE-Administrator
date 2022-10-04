import { DbUser } from "./db-users";
import { DbRole } from "./db-roles";
import { DbAuthority } from "./db-authorities";
import { DbAcmeAccount } from "./db-acme-accounts";
import { DbAcmeProfile } from "./db-acme-profiles";
import { DbAuditLog } from "./db-audit-logs";
import { DbCertificate } from "./db-certificates";
import { DbConnector } from "./db-connectors";
import { DbRemoteConnector } from "./db-connectors-remote";
import { DbCredential } from "./db-credentials";
import { DbRaProfile } from "./db-ra-profiles";
import { DbDiscovery } from "./db-discoveries";

import { AuditLogOperation, AuditLogOperationStatus } from "types/auditlog";
import { GroupDTO } from "api/groups";
import { DashboardDTO } from "api/dashboard";
import { DbComplianceGroup, DbComplianceProfile, DbComplianceProfileList, DbComplianceRule } from "./db-compliance-profiles";

import { DbEntity } from "./db-entities";
import { DbLocation } from "./db-locations";
import { DbResource } from "./db-auth";
import { DbCertificateFilter } from "./db-certificate-filters";


export interface DBData {

   acmeAccounts: DbAcmeAccount[];

   acmeProfiles: DbAcmeProfile[];

   users: DbUser[];
   roles: DbRole[];
   resources: DbResource[];

   auditLogs: DbAuditLog[];
   auditLogsOperations: AuditLogOperation[],
   auditLogsStatuses: AuditLogOperationStatus[],
   auditLogsOrigins: string[],

   authorities: DbAuthority[];

   certificateFilters: DbCertificateFilter[];
   certificates: DbCertificate[];

   connectors: DbConnector[];
   connectorsRemote: DbRemoteConnector[];

   credentials: DbCredential[];

   raProfiles: DbRaProfile[];

   groups: GroupDTO[];

   discoveries: DbDiscovery[];

   entities: DbEntity[];
   locations: DbLocation[];

   dashboard: DashboardDTO;

   complianceProfilesList: DbComplianceProfileList[];
   complianceProfiles: DbComplianceProfile[];
   complianceRules: DbComplianceRule[];
   complianceGroups: DbComplianceGroup[];

}