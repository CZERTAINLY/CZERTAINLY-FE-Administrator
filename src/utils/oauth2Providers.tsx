import { Fragment } from 'react/jsx-runtime';
import Badge from 'components/Badge';
import { OAuth2ProviderSettingsModel } from 'types/auth-settings';

export function isValidJWTBearerProvider(provider: OAuth2ProviderSettingsModel) {
    return Boolean(provider.issuerUrl);
}
export function isValidOAuth2FlowProvider(provider: OAuth2ProviderSettingsModel) {
    return Boolean(
        provider.clientId &&
        provider.authorizationUrl &&
        provider.tokenUrl &&
        (provider.jwkSetUrl || provider.jwkSet) &&
        provider.logoutUrl &&
        provider.postLogoutUrl,
    );
}

export function renderOAuth2StateBadges(provider: OAuth2ProviderSettingsModel) {
    const badges = [];
    if (isValidJWTBearerProvider(provider)) {
        badges.push('JWT Bearer');
    }
    if (isValidOAuth2FlowProvider(provider)) {
        badges.push('OAuth2 Flow');
    }
    return (
        <div>
            {badges.map((el) => (
                <Fragment key={el}>
                    <Badge color="secondary"> {el} </Badge>&nbsp;
                </Fragment>
            ))}
        </div>
    );
}
