import { AttributeCallbackMappingModel } from "./AttributeCallbackMappingModel";

export interface AttributeCallbackDescriptorModel {
   callbackContext: string;
   callbackMethod: string;
   mappings: AttributeCallbackMappingModel[];
}
