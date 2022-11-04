import { GroupDTO } from "api/groups";
import { GroupModel } from "models/groups";

export function transformGroupDtoToModel(groupDto: GroupDTO): GroupModel {

   return {
      uuid: groupDto.uuid,
      name: groupDto.name,
      description: groupDto.description,
   };

}