import {
    SettingsPlatformDto,
    SettingsPlatformModel,
    SettingsUtilsDto,
    SettingsUtilsModel,
    SettingsLoggingModel,
    SettingsLoggingDto,
    SettingsCertificatesDto,
    SettingsCertificatesModel,
} from '../../types/settings';

export function transformSettingsUtilsDtoToModel(settings: SettingsUtilsDto | undefined): SettingsUtilsModel {
    if (settings === undefined) return {};
    return { ...settings };
}
export function transformSettingsCertificatesDtoToModel(settings: SettingsCertificatesDto): SettingsCertificatesModel {
    return { ...settings };
}

export function transformSettingsPlatformDtoToModel(settings: SettingsPlatformDto): SettingsPlatformModel {
    return {
        ...settings,
        certificates: settings.certificates ? transformSettingsCertificatesDtoToModel(settings.certificates) : undefined,
        utils: settings.utils ? transformSettingsUtilsDtoToModel(settings.utils) : undefined,
    };
}

export function transformLoggingSettingsDtoToModel(loggingSettings: SettingsLoggingDto): SettingsLoggingModel {
    return { ...loggingSettings };
}

export function transformLoggingSettingsModelToDto(loggingSettings: SettingsLoggingModel): SettingsLoggingDto {
    return { ...loggingSettings };
}
