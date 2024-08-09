import { AttributeRequestModel, AttributeResponseModel } from './attributes';
import {
    ActivateAcmeForRaProfileRequestDto,
    ActivateCmpForRaProfileRequestDto,
    ActivateScepForRaProfileRequestDto,
    AddRaProfileRequestDto,
    EditRaProfileRequestDto,
    RaProfileAcmeDetailResponseDto as RaProfileAcmeDetailResponseDtoOpenApi,
    RaProfileCmpDetailResponseDto as RaProfileCmpDetailResponseDtoOpenApi,
    RaProfileDto,
    RaProfileScepDetailResponseDto as RaProfileScepDetailResponseDtoOpenApi,
    SimplifiedComplianceProfileDto,
    SimplifiedRaProfileDto,
} from './openapi';

export type RaProfileActivateAcmeRequestDto = ActivateAcmeForRaProfileRequestDto;
export type RaProfileActivateAcmeRequestModel = Omit<
    RaProfileActivateAcmeRequestDto,
    'issueCertificateAttributes | revokeCertificateAttributes'
> & { issueCertificateAttributes: Array<AttributeRequestModel>; revokeCertificateAttributes: Array<AttributeRequestModel> };

export type RaProfileAcmeDetailResponseDto = RaProfileAcmeDetailResponseDtoOpenApi;
export type RaProfileAcmeDetailResponseModel = Omit<
    RaProfileAcmeDetailResponseDto,
    'issueCertificateAttributes | revokeCertificateAttributes'
> & { issueCertificateAttributes?: Array<AttributeResponseModel>; revokeCertificateAttributes?: Array<AttributeResponseModel> };

export type RaProfileActivateCmpRequestDto = ActivateCmpForRaProfileRequestDto;
export type RaProfileActivateCmpRequestModel = Omit<
    RaProfileActivateCmpRequestDto,
    'issueCertificateAttributes | revokeCertificateAttributes'
> & {
    issueCertificateAttributes: Array<AttributeRequestModel>;
    revokeCertificateAttributes: Array<AttributeRequestModel>;
};
export type RaProfileCmpDetailResponseDto = RaProfileCmpDetailResponseDtoOpenApi;
export type RaProfileCmpDetailResponseModel = Omit<
    RaProfileCmpDetailResponseDto,
    'issueCertificateAttributes | revokeCertificateAttributes'
> & {
    issueCertificateAttributes?: Array<AttributeResponseModel>;
    revokeCertificateAttributes?: Array<AttributeResponseModel>;
};

export type RaProfileActivateScepRequestDto = ActivateScepForRaProfileRequestDto;
export type RaProfileActivateScepRequestModel = Omit<RaProfileActivateScepRequestDto, 'issueCertificateAttributes'> & {
    issueCertificateAttributes: Array<AttributeRequestModel>;
};

export type RaProfileScepDetailResponseDto = RaProfileScepDetailResponseDtoOpenApi;
export type RaProfileScepDetailResponseModel = Omit<RaProfileScepDetailResponseDto, 'issueCertificateAttributes'> & {
    issueCertificateAttributes?: Array<AttributeResponseModel>;
};

export type RaProfileAddRequestDto = AddRaProfileRequestDto;
export type RaProfileAddRequestModel = Omit<RaProfileAddRequestDto, 'attributes | customAttributes'> & {
    attributes: Array<AttributeRequestModel>;
    customAttributes?: Array<AttributeRequestModel>;
};

export type RaProfileEditRequestDto = EditRaProfileRequestDto;
export type RaProfileEditRequestModel = Omit<RaProfileEditRequestDto, 'attributes | customAttributes'> & {
    attributes: Array<AttributeRequestModel>;
    customAttributes?: Array<AttributeRequestModel>;
};

export type RaProfileSimplifiedDto = SimplifiedRaProfileDto;
export type RaProfileSimplifiedModel = RaProfileSimplifiedDto;

export type RaProfileResponseDto = RaProfileDto;
export type RaProfileResponseModel = Omit<RaProfileResponseDto, 'attributes | customAttributes'> & {
    attributes: Array<AttributeResponseModel>;
    customAttributes?: Array<AttributeResponseModel>;
};

export type ComplianceProfileSimplifiedDto = SimplifiedComplianceProfileDto;
export type ComplianceProfileSimplifiedModel = ComplianceProfileSimplifiedDto;
