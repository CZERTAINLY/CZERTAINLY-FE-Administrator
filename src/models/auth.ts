export enum Role {
  Admin = "administrator",
  SuperAdmin = "superAdministrator",
}

export interface UserProfileModel {
  name: string;
  surname: string;
  username: string;
  email: string;
  role: Role;
}
