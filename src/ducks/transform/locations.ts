import {
    LocationAddRequestDto,
    LocationAddRequestModel,
    LocationCertificateDto,
    LocationCertificateModel,
    LocationEditRequestDto,
    LocationEditRequestModel,
    LocationIssueRequestDto,
    LocationIssueRequestModel,
    LocationPushRequestDto,
    LocationPushRequestModel,
    LocationResponseDto,
    LocationResponseModel,
    MetadataDto,
    MetadataItemDto,
    MetadataItemModel,
    MetadataModel,
    NameAndUuidDto,
    NameAndUuidModel,
} from 'types/locations';
import { transformAttributeRequestModelToDto, transformAttributeResponseDtoToModel } from './attributes';

export function transformNameAndUuidDtoToModel(name: NameAndUuidDto): NameAndUuidModel {
    return { ...name };
}

export function transformMetadataItemDtoToModel(metadataItem: MetadataItemDto): MetadataItemModel {
    return {
        ...metadataItem,
        sourceObjects: metadataItem.sourceObjects?.map(transformNameAndUuidDtoToModel),
    };
}

export function transformMetadataDtoToModel(metadata: MetadataDto): MetadataModel {
    return {
        ...metadata,
        items: metadata.items.map(transformMetadataItemDtoToModel),
    };
}

export function transformLocationCertificateDtoToModel(locationCertificate: LocationCertificateDto): LocationCertificateModel {
    return {
        ...locationCertificate,
        metadata: locationCertificate.metadata?.map(transformMetadataDtoToModel),
        pushAttributes: locationCertificate.pushAttributes?.map(transformAttributeResponseDtoToModel),
        csrAttributes: locationCertificate.csrAttributes?.map(transformAttributeResponseDtoToModel),
    };
}

export function transformLocationResponseDtoToModel(location: LocationResponseDto): LocationResponseModel {
    return {
        ...location,
        attributes: location.attributes.map(transformAttributeResponseDtoToModel),
        certificates: location.certificates.map(transformLocationCertificateDtoToModel),
        metadata: location.metadata?.map(transformMetadataDtoToModel),
        customAttributes: location.customAttributes?.map(transformAttributeResponseDtoToModel),
    };
}

export function transformLocationAddRequestModelToDto(addReq: LocationAddRequestModel): LocationAddRequestDto {
    return {
        ...addReq,
        attributes: addReq.attributes.map(transformAttributeRequestModelToDto),
        customAttributes: addReq.customAttributes?.map(transformAttributeRequestModelToDto),
    };
}

export function transformLocationEditRequestModelToDto(editReq: LocationEditRequestModel): LocationEditRequestDto {
    return {
        ...editReq,
        attributes: editReq.attributes.map(transformAttributeRequestModelToDto),
        customAttributes: editReq.customAttributes?.map(transformAttributeRequestModelToDto),
    };
}

export function transformLocationPushRequestModelToDto(pushReq: LocationPushRequestModel): LocationPushRequestDto {
    return {
        ...pushReq,
        attributes: pushReq.attributes.map(transformAttributeRequestModelToDto),
    };
}

export function transformLocationIssueRequestModelToDto(issueReq: LocationIssueRequestModel): LocationIssueRequestDto {
    return {
        ...issueReq,
        csrAttributes: issueReq.csrAttributes.map(transformAttributeRequestModelToDto),
        issueAttributes: issueReq.issueAttributes.map(transformAttributeRequestModelToDto),
        customAttributes: issueReq.customAttributes?.map(transformAttributeRequestModelToDto),
    };
}
