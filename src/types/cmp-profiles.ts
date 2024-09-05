import { AttributeRequestModel, AttributeResponseModel } from './attributes';
import {
    // ScepProfileDetailDto,
    // ScepProfileDto,
    // ScepProfileEditRequestDto as ScepProfileEditRequestDtoOpenApi,
    // ScepProfileRequestDto,
    CmpProfileDetailDto as CmpProfileDetailDtoOpenApi,
    CmpProfileDto as CmpProfileDtoOpenApi,
    CmpProfileEditRequestDto as CmpProfileEditRequestDtoOpenApi,
    CmpProfileRequestDto as CmpProfileRequestDtoOpenApi,
} from './openapi';
// import { RaProfileSimplifiedModel } from './ra-profiles';

// issueCertificateAttributes?: Array<RequestAttributeDto>;
// /**
//  * List of Attributes to revoke Certificate for the associated RA Profile. Required when raProfileUuid is provided
//  * @type {Array<RequestAttributeDto>}
//  * @memberof CmpProfileRequestDto
//  */
// revokeCertificateAttributes?: Array<RequestAttributeDto>;
// /**
//  * List of Custom Attributes for CMP Profile
//  * @type {Array<RequestAttributeDto>}
//  * @memberof CmpProfileRequestDto
//  */
// customAttributes?: Array<RequestAttributeDto>;

export type CmpProfileRequestDto = CmpProfileRequestDtoOpenApi;
export type CmpProfileRequestModel = Omit<
    CmpProfileRequestDto,
    'issueCertificateAttributes | revokeCertificateAttributes | customAttributes'
> & {
    issueCertificateAttributes?: Array<AttributeRequestModel>;
    revokeCertificateAttributes?: Array<AttributeRequestModel>;
    customAttributes?: Array<AttributeRequestModel>;
};

// export type ScepProfileAddRequestDto = ScepProfileRequestDto;
// export type ScepProfileAddRequestModel = Omit<ScepProfileAddRequestDto, 'issueCertificateAttributes | customAttributes'> & {
//     issueCertificateAttributes: Array<AttributeRequestModel>;
//     customAttributes?: Array<AttributeRequestModel>;
// };

export type CmpProfileEditRequestDto = CmpProfileEditRequestDtoOpenApi;
export type CmpProfileEditRequestModel = Omit<
    CmpProfileEditRequestDto,
    'issueCertificateAttributes | revokeCertificateAttributes | customAttributes'
> & {
    issueCertificateAttributes?: Array<AttributeRequestModel>;
    revokeCertificateAttributes?: Array<AttributeRequestModel>;
    customAttributes?: Array<AttributeRequestModel>;
};

// export type ScepProfileEditRequestDto = ScepProfileEditRequestDtoOpenApi;
// export type ScepProfileEditRequestModel = Omit<ScepProfileEditRequestDto, 'issueCertificateAttributes | customAttributes'> & {
//     issueCertificateAttributes: Array<AttributeRequestModel>;
//     customAttributes?: Array<AttributeRequestModel>;
// };

// export type ScepProfileResponseDto = ScepProfileDetailDto;
// export type ScepProfileResponseModel = Omit<
//     ScepProfileResponseDto,
//     'raProfile | issueCertificateAttributes | customAttributes | caCertificate'
// > & {
//     raProfile?: RaProfileSimplifiedModel;
//     issueCertificateAttributes?: Array<AttributeResponseModel>;
//     customAttributes?: Array<AttributeResponseModel>;
//     caCertificate?: CertificateListResponseModel;
// };

// issueCertificateAttributes?: Array<ResponseAttributeDto>;
// /**
//  * List of Attributes to revoke a Certificate for the associated RA Profile
//  * @type {Array<ResponseAttributeDto>}
//  * @memberof CmpProfileDetailDto
//  */
// revokeCertificateAttributes?: Array<ResponseAttributeDto>;
// /**
//  * List of Custom Attributes for CMP Profile
//  * @type {Array<ResponseAttributeDto>}
//  * @memberof CmpProfileDetailDto
//  */
// customAttributes?: Array<ResponseAttributeDto>;

export type CmpProfileDetailDto = CmpProfileDetailDtoOpenApi;
export type CmpProfileDetailModel = Omit<
    CmpProfileDetailDto,
    'issueCertificateAttributes | revokeCertificateAttributes | customAttributes'
> & {
    issueCertificateAttributes?: Array<AttributeResponseModel>;
    revokeCertificateAttributes?: Array<AttributeResponseModel>;
    customAttributes?: Array<AttributeResponseModel>;
};

// export type ScepProfileListResponseDto = ScepProfileDto;
// export type ScepProfileListResponseModel = ScepProfileListResponseDto;

export type CmpProfileDto = CmpProfileDtoOpenApi;
export type CmpProfileModel = CmpProfileDto;
