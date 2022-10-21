import { AuditLogDTO } from "api/auditLogs";
import { AuditLogOperation, AuditLogOperationStatus, AuditLogSourceTarget } from "types/auditlog";


export interface DbAuditLog extends AuditLogDTO {
}


interface DbAuditLogs {
   [key: string]: DbAuditLog;
}


export const dbAuditLogsOperations: AuditLogOperation[] = [
   "CREATE",
   "DELETE",
   "CHANGE",
   "ENABLE",
   "DISABLE",
   "AUTH",
   "REQUEST",
   "ISSUE",
   "RENEW",
   "REVOKE",
   "RESET",
   "START",
   "STOP",
   "VALIDATE",
   "CALLBACK",
   "CONNECT",
   "FORCE_DELETE",
   "APPROVE"
]

export const dbAuditLogsOperationStatuses: AuditLogOperationStatus[] = [
   "FAILURE",
   "SUCCESS"
]

export const dbAuditLogsOrigins: AuditLogSourceTarget[] = [
   "ACCESS",
   "ACME_ACCOUNT",
   "ACME_PROFILE",
   "ADMINISTRATOR",
   "ATTRIBUTES",
   "AUDIT_LOG",
   "BE",
   "CA",
   "CA_INSTANCE",
   "CERTIFICATE",
   "CLIENT",
   "CONNECTOR",
   "CREDENTIAL",
   "DISCOVERY",
   "ENTITY",
   "END_ENTITY",
   "END_ENTITY_CERTIFICATE",
   "END_ENTITY_PROFILE",
   "FE",
   "GROUP",
   "HEALTH",
   "LOCALHOST",
   "RA_PROFILE",
   "STATISTICS"
];

export const dbAuditLogs: DbAuditLogs = {

   1: {
      id: 1,
      created: new Date(),
      author: "Super Áda",
      operationStatus: "SUCCESS",
      origination: "ACCESS",
      affected: "ACME_PROFILE",
      objectIdentifier: "abc",
      operation: "CHANGE",
      additionalData: null,
   },
   2: {
      id: 2,
      created: new Date(),
      author: "Áda",
      operationStatus: "SUCCESS",
      origination: "CLIENT",
      affected: "CONNECTOR",
      objectIdentifier: "abc",
      operation: "CREATE",
      additionalData: { key: "value" },
   },
   3: {
      id: 3,
      created: new Date(),
      author: "Superman",
      operationStatus: "SUCCESS",
      origination: "ENTITY",
      affected: "CA",
      objectIdentifier: "adfqawdsf2wefg",
      operation: "DELETE",
      additionalData: { key1: "value1", key2: "value2", key3: "value3" },
   },
   4: {
      id: 4,
      created: new Date(),
      author: "Super Áda",
      operationStatus: "SUCCESS",
      origination: "ADMINISTRATOR",
      affected: "BE",
      objectIdentifier: "abc",
      operation: "FORCE_DELETE",
      additionalData: null,
   },
   5: {
      id: 5,
      created: new Date(),
      author: "Super Áda",
      operationStatus: "SUCCESS",
      origination: "ATTRIBUTES",
      affected: "RA_PROFILE",
      objectIdentifier: "abc",
      operation: "CREATE",
      additionalData: {
         somewhat: "meaningful",
         additional: "data",
         that: "can",
         be: "displayed",
         here: "in the detail",
      },
   },
   6: {
      id: 6,
      created: new Date(),
      author: "Áda",
      operationStatus: "SUCCESS",
      origination: "ACME_ACCOUNT",
      affected: "END_ENTITY",
      objectIdentifier: "abc",
      operation: "ENABLE",
      additionalData: null,
   },
   7: {
      id: 7,
      created: new Date(),
      author: "Áda",
      operationStatus: "SUCCESS",
      origination: "END_ENTITY_CERTIFICATE",
      affected: "CERTIFICATE",
      objectIdentifier: "abc",
      operation: "ISSUE",
      additionalData: null,
   },
   8: {
      id: 8,
      created: new Date(),
      author: "Áda",
      operationStatus: "FAILURE",
      origination: "AUDIT_LOG",
      affected: "AUDIT_LOG",
      objectIdentifier: "abc",
      operation: "DELETE",
      additionalData: null,
   },
   9: {
      id: 9,
      created: new Date(),
      author: "Superman",
      operationStatus: "SUCCESS",
      origination: "CREDENTIAL",
      affected: "CREDENTIAL",
      objectIdentifier: "abc",
      operation: "AUTH",
      additionalData: null,
   },
   10: {
      id: 10,
      created: new Date(),
      author: "Dis Áda",
      operationStatus: "SUCCESS",
      origination: "ACME_ACCOUNT",
      affected: "CREDENTIAL",
      objectIdentifier: "abc",
      operation: "FORCE_DELETE",
      additionalData: null,
   },
   11: {
      id: 11,
      created: new Date(),
      author: "Dis Áda",
      operationStatus: "SUCCESS",
      origination: "ACCESS",
      affected: "GROUP",
      objectIdentifier: "abc",
      operation: "APPROVE",
      additionalData: {
         somewhat: "meaningful",
         additional: "data",
         that: "can",
         be: "displayed",
         here: "in the detail",
         certData: {
            adminCertificate:
               "MIIEbDCCAlSgAwIBAgIUIAUP0bIO303GsPuOrwqPnH+6uUgwDQYJKoZIhvcNAQELBQAwNjEWMBQGA1UEAwwNTWFuYWdlbWVudCBDQTEcMBoGA1UECgwTM0tleSBDb21wYW55IHMuci5vLjAeFw0yMDA4MDEwODMxMDVaFw0yMjA4MDEwODMxMDVaMDMxFzAVBgNVBAMMDmNsb3VkZmllbGRkZW1vMRgwFgYDVQQKDA9DTE9VREZJRUxEIGEucy4wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDLvqLOLk2m+UkTRunubjTfHeQjePbY5sho4NLaCwBCmE+wbLp1KYqnRm9mh0IJbaXtmm26lPyJWMqxeyArkFlbqve+yY5tpGJMrD1bxPJRt5FrjNugnY5qPB6+4YK+EFqNCd+RjiNyOcaPNFIhVgqNtp6MXa8ziByvKv9Bswoe9+g/bG1jRZWpSbl4QYUlTmUbbwDrhU1tCKJyyjxCrqO4O8B5puHQ1+Z3/1fzEhpk/e133UcXY6utt5hYRuHU0uB2aERatbGvsY+Y1UWdPb+xXhiqh/V0UI0zw1bqZjN9aygti+qfWwYtPe8PITb5BOSGtgA+6vtIQSk35lIGYLjFAgMBAAGjdTBzMAwGA1UdEwEB/wQCMAAwHwYDVR0jBBgwFoAU1K6TkRjwywcAqvuFiBaUXu+9YjMwEwYDVR0lBAwwCgYIKwYBBQUHAwIwHQYDVR0OBBYEFDFClGmjuwC6QGAMY1MlW+rICAjmMA4GA1UdDwEB/wQEAwIF4DANBgkqhkiG9w0BAQsFAAOCAgEAWv2fgfXrm2mkZFCWdO6WXZ4EghzDJvdqbTgg9SFMRSAuoLwlXpm4vmCO9Y9IZKp0IpZdKlLgbfAbGa8SpS7zPNF34YAdKNWgs9Ul9eX90NHbVb5P1tnfotC/03iPZKeA84p9N44URr9ewIJk2qJ7kLgCmtJNtzb4PL4oY2jXzPeA+lXwgqDZCpL8Lu98zIIPKyUVpXeeMfd5ACBOLDIoY0nZfsHk3SBVVHpKkywbpaSZXi0QsABFWC/iFAiAXIe7i9fSPF8hCDEpgnblkXXtr1vgQQMxZHAQf/79oU82i4zjg2ymvhDMsT1oaFMVpkewEMqySlCvvEPqN6eR8OkwUaLFSWVIDpgilHbt/tNB46eKPsL2BeBxSKwQG2Quizi/pPWW9Q2uVS1D73k7rFtoqD9G5AjHbwcJ5+Hwb48EQwlqZUUFEXvlqJbSh4jAWY1rPaA0i2gPE5pM2Sf/+twEW0i21+te20tjiTOZOo3cgOZNKfYljyyYxUcrelqL9Cd98ppbRFKquh70DgqZv802rI24soaYenqvVpSLLj4HNauPjrvVOJsF3WDrzLIfQIKsBdisqhwLATqESKbEvwGDODL1KVTLpdr5+dEXXt4H8uf5pZrlMU7kEjL74Kh5vLuK5eKEX+OpQbGBjp1iikUSO+EMjW0TZmXcXjNDPVDymJo=",
         },
      },
   },
   12: {
      id: 12,
      created: new Date(),
      author: "Super Áda",
      operationStatus: "SUCCESS",
      origination: "ACCESS",
      affected: "CA",
      objectIdentifier: "abc",
      operation: "CHANGE",
      additionalData: {
         somewhat: "meaningful",
         additional: "data",
         that: "can",
         be: "displayed",
         here: "in the detail",
      },
   },
   13: {
      id: 13,
      created: new Date(),
      author: "Super Áda",
      operationStatus: "SUCCESS",
      origination: "ACCESS",
      affected: "CA",
      objectIdentifier: "abc",
      operation: "CHANGE",
      additionalData: {
         somewhat: "meaningful",
         additional: "data",
         that: "can",
         be: "displayed",
         here: "in the detail",
      },
   },
   14: {
      id: 14,
      created: new Date(),
      author: "Super Áda",
      operationStatus: "SUCCESS",
      origination: "ACCESS",
      affected: "CA",
      objectIdentifier: "abc",
      operation: "CHANGE",
      additionalData: {
         somewhat: "meaningful",
         additional: "data",
         that: "can",
         be: "displayed",
         here: "in the detail",
      },
   },
   15: {
      id: 15,
      created: new Date(),
      author: "Super Áda",
      operationStatus: "SUCCESS",
      origination: "ACCESS",
      affected: "CA",
      objectIdentifier: "abc",
      operation: "CHANGE",
      additionalData: {
         somewhat: "meaningful",
         additional: "data",
         that: "can",
         be: "displayed",
         here: "in the detail",
      },
   },
   16: {
      id: 16,
      created: new Date(),
      author: "Super Áda",
      operationStatus: "SUCCESS",
      origination: "ACCESS",
      affected: "CA",
      objectIdentifier: "abc",
      operation: "CHANGE",
      additionalData: {
         somewhat: "meaningful",
         additional: "data",
         that: "can",
         be: "displayed",
         here: "in the detail",
      },
   },
   17: {
      id: 17,
      created: new Date(),
      author: "Super Áda",
      operationStatus: "SUCCESS",
      origination: "ACCESS",
      affected: "CA",
      objectIdentifier: "abc",
      operation: "CHANGE",
      additionalData: {
         somewhat: "meaningful",
         additional: "data",
         that: "can",
         be: "displayed",
         here: "in the detail",
      },
   },
   18: {
      id: 18,
      created: new Date(),
      author: "Super Áda",
      operationStatus: "SUCCESS",
      origination: "ACCESS",
      affected: "CA",
      objectIdentifier: "abc",
      operation: "CHANGE",
      additionalData: {
         somewhat: "meaningful",
         additional: "data",
         that: "can",
         be: "displayed",
         here: "in the detail",
      },
   },
   19: {
      id: 19,
      created: new Date(),
      author: "Super Áda",
      operationStatus: "SUCCESS",
      origination: "ACCESS",
      affected: "CA",
      objectIdentifier: "abc",
      operation: "CHANGE",
      additionalData: {
         somewhat: "meaningful",
         additional: "data",
         that: "can",
         be: "displayed",
         here: "in the detail",
      },
   },
   20: {
      id: 20,
      created: new Date(),
      author: "Super Áda",
      operationStatus: "SUCCESS",
      origination: "ACCESS",
      affected: "CA",
      objectIdentifier: "abc",
      operation: "CHANGE",
      additionalData: {
         somewhat: "meaningful",
         additional: "data",
         that: "can",
         be: "displayed",
         here: "in the detail",
      },
   }

}