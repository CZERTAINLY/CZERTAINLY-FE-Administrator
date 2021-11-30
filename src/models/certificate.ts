export interface Certificate {
  subjectDn: string;
  issuerDn: string;
  validFrom: Date;
  validTo: Date;
  serialNumber: string;
}

export interface CertificateDetailResponse {
  uuid: string;
  commonName: string;
  serialNumber: string;
  issuerCommonName?: string;
  certificateContent?: string;
  issuerDn?: string;
  subjectDn?: string;
  notAfter?: string;
  notBefore?: string;
  publicKeyAlgorithm?: string;
  signatureAlgorithm?: string;
  keySize?: number;
  basicConstraints?: string;
  status?: string;
  fingerprint?: string;
  subjectAlternativeNames?: CertificateMeta;
  keyUsage?: string[];
  extendedKeyUsage?: string[];
  meta?: CertificateMeta;
  entity?: any;
  group?: any;
  owner?: string;
  raProfile?: any;
  issuerSerialNumber?: string;
  certificateType?: string;
  certificateValidationResult?: CertificateMeta;
}

export interface CertificateMeta {
  [key: string]: any;
}
