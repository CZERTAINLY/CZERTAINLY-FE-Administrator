export enum Role {
  Admin = 'ADMINISTRATOR',
  SuperAdmin = 'SUPERADMINISTRATOR',
}

export interface Profile {
  name: string;
  surname: string;
  username: string;
  email: string;
  role: Role;
}
