import { AppEpic } from 'ducks';
import { of } from 'rxjs';
import { catchError, filter, mergeMap } from 'rxjs/operators';
import { extractError } from 'utils/net';
import { slice } from './auth-settings';

import {
    transformAuthenticationSettingsDtoToModel,
    transformAuthenticationSettingsUpdateModelToDto,
    transformOAuth2ProviderSettingsDtoToModel,
    transformOAuth2ProviderSettingsUpdateModelToDto,
} from './transform/auth-settings';

import { actions as appRedirectActions } from './app-redirect';

const getAuthenticationSettings: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getAuthenticationSettings.match),
        mergeMap(() =>
            deps.apiClients.settings.getAuthenticationSettings().pipe(
                mergeMap((settings) =>
                    of(slice.actions.getAuthenticationSettingsSuccess({ settings: transformAuthenticationSettingsDtoToModel(settings) })),
                ),
                catchError((err) =>
                    of(
                        slice.actions.getAuthenticationSettingsFailure({
                            error: extractError(err, 'Failed to get authentication settings'),
                        }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to get authentication settings' }),
                    ),
                ),
            ),
        ),
    );
};

const updateAuthenticationSettings: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.updateAuthenticationSettings.match),
        mergeMap((action) =>
            deps.apiClients.settings
                .updateAuthenticationSettings({
                    authenticationSettingsUpdateDto: transformAuthenticationSettingsUpdateModelToDto(
                        action.payload.authenticationSettingsUpdateModel,
                    ),
                })
                .pipe(
                    mergeMap(() => of(slice.actions.updateAuthenticationSettingsSuccess())),
                    catchError((err) =>
                        of(
                            slice.actions.updateAuthenticationSettingsFailure({
                                error: extractError(err, 'Failed to update authentication settings'),
                            }),
                            appRedirectActions.fetchError({ error: err, message: 'Failed to update authentication settings' }),
                        ),
                    ),
                ),
        ),
    );
};

const getOAuth2ProviderSettings: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getOAuth2ProviderSettings.match),
        mergeMap((action) =>
            deps.apiClients.settings.getOAuth2ProviderSettings({ providerName: action.payload.providerName }).pipe(
                mergeMap((provider) =>
                    of(
                        slice.actions.getOAuth2ProviderSettingsSuccess({
                            oauth2Provider: transformOAuth2ProviderSettingsDtoToModel(provider),
                        }),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.getOAuth2ProviderSettingsFailure({
                            error: extractError(err, 'Failed to get OAuth2 provider settings'),
                        }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to get OAuth2 provider settings' }),
                    ),
                ),
            ),
        ),
    );
};
const updateOAuth2ProviderSettings: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.updateOAuth2ProviderSettings.match),
        mergeMap((action) =>
            deps.apiClients.settings
                .updateOAuth2ProviderSettings({
                    providerName: action.payload.providerName,
                    oAuth2ProviderSettingsUpdateDto: transformOAuth2ProviderSettingsUpdateModelToDto(
                        action.payload.oAuth2ProviderSettingsUpdateModel,
                    ),
                })
                .pipe(
                    mergeMap((provider) => of(slice.actions.updateOAuth2ProviderSettingsSuccess())),
                    catchError((err) =>
                        of(
                            slice.actions.updateOAuth2ProviderSettingsFailure({
                                error: extractError(err, 'Failed to get OAuth2 provider settings'),
                            }),
                            appRedirectActions.fetchError({ error: err, message: 'Failed to get OAuth2 provider settings' }),
                        ),
                    ),
                ),
        ),
    );
};
const removeOAuth2Provider: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.removeOAuth2Provider.match),
        mergeMap((action) =>
            deps.apiClients.settings.removeOAuth2Provider({ providerName: action.payload.providerName }).pipe(
                mergeMap(() => of(slice.actions.removeOAuth2ProviderSuccess())),
                catchError((err) =>
                    of(
                        slice.actions.getOAuth2ProviderSettingsFailure({
                            error: extractError(err, 'Failed to remove OAuth2 provider'),
                        }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to remove OAuth2 provider' }),
                    ),
                ),
            ),
        ),
    );
};

const epics = [
    getAuthenticationSettings,
    updateAuthenticationSettings,
    getOAuth2ProviderSettings,
    updateOAuth2ProviderSettings,
    removeOAuth2Provider,
];

export default epics;
