import { CredentialDTO, CredentialProviderDTO } from "api/credential"
import { CredentialModel, CredentialProviderModel } from "models/credentials"

export function transformCredentialDtoToModel(credentialDto: CredentialDTO): CredentialModel {
    return {
        uuid: credentialDto.uuid,
        name: credentialDto.name,
        kind: credentialDto.kind,
        attributes: credentialDto.attributes,
        enabled: credentialDto.enabled,
        connectorUuid: credentialDto.connectorUuid,
        connectorName: credentialDto.connectorName
    }
}


export function transformCredentialProviderDtoToModel(credentialProviderDto: CredentialProviderDTO): CredentialProviderModel {
    return {
        uuid: credentialProviderDto.uuid,
        name: credentialProviderDto.name,
        status: credentialProviderDto.status,
        url: credentialProviderDto.url,
        functionGroups: credentialProviderDto.functionGroups,
        authAttributes: credentialProviderDto.authAttributes,
        authType: credentialProviderDto.authType
    }
}
