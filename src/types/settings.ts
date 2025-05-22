import {
    PlatformSettingsDto,
    PlatformSettingsUpdateDto,
    UtilsSettingsDto,
    LoggingSettingsDto,
    ResourceLoggingSettingsDto as ResourceLoggingSettingsDtoApi,
    AuditLoggingSettingsDto as AuditLoggingSettingsDtoApi,
    CertificateSettingsDto as CertificateSettingsDtoApi,
    EventSettingsDto as EventSettingsDtoApi,
    EventsSettingsDto as EventsSettingsDtoApi,
} from './openapi';

export type SettingsUtilsDto = UtilsSettingsDto;
export type SettingsUtilsModel = SettingsUtilsDto;

export type SettingsCertificatesDto = CertificateSettingsDtoApi;
export type SettingsCertificatesModel = SettingsCertificatesDto;

export type SettingsPlatformDto = PlatformSettingsDto;
export type SettingsPlatformModel = SettingsPlatformDto;

export type SettingsPlatformUpdateDto = PlatformSettingsUpdateDto;
export type SettingsPlatformUpdateModel = SettingsPlatformUpdateDto;

export type SettingsLoggingDto = LoggingSettingsDto;
export type SettingsLoggingModel = SettingsLoggingDto;

export type ResourceLoggingSettingsDto = ResourceLoggingSettingsDtoApi;
export type ResourceLoggingSettingsModel = ResourceLoggingSettingsDto;

export type AuditLoggingSettingsDto = AuditLoggingSettingsDtoApi;
export type AuditLoggingSettingsModel = AuditLoggingSettingsDto;

export type EventSettingsDto = EventSettingsDtoApi;
export type EventSettingsModel = EventSettingsDto;

export type EventsSettingsDto = EventsSettingsDtoApi;
export type EventsSettingsModel = EventsSettingsDto;
