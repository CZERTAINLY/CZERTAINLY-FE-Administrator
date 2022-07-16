import { CertificateDTO } from "api/certificates";
import { ConnectorDTO } from "api/connectors";
import { AttributeDTO } from "api/_common/attributeDTO";
import { Observable } from "rxjs";
import { Status } from "types/discovery";


export interface DiscoveryDTO {
  uuid: string;
  name: string;
  connectorUuid: string;
  connectorName: string;
  status: Status;
  totalCertificatesDiscovered?: number;
  startTime: string;
  endTime: string;
  attributes: AttributeDTO[];
  certificate: CertificateDTO[];
  meta: DiscoveryMeta;
  kind: string;
  message?: string;
}


export interface DiscoveryMeta {
  [key: string]: any;
}


export interface DiscoveryManagementApi {
  createNewDiscovery(
    name: string,
    kind: string,
    connectorUuid: string,
    attributes: AttributeDTO[]
  ): Observable<string>;
  getDiscoveryList(): Observable<DiscoveryDTO[]>;
  getDiscoveryDetail(uuid: string): Observable<DiscoveryDTO>;
  getDiscoveryProviderList(): Observable<ConnectorDTO[]>;
  getDiscoveryProviderAttributes(
    uuid: string,
    kind: string
  ): Observable<AttributeDTO[]>;
  deleteDiscovery(uuid: string): Observable<void>;
  bulkDeleteDiscovery(uuid: string[]): Observable<void>;
}
