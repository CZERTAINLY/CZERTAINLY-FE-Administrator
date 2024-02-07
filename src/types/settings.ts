import { PlatformSettingsDto, UtilsSettingsDto } from './openapi';

export type SettingsUtilsDto = UtilsSettingsDto;
export type SettingsUtilsModel = SettingsUtilsDto;

export type SettingsPlatformDto = PlatformSettingsDto;
export type SettingsPlatformModel = Omit<SettingsPlatformDto, 'utils'> & { utils: SettingsUtilsModel };
