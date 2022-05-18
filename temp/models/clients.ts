import { CertificateDetailResponse } from "models";

export interface Client {
  uuid: string;
  name: string;
  certificate?: CertificateDetailResponse;
  enabled: boolean;
  description?: string;
  serialNumber?: string;
}

export interface ClientDetails {
  uuid: string;
  name?: string;
  description?: string;
  certificate?: CertificateDetailResponse;
  enabled?: boolean;
  serialNumber: string;
}
