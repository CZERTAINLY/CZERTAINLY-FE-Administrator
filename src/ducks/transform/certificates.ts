import { AvailableCertificateFilterDTO, CertificateDTO, CertificateEventHistoryDTO, CertificateSubjectAlternativeNamesDTO, NonCompliantRuleDTO } from "api/certificates";
import { RaProfileDTO } from "api/profiles";
import { AvailableCertificateFilterModel, CertificateEventHistoryModel, CertificateModel, CertificateRAProfileModel, NonCompliantRuleModel } from "models";
import { transformAttributeDTOToModel } from "./attributes";

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
      extendedKeyUsage: certificate.extendedKeyUsage ? JSON.parse(JSON.stringify(certificate.extendedKeyUsage)) : undefined,
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

      meta: certificate.meta ? JSON.parse(JSON.stringify(certificate.meta)) : undefined,

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
         enabled: certificate.raProfile.enabled,
         authorityInstanceUuid: certificate.raProfile.authorityInstanceUuid,
      } : undefined,

      complianceStatus: certificate.complianceStatus,
      nonCompliantRules: transformNonComplianceRulesToModel(certificate.nonCompliantRules),
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
      extendedKeyUsage: certificate.extendedKeyUsage ? JSON.parse(JSON.stringify(certificate.extendedKeyUsage)) : undefined,
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

      meta: certificate.meta ? JSON.parse(JSON.stringify(certificate.meta)) : undefined,

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
         enabled: certificate.raProfile.enabled,
         authorityInstanceUuid: certificate.raProfile.authorityInstanceUuid,
      } : undefined
   }

}


export function transformAvailableCertificateFilterDTOToModel(availableCertificateFilter: AvailableCertificateFilterDTO): AvailableCertificateFilterModel {

   return {
      field: availableCertificateFilter.field,
      label: availableCertificateFilter.label,
      type: availableCertificateFilter.type,
      conditions: [...availableCertificateFilter.conditions],
      value: availableCertificateFilter.value,
      multiValue: availableCertificateFilter.multiValue
   }

}


export function transformCertificateHistoryDTOToModel(certificateHistory: CertificateEventHistoryDTO): CertificateEventHistoryModel {

   return {
      uuid: certificateHistory.uuid,
      certificateUuid: certificateHistory.certificateUuid,
      event: certificateHistory.event,
      message: certificateHistory.message,
      status: certificateHistory.status,
      created: certificateHistory.created,
      createdBy: certificateHistory.createdBy,
      additionalInformation: certificateHistory.additionalInformation
   }

}


export function transformRaProfileDTOToCertificateModel(raProfile: RaProfileDTO): CertificateRAProfileModel {

   return {
      uuid: raProfile.uuid,
      name: raProfile.name,
      enabled: raProfile.enabled,
      authorityInstanceUuid: raProfile.authorityInstanceUuid,
   }

}


export function transformNonComplianceRulesToModel(nonComplianceRules?: NonCompliantRuleDTO[]): NonCompliantRuleModel[] {

   if (!nonComplianceRules) return [];

   return nonComplianceRules.map(
      rule => ({
         connectorName: rule.connectorName,
         ruleName: rule.ruleName,
         ruleDescription: rule.ruleDescription,
         status: rule.status,
         attributes: rule.attributes?.map(attribute => transformAttributeDTOToModel(attribute))
      })
   );

}