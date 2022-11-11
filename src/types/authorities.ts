import { AuthorityInstanceDto, AuthorityInstanceRequestDto } from "./openapi";
import { AttributeRequestModel, AttributeResponseModel } from "./attributes";

export type AuthorityRequestDto = AuthorityInstanceRequestDto;
export type AuthorityResponseDto = AuthorityInstanceDto;

export type AuthorityRequestModel = Omit<AuthorityRequestDto, "attributes"> & { attributes: Array<AttributeRequestModel> };
export type AuthorityResponseModel = Omit<AuthorityResponseDto, "attributes"> & { attributes: Array<AttributeResponseModel> };
