import { Certificate, DistinguishedName } from '@fidm/x509';

import { Certificate as InternalCertificate } from 'models';

function getDistinguishedName(dn: DistinguishedName): string {
  const segments = [] as string[];

  if (dn) {
    if (dn.commonName) {
      segments.push(`CN=${dn.commonName}`);
    }
    if (dn.organizationName) {
      segments.push(`O=${dn.organizationName}`);
    }
    if (dn.organizationalUnitName) {
      segments.push(`OU=${dn.organizationalUnitName}`);
    }
    if (dn.localityName) {
      segments.push(`L=${dn.localityName}`);
    }
    if (dn.countryName) {
      segments.push(`C=${dn.countryName}`);
    }
  }

  return segments.join(',');
}

export function getCertificateInformation(encoded: string): InternalCertificate {
  let toDecode = encoded;

  if (!encoded.startsWith('-----BEGIN CERTIFICATE-----')) {
    toDecode = `-----BEGIN CERTIFICATE-----
      ${encoded}
      -----END CERTIFICATE-----
    `;
  }

  const cert = Certificate.fromPEM(Buffer.from(toDecode, 'utf-8'));
  const subjectDn = getDistinguishedName(cert.subject);
  const issuerDn = getDistinguishedName(cert.issuer);
  
  return {
    subjectDn,
    issuerDn,
    validFrom: cert.validFrom,
    validTo: cert.validTo,
    serialNumber: cert.serialNumber,
  };
}
