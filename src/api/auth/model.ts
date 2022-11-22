export interface ActionDTO {
   uuid: string;
   name: string;
   displayName: string;
}


export interface ResourceDTO {
   uuid: string;
   name: string;
   displayName: string;
   listObjectsEndpoint: string;
   objectAccess: boolean;
}

export interface ResourceDetailDTO extends ResourceDTO {

   actions: ActionDTO[];

}


export interface ObjectPermissionsDTO {
   uuid: string;
   isAllowed?: string[];
   isDenied?: string[];
}


export interface ResourcePermissionDTO {
   uuid: string;
   name: string;
   allowAllActions: boolean;
   actions: string[];
}


export interface ProfileDetailDTO {
   description?: string;
   firstName?: string
   lastName?: string;
   email?: string;
}


export interface ResourceDetailDTO extends ResourceDTO {
}

