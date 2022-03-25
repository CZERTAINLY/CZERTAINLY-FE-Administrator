export interface Certificates {
  uuid: string;
  commonName: string;
}

export interface CertificateDetails {
  uuid: string;
  commonName: string;
  serialNumber: string;
}

export interface CertificateRequestInfo {
  itemsPerPage: number;
  pageNumber: number;
  filters: CertificateRequestInfoFilter[];
}

export interface CertificateRequestInfoFilter {
  field: string;
  condition: string;
  value?: any;
}

export interface CertificateResponseDto {
  certificates: CertificateDetails[];
  itemsPerPage: number;
  pageNumber: number;
  totalPages: number;
  totalItems: number;
}
