import { AttributeCallbackMappingModel } from './AttributeCallbackMappingModel';

export interface AttributeCallbackModel {
   callbackContext: string;
   callbackMethod: string;
   mappings: AttributeCallbackMappingModel[];
}
