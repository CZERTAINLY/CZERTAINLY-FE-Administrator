import { Observable } from "rxjs";

import { AttributeDTO } from "api/_common/attributeDTO";
import { FunctionGroupDTO } from "api/connectors";
import { DeleteObjectErrorDTO } from "api/_common/deleteObjectErrorDTO";


export interface CredentialDTO {
   uuid: string;
   name: string;
   kind: string;
   attributes: AttributeDTO[];
   enabled: boolean;
   connectorUuid: string;
   connectorName: string;
}


export interface CredentialProviderDTO {
   uuid: string;
   name: string;
   status?: string;
   url: string;
   functionGroups: FunctionGroupDTO[];
   authAttributes: AttributeDTO[];
   authType: string;
}
