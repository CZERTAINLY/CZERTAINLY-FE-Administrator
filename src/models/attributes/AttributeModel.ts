import { AttributeType } from "types/attributes";
import { AttributeContentModel } from "./AttributeContentModel";

export interface AttributeModel {
   uuid?: string;
   name: string;
   label?: string;
   type?: AttributeType
   content?: AttributeContentModel | AttributeContentModel[];
}
