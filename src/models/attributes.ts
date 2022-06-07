import { AttributeCallbackMappingTarget, AttributeType, AttributeValue } from "types/attributes";
import { FunctionGroupCode } from "types/connectors";

export const attributeFieldNameTransform: { [name: string]: string } = {
   name: "Name",
   credentialProvider: "Credential Provider",
   authorityProvider: "Authority Provider",
   discoveryProvider: "Discovery Provider",
   legacyAuthorityProvider: "Legacy Authority Provider",
};

export const attributeFieldTypeTransform: { [name: string]: string } = {
   STRING: "text",
   NUMBER: "number",
   SECRET: "password",
   DROPDOWN: "select",
   SELECT: "select",
   LIST: "select",
   FILE: "file",
   BOOLEAN: "checkbox",
   CREDENTIAL: "select"
};

export interface CallbackPathVariableDict {
   [key: string]: any;
}

export interface CallbackRequestBodyDict {
   [key: string]: any;
}

export interface CallbackQueryParameterDict {
   [key: string]: any;
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


/**
 * Used to get or set attributes of a particular object
 */
 export interface AttributeModel {
   /** Unique attribute value identifier - not used during create */
   uuid?: string;
   /** Name of the attribute taken from the attribute descriptor when created */
   name: string;
   /** Description of the attribute - not used during create */
   label?: string;
   /** Type of the attribute - not used during create */
   type?: AttributeType;
   /** Value of the attribute */
   value: AttributeValue;
}


export interface AttributeDependencyModel {
   name: string,
   value: string
}


/**
 * Used to describe properties of particular object attributes (generate the form)
 */
 export interface AttributeDescriptorModel {
   uuid: string;
   name: string;
   type: AttributeType;
   label: string;
   required?: boolean;
   readOnly?: boolean;
   editable?: boolean;
   visible?: boolean;
   multiValue?: boolean;
   description?: string;
   dependsOn?: AttributeDependencyModel[];
   validationRegex?: string;
   attributeCallback?: AttributeCallbackModel;
   value?: AttributeValue;
}

export type AttributeDescriptorCollectionModel = {
   [functionGroup in FunctionGroupCode]?: {
      [kind: string]: AttributeDescriptorModel[];
   }
}
