import { GroupDto, GroupRequestDto } from "./openapi";
import { AttributeRequestModel, AttributeResponseModel } from "./attributes";

export type CertificateGroupResponseDto = GroupDto;
export type CertificateGroupResponseModel = Omit<CertificateGroupResponseDto, "customAttributes"> & { customAttributes?: Array<AttributeResponseModel> };

export type CertificateGroupRequestDto = GroupRequestDto;
export type CertificateGroupRequestModel = Omit<CertificateGroupRequestDto, "customAttributes"> & { customAttributes?: Array<AttributeRequestModel> };