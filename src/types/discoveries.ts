import { DiscoveryCertificatesDto, DiscoveryDto, DiscoveryHistoryDto } from "./openapi";
import { AttributeRequestModel, AttributeResponseModel } from "./attributes";
import { MetadataModel } from "./locations";

export type DiscoveryCertificateResponseDto = DiscoveryCertificatesDto;
export type DiscoveryCertificateResponseModel = DiscoveryCertificateResponseDto;

export type DiscoveryResponseDto = DiscoveryHistoryDto;
export type DiscoveryResponseModel = Omit<DiscoveryResponseDto, "certificate | attributes | metadata"> & { certificate: Array<DiscoveryCertificateResponseModel>, attributes: Array<AttributeResponseModel>, metadata?: Array<MetadataModel> };

export type DiscoveryRequestDto = DiscoveryDto;
export type DiscoveryRequestModel = Omit<DiscoveryRequestDto, "attributes"> & { attributes: Array<AttributeRequestModel> };