import { EntityInstanceDto, EntityInstanceRequestDto, EntityInstanceUpdateRequestDto } from "./openapi";
import { AttributeRequestModel, AttributeResponseModel } from "./attributes";

export type EntityResponseDto = EntityInstanceDto;
export type EntityResponseModel = Omit<EntityResponseDto, "attributes | customAttributes"> & { attributes: Array<AttributeResponseModel>, customAttributes?: Array<AttributeResponseModel> };

export type EntityRequestDto = EntityInstanceRequestDto;
export type EntityRequestModel = Omit<EntityRequestDto, "attributes | customAttributes"> & { attributes: Array<AttributeRequestModel>, customAttributes?: Array<AttributeRequestModel> };

export type EntityUpdateRequestDto = EntityInstanceUpdateRequestDto;
export type EntityUpdateRequestModel = Omit<EntityUpdateRequestDto, "attributes | customAttributes"> & { attributes: Array<AttributeRequestModel>, customAttributes?: Array<AttributeRequestModel> };
