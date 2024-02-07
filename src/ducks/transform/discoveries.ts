import {
    DiscoveryCertificateDto,
    DiscoveryCertificateListDto,
    DiscoveryCertificateListModel,
    DiscoveryCertificateModel,
    DiscoveryRequestDto,
    DiscoveryRequestModel,
    DiscoveryResponseDetailDto,
    DiscoveryResponseDetailModel,
    DiscoveryResponseDto,
    DiscoveryResponseModel,
} from 'types/discoveries';
import { transformAttributeRequestModelToDto, transformAttributeResponseDtoToModel } from './attributes';
import { transformMetadataDtoToModel } from './locations';

export function transformDiscoveryResponseDtoToModel(discovery: DiscoveryResponseDto): DiscoveryResponseModel {
    return { ...discovery };
}

export function transformDiscoveryResponseDetailDtoToModel(discovery: DiscoveryResponseDetailDto): DiscoveryResponseDetailModel {
    return {
        ...discovery,
        attributes: discovery.attributes.map(transformAttributeResponseDtoToModel),
        metadata: discovery.metadata?.map(transformMetadataDtoToModel),
        customAttributes: discovery.customAttributes?.map(transformAttributeResponseDtoToModel),
    };
}

export function transformDiscoveryRequestModelToDto(discovery: DiscoveryRequestModel): DiscoveryRequestDto {
    return {
        ...discovery,
        attributes: discovery.attributes.map(transformAttributeRequestModelToDto),
        customAttributes: discovery.customAttributes?.map(transformAttributeRequestModelToDto),
    };
}

export function transformDiscoveryCertificateDtoToModel(cert: DiscoveryCertificateDto): DiscoveryCertificateModel {
    return { ...cert };
}

export function transformDiscoveryCertificateListDtoToModel(list: DiscoveryCertificateListDto): DiscoveryCertificateListModel {
    return {
        ...list,
        certificates: list.certificates.map(transformDiscoveryCertificateDtoToModel),
    };
}
