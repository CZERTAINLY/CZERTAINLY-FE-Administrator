import { ConnectorDTO, EndpointDTO, FunctionGroupDTO } from "api/connectors";
import { ConnectorModel, EndpointModel, FunctionGroupModel } from "models/connectors";
import { FunctionGroupCode, FunctionGroupFilter } from "types/connectors";
import { transformAttributeDTOToModel } from "./attributes";


export const functionGroupCodeToGroupFilter: { [code in FunctionGroupCode]: FunctionGroupFilter } = {
   "credentialProvider": "CREDENTIAL_PROVIDER",
   "legacyAuthorityProvider": "AUTHORITY_PROVIDER",
   "authorityProvider": "LEGACY_AUTHORITY_PROVIDER",
   "discoveryProvider": "DISCOVERY_PROVIDER"
}


export const functionGroupFilterToGroupCode: { [filter in FunctionGroupFilter]: FunctionGroupCode } = {
   "CREDENTIAL_PROVIDER": "credentialProvider",
   "AUTHORITY_PROVIDER": "legacyAuthorityProvider",
   "LEGACY_AUTHORITY_PROVIDER": "authorityProvider",
   "DISCOVERY_PROVIDER": "discoveryProvider"
}


export function transformEndPointDTOToModel(endPoint: EndpointDTO): EndpointModel {

   return {
      uuid: endPoint.uuid,
      name: endPoint.name,
      method: endPoint.method,
      context: endPoint.context,
      required: endPoint.required
   }

}


export function transformFunctionGroupDTOtoModel(functionGroup: FunctionGroupDTO): FunctionGroupModel {

   return {
      uuid: functionGroup.uuid,
      name: functionGroup.name,
      functionGroupCode: functionGroup.functionGroupCode,
      kinds: [ ...functionGroup.kinds ],
      endPoints: functionGroup.endPoints.map(endpoint => transformEndPointDTOToModel(endpoint))
   }

}


export function transformConnectorDTOToModel(connector: ConnectorDTO): ConnectorModel {

   return {
      uuid: connector.uuid,
      name: connector.name,
      url: connector.url,
      status: connector.status,
      authType: connector.authType,
      authAttributes: connector.authAttributes?.map(attr => transformAttributeDTOToModel(attr)),
      functionGroups: connector.functionGroups.map(fngroup => transformFunctionGroupDTOtoModel(fngroup))
   }

}