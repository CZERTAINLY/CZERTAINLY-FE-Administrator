import { FunctionGroupCode } from "types/connectors";
import { AttributeDescriptorModel } from "./AttributeDescriptorModel";

export type AttributeDescriptorCollectionModel = {
   [functionGroup in FunctionGroupCode]?: {
      [kind: string]: AttributeDescriptorModel[];
   }
}
