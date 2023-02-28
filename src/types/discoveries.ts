import { AttributeRequestModel, AttributeResponseModel } from "./attributes";
import { MetadataModel } from "./locations";
import { DiscoveryDto, DiscoveryHistoryDetailDto, DiscoveryHistoryDto } from "./openapi";

export type DiscoveryResponseDto = DiscoveryHistoryDto;
export type DiscoveryResponseModel = DiscoveryResponseDto;

export type DiscoveryResponseDetailDto = DiscoveryHistoryDetailDto;
export type DiscoveryResponseDetailModel = Omit<DiscoveryResponseDetailDto, "attributes | metadata | customAttributes"> & { attributes: Array<AttributeResponseModel>, metadata?: Array<MetadataModel>, customAttributes?: Array<AttributeResponseModel> };

export type DiscoveryRequestDto = DiscoveryDto;
export type DiscoveryRequestModel = Omit<DiscoveryRequestDto, "attributes | customAttributes"> & { attributes: Array<AttributeRequestModel>, customAttributes?: Array<AttributeRequestModel> };