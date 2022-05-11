import { AttributeCallback } from "../../models/callback";

export type AttributeType = "STRING" | "NUMBER" | "BOOLEAN" | "DROPDOWN" | "LIST" | "FILE" | "CREDENTIAL" | "SECRET";


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
   dependsOn?: any;
   validationRegex?: string | RegExp;
   attributeCallback?: AttributeCallback;
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
   value: string | number | boolean | string[] | number[] | boolean[];
}


export interface AllAttributeDTO {
   [key: string]: any;
}