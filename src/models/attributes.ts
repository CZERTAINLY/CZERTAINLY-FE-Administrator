import { AttributeCallback } from "./callback";

export interface AttributeResponse {
  uuid: string | number;
  name: string;
  type: string;
  label: string;
  required: boolean;
  readOnly: boolean;
  editable: boolean;
  visible: boolean;
  multiValue?: boolean;
  value?: any;
  description?: string;
  dependsOn?: any;
  validationRegex?: any;
  attributeCallback?: AttributeCallback;
}

export interface SimplifiedAttributes {
  id?: string | number;
  name: string;
  value: any;
}
