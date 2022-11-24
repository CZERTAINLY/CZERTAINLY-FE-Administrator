import { transformAttributeRequestModelToDto, transformAttributeResponseDtoToModel } from "./attributes";
import {
    AcmeProfileAddRequestDto,
    AcmeProfileAddRequestModel,
    AcmeProfileEditRequestDto,
    AcmeProfileEditRequestModel,
    AcmeProfileListResponseDto,
    AcmeProfileListResponseModel,
    AcmeProfileResponseDto,
    AcmeProfileResponseModel
} from "types/acme-profiles";
import { transformRaProfileResponseDtoToModel } from "./ra-profiles";

export function transformAcmeProfileListResponseDtoToModel(acme: AcmeProfileListResponseDto): AcmeProfileListResponseModel {
    return { ...acme };
}

export function transformAcmeProfileResponseDtoToModel(acme: AcmeProfileResponseDto): AcmeProfileResponseModel {
    return {
        ...acme,
        raProfile: acme.raProfile ? transformRaProfileResponseDtoToModel(acme.raProfile) : undefined,
        issueCertificateAttributes: acme.issueCertificateAttributes?.map(transformAttributeResponseDtoToModel),
        revokeCertificateAttributes: acme.revokeCertificateAttributes?.map(transformAttributeResponseDtoToModel),
    };
}

export function transformAcmeProfileEditRequestModelToDto(acme: AcmeProfileEditRequestModel): AcmeProfileEditRequestDto {
    return {
        ...acme,
        issueCertificateAttributes: acme.issueCertificateAttributes.map(transformAttributeRequestModelToDto),
        revokeCertificateAttributes: acme.revokeCertificateAttributes.map(transformAttributeRequestModelToDto),
    };
}

export function transformAcmeProfileAddRequestModelToDto(acme: AcmeProfileAddRequestModel): AcmeProfileAddRequestDto {
    return {
        ...acme,
        issueCertificateAttributes: acme.issueCertificateAttributes.map(transformAttributeRequestModelToDto),
        revokeCertificateAttributes: acme.revokeCertificateAttributes.map(transformAttributeRequestModelToDto),
    };
}
