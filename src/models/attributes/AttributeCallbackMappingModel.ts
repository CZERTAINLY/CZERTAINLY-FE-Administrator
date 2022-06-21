import { AttributeCallbackMappingTarget, AttributeType } from "types/attributes";

export interface AttributeCallbackMappingModel {
   from?: string;
   attributeType?: AttributeType;
   to: string;
   targets: AttributeCallbackMappingTarget[];
   value?: any;
}
