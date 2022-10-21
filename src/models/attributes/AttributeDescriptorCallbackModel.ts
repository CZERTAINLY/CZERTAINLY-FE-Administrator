import { HttpMethod } from "ts-rest-client";
import { AttributeDescriptorCallbackMappingModel } from "./AttributeDescriptorCallbackMappingModel";

export interface AttributeDescriptorCallbackModel {
   callbackContext: string;
   callbackMethod: HttpMethod;
   mappings: AttributeDescriptorCallbackMappingModel[];
}
