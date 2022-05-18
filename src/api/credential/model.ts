import { Observable } from "rxjs";

import { AttributeDTO } from "api/.common/AttributeDTO";
import { FunctionGroupDTO } from "api/connectors";
import { DeleteObjectErrorDTO } from "api/.common/DeleteObjectErrorDTO";


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


export interface CredentialManagementApi {

   enableCredential(uuid: string): Observable<void>;

   disableCredential(uuid: string): Observable<void>;

   getCredentialDetail(uuid: string): Observable<CredentialDTO>;

   updateCredential(uuid: string, attributes: AttributeDTO[]): Observable<CredentialDTO>;

   deleteCredential(uuid: string): Observable<DeleteObjectErrorDTO[]>;

   getCredentialsList(): Observable<CredentialDTO[]>;

   createNewCredential(name: string, kind: string, connectorUuid: string, attributes: AttributeDTO[]): Observable<string>;

   forceDeleteCredential(uuid: string | number): Observable<void>;

   bulkForceDeleteCredential(uuids: string[]): Observable<void>;

   bulkDeleteCredential(uuids: string[]): Observable<DeleteObjectErrorDTO[]>;

}
