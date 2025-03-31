import { Badge } from 'reactstrap';
import { OAuth2ProviderSettingsModel } from 'types/auth-settings';

export function isValidOAuth2Provider(provider: OAuth2ProviderSettingsModel) {
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
    if (provider.issuerUrl) {
        badges.push(<Badge color="secondary">JWT Bearer</Badge>);
    }
    if (isValidOAuth2Provider(provider)) {
        badges.push(<Badge color="secondary">OAuth2 Flow</Badge>);
    }
    return (
        <div>
            {badges.map((el, i) => (
                <span key={i}>{el} &nbsp;</span>
            ))}
        </div>
    );
}
