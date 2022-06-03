import { AttributeModel } from "./attributes";
import { FunctionGroupModel } from "./connectors";

export interface CredentialModel {
    uuid: string;
    name: string;
    kind: string;
    attributes: AttributeModel[];
    enabled: boolean;
    connectorUuid: string;
    connectorName: string;
 }
 
 
 export interface CredentialProviderModel {
    uuid: string;
    name: string;
    status?: string;
    url: string;
    functionGroups: FunctionGroupModel[];
    authAttributes: AttributeModel[];
    authType: string;
 }