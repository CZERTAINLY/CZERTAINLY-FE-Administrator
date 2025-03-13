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

export function renderOAuth2StateBadge(provider: OAuth2ProviderSettingsModel) {
    if (isValidOAuth2Provider(provider)) {
        return <Badge color="success">Valid</Badge>;
    } else {
        return <Badge color="danger">Invalid</Badge>;
    }
}
