import { GroupDTO } from "api/groups";
import { GroupModel } from "models";

export function transformGroupsDtoToModel(groupDto: GroupDTO): GroupModel {

   return {
      uuid: groupDto.uuid,
      name: groupDto.name,
      description: groupDto.description,
   };

}