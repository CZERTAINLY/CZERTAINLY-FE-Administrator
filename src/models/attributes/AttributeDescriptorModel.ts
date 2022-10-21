import { AttributeType } from "types/attributes";
import { AttributeDescriptorCallbackModel } from "./AttributeDescriptorCallbackModel";
import { AttributeContentModel } from "./AttributeContentModel";

export interface AttributeDescriptorModel {
   uuid: string;
   type: AttributeType;
   name: string;
   label: string;
   description?: string;
   group?: string;
   required: boolean;
   readOnly: boolean;
   visible: boolean;
   list: boolean;
   multiSelect: boolean;
   validationRegex?: RegExp;
   callback?: AttributeDescriptorCallbackModel;
   content?: AttributeContentModel | AttributeContentModel[];
}
