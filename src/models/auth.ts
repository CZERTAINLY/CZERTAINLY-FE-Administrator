export enum Role {
  Admin = "administrator",
  SuperAdmin = "superAdministrator",
}

export interface Profile {
  name: string;
  surname: string;
  username: string;
  email: string;
  role: Role;
}
