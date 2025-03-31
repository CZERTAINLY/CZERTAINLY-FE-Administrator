import {
    SettingsPlatformDto,
    SettingsPlatformModel,
    SettingsUtilsDto,
    SettingsUtilsModel,
    SettingsLoggingModel,
    SettingsLoggingDto,
} from '../../types/settings';

export function transformSettingsUtilsDtoToModel(settings: SettingsUtilsDto | undefined): SettingsUtilsModel {
    if (settings === undefined) return {};
    return { ...settings };
}

export function transformSettingsPlatformDtoToModel(settings: SettingsPlatformDto): SettingsPlatformModel {
    return {
        ...settings,
        utils: transformSettingsUtilsDtoToModel(settings.utils),
    };
}

export function transformLoggingSettingsDtoToModel(loggingSettings: SettingsLoggingDto): SettingsLoggingModel {
    return { ...loggingSettings };
}

export function transformLoggingSettingsModelToDto(loggingSettings: SettingsLoggingModel): SettingsLoggingDto {
    return { ...loggingSettings };
}
