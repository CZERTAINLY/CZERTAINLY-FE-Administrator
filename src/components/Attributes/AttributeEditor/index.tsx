type AttributeType = "BOOLEAN" | "INTEGER" | "FLOAT" | "STRING" | "TEXT" | "DATE" | "TIME" | "DATETIME" | "FILE" | "SECRET" | "CREDENTIAL" | "JSON";

type AttributeMappingTarget = "pathVariable" | "requestParameter" | "body";

type AttributeValue = string | number | boolean | Date | AttributeContent | string[] | number[] | boolean[] | Date[]| AttributeContent[];


interface AttributeContent {
   value: string;
}


interface Attribute {
   name: string;
   value: AttributeValue;
}


interface AttributeCallbackMapping {
   from: string;
   attributeType: AttributeType;
   to: string;
   targets: AttributeMappingTarget;
   value: AttributeValue;
}


interface AttributeCallbackDescriptor {
   callbackContext: string;
   method: string;
   mappings: AttributeCallbackMapping;
}


interface AttributeDescriptor {
   uuid: string;
   type: AttributeType;
   name: string;
   label: string;
   description: string;
   group: string;
   required: boolean;
   readonly: boolean;
   visible: boolean;
   list: boolean;
   multiSelect: boolean;
   validationRegex?: RegExp;
   callback?: AttributeCallbackDescriptor;
   content: AttributeValue;
}


interface Props {
   attributes: Attribute[];
   attributeDescriptors: AttributeDescriptor[];
   onChange: (attributes: Attribute[]) => void;
}


export default function AttributeEditor({
   attributes,
   attributeDescriptors,
   onChange,
}: Props) {


}