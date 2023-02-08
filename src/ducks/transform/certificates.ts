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
   CertificateDetailResponseDto,
   CertificateDetailResponseModel,
   CertificateRevokeRequestDto,
   CertificateRevokeRequestModel,
   CertificateSignRequestDto,
   CertificateSignRequestModel,
   CertificateUploadDto,
   CertificateUploadModel,
   RaProfileSimplifiedDto,
   RaProfileSimplifiedModel,
   SearchFieldDto,
   SearchFieldModel,
   SearchFilterDto,
   SearchFilterModel,
   SearchRequestDto,
   SearchRequestModel,
} from "types/certificate";
import { CertificateComplianceCheckDto } from "../../types/openapi";
import { transformAttributeRequestModelToDto, transformAttributeResponseDtoToModel } from "./attributes";
import { transformCertificateGroupResponseDtoToModel } from "./certificateGroups";
import { transformLocationResponseDtoToModel, transformMetadataDtoToModel } from "./locations";

export function transformSearchFilterModelToDto(search: SearchFilterModel): SearchFilterDto {
   return { ...search };
}

export function transformSearchRequestModelToDto(search: SearchRequestModel): SearchRequestDto {
   return {
      ...search,
      filters: search.filters?.map(transformSearchFilterModelToDto)
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

export function transformCertificateDetailResponseDtoToModel(certificate: CertificateDetailResponseDto): CertificateDetailResponseModel {
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


export function transformCertificateResponseDtoToModel(certificate: CertificateListResponseDto): CertificateListResponseModel {
   return {
      ...certificate,
      raProfile: certificate.raProfile ? transformRaProfileSimplifiedDtoToModel(certificate.raProfile) : undefined,
      group: certificate.group ? transformCertificateGroupResponseDtoToModel(certificate.group) : undefined,
   };
}

export function transformCertificateListResponseDtoToModel(certificates: CertificateListResponseDto): CertificateListResponseModel {
   return {
      ...certificates
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

export function transformSearchFieldDtoToModel(searchField: SearchFieldDto): SearchFieldModel {
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
      filters: bulk.filters?.map(transformSearchFilterModelToDto)
   }
}

export function transformCertificateBulkDeleteRequestModelToDto(bulk: CertificateBulkDeleteRequestModel): CertificateBulkDeleteRequestDto {
   return {
      ...bulk,
      filters: bulk.filters?.map(transformSearchFilterModelToDto)
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