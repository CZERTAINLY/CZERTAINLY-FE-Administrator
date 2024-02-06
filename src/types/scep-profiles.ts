import { AttributeRequestModel, AttributeResponseModel } from './attributes';
import { CertificateListResponseModel } from './certificate';
import {
    ScepProfileDetailDto,
    ScepProfileDto,
    ScepProfileEditRequestDto as ScepProfileEditRequestDtoOpenApi,
    ScepProfileRequestDto,
} from './openapi';
import { RaProfileSimplifiedModel } from './ra-profiles';

export type ScepProfileAddRequestDto = ScepProfileRequestDto;
export type ScepProfileAddRequestModel = Omit<ScepProfileAddRequestDto, 'issueCertificateAttributes | customAttributes'> & {
    issueCertificateAttributes: Array<AttributeRequestModel>;
    customAttributes?: Array<AttributeRequestModel>;
};

export type ScepProfileEditRequestDto = ScepProfileEditRequestDtoOpenApi;
export type ScepProfileEditRequestModel = Omit<ScepProfileEditRequestDto, 'issueCertificateAttributes | customAttributes'> & {
    issueCertificateAttributes: Array<AttributeRequestModel>;
    customAttributes?: Array<AttributeRequestModel>;
};

export type ScepProfileResponseDto = ScepProfileDetailDto;
export type ScepProfileResponseModel = Omit<
    ScepProfileResponseDto,
    'raProfile | issueCertificateAttributes | customAttributes | caCertificate'
> & {
    raProfile?: RaProfileSimplifiedModel;
    issueCertificateAttributes?: Array<AttributeResponseModel>;
    customAttributes?: Array<AttributeResponseModel>;
    caCertificate?: CertificateListResponseModel;
};

export type ScepProfileListResponseDto = ScepProfileDto;
export type ScepProfileListResponseModel = ScepProfileListResponseDto;
