import { EntityInstanceDto, EntityInstanceRequestDto, EntityInstanceUpdateRequestDto } from "./openapi";
import { AttributeRequestModel, AttributeResponseModel } from "./attributes";

export type EntityResponseDto = EntityInstanceDto;
export type EntityResponseModel = Omit<EntityResponseDto, "attributes"> & { attributes: Array<AttributeResponseModel> };

export type EntityRequestDto = EntityInstanceRequestDto;
export type EntityRequestModel = Omit<EntityRequestDto, "attributes"> & { attributes: Array<AttributeRequestModel> };

export type EntityUpdateRequestDto = EntityInstanceUpdateRequestDto;
export type EntityUpdateRequestModel = Omit<EntityUpdateRequestDto, "attributes"> & { attributes: Array<AttributeRequestModel> };
