import {
    AttributeDescriptorCollectionDto,
    AttributeDescriptorCollectionModel,
    AttributeDescriptorDto,
    AttributeDescriptorModel,
    AttributeMappingModel,
    AttributeRequestDto,
    AttributeRequestModel,
    AttributeResponseDto,
    AttributeResponseModel,
    CustomAttributeDto,
    CustomAttributeModel,
} from 'types/attributes';
import { CallbackAttributeDto, CallbackAttributeModel, HealthDto, HealthModel } from 'types/connectors';
import { AttributeMappingDto } from 'types/openapi';

export function transformAttributeResponseDtoToModel(attribute: AttributeResponseDto): AttributeResponseModel {
    return {
        ...attribute,
        content: attribute.content ? JSON.parse(JSON.stringify(attribute.content)) : undefined,
    };
}

export function transformAttributeRequestModelToDto(attributeRequest: AttributeRequestModel): AttributeRequestDto {
    return {
        ...attributeRequest,
        content: JSON.parse(JSON.stringify(attributeRequest.content)),
    };
}

export function transformCustomAttributeDtoToModel(attribute: CustomAttributeDto): CustomAttributeModel {
    return {
        ...attribute,
        content: attribute.content ? JSON.parse(JSON.stringify(attribute.content)) : undefined,
    };
}

export function transformAttributeMappingDtoToModel(attributeMapping: AttributeMappingDto): AttributeMappingModel {
    return { ...attributeMapping };
}

export function transformAttributeMappingModelToDto(attributeMapping: AttributeMappingModel): AttributeMappingDto {
    return { ...attributeMapping };
}

export function transformAttributeDescriptorDtoToModel(attributeDescriptor: AttributeDescriptorDto): AttributeDescriptorModel {
    return {
        ...attributeDescriptor,
        content: attributeDescriptor?.content ? JSON.parse(JSON.stringify(attributeDescriptor.content)) : undefined,
    };
}

export function transformAttributeDescriptorCollectionDtoToModel(
    collection: AttributeDescriptorCollectionDto,
): AttributeDescriptorCollectionModel {
    const result: AttributeDescriptorCollectionModel = {};

    for (const functionGroup in collection) {
        result[functionGroup] = {};

        for (const kind in collection[functionGroup]) {
            result[functionGroup]![kind] = collection[functionGroup]![kind].map((attrDesc) =>
                transformAttributeDescriptorDtoToModel(attrDesc),
            );
        }
    }
    return result;
}

export function transformHealthDtoToModel(health: HealthDto): HealthModel {
    const parts: { [key: string]: HealthModel } | undefined = health.parts ? {} : undefined;

    if (parts) {
        for (const key in health.parts) {
            parts[key] = transformHealthDtoToModel(health.parts[key]);
        }
    }

    return {
        status: health.status,
        description: health.description,
        parts,
    };
}

export function transformCallbackAttributeModelToDto(callbackAttribute: CallbackAttributeModel): CallbackAttributeDto {
    return { ...callbackAttribute };
}
