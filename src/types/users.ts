import { AttributeRequestModel } from './attributes';
import { AddUserRequestDto, UserDto } from './openapi';

export type UserResponseDto = UserDto;
export type UserResponseModel = UserResponseDto;

export type UserAddRequestDto = AddUserRequestDto;
export type UserAddRequestModel = Omit<UserAddRequestDto, 'customAttributes'> & { customAttributes?: Array<AttributeRequestModel> };
