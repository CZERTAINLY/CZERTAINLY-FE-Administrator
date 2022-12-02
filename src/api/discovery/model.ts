import { CertificateDTO } from "api/certificates";
import { ConnectorDTO } from "api/connectors";
import { AttributeDTO } from "api/_common/attributeDTO";
import { Observable } from "rxjs";
import { Status } from "types/discoveries";


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
