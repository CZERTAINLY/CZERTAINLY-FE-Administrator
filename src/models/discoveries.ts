import { Status } from "types/discovery";
import { AttributeModel } from "./attributes/AttributeModel";
import { CertificateModel } from "./certificate";

export interface DiscoveryModel {
    uuid: string;
    name: string;
    connectorUuid: string;
    connectorName: string;
    status: Status;
    totalCertificatesDiscovered?: number;
    startTime: string;
    endTime: string;
    attributes: AttributeModel[];
    certificate: CertificateModel[];
    meta: DiscoveryMeta;
    kind: string;
    message?: string;
  }
  
  
  export interface DiscoveryMeta {
    [key: string]: any;
  }