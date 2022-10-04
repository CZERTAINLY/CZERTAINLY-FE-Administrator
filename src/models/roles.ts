export interface RoleModel {
   uuid: string;
   name: string;
   description?: string;
   systemRole: boolean;
}


export interface RoleDetailModel extends RoleModel {
   users: UserModel[];
}
