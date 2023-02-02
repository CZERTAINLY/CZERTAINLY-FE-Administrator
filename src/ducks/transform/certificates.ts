import {
   CertificateBulkDeleteRequestDto,
   CertificateBulkDeleteRequestModel,
   CertificateBulkDeleteResponseDto,
   CertificateBulkDeleteResponseModel,
   CertificateBulkObjectDto,
   CertificateBulkObjectModel,
   CertificateComplianceCheckModel,
   CertificateComplianceResponseDto,
   CertificateComplianceResponseModel,
   CertificateHistoryDto,
   CertificateHistoryModel,
   CertificateListResponseDto,
   CertificateListResponseModel,
   CertificateObjectDto,
   CertificateObjectModel,
   CertificateRekeyRequestDto,
   CertificateRekeyRequestModel,
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
   CertificateSignRequestModel,
   CertificateUploadDto,
   CertificateUploadModel,
   RaProfileSimplifiedDto,
   RaProfileSimplifiedModel,
} from "types/certificate";
import { CertificateComplianceCheckDto } from "../../types/openapi";
import { transformAttributeRequestModelToDto, transformAttributeResponseDtoToModel } from "./attributes";
import { transformCertificateGroupResponseDtoToModel } from "./certificateGroups";
import { transformLocationResponseDtoToModel, transformMetadataDtoToModel } from "./locations";

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
      nonCompliantRules: certificate.nonCompliantRules?.map(transformCertificateComplianceResponseDtoToModel),
      customAttributes: certificate.customAttributes?.map(transformAttributeResponseDtoToModel)
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
      attributes: signRequest.attributes.map(transformAttributeRequestModelToDto),
      customAttributes: signRequest.customAttributes?.map(transformAttributeRequestModelToDto)
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

export function transformCertificateRekeyRequestModelToDto(rekeyRequest: CertificateRekeyRequestModel): CertificateRekeyRequestDto {
   return { ...rekeyRequest };
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
   return {
      ...upload,
      customAttributes: upload.customAttributes.map(transformAttributeRequestModelToDto)
   };
}

export function transformCertificateComplianceCheckModelToDto(check: CertificateComplianceCheckModel): CertificateComplianceCheckDto {
   return { ...check };
}