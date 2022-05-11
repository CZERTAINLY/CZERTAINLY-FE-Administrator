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


export interface X509Certificate {

   readonly version: number;
   readonly serialNumber: string;
   readonly signatureOID: string;
   readonly signatureAlgorithm: string;
   readonly infoSignatureOID: string;
   readonly signature: Buffer;
   readonly subjectKeyIdentifier: string;
   readonly authorityKeyIdentifier: string;
   readonly ocspServer: string;
   readonly issuingCertificateURL: string;
   readonly isCA: boolean;
   readonly maxPathLen: number;
   readonly basicConstraintsValid: boolean;
   readonly keyUsage: string[];
   readonly dnsNames: string[];
   readonly emailAddresses: string[];
   readonly ipAddresses: string[];
   readonly uris: string[];
   readonly validFrom: Date;
   readonly validTo: Date;
   readonly issuer: DistinguishedName;
   readonly subject: DistinguishedName;
   readonly extensions: Extension[];
   readonly publicKey: PublicKey;
   readonly publicKeyRaw: Buffer;
   readonly tbsCertificate: ASN1;


   commonName: string,
   issuerCommonName: string,
   certificateContent: string,
   issuerDn: string,
   subjectDn: string,
   notBefore: string,
   notAfter: string,
   publicKeyAlgorithm: string,
   keySize: number,
   extendedKeyUsage?: string[],
   basicConstraints: string,
   status: "unknown",
   fingerprint: string,

}