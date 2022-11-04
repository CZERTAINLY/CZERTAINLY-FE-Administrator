import { HttpMethod } from "utils/FetchHttpService/HttpRequestOptions";
import { AttributeDescriptorCallbackMappingModel } from "./AttributeDescriptorCallbackMappingModel";

export interface AttributeDescriptorCallbackModel {
   callbackContext: string;
   callbackMethod: HttpMethod;
   mappings: AttributeDescriptorCallbackMappingModel[];
}
