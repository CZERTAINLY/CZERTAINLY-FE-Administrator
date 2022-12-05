import { DiscoveryCertificatesDto, DiscoveryDto, DiscoveryHistoryDto } from "./openapi";
import { AttributeRequestModel, AttributeResponseModel } from "./attributes";
import { MetadataModel } from "./locations";

export type DiscoveryCertificateResponseDto = DiscoveryCertificatesDto;
export type DiscoveryCertificateResponseModel = DiscoveryCertificateResponseDto;

export type DiscoveryResponseDto = DiscoveryHistoryDto;
export type DiscoveryResponseModel = Omit<DiscoveryResponseDto, "certificate | attributes | metadata | customAttributes"> & { certificate: Array<DiscoveryCertificateResponseModel>, attributes: Array<AttributeResponseModel>, metadata?: Array<MetadataModel>, customAttributes?: Array<AttributeResponseModel> };

export type DiscoveryRequestDto = DiscoveryDto;
export type DiscoveryRequestModel = Omit<DiscoveryRequestDto, "attributes | customAttributes"> & { attributes: Array<AttributeRequestModel>, customAttributes?: Array<AttributeRequestModel> };