import { UserProfileDTO } from "api/auth/model";
import { Role, UserProfileModel } from "models";

export function UserProfileDtoToModel(profile: UserProfileDTO): UserProfileModel {

   return {
      username: profile.username,
      name: profile.name,
      surname: profile.surname,
      email: profile.email,
      role: profile.role === "superAdministrator" ? Role.SuperAdmin : Role.Admin,
   }

}
