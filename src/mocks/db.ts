import { DBData } from "./DBData";

import { dbAcmeProfiles } from "./db-acme-profiles";
import { dbAcmeAccounts } from "./db-acme-accounts";
import { dbAdministrators } from "./db-administrators";
import { dbAuditLogs, dbAuditLogsOperationStatuses, dbAuditLogsOperations, dbAuditLogsOrigins } from "./db-audit-logs";
import { dbClients } from "./db-clients";
import { dbCertificates } from "./db-certificates";
import { dbAuthorities } from "./db-authorities";
import { dbConnectors } from "./db-connectors";
import { dbRemoteConnectors } from "./db-connectors-remote";
import { dbRaProfiles } from "./db-ra-profiles";
import { dbCredentials } from "./db-credentials";
import { dbGroups } from "./db-groups";
import { dbDiscoveries } from "./db-discoveries";
import { dbDashboard } from "./db-dashboard";
import { dbComplianceGroups, dbComplianceProfiles, dbComplianceProfilesListItem, dbComplianceRules } from "./db-compliance-profiles";

// const certificate = `MIIE8zCCAtugAwIBAgIJAJUUUpnYuGibMA0GCSqGSIb3DQEBCwUAMIGQMQswCQYDVQQGEwJDWjEXMBUGA1UECAwOQ3plY2ggUmVwdWJsaWMxDzANBgNVBAcMBlByYWd1ZTEWMBQGA1UECgwNTHVrYXMgS29wZW5lYzEWMBQGA1UEAwwNTHVrYXMgS29wZW5lYzEnMCUGCSqGSIb3DQEJARYYbHVrYXMua29wZW5lY0BvdXRsb29rLmN6MB4XDTE4MTAyNzE4MTUzMFoXDTE5MDQyNzE4MTUzMFowgY0xCzAJBgNVBAYTAkNaMRcwFQYDVQQIDA5DemVjaCBSZXB1YmxpYzEPMA0GA1UEBwwGUHJhZ3VlMRcwFQYDVQQKDA5PbmxpbmVrdXJ6eS5jejESMBAGA1UEAwwJbG9jYWxob3N0MScwJQYJKoZIhvcNAQkBFhhsdWthcy5rb3BlbmVjQG91dGxvb2suY3owggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCbcChmJIAMp7k/3tB/D05PZ3BzSg1hz83EvjPAJ+pCJ8Ub4jvFwpbn/10fe60NZV+IEoL7t+i4fZruJc4k8Cyauc0x1179FWgSEw9rKeDlrS9yJ01cwsC0Wme6VVoJok9RSvhF4rahNhsEX+RUwa3Mo7pw+kmCNXo+32bEr09UuriES/YUt0KIpB8Si7Ta3buz5NVu0y5iKKP6+4Ab9haTFQmrJljL5q5mW+0TMZgK/d7Qpd7Q4jlvt5EjSBKl1RculOVpkpvXOAJD/vQ+xZP8DreOjR/QO8tOFQqhWvttSQVNbMloRinoWEAeRi9a/GkjAccMNlEh7PO6m2NZwQzfAgMBAAGjUTBPMB8GA1UdIwQYMBaAFJ8AR+Q931n61MeDPeHeBQAI02JxMAkGA1UdEwQCMAAwCwYDVR0PBAQDAgTwMBQGA1UdEQQNMAuCCWxvY2FsaG9zdDANBgkqhkiG9w0BAQsFAAOCAgEArYbPTb+d2hAuG5imd5i7srDd5IKvt4YpY/zdz+nAX6JPRwNyb7ssHEZ5UsKekFH2IuWRuWqyGBmb3AsnoEa4Ws3hG8HH+hivvYQ31No4KD1oHASwzJ7R7J6FXHksNQQkuE5qGybpHimU24MX34ThpglhbZVqcUNpjJLhchZ704GJB+SNMtDxdScpTQ2L4lk9PvBQFZYhMjOcygz0+JDKww9UCdLwbX3BSwcXBkGqAoS8CyE/nA1Bjrn+wUzcSRjewh1QkdcY3KLH3Hxv7Bs8mVsTlNS1t8ac7QwrXAp6+aqUCKx4Bec2KR37yD+IsMLBFKn4vzEOb+i7f7syfqzRr3Q1/lutor2BVsCx6eN2dFK2EXjqjG8sH8+9qIjXKuGjCVJ8fANLG4pYquxm3wPOMR3eYrykJnD5Bd9qNbl9/Awc7jWDnYtvNxh4iLSL68D4jHdJjSX6oyk5ipR6Czkx4oVa46oIavQyVCncjZRbj2wXsUxtMti3DdpwWE7eD8Bfg+JSa5QRlo2WlOPD5E7s3HlfHNn2r1UFfZ79Kq068n8Jh6m0h70anTo0Byfcnu+3xYsiG8eerJV6SANkHbTgD6q0CF2/r0xAWnbBAAQaGydkXTYwDeOn8fUd9ayBPUnoo5QU6I+8qVFjzyzEhTs5vOJfZ9Xy885LwPGXXMpTZQw=`;

/**
 * Database objects are specified in separate files in object structure which can be reffered throughtout the database
 */
export const dbData: DBData = {

   acmeAccounts: [
      dbAcmeAccounts["BeWgvKI160E"],
      dbAcmeAccounts["ZnaucX7UOFs"],
      dbAcmeAccounts["PrLHcY5PnnA"],
      dbAcmeAccounts["FQxkmEYae9g"],
      dbAcmeAccounts["ZeQgvUI12pE"]
   ],

   acmeProfiles: [
      dbAcmeProfiles["cm"],
      dbAcmeProfiles["ACME CZERTAINLY Profile"]
   ],

   administrators: [
      dbAdministrators["Lukáš"],
      dbAdministrators["Super_Administrator"],
      dbAdministrators["Super_Administrator1"],
      dbAdministrators["Super_Administrator2"],
      dbAdministrators["Super_Administrator3"],
      dbAdministrators["Super_Administrator4"],
      dbAdministrators["Super_Administrator5"],
      dbAdministrators["Super_Administrator6"],
      dbAdministrators["Super_Administrator7"],
      dbAdministrators["Super_Administrator8"],
      dbAdministrators["Super_Administrator9"],
      dbAdministrators["Super_Administrator10"],
      dbAdministrators["Super_Administrator11"],
      dbAdministrators["Super_Administrator12"],
      dbAdministrators["Super_Administrator13"],
      dbAdministrators["Super_Administrator14"],
      dbAdministrators["Super_Administrator15"],
      dbAdministrators["Super_Administrator16"],
      dbAdministrators["Super_Administrator17"],
      dbAdministrators["Super_Administrator18"]
   ],

   auditLogs: [
      dbAuditLogs[1],
      dbAuditLogs[2],
      dbAuditLogs[3],
      dbAuditLogs[4],
      dbAuditLogs[5],
      dbAuditLogs[6],
      dbAuditLogs[7],
      dbAuditLogs[8],
      dbAuditLogs[9],
      dbAuditLogs[10],
      dbAuditLogs[11],
      dbAuditLogs[12],
      dbAuditLogs[13],
      dbAuditLogs[14],
      dbAuditLogs[15],
      dbAuditLogs[16],
      dbAuditLogs[17],
      dbAuditLogs[18],
      dbAuditLogs[19],
      dbAuditLogs[20]
   ],

   auditLogsOperations: dbAuditLogsOperations,

   auditLogsStatuses: dbAuditLogsOperationStatuses,

   auditLogsOrigins: dbAuditLogsOrigins,

   authorities: [
      dbAuthorities["ejbca-ca-instance1"]
   ],

   certificates: [
      dbCertificates["Lukas Kopenec"],
      dbCertificates["CLIENT1"],
      dbCertificates["t1c.com"],
      dbCertificates["GTS Root R1C3"],
      dbCertificates["GTS Root R1"],
      dbCertificates["*.google.com"],
   ],

   clients: [
      dbClients["PT1"],
      dbClients["test-client1"],
      dbClients["TestClient"],
   ],

   connectors: [
      dbConnectors["Common-Credential-Provider"],
      dbConnectors["Network-Discovery-Provider"],
      dbConnectors["Cryptosense-Discovery-Provider"],
      dbConnectors["MS-ADCS-Connector"],
      dbConnectors["EJBCA-Legacy-Connector"],
      dbConnectors["EJBCA-NG-Connector"],
   ],

   connectorsRemote: [
      dbRemoteConnectors["http://localhost:1"],
      dbRemoteConnectors["http://localhost:10000"],
      dbRemoteConnectors["http://localhost:10001"],
      dbRemoteConnectors["http://localhost:10002"],
      dbRemoteConnectors["http://localhost:10003"],
      dbRemoteConnectors["http://localhost:10004"],
      dbRemoteConnectors["http://localhost:10005"],
   ],

   credentials: [
      dbCredentials["ejbca-client-cert"],
      dbCredentials["Cryptosense-API"],
      dbCredentials["Basic"],
      dbCredentials["ejbca-admin"]
   ],

   raProfiles: [
      dbRaProfiles["localhostProfile"],
      dbRaProfiles["DEMO-PROFILE"],
      dbRaProfiles["DEMO-RA-PROFILE2"]
   ],

   groups: [
      dbGroups["Group1"],
      dbGroups["Group2"],
      dbGroups["Group3"],
   ],

   discoveries: [
      dbDiscoveries["Discovery1"],
      dbDiscoveries["Discovery2"],
      dbDiscoveries["Discovery3"],
   ],
   dashboard: dbDashboard,

   complianceProfilesList: [
      dbComplianceProfilesListItem["Profile1"],
      dbComplianceProfilesListItem["Profile2"],
      dbComplianceProfilesListItem["Profile3"],
      dbComplianceProfilesListItem["Profile4"],
   ],

   complianceProfiles: [
      dbComplianceProfiles["Profile1"],
      dbComplianceProfiles["Profile2"],
      dbComplianceProfiles["Profile3"],
      dbComplianceProfiles["Profile4"],
   ],

   complianceRules: dbComplianceRules,

   complianceGroups: dbComplianceGroups,
};

