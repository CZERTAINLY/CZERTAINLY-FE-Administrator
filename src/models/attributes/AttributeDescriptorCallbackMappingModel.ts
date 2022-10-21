import { AttributeCallbackMappingTarget_AttributeCallbackModel, AttributeType } from "types/attributes";

export interface AttributeDescriptorCallbackMappingModel {
   from?: string;
   attributeType?: AttributeType;
   to: string;
   targets: AttributeCallbackMappingTarget_AttributeCallbackModel[];
   value?: any;
}
