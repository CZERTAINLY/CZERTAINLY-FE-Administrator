import { Certificate, DistinguishedName, Extension } from '@fidm/x509';
import { CertificateDTO, CertificateSubjectAlternativeNamesDTO } from 'api/certificates';

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


export function certificatePEM2CertificateDTO(certificate: string): CertificateDTO {

   const crt = Certificate.fromPEM(Buffer.from(certificate));

   enum KeyUsageFlags {
      digitalSignature = 1,
      nonRepudiation = 2,
      keyEncipherment = 4,
      dataEncipherment = 8,
      keyAgreement = 16,
      keyCertSign = 32,
      cRLSign = 64,
      encipherOnly = 128,
      decipherOnly = 256
   }


   function buildDnString(dn: DistinguishedName): string {

      const tmp: string[] = [];

      if (dn.commonName) tmp.push(`CN=${dn.commonName}`);
      if (dn.organizationName) tmp.push(`O=${dn.organizationName}`);
      if (dn.organizationalUnitName) tmp.push(`OU=${dn.organizationalUnitName}`);
      if (dn.localityName) tmp.push(`L=${dn.localityName}`);
      if (dn.countryName) tmp.push(`C=${dn.countryName}`);

      return tmp.join(";");

   }


   function buildKeyUsages(): string[] {

      const tmp: string[] = [];

      if (crt.keyUsage & KeyUsageFlags.digitalSignature) tmp.push("digitalSignature");
      if (crt.keyUsage & KeyUsageFlags.nonRepudiation) tmp.push("nonRepudiation");
      if (crt.keyUsage & KeyUsageFlags.keyEncipherment) tmp.push("keyEncipherment");
      if (crt.keyUsage & KeyUsageFlags.dataEncipherment) tmp.push("dataEncipherment");
      if (crt.keyUsage & KeyUsageFlags.keyAgreement) tmp.push("keyAgreement");
      if (crt.keyUsage & KeyUsageFlags.keyCertSign) tmp.push("keyCertSign");
      if (crt.keyUsage & KeyUsageFlags.cRLSign) tmp.push("cRLSign");
      if (crt.keyUsage & KeyUsageFlags.encipherOnly) tmp.push("encipherOnly");
      if (crt.keyUsage & KeyUsageFlags.decipherOnly) tmp.push("decipherOnly");

      return tmp;

   }


   function buildBasicConstraints(): string {

      const tmp: string[] = [];

      const bc = crt.extensions.find(ext => ext.name === "basicConstraints");
      if (!bc) return "";

      tmp.push(`critical: ${bc.critical ? "yes" : "no"}`);
      tmp.push(`CA: ${bc.isCA ? "true" : "false"}`);
      tmp.push(`Path length: ${bc.maxPathLen === -1 ? "unlimited" : bc.maxPathLen.toString() }`);

      return tmp.join(", ");

   }


   function getSubjectAlternativeNames(): CertificateSubjectAlternativeNamesDTO {

      return {
         dNSName: crt.dnsNames,
         directoryName: [],
         ediPartyName: [],
         iPAddress: crt.ipAddresses,
         otherName: [],
         registeredID: [],
         rfc822Name: [],
         uniformResourceIdentifier: crt.uris,
         x400Address: crt.emailAddresses
      }

   }


   let encoded = certificate;

   if (!encoded.startsWith('-----BEGIN CERTIFICATE-----')) {
      encoded = `-----BEGIN CERTIFICATE-----\n${encoded}\n-----END CERTIFICATE-----\n`;
   }



   return {
      uuid: "",
      commonName: crt.subject.commonName,
      issuerCommonName: crt.issuer.commonName,
      issuerSerialNumber: crt.issuer.serialName,
      issuerDn: buildDnString(crt.issuer),
      subjectDn: buildDnString(crt.subject),
      serialNumber: crt.serialNumber,
      notBefore: crt.validFrom.toUTCString(),
      notAfter: crt.validTo.toUTCString(),
      keySize: crt.publicKey.keyRaw.length,
      publicKeyAlgorithm: crt.publicKey.algo,
      signatureAlgorithm: crt.signatureAlgorithm,
      fingerprint: btoa(crt.publicKey.getFingerprint("sha1").toString()),
      keyUsage: buildKeyUsages(),
      basicConstraints: buildBasicConstraints(),
      extendedKeyUsage: [],
      subjectAlternativeNames: getSubjectAlternativeNames(),

      status: "unknown",
      certificateContent: encoded,
      certificateType: "X509",

   }

}
