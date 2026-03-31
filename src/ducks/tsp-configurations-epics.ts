import { AppEpic } from 'ducks';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { extractError } from 'utils/net';
import { SearchRequestDto } from 'types/openapi';

import { LockWidgetNameEnum } from 'types/user-interface';
import { slice } from './tsp-configurations';
import { actions as appRedirectActions } from './app-redirect';
import { actions as alertActions } from './alerts';
import { actions as userInterfaceActions } from './user-interface';

const listTspConfigurations: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listTspConfigurations.match),
        switchMap(() => {
            const searchRequest: SearchRequestDto = { filters: [] };
            return deps.apiClients.tspConfigurations.listTspConfigurations({ searchRequestDto: searchRequest }).pipe(
                switchMap((response) =>
                    of(
                        slice.actions.listTspConfigurationsSuccess({
                            tspConfigurations: response.items ?? [],
                            totalItems: response.totalItems ?? 0,
                        }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ListOfTspConfigurations),
                    ),
                ),
                catchError((error) =>
                    of(
                        slice.actions.listTspConfigurationsFailure({ error: extractError(error, 'Failed to get TSP Configurations list') }),
                        userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.ListOfTspConfigurations),
                    ),
                ),
            );
        }),
    );
};

const getTspConfiguration: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getTspConfiguration.match),
        switchMap((action) =>
            deps.apiClients.tspConfigurations.getTspConfiguration({ uuid: action.payload.uuid }).pipe(
                switchMap((detail) =>
                    of(
                        slice.actions.getTspConfigurationSuccess({ tspConfiguration: detail }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.TspConfigurationDetails),
                    ),
                ),
                catchError((error) =>
                    of(
                        slice.actions.getTspConfigurationFailure({ error: extractError(error, 'Failed to get TSP Configuration details') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to get TSP Configuration details' }),
                        userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.TspConfigurationDetails),
                    ),
                ),
            ),
        ),
    );
};

const listTspConfigurationSearchableFields: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listTspConfigurationSearchableFields.match),
        switchMap(() =>
            deps.apiClients.tspConfigurations.listTspConfigurationSearchableFields().pipe(
                map((fields) => slice.actions.listTspConfigurationSearchableFieldsSuccess({ searchableFields: fields })),
                catchError((error) =>
                    of(
                        slice.actions.listTspConfigurationSearchableFieldsFailure({
                            error: extractError(error, 'Failed to get TSP Configuration searchable fields'),
                        }),
                    ),
                ),
            ),
        ),
    );
};

const createTspConfiguration: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.createTspConfiguration.match),
        switchMap((action) =>
            deps.apiClients.tspConfigurations
                .createTspConfiguration({ tspConfigurationRequestDto: action.payload.tspConfigurationRequestDto })
                .pipe(
                    mergeMap((created) =>
                        of(
                            slice.actions.createTspConfigurationSuccess({ tspConfiguration: created }),
                            appRedirectActions.redirect({ url: `../tspconfigurations/detail/${created.uuid}` }),
                        ),
                    ),
                    catchError((error) =>
                        of(
                            slice.actions.createTspConfigurationFailure({
                                error: extractError(error, 'Failed to create TSP Configuration'),
                            }),
                            appRedirectActions.fetchError({ error, message: 'Failed to create TSP Configuration' }),
                        ),
                    ),
                ),
        ),
    );
};

const updateTspConfiguration: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.updateTspConfiguration.match),
        switchMap((action) =>
            deps.apiClients.tspConfigurations
                .updateTspConfiguration({
                    uuid: action.payload.uuid,
                    tspConfigurationRequestDto: action.payload.tspConfigurationRequestDto,
                })
                .pipe(
                    mergeMap((updated) =>
                        of(
                            slice.actions.updateTspConfigurationSuccess({ tspConfiguration: updated }),
                            appRedirectActions.redirect({ url: `../../tspconfigurations/detail/${updated.uuid}` }),
                        ),
                    ),
                    catchError((error) =>
                        of(
                            slice.actions.updateTspConfigurationFailure({
                                error: extractError(error, 'Failed to update TSP Configuration'),
                            }),
                            appRedirectActions.fetchError({ error, message: 'Failed to update TSP Configuration' }),
                        ),
                    ),
                ),
        ),
    );
};

const deleteTspConfiguration: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteTspConfiguration.match),
        switchMap((action) =>
            deps.apiClients.tspConfigurations.deleteTspConfiguration({ uuid: action.payload.uuid }).pipe(
                mergeMap(() =>
                    of(
                        slice.actions.deleteTspConfigurationSuccess({ uuid: action.payload.uuid }),
                        appRedirectActions.redirect({ url: '../../tspconfigurations' }),
                    ),
                ),
                catchError((error) =>
                    of(
                        slice.actions.deleteTspConfigurationFailure({ error: extractError(error, 'Failed to delete TSP Configuration') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to delete TSP Configuration' }),
                    ),
                ),
            ),
        ),
    );
};

const enableTspConfiguration: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.enableTspConfiguration.match),
        switchMap((action) =>
            deps.apiClients.tspConfigurations.enableTspConfiguration({ uuid: action.payload.uuid }).pipe(
                map(() => slice.actions.enableTspConfigurationSuccess({ uuid: action.payload.uuid })),
                catchError((error) =>
                    of(
                        slice.actions.enableTspConfigurationFailure({ error: extractError(error, 'Failed to enable TSP Configuration') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to enable TSP Configuration' }),
                    ),
                ),
            ),
        ),
    );
};

const disableTspConfiguration: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.disableTspConfiguration.match),
        switchMap((action) =>
            deps.apiClients.tspConfigurations.disableTspConfiguration({ uuid: action.payload.uuid }).pipe(
                map(() => slice.actions.disableTspConfigurationSuccess({ uuid: action.payload.uuid })),
                catchError((error) =>
                    of(
                        slice.actions.disableTspConfigurationFailure({ error: extractError(error, 'Failed to disable TSP Configuration') }),
                        appRedirectActions.fetchError({ error, message: 'Failed to disable TSP Configuration' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkDeleteTspConfigurations: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDeleteTspConfigurations.match),
        switchMap((action) =>
            deps.apiClients.tspConfigurations.bulkDeleteTspConfigurations({ requestBody: action.payload.uuids }).pipe(
                mergeMap((errors) =>
                    of(
                        slice.actions.bulkDeleteTspConfigurationsSuccess({ uuids: action.payload.uuids, errors }),
                        alertActions.success('Selected TSP Configurations successfully deleted.'),
                    ),
                ),
                catchError((error) =>
                    of(
                        slice.actions.bulkDeleteTspConfigurationsFailure({
                            error: extractError(error, 'Failed to delete TSP Configurations'),
                        }),
                        appRedirectActions.fetchError({ error, message: 'Failed to delete TSP Configurations' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkEnableTspConfigurations: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkEnableTspConfigurations.match),
        switchMap((action) =>
            deps.apiClients.tspConfigurations.bulkEnableTspConfigurations({ requestBody: action.payload.uuids }).pipe(
                map(() => slice.actions.bulkEnableTspConfigurationsSuccess({ uuids: action.payload.uuids })),
                catchError((error) =>
                    of(
                        slice.actions.bulkEnableTspConfigurationsFailure({
                            error: extractError(error, 'Failed to enable TSP Configurations'),
                        }),
                        appRedirectActions.fetchError({ error, message: 'Failed to enable TSP Configurations' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkDisableTspConfigurations: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDisableTspConfigurations.match),
        switchMap((action) =>
            deps.apiClients.tspConfigurations.bulkDisableTspConfigurations({ requestBody: action.payload.uuids }).pipe(
                map(() => slice.actions.bulkDisableTspConfigurationsSuccess({ uuids: action.payload.uuids })),
                catchError((error) =>
                    of(
                        slice.actions.bulkDisableTspConfigurationsFailure({
                            error: extractError(error, 'Failed to disable TSP Configurations'),
                        }),
                        appRedirectActions.fetchError({ error, message: 'Failed to disable TSP Configurations' }),
                    ),
                ),
            ),
        ),
    );
};

const epics = [
    listTspConfigurations,
    getTspConfiguration,
    listTspConfigurationSearchableFields,
    createTspConfiguration,
    updateTspConfiguration,
    deleteTspConfiguration,
    enableTspConfiguration,
    disableTspConfiguration,
    bulkDeleteTspConfigurations,
    bulkEnableTspConfigurations,
    bulkDisableTspConfigurations,
];

export default epics;
