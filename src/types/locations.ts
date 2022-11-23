import {
    AddLocationRequestDto,
    CertificateInLocationDto,
    EditLocationRequestDto,
    IssueToLocationRequestDto,
    LocationDto,
    MetadataResponseDto,
    PushToLocationRequestDto,
    ResponseMetadataDto
} from "./openapi";
import { AttributeRequestModel, AttributeResponseModel } from "./attributes";

export type LocationAddRequestDto = AddLocationRequestDto;
export type LocationAddRequestModel = Omit<LocationAddRequestDto, "attributes"> & { attributes: Array<AttributeRequestModel> }

export type LocationEditRequestDto = EditLocationRequestDto;
export type LocationEditRequestModel = Omit<LocationEditRequestDto, "attributes"> & { attributes: Array<AttributeRequestModel> }

export type LocationPushRequestDto = PushToLocationRequestDto;
export type LocationPushRequestModel = Omit<LocationPushRequestDto, "attributes"> & { attributes: Array<AttributeRequestModel> }

export type LocationIssueRequestDto = IssueToLocationRequestDto;
export type LocationIssueRequestModel = Omit<LocationIssueRequestDto, "csrAttributes | issueAttributes"> & { csrAttributes: Array<AttributeRequestModel>, issueAttributes: Array<AttributeRequestModel> }

export type MetadataItemDto = ResponseMetadataDto;
export type MetadataItemModel = MetadataItemDto;

export type MetadataDto = MetadataResponseDto;
export type MetadataModel = Omit<MetadataDto, "items"> & { items: Array<MetadataItemModel> };

export type LocationCertificateDto = CertificateInLocationDto;
export type LocationCertificateModel = Omit<LocationCertificateDto, "metadata | pushAttributes | csrAttributes"> & { metadata: Array<MetadataModel>, pushAttributes?: Array<AttributeResponseModel>, csrAttributes?: Array<AttributeResponseModel> };

export type LocationResponseDto = LocationDto;
export type LocationResponseModel = Omit<LocationResponseDto, "attributes | certificates | metadata"> & { attributes: Array<AttributeResponseModel>, certificates: Array<LocationCertificateModel>, metadata?: Array<MetadataModel> };

