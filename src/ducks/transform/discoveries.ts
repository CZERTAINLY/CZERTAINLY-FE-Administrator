import {
   DiscoveryCertificateResponseDto,
   DiscoveryCertificateResponseModel, DiscoveryRequestDto, DiscoveryRequestModel,
   DiscoveryResponseDto,
   DiscoveryResponseModel
} from "types/discoveries";
import { transformAttributeRequestModelToDto, transformAttributeResponseDtoToModel } from "./attributes";
import { transformMetadataDtoToModel } from "./locations";

export function transformDiscoveryCertificateResponseDtoToModel(certificate: DiscoveryCertificateResponseDto): DiscoveryCertificateResponseModel {
   return { ...certificate };
}

export function transformDiscoveryResponseDtoToModel(discovery: DiscoveryResponseDto): DiscoveryResponseModel {
   return {
      ...discovery,
      certificate: discovery.certificate.map(transformDiscoveryCertificateResponseDtoToModel),
      attributes: discovery.attributes.map(transformAttributeResponseDtoToModel),
      metadata: discovery.metadata?.map(transformMetadataDtoToModel),
      customAttributes: discovery.customAttributes?.map(transformAttributeResponseDtoToModel)
   }
}

export function transformDiscoveryRequestModelToDto(discovery: DiscoveryRequestModel): DiscoveryRequestDto {
   return {
      ...discovery,
      attributes: discovery.attributes.map(transformAttributeRequestModelToDto),
      customAttributes: discovery.customAttributes?.map(transformAttributeRequestModelToDto)
   }
}