import { FunctionGroupCode } from "types/connectors";
import { AttributeCallbackMappingTarget, AttributeType, AttributeValue } from "types/attributes";


export interface AttibuteCallbackMappingDTO {
   from?: string;
   attributeType?: AttributeType;
   to: string;
   targets: AttributeCallbackMappingTarget[];
   value?: any;
}

export interface CallbackPathVariableDict {
   [key: string]: any;
}

export interface CallbackRequestBodyDict {
   [key: string]: any;
}

export interface CallbackQueryParameterDict {
   [key: string]: any;
}

export interface AttributeCallbackDTO {
   callbackContext: string;
   callbackMethod: string;
   mappings: AttibuteCallbackMappingDTO[];
}


export interface AttributeDependencyDTO {
   name: string;
   value: string;
}


/**
 * Used to describe properties of particular object attributes (generate the form)
 */
export interface AttributeDescriptorDTO {
   uuid: string | number;
   name: string;
   type: AttributeType;
   label: string;
   required?: boolean;
   readOnly?: boolean;
   editable?: boolean;
   visible?: boolean;
   multiValue?: boolean;
   description?: string;
   dependsOn?: AttributeDependencyDTO[];
   validationRegex?: string;
   attributeCallback?: AttributeCallbackDTO;
   value?: AttributeValue;
}


/**
 * Used to obtain complete list of named
 */
export type AttributeDescriptorCollectionDTO = {
   [functionGroup in FunctionGroupCode]?: {
      [kind: string]: AttributeDescriptorDTO[];
   }
}


/**
 * Used to get or set attributes of a particular object
 */
export interface AttributeDTO {
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


