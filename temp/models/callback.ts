export interface CallbackMapping {
  from?: string;
  attributeType: string;
  to: string;
  targets: string[];
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

export interface AttributeCallback {
  callbackMethod?: string;
  callbackContext?: string;
  mappings?: CallbackMapping[];
  pathVariables?: CallbackPathVariableDict;
  queryParameters?: CallbackQueryParameterDict;
  requestBody?: CallbackRequestBodyDict;
  name?: string;
  uuid?: string | number;
}
