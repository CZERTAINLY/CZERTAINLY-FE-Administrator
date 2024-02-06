import { SettingsPlatformDto, SettingsPlatformModel, SettingsUtilsDto, SettingsUtilsModel } from '../../types/settings';

export function transformSettingsUtilsDtoToModel(settings: SettingsUtilsDto): SettingsUtilsModel {
    return { ...settings };
}

export function transformSettingsPlatformDtoToModel(settings: SettingsPlatformDto): SettingsPlatformModel {
    return {
        ...settings,
        utils: transformSettingsUtilsDtoToModel(settings.utils),
    };
}
