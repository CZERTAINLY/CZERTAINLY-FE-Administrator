import { AttributeCallbackMappingTarget_AttributeCallbackModel } from 'types/attributes';

type Targets = { [ target in AttributeCallbackMappingTarget_AttributeCallbackModel ]: { [name: string]: any } }

export type AttributeCallbackDataModel = { uuid: string; name: string; } & Targets;

