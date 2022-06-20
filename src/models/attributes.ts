import { AttributeCallbackMappingTarget, AttributeType, AttributeValue } from "types/attributes";
import { FunctionGroupCode } from "types/connectors";


export interface AttributeContentModel {
   value: AttributeValue;
}


/**
 * Used to get or set attributes of a particular object
 */
 export interface AttributeModel {
   uuid: string;
   name: string;
   label?: string;
   type?: AttributeType
   content: AttributeContentModel | AttributeContentModel[];
}


interface AttributeCallbackMappingModel {
   from?: string;
   attributeType?: AttributeType;
   to: string;
   targets: AttributeCallbackMappingTarget[];
   value?: any;
}


interface AttributeCallbackDescriptorModel {
   callbackContext: string;
   callbackMethod: string;
   mappings: AttributeCallbackMappingModel[];
}


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


export interface AttibuteCallbackMappingModel {
   from?: string;
   attributeType?: AttributeType;
   to: string;
   targets: AttributeCallbackMappingTarget[];
   value?: any;
}


export interface AttributeCallbackModel {
   callbackContext: string;
   callbackMethod: string;
   mappings: AttibuteCallbackMappingModel[];
}


export type AttributeDescriptorCollectionModel = {
   [functionGroup in FunctionGroupCode]?: {
      [kind: string]: AttributeDescriptorModel[];
   }
}


export const attributeFieldNameTransform: { [name: string]: string } = {
   name: "Name",
   credentialProvider: "Credential Provider",
   authorityProvider: "Authority Provider",
   discoveryProvider: "Discovery Provider",
   legacyAuthorityProvider: "Legacy Authority Provider",
};


export const attributeFieldTypeTransform: { [name: string]: string } = {
   BOOLEAN: "checkbox",
   INTEGER: "number",
   FLOAT: "number",
   STRING: "string",
   TEXT: "textarea",
   DATE: "date",
   TIME: "time",
   DATETIME: "datetime",
   FILE: "file",
   SECRET: "password",
   CREDENTIAL: "select",
   JSON: "select"
};
