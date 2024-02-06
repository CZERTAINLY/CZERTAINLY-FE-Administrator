import { AttributeRequestModel, AttributeResponseModel } from './attributes';
import {
    AcmeProfileDto,
    AcmeProfileEditRequestDto as AcmeProfileEditRequestDtoOpenApi,
    AcmeProfileListDto,
    AcmeProfileRequestDto,
} from './openapi';
import { RaProfileSimplifiedModel } from './ra-profiles';

export type AcmeProfileAddRequestDto = AcmeProfileRequestDto;
export type AcmeProfileAddRequestModel = Omit<
    AcmeProfileAddRequestDto,
    'issueCertificateAttributes | revokeCertificateAttributes | customAttributes'
> & {
    issueCertificateAttributes: Array<AttributeRequestModel>;
    revokeCertificateAttributes: Array<AttributeRequestModel>;
    customAttributes?: Array<AttributeRequestModel>;
};

export type AcmeProfileEditRequestDto = AcmeProfileEditRequestDtoOpenApi;
export type AcmeProfileEditRequestModel = Omit<
    AcmeProfileEditRequestDto,
    'issueCertificateAttributes | revokeCertificateAttributes | customAttributes'
> & {
    issueCertificateAttributes: Array<AttributeRequestModel>;
    revokeCertificateAttributes: Array<AttributeRequestModel>;
    customAttributes?: Array<AttributeRequestModel>;
};

export type AcmeProfileResponseDto = AcmeProfileDto;
export type AcmeProfileResponseModel = Omit<
    AcmeProfileResponseDto,
    'raProfile | issueCertificateAttributes | revokeCertificateAttributes | customAttributes '
> & {
    raProfile?: RaProfileSimplifiedModel;
    issueCertificateAttributes?: Array<AttributeResponseModel>;
    revokeCertificateAttributes?: Array<AttributeResponseModel>;
    customAttributes?: Array<AttributeResponseModel>;
};

export type AcmeProfileListResponseDto = AcmeProfileListDto;
export type AcmeProfileListResponseModel = AcmeProfileListResponseDto;
