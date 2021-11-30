import { CertificateDetailResponse } from "models";

export interface Administrator {
  uuid: string;
  name: string;
  surname: string;
  username: string;
  certificate: CertificateDetailResponse;
  superAdmin: boolean;
  enabled: boolean;
  serialNumber?: string;
}

export interface AdministratorDetail {
  uuid: string;
  name: string;
  surname: string;
  username: string;
  email: string;
  description: string;
  certificate: CertificateDetailResponse;
  superAdmin: boolean;
  enabled: boolean;
  serialNumber?: string;
}
