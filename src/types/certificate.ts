// TODO --- Remove from here
import {
    BulkOperationResponse, CertificateComplianceCheckDto,
    CertificateComplianceResultDto,
    CertificateDto, CertificateEventHistoryDto,
    CertificateResponseDto as CertificateResponseDtoOpenApi, CertificateUpdateObjectsDto,
    CertificateValidationDto as CertificateValidationDtoOpenApi,
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

export type CertificateEvent =
   "Issue Certificate" |
   "Renew Certificate" |
   "Revoke Certificate" |
   "Delete Certificate" |
   "Update RA Profile" |
   "Update Entity" |
   "Update Group" |
   "Update Owner" |
   "Upload Certificate" |
   "Certificate Discovered"
   ;


export type CertificateRevocationReason =
   "UNSPECIFIED" |
   "KEY_COMPROMISE" |
   "CA_COMPROMISE" |
   "AFFILIATION_CHANGED" |
   "SUPERSEDED" |
   "CESSATION_OF_OPERATION" |
   "CERTIFICATE_HOLD" |
   "REMOVE_FROM_CRL" |
   "PRIVILEGES_WITHDRAWN" |
   "AA_COMPROMISE"
   ;


export type CertificateFilterCondition =
   "EQUALS" |
   "NOT_EQUALS" |
   "GREATER" |
   "LESSER" |
   "CONTAINS" |
   "NOT_CONTAINS" |
   "STARTS_WITH" |
   "ENDS_WITH" |
   "EMPTY" |
   "NOT_EMPTY" |
   "SUCCESS" |
   "FAILED" |
   "UNKNOWN" |
   "NOT_CHECKED"
   ;


export type CertificateFilterField =
   "commonName" |
   "serialNumber" |
   "raProfile" |
   "entity" |
   "status" |
   "group" |
   "owner" |
   "issuerCommonName" |
   "signatureAlgorithm" |
   "fingerprint" |
   "notAfter" |
   "notBefore" |
   "publicKeyAlgorithm" |
   "keySize" |
   "keyUsage" |
   "basicConstraints" |
   "meta" |
   "subjectAlternativeNames" |
   "subjectDn" |
   "issuerDn" |
   "issuerSerialNumber" |
   "ocspValidation" |
   "crlValidation" |
   "signatureValidation" |
   "complianceStatus"
   ;


export type ValidationStatus = "success" | "failed" | "warning" | "revoked" | "notChecked" | "invalid" | "expiring" | "expired";

export type Status = "valid" | "revoked" | "expired" | "unknown" | "expiring" | "new" | "invalid"

export type CertificateType = "X509" | "SSH";
// TODO --- Remove to here

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
export type CertificateSignRequestModel = Omit<CertificateSignRequestDto, "attributes | customAttributes"> & { attributes: Array<AttributeRequestModel>, customAttributes?: Array<AttributeRequestModel> };

export type CertificateRevokeRequestDto = ClientCertificateRevocationDto;
export type CertificateRevokeRequestModel = Omit<CertificateRevokeRequestDto, "attributes"> & { attributes: Array<AttributeRequestModel> };

export type CertificateRenewRequestDto = ClientCertificateRenewRequestDto;
export type CertificateRenewRequestModel = CertificateRenewRequestDto;

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