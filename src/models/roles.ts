export interface RoleModel {
   uuid: string;
   name: string;
   description?: string;
   systemRole: boolean;
}

export interface UserCertificateModel {
   uuid: string;
   fingerprint: string;
}