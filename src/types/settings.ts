import { AttributeDescriptorModel, AttributeResponseModel } from "./attributes";
import { AllSettingsDto, SectionSettingsDto } from "./openapi";

export type SettingsResponseDto = SectionSettingsDto;
export type SettingsResponseModel = Omit<SettingsResponseDto, "attributeDefinitions | attributes"> & { attributeDefinitions: Array<AttributeDescriptorModel>, attributes: Array<AttributeResponseModel>};

export type SettingsAllResponseDto = AllSettingsDto;
export type SettingsAllResponseModel = SettingsAllResponseDto;