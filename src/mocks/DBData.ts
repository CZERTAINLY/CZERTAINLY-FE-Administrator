import { DbAuthority } from "./db-authorities";
import { DbAcmeAccount } from "./db-acme-accounts";
import { DbAcmeProfile } from "./db-acme-profiles";
import { DbAdministrator } from "./db-administrators";
import { DbAuditLog } from "./db-audit-logs";
import { DbCertificate } from "./db-certificates";
import { DbClient } from "./db-clients";
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


export interface DBData {

   acmeAccounts: DbAcmeAccount[];

   acmeProfiles: DbAcmeProfile[];

   administrators: DbAdministrator[];

   auditLogs: DbAuditLog[];
   auditLogsOperations: AuditLogOperation[],
   auditLogsStatuses: AuditLogOperationStatus[],
   auditLogsOrigins: string[],

   authorities: DbAuthority[];

   certificates: DbCertificate[];

   clients: DbClient[];

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