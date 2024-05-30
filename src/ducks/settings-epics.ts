import { AppEpic } from 'ducks';
import { of } from 'rxjs';
import { catchError, filter, mergeMap, switchMap } from 'rxjs/operators';

import { LockWidgetNameEnum } from 'types/user-interface';
import { extractError } from 'utils/net';
import { updateBackendUtilsClients } from '../api';
import { actions as alertActions } from './alerts';
import { actions as appRedirectActions } from './app-redirect';
import { slice } from './settings';
import { transformSettingsPlatformDtoToModel } from './transform/settings';
import { actions as userInterfaceActions } from './user-interface';

const getPlatformSettings: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getPlatformSettings.match),
        switchMap(() =>
            deps.apiClients.settings.getPlatformSettings().pipe(
                switchMap((platformSettings) => {
                    const platformSettingsModel = transformSettingsPlatformDtoToModel(platformSettings);
                    updateBackendUtilsClients(platformSettingsModel.utils.utilsServiceUrl);
                    return of(
                        slice.actions.getPlatformSettingsSuccess(platformSettingsModel),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.PlatformSettings),
                    );
                }),
                catchError((err) =>
                    of(
                        slice.actions.getPlatformSettingsFailure({ error: extractError(err, 'Failed to get platform settings') }),
                        userInterfaceActions.insertWidgetLock(err, LockWidgetNameEnum.PlatformSettings),
                    ),
                ),
            ),
        ),
    );
};

const updatePlatformSettings: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.updatePlatformSettings.match),
        switchMap((action) =>
            deps.apiClients.settings.updatePlatformSettings({ platformSettingsDto: action.payload }).pipe(
                mergeMap(() => {
                    updateBackendUtilsClients(action.payload.utils.utilsServiceUrl);
                    return of(
                        slice.actions.updatePlatformSettingsSuccess(action.payload),
                        appRedirectActions.redirect({ url: `../settings` }),
                    );
                }),
                catchError((err) =>
                    of(
                        slice.actions.updatePlatformSettingsFailure({ error: extractError(err, 'Failed to update platform settings') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to update platform settings' }),
                    ),
                ),
            ),
        ),
    );
};

const getNotificationsSettings: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getNotificationsSettings.match),
        switchMap(() =>
            deps.apiClients.settings.getNotificationsSettings().pipe(
                switchMap((notificationsSettings) => {
                    return of(slice.actions.getNotificationsSettingsSuccess(notificationsSettings));
                }),
                catchError((err) =>
                    of(
                        slice.actions.getNotificationsSettingsFailure({ error: extractError(err, 'Failed to get notifications settings') }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to get notifications settings' }),
                    ),
                ),
            ),
        ),
    );
};

const updateNotificationsSettings: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.updateNotificationsSettings.match),
        switchMap((action) =>
            deps.apiClients.settings.updateNotificationsSettings({ notificationSettingsDto: action.payload }).pipe(
                mergeMap(() => {
                    return of(
                        slice.actions.updateNotificationsSettingsSuccess(action.payload),
                        alertActions.success('Notifications settings updated successfully.'),
                    );
                }),
                catchError((err) =>
                    of(
                        slice.actions.updateNotificationsSettingsFailure({
                            error: extractError(err, 'Failed to update notifications settings'),
                        }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to update notifications settings' }),
                    ),
                ),
            ),
        ),
    );
};

const epics = [getPlatformSettings, updatePlatformSettings, getNotificationsSettings, updateNotificationsSettings];

export default epics;
