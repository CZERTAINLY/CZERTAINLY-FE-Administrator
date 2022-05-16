import { CertificateDTO } from "api/certificates";
import { certificatePEM2CertificateDTO } from "utils/certificate";
import { dbData } from "./db";

export function getOrCreateCertificate(certificateContent: string | undefined, certificateUuid: string | undefined): CertificateDTO | undefined {

   let certificate: CertificateDTO | undefined;

   if (certificateUuid) {
      const crt = dbData.certificates.find(cerificate => cerificate.uuid === certificateUuid);
      certificate = crt;
   }

   if (!certificateContent) return certificate;

   const acrt = certificatePEM2CertificateDTO(certificateContent);
   const crt = dbData.certificates.find(certificate => certificate.fingerprint === acrt.fingerprint && certificate.serialNumber === acrt.serialNumber);

   if (crt) return crt;

   acrt.uuid = crypto.randomUUID();
   dbData.certificates.push(acrt);

   return acrt;

}
