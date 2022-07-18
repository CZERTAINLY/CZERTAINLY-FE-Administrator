import { CertificateDTO } from "api/certificates";
import { certificatePEM2CertificateModel } from "utils/certificate";
import { dbData } from "./db";

export function getOrCreateCertificate(certificateContent: string | undefined, certificateUuid: string | undefined): CertificateDTO | undefined {

   let certificate: CertificateDTO | undefined;

   if (certificateUuid) {
      const crt = dbData.certificates.find(cerificate => cerificate.uuid === certificateUuid);
      certificate = crt;
   }

   if (!certificateContent) return certificate;

   const mcrt = certificatePEM2CertificateModel(certificateContent);
   const crt = dbData.certificates.find(certificate => certificate.fingerprint === mcrt.fingerprint && certificate.serialNumber === mcrt.serialNumber);

   if (crt) return crt;

   mcrt.uuid = crypto.randomUUID();

   const dtoctr: CertificateDTO = {
      ...mcrt,
      subjectAlternativeNames: {
         dNSName: mcrt.subjectAlternativeNames?.dNSName || [],
         directoryName: mcrt.subjectAlternativeNames?.directoryName || [],
         ediPartyName: mcrt.subjectAlternativeNames?.ediPartyName || [],
         iPAddress: mcrt.subjectAlternativeNames?.iPAddress || [],
         otherName: mcrt.subjectAlternativeNames?.otherName || [],
         registeredID: mcrt.subjectAlternativeNames?.registeredID || [],
         rfc822Name: mcrt.subjectAlternativeNames?.rfc822Name || [],
         uniformResourceIdentifier: mcrt.subjectAlternativeNames?.uniformResourceIdentifier || [],
         x400Address: mcrt.subjectAlternativeNames?.x400Address || [],
      }
   }

   dbData.certificates.push(dtoctr);

   return dtoctr;

}
