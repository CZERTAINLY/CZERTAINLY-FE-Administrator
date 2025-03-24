import { AnyAction } from '@reduxjs/toolkit';
import { AppEpic } from 'ducks';
import { of } from 'rxjs';
import { catchError, filter, mergeMap, switchMap } from 'rxjs/operators';

import { LockWidgetNameEnum } from 'types/user-interface';
import { extractError } from 'utils/net';
import { updateBackendUtilsClients } from '../api';
import { actions as alertActions } from './alerts';
import { actions as appRedirectActions } from './app-redirect';
import { slice } from './settings';
import {
    transformLoggingSettingsDtoToModel,
    transformLoggingSettingsModelToDto,
    transformSettingsPlatformDtoToModel,
} from './transform/settings';
import { actions as userInterfaceActions } from './user-interface';

const getPlatformSettings: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getPlatformSettings.match),
        switchMap(() =>
            deps.apiClients.settings.getPlatformSettings().pipe(
                switchMap((platformSettings) => {
                    const platformSettingsModel = transformSettingsPlatformDtoToModel(platformSettings);
                    updateBackendUtilsClients(platformSettingsModel.utils?.utilsServiceUrl);
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
            deps.apiClients.settings.updatePlatformSettings({ platformSettingsUpdateDto: action.payload.settingsDto }).pipe(
                mergeMap(() => {
                    if (typeof action.payload.settingsDto.utils === 'object') {
                        updateBackendUtilsClients(action.payload.settingsDto.utils?.utilsServiceUrl);
                    }
                    const actions = [
                        slice.actions.updatePlatformSettingsSuccess(action.payload.settingsDto),
                        alertActions.success('Platform settings updated successfully.'),
                        action.payload.redirect ? appRedirectActions.redirect({ url: action.payload.redirect }) : undefined,
                    ].filter((el) => el) as AnyAction[];
                    return of(...actions);
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

const getLoggingSettings: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getLoggingSettings.match),
        mergeMap(() =>
            deps.apiClients.settings.getLoggingSettings().pipe(
                mergeMap((settings) =>
                    of(
                        slice.actions.getLoggingSettingsSuccess(transformLoggingSettingsDtoToModel(settings)),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.LoggingSettings),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.getLoggingSettingsFailure({
                            error: extractError(err, 'Failed to get logging settings'),
                        }),
                        userInterfaceActions.insertWidgetLock(err, LockWidgetNameEnum.LoggingSettings),
                    ),
                ),
            ),
        ),
    );
};

const updateLoggingSettings: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.updateLoggingSettings.match),
        mergeMap((action) =>
            deps.apiClients.settings
                .updateLoggingSettings({
                    loggingSettingsDto: transformLoggingSettingsModelToDto(action.payload),
                })
                .pipe(
                    mergeMap(() =>
                        of(
                            slice.actions.updateLoggingSettingsSuccess(action.payload),
                            alertActions.success('Logging settings updated successfully.'),
                        ),
                    ),
                    catchError((err) =>
                        of(
                            slice.actions.updateLoggingSettingsFailure({
                                error: extractError(err, 'Failed to update logging settings'),
                            }),
                            appRedirectActions.fetchError({ error: err, message: 'Failed to update logging settings' }),
                        ),
                    ),
                ),
        ),
    );
};

const epics = [
    getPlatformSettings,
    updatePlatformSettings,
    getNotificationsSettings,
    updateNotificationsSettings,
    getLoggingSettings,
    updateLoggingSettings,
];

export default epics;
