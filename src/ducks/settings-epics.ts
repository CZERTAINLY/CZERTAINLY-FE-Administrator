import { AppEpic } from "ducks";
import { of } from "rxjs";
import { catchError, filter, mergeMap, switchMap } from "rxjs/operators";

import { LockWidgetNameEnum } from "types/widget-locks";
import { extractError } from "utils/net";
import { updateBackendUtilsClients } from "../api";
import { actions as appRedirectActions } from "./app-redirect";
import { slice } from "./settings";
import { transformSettingsPlatformDtoToModel } from "./transform/settings";
import { actions as widgetLockActions } from "./widget-locks";

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
                        widgetLockActions.removeWidgetLock(LockWidgetNameEnum.PlatformSettings),
                    );
                }),
                catchError((err) =>
                    of(
                        slice.actions.getPlatformSettingsFailure({ error: extractError(err, "Failed to get platform settings") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to get platform settings" }),
                        widgetLockActions.insertWidgetLock(err, LockWidgetNameEnum.PlatformSettings),
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
                    return of(slice.actions.updatePlatformSettingsSuccess(action.payload), appRedirectActions.redirect({ url: `../` }));
                }),
                catchError((err) =>
                    of(
                        slice.actions.updatePlatformSettingsFailure({ error: extractError(err, "Failed to update platform settings") }),
                        appRedirectActions.fetchError({ error: err, message: "Failed to update platform settings" }),
                    ),
                ),
            ),
        ),
    );
};

const epics = [getPlatformSettings, updatePlatformSettings];

export default epics;
