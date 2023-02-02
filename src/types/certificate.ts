import {
    BulkOperationResponse, CertificateComplianceCheckDto,
    CertificateComplianceResultDto,
    CertificateDto, CertificateEventHistoryDto,
    CertificateResponseDto as CertificateResponseDtoOpenApi, CertificateUpdateObjectsDto,
    CertificateValidationDto as CertificateValidationDtoOpenApi,
    ClientCertificateRekeyRequestDto,
    ClientCertificateRenewRequestDto,
    ClientCertificateRevocationDto,
    ClientCertificateSignRequestDto, MultipleCertificateObjectUpdateDto,
    RemoveCertificateDto, SearchFieldDataDto,
    SearchFilterRequestDto,
    SearchRequestDto,
    SimplifiedRaProfileDto, UploadCertificateRequestDto
} from "./openapi";
import { LocationResponseModel, MetadataModel } from "./locations";
import { CertificateGroupResponseModel } from "./certificateGroups";
import { AttributeRequestModel, AttributeResponseModel } from "./attributes";

export type CertificateSearchFilterDto = SearchFilterRequestDto;
export type CertificateSearchFilterModel = CertificateSearchFilterDto;

export type CertificateSearchRequestDto = SearchRequestDto;
export type CertificateSearchRequestModel = Omit<CertificateSearchRequestDto, "filters"> & { filters?: Array<CertificateSearchFilterModel> };

export type RaProfileSimplifiedDto = SimplifiedRaProfileDto;
export type RaProfileSimplifiedModel = RaProfileSimplifiedDto;

export type CertificateComplianceResponseDto = CertificateComplianceResultDto;
export type CertificateComplianceResponseModel = Omit<CertificateComplianceResponseDto, "attributes"> & { attributes?: Array<AttributeResponseModel> };

export type CertificateResponseDto = CertificateDto;
export type CertificateResponseModel = Omit<CertificateResponseDto, "metadata | raProfile | locations | group | nonCompliantRules | customAttributes"> & {
    metadata?: Array<MetadataModel>,
    raProfile?: RaProfileSimplifiedModel,
    locations?: Array<LocationResponseModel>,
    group?: CertificateGroupResponseModel,
    nonCompliantRules?: Array<CertificateComplianceResponseModel>,
    customAttributes?: Array<AttributeResponseModel>,
}

export type CertificateListResponseDto = CertificateResponseDtoOpenApi;
export type CertificateListResponseModel = Omit<CertificateListResponseDto, "certificates"> & { certificates: Array<CertificateResponseModel> };

export type CertificateValidationDto = CertificateValidationDtoOpenApi;
export type CertificateValidationModel = CertificateValidationDto;

export type CertificateSignRequestDto = ClientCertificateSignRequestDto;
export type CertificateSignRequestModel = Omit<CertificateSignRequestDto, "attributes | customAttributes | csrAttributes | signatureAttributes"> & { attributes: Array<AttributeRequestModel>, customAttributes?: Array<AttributeRequestModel>, csrAttributes?: Array<AttributeRequestModel>, signatureAttributes?: Array<AttributeRequestModel> };

export type CertificateRevokeRequestDto = ClientCertificateRevocationDto;
export type CertificateRevokeRequestModel = Omit<CertificateRevokeRequestDto, "attributes"> & { attributes: Array<AttributeRequestModel> };

export type CertificateRenewRequestDto = ClientCertificateRenewRequestDto;
export type CertificateRenewRequestModel = CertificateRenewRequestDto;

export type CertificateRekeyRequestDto = ClientCertificateRekeyRequestDto;
export type CertificateRekeyRequestModel = CertificateRekeyRequestDto;

export type CertificateSearchFieldDto = SearchFieldDataDto;
export type CertificateSearchFieldModel = CertificateSearchFieldDto;

export type CertificateHistoryDto = CertificateEventHistoryDto;
export type CertificateHistoryModel = CertificateHistoryDto;

export type CertificateObjectDto = CertificateUpdateObjectsDto;
export type CertificateObjectModel = CertificateObjectDto;

export type CertificateBulkObjectDto = MultipleCertificateObjectUpdateDto;
export type CertificateBulkObjectModel = Omit<CertificateBulkObjectDto, "filters"> & { filters?: Array<CertificateSearchFilterModel> };

export type CertificateBulkDeleteRequestDto = RemoveCertificateDto;
export type CertificateBulkDeleteRequestModel = Omit<CertificateBulkDeleteRequestDto, "filters"> & { filters?: Array<CertificateSearchFilterModel> };

export type CertificateBulkDeleteResponseDto = BulkOperationResponse;
export type CertificateBulkDeleteResponseModel = CertificateBulkDeleteResponseDto;

export type CertificateUploadDto = UploadCertificateRequestDto;
export type CertificateUploadModel = CertificateUploadDto;

export type CertificateCheckComplianceDto = CertificateComplianceCheckDto;
export type CertificateComplianceCheckModel = CertificateComplianceCheckDto;