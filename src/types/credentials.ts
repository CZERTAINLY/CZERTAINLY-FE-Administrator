import { CredentialDto, CredentialRequestDto, CredentialUpdateRequestDto } from "./openapi";
import { AttributeRequestModel, AttributeResponseModel } from "./attributes";

export type CredentialResponseDto = CredentialDto;
export type CredentialResponseModel = Omit<CredentialResponseDto, "attributes"> & { attributes: Array<AttributeResponseModel> };

export type CredentialCreateRequestDto = CredentialRequestDto;
export type CredentialCreateRequestModel = Omit<CredentialCreateRequestDto, "attributes"> & { attributes: Array<AttributeRequestModel> };

export type CredentialEditRequestDto = CredentialUpdateRequestDto;
export type CredentialEditRequestModel = Omit<CredentialEditRequestDto, "attributes"> & { attributes: Array<AttributeRequestModel> };