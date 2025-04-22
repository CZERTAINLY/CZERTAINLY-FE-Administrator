import {
    AuthenticationSettingsDto,
    AuthenticationSettingsModel,
    AuthenticationSettingsUpdateDto,
    AuthenticationSettingsUpdateModel,
    OAuth2ProviderSettingsResponseDto,
    OAuth2ProviderSettingsResponseModel,
    OAuth2ProviderSettingsUpdateDto,
    OAuth2ProviderSettingsUpdateModel,
} from 'types/auth-settings';

export function transformAuthenticationSettingsDtoToModel(authenticationSettings: AuthenticationSettingsDto): AuthenticationSettingsModel {
    return { ...authenticationSettings };
}

export function transformOAuth2ProviderSettingsDtoToModel(
    oauth2provider: OAuth2ProviderSettingsResponseDto,
): OAuth2ProviderSettingsResponseModel {
    return { ...oauth2provider };
}

export function transformAuthenticationSettingsUpdateModelToDto(
    authenticationSettings: AuthenticationSettingsUpdateModel,
): AuthenticationSettingsUpdateDto {
    return { ...authenticationSettings };
}

export function transformOAuth2ProviderSettingsUpdateModelToDto(
    oauth2provider: OAuth2ProviderSettingsUpdateModel,
): OAuth2ProviderSettingsUpdateDto {
    return { ...oauth2provider };
}
