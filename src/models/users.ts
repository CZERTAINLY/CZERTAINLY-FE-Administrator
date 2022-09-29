import { RoleModel } from "./roles";


export interface UserModel {

   uuid: string;
   username: string;
   firstName?: string;
   lastName?: string;
   email?: string;
   enabled: boolean;
   systemUser: boolean;

}


export interface UserCertificateModel {

   uuid: string;
   fingerprint: string;

}


export interface UserDetailModel extends UserModel {

   certificate: UserCertificateModel;
   roles: RoleModel[];

}
