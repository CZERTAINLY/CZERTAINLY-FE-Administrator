import { DbUser } from "./db-users";
import { DbRole, DbRolePermissions } from "./db-roles";
import { DbCertificate } from "./db-certificates";
import { DbLocation } from "./db-locations";
import { DbResource } from "./db-auth";


export interface DBData {

   users: DbUser[];
   roles: DbRole[];
   permissions: DbRolePermissions[];
   resources: DbResource[];
   certificates: DbCertificate[];
   locations: DbLocation[];

}