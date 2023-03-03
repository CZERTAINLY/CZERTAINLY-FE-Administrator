import { AppEpic } from "ducks";
import { ofType } from "redux-observable";
import { of } from "rxjs";
import { catchError, filter, map, mergeMap, switchMap } from "rxjs/operators";

import { extractError } from "utils/net";
import { updateBackendUtilsClients } from "../api";
import { actions as appRedirectActions } from "./app-redirect";

import { slice } from "./settings";
import { transformSettingsResponseDtoToModel } from "./transform/settings";

const getSettings: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(
            slice.actions.getSettings.match,
        ),
        switchMap(
            () => deps.apiClients.settings.getSettings().pipe(
                map(
                    settings => slice.actions.getSettingsSuccess(settings.map(transformSettingsResponseDtoToModel)),
                ),
                catchError(
                    err => of(
                        slice.actions.getSettingsFailure({error: extractError(err, "Failed to get Settings list")}),
                        appRedirectActions.fetchError({error: err, message: "Failed to get Settings list"}),
                    ),
                ),
            ),
        ),
    );
};

const updateSettings: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(
            slice.actions.updateSettings.match,
        ),
        switchMap(
            action => deps.apiClients.settings.updateSettings({
                    requestBody: action.payload,
                },
            ).pipe(
                mergeMap(
                    settings => of(
                        slice.actions.updateSettingsSuccess(settings.map(transformSettingsResponseDtoToModel)),
                        slice.actions.settingsUpdated(),
                        appRedirectActions.redirect({url: `../`}),
                    ),
                ),
                catchError(
                    err => of(
                        slice.actions.updateSettingsFailure({error: extractError(err, "Failed to update settings")}),
                        appRedirectActions.fetchError({error: err, message: "Failed to update settings"}),
                    ),
                ),
            ),
        ),
    );
};

const getAllSettings: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        ofType(
            slice.actions.getAllSettings, slice.actions.settingsUpdated,
        ),
        switchMap(
            () => deps.apiClients.settings.getAllSettings().pipe(
                map(
                    allSettings => {
                        updateBackendUtilsClients(allSettings.general.utilsServiceUrl);
                        return slice.actions.getAllSettingsSuccess(allSettings);
                    },
                ),
                catchError(
                    err => of(
                        slice.actions.getAllSettingsFailure({error: extractError(err, "Failed to get Settings")}),
                        appRedirectActions.fetchError({error: err, message: "Failed to get Settings"}),
                    ),
                ),
            ),
        ),
    );
};

const epics = [
    getSettings,
    getAllSettings,
    updateSettings,
];

export default epics;