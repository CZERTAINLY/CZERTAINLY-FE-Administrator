import { CertificateModel } from "models";

export interface ClientModel {
  uuid: string;
  name: string;
  certificate?: CertificateModel;
  enabled: boolean;
  description?: string;
  serialNumber: string;
}
