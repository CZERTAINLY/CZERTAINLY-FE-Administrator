import { UserCertificateDTO, UserDetailDTO } from "api/users";
import { UserCertificateModel, UserDetailModel } from "models";
import { transformRoleDTOtoModel } from "./roles";


export function transformUserCertificateDTOToModel(certificate: UserCertificateDTO): UserCertificateModel {

   return {
      uuid: certificate.uuid,
      fingerprint: certificate.fingerprint,
   };

}


export function transformUserDetailDTO(user: UserDetailDTO): UserDetailModel {

   return {
      uuid: user.uuid,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      enabled: user.enabled,
      systemUser: user.systemUser,
      certificate: transformUserCertificateDTOToModel(user.certificate),
      roles: user.roles.map(role => transformRoleDTOtoModel(role))
   }

}
