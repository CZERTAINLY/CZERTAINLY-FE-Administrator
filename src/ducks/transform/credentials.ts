import { CredentialDTO } from "api/credential"
import { CredentialModel } from "models/credentials"

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
