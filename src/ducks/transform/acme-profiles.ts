import { AcmeProfileDTO, AcmeProfileListItemDTO } from "api/acme-profile";
import { RaAcmeLinkDTO } from "api/profiles";
import { AcmeProfileListModel, AcmeProfileModel } from "models/acme-profiles";
import { RaAcmeLinkModel } from "models/ra-profiles";
import { transformAttributeDTOToModel } from "./attributes";

export function transformAcmeProfileListDtoToModel(acmeProfileDto: AcmeProfileListItemDTO): AcmeProfileListModel {

   return {
      uuid: acmeProfileDto.uuid,
      name: acmeProfileDto.name,
      enabled: acmeProfileDto.enabled,
      description: acmeProfileDto.description,
      raProfileName: acmeProfileDto.raProfileName,
      raProfileUuid: acmeProfileDto.raProfileUuid,
      directoryUrl: acmeProfileDto.directoryUrl,
   };

}


export function transformAcmeProfileDtoToModel(acmeProfileDto: AcmeProfileDTO): AcmeProfileModel {

   return {
      uuid: acmeProfileDto.uuid,
      name: acmeProfileDto.name,
      enabled: acmeProfileDto.enabled,
      description: acmeProfileDto.description,
      termsOfServiceUrl: acmeProfileDto.termsOfServiceUrl,
      websiteUrl: acmeProfileDto.websiteUrl,
      dnsResolverIp: acmeProfileDto.dnsResolverIp,
      dnsResolverPort: acmeProfileDto.dnsResolverPort,
      raProfile: acmeProfileDto.raProfile,
      retryInterval: acmeProfileDto.retryInterval,
      termsOfServiceChangeDisable: acmeProfileDto.termsOfServiceChangeDisable,
      validity: acmeProfileDto.validity,
      directoryUrl: acmeProfileDto.directoryUrl,
      termsOfServiceChangeUrl: acmeProfileDto.termsOfServiceChangeUrl,
      requireContact: acmeProfileDto.requireContact,
      requireTermsOfService: acmeProfileDto.requireTermsOfService,
      issueCertificateAttributes: acmeProfileDto.issueCertificateAttributes,
      revokeCertificateAttributes: acmeProfileDto.revokeCertificateAttributes,
   };

}


export function transfromRaAcmeLinkDtoToModel(raAcmeLinkDto: RaAcmeLinkDTO): RaAcmeLinkModel {

   return {
      uuid: raAcmeLinkDto.uuid,
      name: raAcmeLinkDto.name,
      directoryUrl: raAcmeLinkDto.directoryUrl,
      issueCertificateAttributes: raAcmeLinkDto.issueCertificateAttributes?.map(attribute => transformAttributeDTOToModel(attribute)),
      revokeCertificateAttributes: raAcmeLinkDto.revokeCertificateAttributes?.map(attribute => transformAttributeDTOToModel(attribute)),
      acmeAvailable: raAcmeLinkDto.acmeAvailable,
   };

}