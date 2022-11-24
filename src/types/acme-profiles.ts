import {
    AcmeProfileDto,
    AcmeProfileEditRequestDto as AcmeProfileEditRequestDtoOpenApi, AcmeProfileListDto,
    AcmeProfileRequestDto,
} from "./openapi";
import { AttributeRequestModel, AttributeResponseModel } from "./attributes";
import { RaProfileResponseModel } from "./ra-profiles";

export type AcmeProfileAddRequestDto = AcmeProfileRequestDto;
export type AcmeProfileAddRequestModel = Omit<AcmeProfileAddRequestDto, "issueCertificateAttributes | revokeCertificateAttributes"> & { issueCertificateAttributes: Array<AttributeRequestModel>, revokeCertificateAttributes: Array<AttributeRequestModel> };

export type AcmeProfileEditRequestDto = AcmeProfileEditRequestDtoOpenApi;
export type AcmeProfileEditRequestModel = Omit<AcmeProfileEditRequestDto, "issueCertificateAttributes | revokeCertificateAttributes"> & { issueCertificateAttributes: Array<AttributeRequestModel>, revokeCertificateAttributes: Array<AttributeRequestModel> };

export type AcmeProfileResponseDto = AcmeProfileDto;
export type AcmeProfileResponseModel = Omit<AcmeProfileResponseDto, "raProfile | issueCertificateAttributes | revokeCertificateAttributes "> & { raProfile?: RaProfileResponseModel, issueCertificateAttributes?: Array<AttributeResponseModel>, revokeCertificateAttributes?: Array<AttributeResponseModel> };

export type AcmeProfileListResponseDto = AcmeProfileListDto;
export type AcmeProfileListResponseModel = AcmeProfileListResponseDto;
