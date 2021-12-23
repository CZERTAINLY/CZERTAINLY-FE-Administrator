import { FunctionGroup } from "api/connectors";
import { ErrorDeleteObject } from "models";
import { AttributeResponse } from "models/attributes";
import { Observable } from "rxjs";

export interface AuthorityInfoResponse {
  uuid: string;
  name: string;
  connectorUuid: string;
  kind: string;
  connectorName: string;
}

export interface AuthorityDetailResponse {
  uuid: string;
  name?: string;
  attributes?: AttributeResponse[];
  connectorUuid: string;
  credential?: any;
  kind: string;
  connectorName: string;
}

export interface AuthorityProviderResponse {
  uuid: string;
  name: string;
  status?: string;
  url: string;
  functionGroups: FunctionGroup[];
}

export interface AuthorityProviderAttributes {
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
  validationRegex?: string;
  dependsOn?: any;
  value?: any;
}

export interface AuthorityManagementApi {
  createNewAuthority(
    name: string,
    connectorUuid: string,
    credential: any,
    status: string,
    attributes: any,
    kind: string
  ): Observable<string>;
  getAuthoritiesList(): Observable<AuthorityInfoResponse[]>;
  getAuthorityDetail(uuid: string): Observable<AuthorityDetailResponse>;
  getAuthorityProviderList(): Observable<AuthorityProviderResponse[]>;
  getAuthorityProviderAttributes(
    uuid: string,
    kind: string,
    functionGroup: string
  ): Observable<AuthorityProviderAttributes[]>;
  deleteAuthority(uuid: number | string): Observable<ErrorDeleteObject[]>;
  deleteBulkAuthority(
    uuid: (number | string)[]
  ): Observable<ErrorDeleteObject[]>;
  forceDeleteAuthority(uuid: string | number): Observable<void>;
  bulkForceDeleteAuthority(uuid: (string | number)[]): Observable<void>;
  updateAuthority(
    uuid: string,
    name: string,
    connectorUuid: string,
    credential: any,
    status: string,
    attributes: any,
    kind: string
  ): Observable<AuthorityDetailResponse>;
}
