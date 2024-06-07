import {
    // ScepProfileResponseDto,
    // ScepProfileResponseModel,
    CmpProfileDetailDto,
    CmpProfileDetailModel,
    // ScepProfileListResponseDto,
    // ScepProfileListResponseModel,
    CmpProfileDto,
    // ScepProfileEditRequestDto,
    // ScepProfileEditRequestModel,
    CmpProfileEditRequestDto,
    CmpProfileEditRequestModel,
    CmpProfileModel,
    // ScepProfileAddRequestDto,
    // ScepProfileAddRequestModel,
    CmpProfileRequestDto,
    CmpProfileRequestModel,
} from 'types/cmp-profiles';
import { transformAttributeRequestModelToDto, transformAttributeResponseDtoToModel } from './attributes';

// export function transformScepProfileListResponseDtoToModel(scep: ScepProfileListResponseDto): ScepProfileListResponseModel {
//     return { ...scep };
// }

export function transformCmpProfileDtoToModel(cmp: CmpProfileDto): CmpProfileModel {
    return { ...cmp };
}

export function transformCmpProfileDetailDtoToModel(cmp: CmpProfileDetailDto): CmpProfileDetailModel {
    return {
        ...cmp,
        issueCertificateAttributes: cmp.issueCertificateAttributes?.map(transformAttributeResponseDtoToModel),
        revokeCertificateAttributes: cmp.revokeCertificateAttributes?.map(transformAttributeResponseDtoToModel),
        customAttributes: cmp.customAttributes?.map(transformAttributeResponseDtoToModel),

        // issueCertificateAttributes: acme.issueCertificateAttributes?.map(transformAttributeResponseDtoToModel),
        // revokeCertificateAttributes: acme.revokeCertificateAttributes?.map(transformAttributeResponseDtoToModel),
        // customAttributes: acme.customAttributes?.map(transformAttributeResponseDtoToModel),
    };
}
// export function transformScepProfileResponseDtoToModel(scep: ScepProfileResponseDto): ScepProfileResponseModel {
//     return {
//         ...scep,
//         raProfile: scep.raProfile ? transformRaProfileSimplifiedDtoToModel(scep.raProfile) : undefined,
//         issueCertificateAttributes: scep.issueCertificateAttributes?.map(transformAttributeResponseDtoToModel),
//         customAttributes: scep.customAttributes?.map(transformAttributeResponseDtoToModel),
//         caCertificate: scep.caCertificate ? transformCertificateListResponseDtoToModel(scep.caCertificate) : undefined,
//     };
// }

// export function transformScepProfileEditRequestModelToDto(scep: ScepProfileEditRequestModel): ScepProfileEditRequestDto {
//     return {
//         ...scep,
//         issueCertificateAttributes: scep.issueCertificateAttributes.map(transformAttributeRequestModelToDto),
//         customAttributes: scep.customAttributes?.map(transformAttributeRequestModelToDto),
//     };
// }

export function transformCmpProfileEditRequestModelToDto(cmp: CmpProfileEditRequestModel): CmpProfileEditRequestDto {
    return {
        ...cmp,
        issueCertificateAttributes: cmp.issueCertificateAttributes?.map(transformAttributeRequestModelToDto),
        revokeCertificateAttributes: cmp.revokeCertificateAttributes?.map(transformAttributeRequestModelToDto),
        customAttributes: cmp.customAttributes?.map(transformAttributeRequestModelToDto),
    };
}

// export function transformScepProfileAddRequestModelToDto(scep: ScepProfileAddRequestModel): ScepProfileAddRequestDto {
//     return {
//         ...scep,
//         issueCertificateAttributes: scep.issueCertificateAttributes.map(transformAttributeRequestModelToDto),
//         customAttributes: scep.customAttributes?.map(transformAttributeRequestModelToDto),
//     };
// }

export function transformCmpProfileRequestModelToDto(cmp: CmpProfileRequestModel): CmpProfileRequestDto {
    return {
        ...cmp,
        issueCertificateAttributes: cmp.issueCertificateAttributes?.map(transformAttributeRequestModelToDto),
        revokeCertificateAttributes: cmp.revokeCertificateAttributes?.map(transformAttributeRequestModelToDto),
        customAttributes: cmp.customAttributes?.map(transformAttributeRequestModelToDto),
    };
}
