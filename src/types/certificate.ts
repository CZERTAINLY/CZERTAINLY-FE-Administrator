import { AttributeRequestModel, AttributeResponseModel } from "./attributes";
import { CertificateGroupResponseModel } from "./certificateGroups";
import { LocationResponseModel, MetadataModel } from "./locations";
import {
    BulkOperationResponse,
    CertificateComplianceCheckDto,
    CertificateComplianceResultDto,
    CertificateDto,
    CertificateEventHistoryDto,
    CertificateResponseDto as CertificateResponseDtoOpenApi,
    CertificateUpdateObjectsDto,
    CertificateValidationDto as CertificateValidationDtoOpenApi,
    ClientCertificateRekeyRequestDto,
    ClientCertificateRenewRequestDto,
    ClientCertificateRevocationDto,
    ClientCertificateSignRequestDto,
    MultipleCertificateObjectUpdateDto,
    RemoveCertificateDto,
    SearchFieldDataDto,
    SearchFilterRequestDto,
    SearchRequestDto as SearchRequestDtoOpenApi,
    SimplifiedRaProfileDto,
    UploadCertificateRequestDto,
} from "./openapi";

export type SearchFilterDto = SearchFilterRequestDto;
export type SearchFilterModel = SearchFilterDto;

export type SearchRequestDto = SearchRequestDtoOpenApi;
export type SearchRequestModel = Omit<SearchRequestDto, "filters"> & { filters?: Array<SearchFilterModel> };

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

export type SearchFieldDto = SearchFieldDataDto;
export type SearchFieldModel = SearchFieldDto;

export type CertificateHistoryDto = CertificateEventHistoryDto;
export type CertificateHistoryModel = CertificateHistoryDto;

export type CertificateObjectDto = CertificateUpdateObjectsDto;
export type CertificateObjectModel = CertificateObjectDto;

export type CertificateBulkObjectDto = MultipleCertificateObjectUpdateDto;
export type CertificateBulkObjectModel = Omit<CertificateBulkObjectDto, "filters"> & { filters?: Array<SearchFilterModel> };

export type CertificateBulkDeleteRequestDto = RemoveCertificateDto;
export type CertificateBulkDeleteRequestModel = Omit<CertificateBulkDeleteRequestDto, "filters"> & { filters?: Array<SearchFilterModel> };

export type CertificateBulkDeleteResponseDto = BulkOperationResponse;
export type CertificateBulkDeleteResponseModel = CertificateBulkDeleteResponseDto;

export type CertificateUploadDto = UploadCertificateRequestDto;
export type CertificateUploadModel = CertificateUploadDto;

export type CertificateCheckComplianceDto = CertificateComplianceCheckDto;
export type CertificateComplianceCheckModel = CertificateComplianceCheckDto;