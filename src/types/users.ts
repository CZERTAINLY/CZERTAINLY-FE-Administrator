import { AddUserRequestDto, UserDto } from "./openapi";
import { AttributeRequestModel } from "./attributes";

export type UserResponseDto = UserDto;
export type UserResponseModel = UserResponseDto;

export type UserAddRequestDto = AddUserRequestDto;
export type UserAddRequestModel = Omit<UserAddRequestDto, "customAttributes"> & { customAttributes?: Array<AttributeRequestModel> };