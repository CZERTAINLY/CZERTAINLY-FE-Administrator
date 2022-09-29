import { UserDetailDTO } from 'api/users';
import { Observable } from 'rxjs';


export interface ActionDTO {
   uuid: string;
   name: string;
   displayName: string;
}


export interface ResourceDTO {
   uuid: string;
   name: string;
   displayName: string;
   listingEndPoint: string;
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


export interface ResourceDetailDTO extends ResourceDTO {

}


export interface AuthApi {

   profile(): Observable<UserDetailDTO>;

   getAllResources(): Observable<ResourceDetailDTO[]>;

}

