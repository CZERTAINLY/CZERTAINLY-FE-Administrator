import { ResourceDto, ResourceModel } from "types/auth";

export function transformResourceDtoToModel(resource: ResourceDto): ResourceModel {
   return { ...resource };
}