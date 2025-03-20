import {
    PlatformSettingsDto,
    UtilsSettingsDto,
    LoggingSettingsDto,
    ResourceLoggingSettingsDto as ResourceLoggingSettingsDtoApi,
    AuditLoggingSettingsDto as AuditLoggingSettingsDtoApi,
} from './openapi';

export type SettingsUtilsDto = UtilsSettingsDto;
export type SettingsUtilsModel = SettingsUtilsDto;

export type SettingsPlatformDto = PlatformSettingsDto;
export type SettingsPlatformModel = SettingsPlatformDto;

export type SettingsLoggingDto = LoggingSettingsDto;
export type SettingsLoggingModel = SettingsLoggingDto;

export type ResourceLoggingSettingsDto = ResourceLoggingSettingsDtoApi;
export type ResourceLoggingSettingsModel = ResourceLoggingSettingsDto;

export type AuditLoggingSettingsDto = AuditLoggingSettingsDtoApi;
export type AuditLoggingSettingsModel = AuditLoggingSettingsDto;
