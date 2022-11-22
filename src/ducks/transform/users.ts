import { UserAddRequestDto, UserAddRequestModel, UserResponseDto, UserResponseModel } from "types/users";

export function transformUserResponseDtoToModel(user: UserResponseDto): UserResponseModel {
   return { ...user };
}

export function transformUserAddRequestModelToDto(user: UserAddRequestModel): UserAddRequestDto {
   return { ...user };
}

