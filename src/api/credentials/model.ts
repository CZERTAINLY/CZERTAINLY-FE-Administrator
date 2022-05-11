import { AttributeDTO } from "api/.common/AttributeDTO";
import { ConnectorFunctionGroupDTO } from "api/connectors";
import { ErrorDeleteObject } from "models";
import { Observable } from "rxjs";


export interface CredentialInfoDTO {
  uuid: string;
  name: string;
  kind: string;
  connectorUuid: string;
  connectorName: string;
}


export interface CredentialDetailDTO {
  uuid: string;
  name?: string;
  kind: string;
  attributes: AttributeDTO[];
  connectorUuid: string;
  connectorName: string;
}


export interface CredentialProviderDTO {
  uuid: string;
  name: string;
  status?: string;
  url: string;
  functionGroups: ConnectorFunctionGroupDTO[];
}


export interface CredentialManagementApi {

  createNewCredential(
    name: string,
    kind: string,
    connectorUuid: string,
    attributes: any
  ): Observable<string>;

  getCredentialsList(): Observable<CredentialInfoDTO[]>;

  getCredentialDetail(uuid: string): Observable<CredentialDetailDTO>;

  getCredentialProviderList(): Observable<CredentialProviderDTO[]>;

  getCredentialProviderAttributes(
    uuid: string,
    code: string,
    kind: string
  ): Observable<AttributeDTO[]>;

  deleteCredential(uuid: number | string): Observable<ErrorDeleteObject[]>;

  forceDeleteCredential(uuid: string | number): Observable<void>;

  bulkDeleteCredential(
    uuid: (number | string)[]
  ): Observable<ErrorDeleteObject[]>;

  bulkForceDeleteCredential(uuid: (string | number)[]): Observable<void>;

  updateCredential(
    uuid: string,
    name: string,
    kind: string,
    connectorUuid: string,
    attributes: any
  ): Observable<CredentialDetailDTO>;


}
