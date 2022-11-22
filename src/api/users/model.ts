import { RoleDTO } from "api/roles";


export interface UserDTO {
   uuid: string;
   username: string;
   description?: string;
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
   description?: string;
   firstName?: string;
   lastName?: string;
   email?: string;
   enabled: boolean;
   systemUser: boolean;
   certificate: UserCertificateDTO;
   roles: RoleDTO[];
}

