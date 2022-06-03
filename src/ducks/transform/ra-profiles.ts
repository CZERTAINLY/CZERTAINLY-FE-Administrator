import { RaAuthorizedClientDTO, RaProfileDTO } from "api/profiles";
import { RaAcmeLinkModel, RaAuthorizedClientModel, RaProfileModel } from "models/ra-profiles";
import { transformAttributeDTOToModel } from "./attributes";

export function transformRaProfileDtoToModel(raProfileDto: RaProfileDTO): RaProfileModel {
    return {
        uuid: raProfileDto.uuid,
        name: raProfileDto.name,
        enabled: raProfileDto.enabled,
        description: raProfileDto.description,
        authorityInstanceUuid: raProfileDto.authorityInstanceUuid,
        authorityInstanceName: raProfileDto.authorityInstanceName,
        attributes: raProfileDto.attributes.map(attribute => transformAttributeDTOToModel(attribute)),
        enabledProtocols: raProfileDto.enabledProtocols
    };
}


export function transformRaAuthorizedClientDtoToModel(raAuthorizedClientDto: RaAuthorizedClientDTO): RaAuthorizedClientModel {
    return {
        uuid: raAuthorizedClientDto.uuid,
        name: raAuthorizedClientDto.name,
        enabled: raAuthorizedClientDto.enabled
    };
}


export function transformRaAcmeLinkDtoToModel(raAcmeLinkDto: RaAcmeLinkModel): RaAcmeLinkModel {
    return {
        uuid: raAcmeLinkDto.uuid,
        name: raAcmeLinkDto.name,
        directoryUrl: raAcmeLinkDto.directoryUrl,
        issueCertificateAttributes: raAcmeLinkDto.issueCertificateAttributes?.map(attribute => transformAttributeDTOToModel(attribute)),
        revokeCertificateAttributes: raAcmeLinkDto.revokeCertificateAttributes?.map(attribute => transformAttributeDTOToModel(attribute)),
        acmeAvailable: raAcmeLinkDto.acmeAvailable
    };
}