import { CertificateDTO } from "api/certificates";
import { RoleDTO } from "api/roles";
import { Observable } from "rxjs";


export interface UserDTO {
   uuid: string;
   username: string;
   firstName?: string;
   lastName?: string;
   email?: string;
   enabled: boolean;
   systemUser: boolean;
}


export interface UserCertificateDTO {
   uuid: string;
   fingerprint: string;
}


export interface UserDetailDTO {
   uuid: string;
   username: string;
   firstName?: string;
   lastName?: string;
   email?: string;
   enabled: boolean;
   systemUser: boolean;
   certificate: UserCertificateDTO;
   roles: RoleDTO[];
}


export interface UserManagementApi {

   list(): Observable<UserDTO[]>;

   detail(uuid: string): Observable<UserDetailDTO>;

   create(
      username: string,
      firstName: string | undefined,
      lastName: string | undefined,
      email: string | undefined,
      enabled: boolean,
      certificateUuid?: string,
      certificate?: CertificateDTO,
   ): Observable<UserDetailDTO>;

   update(
      uuid: string,
      firstName: string | undefined,
      lastName: string | undefined,
      email: string | undefined,
      certificateUuid?: string,
      certificate?: CertificateDTO,
   ): Observable<UserDetailDTO>;

   delete(uuid: string): Observable<void>;

   enable(uuid: string): Observable<void>;

   disable(uuid: string): Observable<void>;

   getRoles(uuid: string): Observable<RoleDTO[]>;

   updateRoles(userUuid: string, rolesUuids: string[]): Observable<UserDetailDTO>;

   addRole(userUuid: string, roleUuid: string): Observable<UserDetailDTO>;

   removeRole(userUuid: string, roleUuid: string): Observable<UserDetailDTO>;

}
