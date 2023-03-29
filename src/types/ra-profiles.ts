import { AttributeRequestModel, AttributeResponseModel } from "./attributes";
import {
    ActivateAcmeForRaProfileRequestDto,
    AddRaProfileRequestDto,
    EditRaProfileRequestDto,
    RaProfileAcmeDetailResponseDto as RaProfileAcmeDetailResponseDtoOpenApi,
    RaProfileDto,
    SimplifiedComplianceProfileDto,
} from "./openapi";

export type RaProfileActivateAcmeRequestDto = ActivateAcmeForRaProfileRequestDto;
export type RaProfileActivateAcmeRequestModel = Omit<
    RaProfileActivateAcmeRequestDto,
    "issueCertificateAttributes | revokeCertificateAttributes"
> & { issueCertificateAttributes: Array<AttributeRequestModel>; revokeCertificateAttributes: Array<AttributeRequestModel> };

export type RaProfileAcmeDetailResponseDto = RaProfileAcmeDetailResponseDtoOpenApi;
export type RaProfileAcmeDetailResponseModel = Omit<
    RaProfileAcmeDetailResponseDto,
    "issueCertificateAttributes | revokeCertificateAttributes"
> & { issueCertificateAttributes?: Array<AttributeResponseModel>; revokeCertificateAttributes?: Array<AttributeResponseModel> };

export type RaProfileAddRequestDto = AddRaProfileRequestDto;
export type RaProfileAddRequestModel = Omit<RaProfileAddRequestDto, "attributes | customAttributes"> & {
    attributes: Array<AttributeRequestModel>;
    customAttributes?: Array<AttributeRequestModel>;
};

export type RaProfileEditRequestDto = EditRaProfileRequestDto;
export type RaProfileEditRequestModel = Omit<RaProfileEditRequestDto, "attributes | customAttributes"> & {
    attributes: Array<AttributeRequestModel>;
    customAttributes?: Array<AttributeRequestModel>;
};

export type RaProfileResponseDto = RaProfileDto;
export type RaProfileResponseModel = Omit<RaProfileResponseDto, "attributes | customAttributes"> & {
    attributes: Array<AttributeResponseModel>;
    customAttributes?: Array<AttributeResponseModel>;
};

export type ComplianceProfileSimplifiedDto = SimplifiedComplianceProfileDto;
export type ComplianceProfileSimplifiedModel = ComplianceProfileSimplifiedDto;
