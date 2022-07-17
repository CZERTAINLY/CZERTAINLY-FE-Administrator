import { GroupDTO } from "api/groups";


interface DbRaGroupList {
   [key: string]: GroupDTO;
}


export const dbGroups: DbRaGroupList = {

   "Group1": {
      uuid: "aab53f2c-a6b9-49f0-ad99-418d5fe2b298",
      name: "Group 1",
      description: "Group 1 description",
   },

   "Group2": {
      uuid: "aab53f2c-a6b9-49f0-ad99-418d5fe2b299",
      name: "Group 2",
      description: "Group Description 2",
   },

   "Group3": {
      uuid: "aab53f2c-a6b9-49f0-ad99-418d5fe2b300",
      name: "Group 3",
      description: "Group Description 3",
   }

}