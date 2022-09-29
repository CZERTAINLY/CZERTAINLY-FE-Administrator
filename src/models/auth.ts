export interface ActionModel {
   uuid: string;
   name: string;
   displayName: string;
}


export interface ResourceModel {
   uuid: string;
   name: string;
   displayName: string;
   listingEndPoint: string;
   objectAccess: boolean;
}


export interface ResourceDetailModel extends ResourceModel {

   actions: ActionModel[];

}
