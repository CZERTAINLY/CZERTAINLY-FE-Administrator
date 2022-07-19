import { AttributeContentModel } from "./AttributeContentModel";

export interface FileAttributeContentModel extends AttributeContentModel {
   value: string;
   fileName?: string;
   contentType?: string;
}
