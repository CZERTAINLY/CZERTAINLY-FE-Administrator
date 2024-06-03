import { AttributeRequestModel, AttributeResponseModel } from './attributes';
import {
    AddLocationRequestDto,
    CertificateInLocationDto,
    EditLocationRequestDto,
    IssueToLocationRequestDto,
    LocationDto,
    MetadataResponseDto,
    NameAndUuidDto as NameAndUuidDtoOpenApi,
    PushToLocationRequestDto,
    ResponseMetadataDto,
} from './openapi';

export type LocationAddRequestDto = AddLocationRequestDto;
export type LocationAddRequestModel = Omit<LocationAddRequestDto, 'attributes | customAttributes'> & {
    attributes: Array<AttributeRequestModel>;
    customAttributes?: Array<AttributeRequestModel>;
};

export type LocationEditRequestDto = EditLocationRequestDto;
export type LocationEditRequestModel = Omit<LocationEditRequestDto, 'attributes | customAttributes'> & {
    attributes: Array<AttributeRequestModel>;
    customAttributes?: Array<AttributeRequestModel>;
};

export type LocationPushRequestDto = PushToLocationRequestDto;
export type LocationPushRequestModel = Omit<LocationPushRequestDto, 'attributes'> & { attributes: Array<AttributeRequestModel> };

export type LocationIssueRequestDto = IssueToLocationRequestDto;
export type LocationIssueRequestModel = Omit<
    LocationIssueRequestDto,
    'csrAttributes | issueAttributes | customAttributes | certificateCustomAttributes'
> & {
    csrAttributes: Array<AttributeRequestModel>;
    issueAttributes: Array<AttributeRequestModel>;
    customAttributes?: Array<AttributeRequestModel>;
    certificateCustomAttributes?: Array<AttributeRequestModel>;
};

export type NameAndUuidDto = NameAndUuidDtoOpenApi;
export type NameAndUuidModel = NameAndUuidDto;

export type MetadataItemDto = ResponseMetadataDto;
export type MetadataItemModel = Omit<MetadataItemDto, 'sourceObjects'> & { sourceObjects: Array<NameAndUuidModel> };

export type MetadataDto = MetadataResponseDto;
export type MetadataModel = Omit<MetadataDto, 'items'> & { items: Array<MetadataItemModel> };

export type LocationCertificateDto = CertificateInLocationDto;
export type LocationCertificateModel = Omit<LocationCertificateDto, 'metadata | pushAttributes | csrAttributes'> & {
    metadata?: Array<MetadataModel>;
    pushAttributes?: Array<AttributeResponseModel>;
    csrAttributes?: Array<AttributeResponseModel>;
};

export type LocationResponseDto = LocationDto;
export type LocationResponseModel = Omit<LocationResponseDto, 'attributes | certificates | metadata | customAttributes'> & {
    attributes: Array<AttributeResponseModel>;
    certificates: Array<LocationCertificateModel>;
    metadata?: Array<MetadataModel>;
    customAttributes?: Array<AttributeResponseModel>;
};
