import {
   CertificateBulkDeleteRequestDto,
   CertificateBulkDeleteRequestModel, CertificateBulkDeleteResponseDto, CertificateBulkDeleteResponseModel,
   CertificateBulkObjectDto,
   CertificateBulkObjectModel, CertificateComplianceCheckModel,
   CertificateComplianceResponseDto,
   CertificateComplianceResponseModel, CertificateHistoryDto, CertificateHistoryModel,
   CertificateListResponseDto,
   CertificateListResponseModel, CertificateObjectDto, CertificateObjectModel,
   CertificateRenewRequestDto,
   CertificateRenewRequestModel,
   CertificateResponseDto,
   CertificateResponseModel,
   CertificateRevokeRequestDto,
   CertificateRevokeRequestModel,
   CertificateSearchFieldDto,
   CertificateSearchFieldModel,
   CertificateSearchFilterDto,
   CertificateSearchFilterModel,
   CertificateSearchRequestDto,
   CertificateSearchRequestModel,
   CertificateSignRequestDto,
   CertificateSignRequestModel, CertificateUploadDto, CertificateUploadModel,
   CertificateValidationDto,
   CertificateValidationModel,
   RaProfileSimplifiedDto,
   RaProfileSimplifiedModel
} from "types/certificate";
import { transformAttributeRequestModelToDto, transformAttributeResponseDtoToModel } from "./attributes";
import { transformLocationResponseDtoToModel, transformMetadataDtoToModel } from "./locations";
import { transformCertificateGroupResponseDtoToModel } from "./certificateGroups";
import { CertificateComplianceCheckDto } from "../../types/openapi";
// import { AvailableCertificateFilterModel, CertificateEventHistoryModel, CertificateModel, CertificateRAProfileModel, NonCompliantRuleModel } from "models";
// import { transformAttributeDTOToModel } from "./attributes";
//
// export function transformCertDTOToModel(certificate: CertificateDTO): CertificateModel {
//
//    const sanClone: CertificateSubjectAlternativeNamesDTO = JSON.parse(JSON.stringify(certificate.subjectAlternativeNames));
//
//    return {
//       uuid: certificate.uuid,
//       commonName: certificate.commonName,
//       serialNumber: certificate.serialNumber,
//       issuerCommonName: certificate.issuerCommonName,
//       certificateContent: certificate.certificateContent,
//       issuerDn: certificate.issuerDn,
//       subjectDn: certificate.subjectDn,
//       notBefore: certificate.notBefore,
//       notAfter: certificate.notAfter,
//       publicKeyAlgorithm: certificate.publicKeyAlgorithm,
//       signatureAlgorithm: certificate.signatureAlgorithm,
//       keySize: certificate.keySize,
//       keyUsage: JSON.parse(JSON.stringify(certificate.keyUsage)),
//       extendedKeyUsage: certificate.extendedKeyUsage ? JSON.parse(JSON.stringify(certificate.extendedKeyUsage)) : undefined,
//       basicConstraints: certificate.basicConstraints,
//       status: certificate.status,
//       fingerprint: certificate.fingerprint,
//       certificateType: certificate.certificateType,
//       issuerSerialNumber: certificate.issuerSerialNumber,
//
//       subjectAlternativeNames: {
//          dNSName: sanClone.dNSName,
//          directoryName: sanClone.directoryName,
//          ediPartyName: sanClone.ediPartyName,
//          iPAddress: sanClone.iPAddress,
//          otherName: sanClone.otherName,
//          registeredID: sanClone.registeredID,
//          rfc822Name: sanClone.rfc822Name,
//          uniformResourceIdentifier: sanClone.uniformResourceIdentifier,
//          x400Address: sanClone.x400Address
//       },
//
//       meta: certificate.meta ? JSON.parse(JSON.stringify(certificate.meta)) : undefined,
//
//       entity: certificate.entity ? {
//          uuid: certificate.entity.uuid,
//          entityType: certificate.entity.entityType,
//          name: certificate.entity.name,
//          description: certificate.entity.description
//       } : undefined,
//
//       certificateGroup: certificate.group ? {
//          uuid: certificate.group.uuid,
//          name: certificate.group.name,
//          description: certificate.group.description
//       } : undefined,
//
//       owner: certificate.owner,
//
//       raProfile: certificate.raProfile ? {
//          uuid: certificate.raProfile.uuid,
//          name: certificate.raProfile.name,
//          enabled: certificate.raProfile.enabled,
//          authorityInstanceUuid: certificate.raProfile.authorityInstanceUuid,
//       } : undefined,
//
//       complianceStatus: certificate.complianceStatus,
//       nonCompliantRules: transformNonComplianceRulesToModel(certificate.nonCompliantRules),
//    }
//
// }
//
//
// export function transformCertModelToDTO(certificate: CertificateModel): CertificateDTO {
//
//    const sanClone: CertificateSubjectAlternativeNamesDTO = JSON.parse(JSON.stringify(certificate.subjectAlternativeNames));
//
//    return {
//       uuid: certificate.uuid,
//       commonName: certificate.commonName,
//       serialNumber: certificate.serialNumber,
//       issuerCommonName: certificate.issuerCommonName,
//       certificateContent: certificate.certificateContent,
//       issuerDn: certificate.issuerDn,
//       subjectDn: certificate.subjectDn,
//       notBefore: certificate.notBefore,
//       notAfter: certificate.notAfter,
//       publicKeyAlgorithm: certificate.publicKeyAlgorithm,
//       signatureAlgorithm: certificate.signatureAlgorithm,
//       keySize: certificate.keySize,
//       keyUsage: JSON.parse(JSON.stringify(certificate.keyUsage)),
//       extendedKeyUsage: certificate.extendedKeyUsage ? JSON.parse(JSON.stringify(certificate.extendedKeyUsage)) : undefined,
//       basicConstraints: certificate.basicConstraints,
//       status: certificate.status,
//       fingerprint: certificate.fingerprint,
//       certificateType: certificate.certificateType,
//       issuerSerialNumber: certificate.issuerSerialNumber,
//
//       subjectAlternativeNames: {
//          dNSName: sanClone.dNSName,
//          directoryName: sanClone.directoryName,
//          ediPartyName: sanClone.ediPartyName,
//          iPAddress: sanClone.iPAddress,
//          otherName: sanClone.otherName,
//          registeredID: sanClone.registeredID,
//          rfc822Name: sanClone.rfc822Name,
//          uniformResourceIdentifier: sanClone.uniformResourceIdentifier,
//          x400Address: sanClone.x400Address
//       },
//
//       meta: certificate.meta ? JSON.parse(JSON.stringify(certificate.meta)) : undefined,
//
//       entity: certificate.entity ? {
//          uuid: certificate.entity.uuid,
//          entityType: certificate.entity.entityType,
//          name: certificate.entity.name,
//          description: certificate.entity.description
//       } : undefined,
//
//       certificateGroup: certificate.group ? {
//          uuid: certificate.group.uuid,
//          name: certificate.group.name,
//          description: certificate.group.description
//       } : undefined,
//
//       owner: certificate.owner,
//
//       raProfile: certificate.raProfile ? {
//          uuid: certificate.raProfile.uuid,
//          name: certificate.raProfile.name,
//          enabled: certificate.raProfile.enabled,
//          authorityInstanceUuid: certificate.raProfile.authorityInstanceUuid,
//       } : undefined
//    }
//
// }
//
//
// export function transformAvailableCertificateFilterDTOToModel(availableCertificateFilter: AvailableCertificateFilterDTO): AvailableCertificateFilterModel {
//
//    return {
//       field: availableCertificateFilter.field,
//       label: availableCertificateFilter.label,
//       type: availableCertificateFilter.type,
//       conditions: [...availableCertificateFilter.conditions],
//       value: availableCertificateFilter.value,
//       multiValue: availableCertificateFilter.multiValue
//    }
//
// }
//
//
// export function transformCertificateHistoryDTOToModel(certificateHistory: CertificateEventHistoryDTO): CertificateEventHistoryModel {
//
//    return {
//       uuid: certificateHistory.uuid,
//       certificateUuid: certificateHistory.certificateUuid,
//       event: certificateHistory.event,
//       message: certificateHistory.message,
//       status: certificateHistory.status,
//       created: certificateHistory.created,
//       createdBy: certificateHistory.createdBy,
//       additionalInformation: certificateHistory.additionalInformation
//    }
//
// }
//
//
// export function transformRaProfileDTOToCertificateModel(raProfile: RaProfileDTO): CertificateRAProfileModel {
//
//    return {
//       uuid: raProfile.uuid,
//       name: raProfile.name,
//       enabled: raProfile.enabled,
//       authorityInstanceUuid: raProfile.authorityInstanceUuid,
//    }
//
// }
//
//
// export function transformNonComplianceRulesToModel(nonComplianceRules?: NonCompliantRuleDTO[]): NonCompliantRuleModel[] {
//
//    if (!nonComplianceRules) return [];
//
//    return nonComplianceRules.map(
//       rule => ({
//          connectorName: rule.connectorName,
//          ruleName: rule.ruleName,
//          ruleDescription: rule.ruleDescription,
//          status: rule.status,
//          attributes: rule.attributes?.map(attribute => transformAttributeDTOToModel(attribute))
//       })
//    );
//
// }


export function transformCertificateSearchFilterModelToDto(search: CertificateSearchFilterModel): CertificateSearchFilterDto {
   return { ...search };
}

export function transformCertificateSearchRequestModelToDto(search: CertificateSearchRequestModel): CertificateSearchRequestDto {
   return {
      ...search,
      filters: search.filters?.map(transformCertificateSearchFilterModelToDto)
   };
}

export function transformRaProfileSimplifiedDtoToModel(raProfile: RaProfileSimplifiedDto): RaProfileSimplifiedModel {
   return { ...raProfile };
}

export function transformCertificateComplianceResponseDtoToModel(cerCompliance: CertificateComplianceResponseDto): CertificateComplianceResponseModel {
   return {
      ...cerCompliance,
      attributes: cerCompliance.attributes?.map(transformAttributeResponseDtoToModel)
   };
}

export function transformCertificateResponseDtoToModel(certificate: CertificateResponseDto): CertificateResponseModel {
   return {
      ...certificate,
      metadata: certificate.metadata?.map(transformMetadataDtoToModel),
      raProfile: certificate.raProfile ? transformRaProfileSimplifiedDtoToModel(certificate.raProfile) : undefined,
      locations: certificate.locations?.map(transformLocationResponseDtoToModel),
      group: certificate.group ? transformCertificateGroupResponseDtoToModel(certificate.group) : undefined,
      nonCompliantRules: certificate.nonCompliantRules?.map(transformCertificateComplianceResponseDtoToModel)
   };
}

export function transformCertificateListResponseDtoToModel(certificates: CertificateListResponseDto): CertificateListResponseModel {
   return {
      ...certificates,
      certificates: certificates.certificates.map(transformCertificateResponseDtoToModel)
   };
}

export function transformCertificateSignRequestModelToDto(signRequest: CertificateSignRequestModel): CertificateSignRequestDto {
   return {
      ...signRequest,
      attributes: signRequest.attributes.map(transformAttributeRequestModelToDto)
   };
}

export function transformCertificateRevokeRequestModelToDto(revokeRequest: CertificateRevokeRequestModel): CertificateRevokeRequestDto {
   return {
      ...revokeRequest,
      attributes: revokeRequest.attributes.map(transformAttributeRequestModelToDto)
   };
}

export function transformCertificateRenewRequestModelToDto(renewRequest: CertificateRenewRequestModel): CertificateRenewRequestDto {
   return { ...renewRequest };
}

export function transformCertificateSearchFieldDtoToModel(searchField: CertificateSearchFieldDto): CertificateSearchFieldModel {
   return { ...searchField };
}

export function transformCertificateHistoryDtoToModel(history: CertificateHistoryDto): CertificateHistoryModel {
   return { ...history };
}

export function transformCertificateObjectModelToDto(certificateObject: CertificateObjectModel): CertificateObjectDto {
   return { ...certificateObject };
}

export function transformCertificateBulkObjectModelToDto(bulk: CertificateBulkObjectModel): CertificateBulkObjectDto {
   return {
      ...bulk,
      filters: bulk.filters?.map(transformCertificateSearchFilterModelToDto)
   }
}

export function transformCertificateBulkDeleteRequestModelToDto(bulk: CertificateBulkDeleteRequestModel): CertificateBulkDeleteRequestDto {
   return {
      ...bulk,
      filters: bulk.filters?.map(transformCertificateSearchFilterModelToDto)
   }
}

export function transformCertificateBulkDeleteResponseDtoToModel(bulk: CertificateBulkDeleteResponseDto): CertificateBulkDeleteResponseModel {
   return { ...bulk };
}

export function transformCertificateUploadModelToDto(upload: CertificateUploadModel): CertificateUploadDto {
   return { ...upload };
}

export function transformCertificateComplianceCheckModelToDto(check: CertificateComplianceCheckModel): CertificateComplianceCheckDto {
   return { ...check };
}