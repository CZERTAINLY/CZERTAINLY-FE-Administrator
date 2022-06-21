import { AttributeType } from "types/attributes";
import { AttributeCallbackDescriptorModel } from "./AttributeCallbackDescriptorModel";
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
   callback?: AttributeCallbackDescriptorModel;
   content?: AttributeContentModel | AttributeContentModel[];
}
