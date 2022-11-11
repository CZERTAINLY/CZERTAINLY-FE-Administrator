import {
   ConnectorResponseDto,
   ConnectorResponseModel,
   EndpointDto,
   EndpointModel,
   FunctionGroupDto,
   FunctionGroupModel
} from "types/connectors";
import { transformAttributeResponseDtoToModel } from "./attributes";


export function transformEndpointDtoToModel(endPoint: EndpointDto): EndpointModel {
   return {...endPoint}
}


export function transformFunctionGroupDtoToModel(functionGroup: FunctionGroupDto): FunctionGroupModel {

   return {
      ...functionGroup,
      kinds: functionGroup.kinds ?? [],
      endPoints: functionGroup.endPoints.map(endpoint => transformEndpointDtoToModel(endpoint))
   }

}


export function transformConnectorResponseDtoToModel(connector: ConnectorResponseDto): ConnectorResponseModel {

   return {
      ...connector,
      authAttributes: connector.authAttributes?.map(attr => transformAttributeResponseDtoToModel(attr)),
      functionGroups: connector.functionGroups.map(group => transformFunctionGroupDtoToModel(group))
   }

}