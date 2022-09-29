import { ResourceDetailDTO } from "api/auth";

export interface DbResource extends ResourceDetailDTO {
}

interface DbResources {
   [key: string]: DbResource;
}

export const dbResources: DbResources = {

   "users": {
      uuid: "29f8cc58-e4f2-4618-b07c-6837b07558c2",
      name: "users",
      displayName: "Users Management",
      objectAccess: false,
      listingEndPoint: "/users",
      actions: []
   },

   "locations": {
      uuid: "d8674b21-bf49-49ba-80ac-0154387c097a",
      name: "locations",
      displayName: "Locations Management",
      objectAccess: false,
      listingEndPoint: "/locations",
      actions: []
   }

}