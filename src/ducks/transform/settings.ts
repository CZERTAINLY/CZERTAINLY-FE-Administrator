import { SettingsResponseDto, SettingsResponseModel } from "../../types/settings";
import { transformAttributeDescriptorDtoToModel, transformAttributeResponseDtoToModel } from "./attributes";

export function transformSettingsResponseDtoToModel(settings: SettingsResponseDto): SettingsResponseModel {
    return {
        ...settings,
        attributeDefinitions: settings.attributeDefinitions.map(transformAttributeDescriptorDtoToModel),
        attributes: settings.attributes.map(transformAttributeResponseDtoToModel)
    };
}
