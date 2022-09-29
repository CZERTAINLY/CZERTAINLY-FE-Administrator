import { ResourceDetailDTO } from "api/auth/model";
import { ResourceDetailModel, ResourceModel } from "models/auth";


export function transformResourceDTOToModel(resource: ResourceDetailDTO): ResourceModel {

   return {
      uuid: resource.uuid,
      name: resource.name,
      displayName: resource.displayName,
      listingEndPoint: resource.listingEndPoint,
      objectAccess: resource.objectAccess,
   };

}

export function transformResourceDetailDTOToModel(resource: ResourceDetailDTO): ResourceDetailModel {

   return {
      ...transformResourceDTOToModel(resource),
      actions: resource.actions.map(
         action => ({
            uuid: action.uuid,
            name: action.name,
            displayName: action.displayName,
         })
      ),
   };

}