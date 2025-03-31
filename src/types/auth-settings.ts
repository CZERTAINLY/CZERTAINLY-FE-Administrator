import {
    AuthenticationSettingsDto as AuthenticationSettingsDtoApi,
    AuthenticationSettingsUpdateDto as AuthenticationSettingsUpdateDtoApi,
    OAuth2ProviderSettingsDto as OAuth2ProviderSettingsDtoApi,
    OAuth2ProviderSettingsUpdateDto as OAuth2ProviderSettingsUpdateDtoApi,
    OAuth2ProviderSettingsResponseDto as OAuth2ProviderSettingsResponseDtoApi,
    JwkDto as JwkDtoApi,
} from './openapi';

export type AuthenticationSettingsDto = AuthenticationSettingsDtoApi;
export type AuthenticationSettingsModel = AuthenticationSettingsDto;

export type OAuth2ProviderSettingsDto = OAuth2ProviderSettingsDtoApi;
export type OAuth2ProviderSettingsModel = OAuth2ProviderSettingsDto;

export type OAuth2ProviderSettingsResponseDto = OAuth2ProviderSettingsResponseDtoApi;
export type OAuth2ProviderSettingsResponseModel = OAuth2ProviderSettingsResponseDto;

export type OAuth2ProviderSettingsUpdateDto = OAuth2ProviderSettingsUpdateDtoApi;
export type OAuth2ProviderSettingsUpdateModel = OAuth2ProviderSettingsUpdateDto;

export type AuthenticationSettingsUpdateDto = AuthenticationSettingsUpdateDtoApi;
export type AuthenticationSettingsUpdateModel = AuthenticationSettingsUpdateDto;

export type JwkDto = JwkDtoApi;
export type JwkModel = JwkDto;
