import { FunctionGroup } from "api/connectors";
import { ErrorDeleteObject } from "models";
import { AttributeResponse } from "models/attributes";
import { Observable } from "rxjs";

export interface CredentialInfoResponse {
  uuid: string;
  name: string;
  kind: string;
  connectorUuid: string;
  connectorName: string;
}

export interface CredentialDetailResponse {
  uuid: string;
  name?: string;
  kind: string;
  attributes: AttributeResponse[];
  connectorUuid: string;
  connectorName: string;
}

export interface CredentialProviderResponse {
  uuid: string;
  name: string;
  status?: string;
  url: string;
  functionGroups: FunctionGroup[];
}

export interface CredentialProviderAttributes {
  id: string | number;
  name: string;
  label: string;
  type: string;
  required: boolean;
  readOnly: boolean;
  editable: boolean;
  visible: boolean;
  multiValue?: boolean;
  description: string;
  validationRegex: string;
  dependsOn: any;
  value?: any;
}

export interface CredentialManagementApi {
  createNewCredential(
    name: string,
    kind: string,
    connectorUuid: string,
    attributes: any
  ): Observable<string>;
  getCredentialsList(): Observable<CredentialInfoResponse[]>;
  getCredentialDetail(uuid: string): Observable<CredentialDetailResponse>;
  getCredentialProviderList(): Observable<CredentialProviderResponse[]>;
  getCredentialProviderAttributes(
    uuid: string,
    code: string,
    kind: string
  ): Observable<CredentialProviderAttributes[]>;
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
  ): Observable<CredentialDetailResponse>;
}
