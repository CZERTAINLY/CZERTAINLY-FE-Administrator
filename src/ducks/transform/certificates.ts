import { CertificateDTO, CertificateSubjectAlternativeNamesDTO } from "api/certificates";
import { CertificateModel } from "models";

export function transformCertDTOToModel(certificate: CertificateDTO): CertificateModel {

   const sanClone: CertificateSubjectAlternativeNamesDTO = JSON.parse(JSON.stringify(certificate.subjectAlternativeNames));

   return {
      uuid: certificate.uuid,
      commonName: certificate.commonName,
      serialNumber: certificate.serialNumber,
      issuerCommonName: certificate.issuerCommonName,
      certificateContent: certificate.certificateContent,
      issuerDn: certificate.issuerDn,
      subjectDn: certificate.subjectDn,
      notBefore: certificate.notBefore,
      notAfter: certificate.notAfter,
      publicKeyAlgorithm: certificate.publicKeyAlgorithm,
      signatureAlgorithm: certificate.signatureAlgorithm,
      keySize: certificate.keySize,
      keyUsage: JSON.parse(JSON.stringify(certificate.keyUsage)),
      extendedKeyUsage: certificate.keyUsage ? JSON.parse(JSON.stringify(certificate.keyUsage)) : undefined,
      basicConstraints: certificate.basicConstraints,
      status: certificate.status,
      fingerprint: certificate.fingerprint,
      certificateType: certificate.certificateType,
      issuerSerialNumber: certificate.issuerSerialNumber,

      subjectAlternativeNames: {
         dNSName: sanClone.dNSName,
         directoryName: sanClone.directoryName,
         ediPartyName: sanClone.ediPartyName,
         iPAddress: sanClone.iPAddress,
         otherName: sanClone.otherName,
         registeredID: sanClone.registeredID,
         rfc822Name: sanClone.rfc822Name,
         uniformResourceIdentifier: sanClone.uniformResourceIdentifier,
         x400Address: sanClone.x400Address
      },

      meta: certificate.meta ? {
         cipherSuite: certificate.meta.cipherSuite,
         discoverySource: certificate.meta.discoverySource
      } : undefined,

      certificateValidationResult: certificate.certificateValidationResult ? {
         status: certificate.certificateValidationResult.status
      } : undefined,

      entity: certificate.entity ? {
         uuid: certificate.entity.uuid,
         entityType: certificate.entity.entityType,
         name: certificate.entity.name,
         description: certificate.entity.description
      } : undefined,

      group: certificate.group ? {
         uuid: certificate.group.uuid,
         name: certificate.group.name,
         description: certificate.group.description
      } : undefined,

      owner: certificate.owner,

      raProfile: certificate.raProfile ? {
         uuid: certificate.raProfile.uuid,
         name: certificate.raProfile.name,
         enabled: certificate.raProfile.enabled
      } : undefined
   }

}


export function transformCertModelToDTO(certificate: CertificateModel): CertificateDTO {

   const sanClone: CertificateSubjectAlternativeNamesDTO = JSON.parse(JSON.stringify(certificate.subjectAlternativeNames));

   return {
      uuid: certificate.uuid,
      commonName: certificate.commonName,
      serialNumber: certificate.serialNumber,
      issuerCommonName: certificate.issuerCommonName,
      certificateContent: certificate.certificateContent,
      issuerDn: certificate.issuerDn,
      subjectDn: certificate.subjectDn,
      notBefore: certificate.notBefore,
      notAfter: certificate.notAfter,
      publicKeyAlgorithm: certificate.publicKeyAlgorithm,
      signatureAlgorithm: certificate.signatureAlgorithm,
      keySize: certificate.keySize,
      keyUsage: JSON.parse(JSON.stringify(certificate.keyUsage)),
      extendedKeyUsage: certificate.keyUsage ? JSON.parse(JSON.stringify(certificate.keyUsage)) : undefined,
      basicConstraints: certificate.basicConstraints,
      status: certificate.status,
      fingerprint: certificate.fingerprint,
      certificateType: certificate.certificateType,
      issuerSerialNumber: certificate.issuerSerialNumber,

      subjectAlternativeNames: {
         dNSName: sanClone.dNSName,
         directoryName: sanClone.directoryName,
         ediPartyName: sanClone.ediPartyName,
         iPAddress: sanClone.iPAddress,
         otherName: sanClone.otherName,
         registeredID: sanClone.registeredID,
         rfc822Name: sanClone.rfc822Name,
         uniformResourceIdentifier: sanClone.uniformResourceIdentifier,
         x400Address: sanClone.x400Address
      },

      meta: certificate.meta ? {
         cipherSuite: certificate.meta.cipherSuite,
         discoverySource: certificate.meta.discoverySource
      } : undefined,

      certificateValidationResult: certificate.certificateValidationResult ? {
         status: certificate.certificateValidationResult.status
      } : undefined,

      entity: certificate.entity ? {
         uuid: certificate.entity.uuid,
         entityType: certificate.entity.entityType,
         name: certificate.entity.name,
         description: certificate.entity.description
      } : undefined,

      group: certificate.group ? {
         uuid: certificate.group.uuid,
         name: certificate.group.name,
         description: certificate.group.description
      } : undefined,

      owner: certificate.owner,

      raProfile: certificate.raProfile ? {
         uuid: certificate.raProfile.uuid,
         name: certificate.raProfile.name,
         enabled: certificate.raProfile.enabled
      } : undefined
   }

}
