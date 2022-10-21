import { DBData } from "./DBData";
import { dbUsers } from "./db-users";
import { dbRolePermissions, dbRoles } from "./db-roles";
import { dbCertificates } from "./db-certificates";
import { dbLocations } from "./db-locations";
import { dbResources } from "./db-auth";

// const certificate = `MIIE8zCCAtugAwIBAgIJAJUUUpnYuGibMA0GCSqGSIb3DQEBCwUAMIGQMQswCQYDVQQGEwJDWjEXMBUGA1UECAwOQ3plY2ggUmVwdWJsaWMxDzANBgNVBAcMBlByYWd1ZTEWMBQGA1UECgwNTHVrYXMgS29wZW5lYzEWMBQGA1UEAwwNTHVrYXMgS29wZW5lYzEnMCUGCSqGSIb3DQEJARYYbHVrYXMua29wZW5lY0BvdXRsb29rLmN6MB4XDTE4MTAyNzE4MTUzMFoXDTE5MDQyNzE4MTUzMFowgY0xCzAJBgNVBAYTAkNaMRcwFQYDVQQIDA5DemVjaCBSZXB1YmxpYzEPMA0GA1UEBwwGUHJhZ3VlMRcwFQYDVQQKDA5PbmxpbmVrdXJ6eS5jejESMBAGA1UEAwwJbG9jYWxob3N0MScwJQYJKoZIhvcNAQkBFhhsdWthcy5rb3BlbmVjQG91dGxvb2suY3owggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCbcChmJIAMp7k/3tB/D05PZ3BzSg1hz83EvjPAJ+pCJ8Ub4jvFwpbn/10fe60NZV+IEoL7t+i4fZruJc4k8Cyauc0x1179FWgSEw9rKeDlrS9yJ01cwsC0Wme6VVoJok9RSvhF4rahNhsEX+RUwa3Mo7pw+kmCNXo+32bEr09UuriES/YUt0KIpB8Si7Ta3buz5NVu0y5iKKP6+4Ab9haTFQmrJljL5q5mW+0TMZgK/d7Qpd7Q4jlvt5EjSBKl1RculOVpkpvXOAJD/vQ+xZP8DreOjR/QO8tOFQqhWvttSQVNbMloRinoWEAeRi9a/GkjAccMNlEh7PO6m2NZwQzfAgMBAAGjUTBPMB8GA1UdIwQYMBaAFJ8AR+Q931n61MeDPeHeBQAI02JxMAkGA1UdEwQCMAAwCwYDVR0PBAQDAgTwMBQGA1UdEQQNMAuCCWxvY2FsaG9zdDANBgkqhkiG9w0BAQsFAAOCAgEArYbPTb+d2hAuG5imd5i7srDd5IKvt4YpY/zdz+nAX6JPRwNyb7ssHEZ5UsKekFH2IuWRuWqyGBmb3AsnoEa4Ws3hG8HH+hivvYQ31No4KD1oHASwzJ7R7J6FXHksNQQkuE5qGybpHimU24MX34ThpglhbZVqcUNpjJLhchZ704GJB+SNMtDxdScpTQ2L4lk9PvBQFZYhMjOcygz0+JDKww9UCdLwbX3BSwcXBkGqAoS8CyE/nA1Bjrn+wUzcSRjewh1QkdcY3KLH3Hxv7Bs8mVsTlNS1t8ac7QwrXAp6+aqUCKx4Bec2KR37yD+IsMLBFKn4vzEOb+i7f7syfqzRr3Q1/lutor2BVsCx6eN2dFK2EXjqjG8sH8+9qIjXKuGjCVJ8fANLG4pYquxm3wPOMR3eYrykJnD5Bd9qNbl9/Awc7jWDnYtvNxh4iLSL68D4jHdJjSX6oyk5ipR6Czkx4oVa46oIavQyVCncjZRbj2wXsUxtMti3DdpwWE7eD8Bfg+JSa5QRlo2WlOPD5E7s3HlfHNn2r1UFfZ79Kq068n8Jh6m0h70anTo0Byfcnu+3xYsiG8eerJV6SANkHbTgD6q0CF2/r0xAWnbBAAQaGydkXTYwDeOn8fUd9ayBPUnoo5QU6I+8qVFjzyzEhTs5vOJfZ9Xy885LwPGXXMpTZQw=`;

/**
 * Database objects are specified in separate files in object structure which can be reffered throughtout the database
 */
export const dbData: DBData = {

   users: [
      dbUsers["Admin"],
      dbUsers["User"],
   ],


   roles: [
      { ...dbRoles["admin"], users: [dbUsers["Admin"]] }  ,
      { ...dbRoles["user"], users: [dbUsers["User"]] }  ,
   ],


   permissions: [
      dbRolePermissions["bbbbbbbb-cf31-402e-84c6-4988d96096c4"],
      dbRolePermissions["aaaaaaaa-cf31-402e-84c6-4988d96096c4"],
   ],


   resources: [
      dbResources["users"],
      dbResources["locations"],
   ],

   certificates: [
      dbCertificates["Lukas Kopenec"],
      dbCertificates["CLIENT1"],
      dbCertificates["t1c.com"],
      dbCertificates["GTS Root R1C3"],
      dbCertificates["GTS Root R1"],
      dbCertificates["*.google.com"],
   ],

   locations: [
      dbLocations["location1"],
      dbLocations["location2"]
   ],


};

