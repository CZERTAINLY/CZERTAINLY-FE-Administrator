import { AppEpic } from 'ducks';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { extractError } from 'utils/net';
import { SearchRequestDto } from 'types/openapi';

import { LockWidgetNameEnum } from 'types/user-interface';
import { slice } from './ilm-signing-protocol-configurations';
import { actions as appRedirectActions } from './app-redirect';
import { actions as alertActions } from './alerts';
import { actions as userInterfaceActions } from './user-interface';

const listIlmSigningProtocolConfigurations: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listIlmSigningProtocolConfigurations.match),
        switchMap(() => {
            const searchRequest: SearchRequestDto = { filters: [] };
            return deps.apiClients.ilmSigningProtocolConfigurations
                .listIlmSigningProtocolConfigurations({ searchRequestDto: searchRequest })
                .pipe(
                    switchMap((response) =>
                        of(
                            slice.actions.listIlmSigningProtocolConfigurationsSuccess({
                                ilmSigningProtocolConfigurations: response.items ?? [],
                                totalItems: response.totalItems ?? 0,
                            }),
                            userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ListOfIlmSigningProtocolConfigurations),
                        ),
                    ),
                    catchError((error) =>
                        of(
                            slice.actions.listIlmSigningProtocolConfigurationsFailure({
                                error: extractError(error, 'Failed to get ILM Signing Protocol Configurations list'),
                            }),
                            userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.ListOfIlmSigningProtocolConfigurations),
                        ),
                    ),
                );
        }),
    );
};

const getIlmSigningProtocolConfiguration: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getIlmSigningProtocolConfiguration.match),
        switchMap((action) =>
            deps.apiClients.ilmSigningProtocolConfigurations.getIlmSigningProtocolConfiguration({ uuid: action.payload.uuid }).pipe(
                switchMap((detail) =>
                    of(
                        slice.actions.getIlmSigningProtocolConfigurationSuccess({ ilmSigningProtocolConfiguration: detail }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.IlmSigningProtocolConfigurationDetails),
                    ),
                ),
                catchError((error) =>
                    of(
                        slice.actions.getIlmSigningProtocolConfigurationFailure({
                            error: extractError(error, 'Failed to get ILM Signing Protocol Configuration details'),
                        }),
                        appRedirectActions.fetchError({ error, message: 'Failed to get ILM Signing Protocol Configuration details' }),
                        userInterfaceActions.insertWidgetLock(error, LockWidgetNameEnum.IlmSigningProtocolConfigurationDetails),
                    ),
                ),
            ),
        ),
    );
};

const listIlmSigningProtocolConfigurationSearchableFields: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listIlmSigningProtocolConfigurationSearchableFields.match),
        switchMap(() =>
            deps.apiClients.ilmSigningProtocolConfigurations.listIlmSigningProtocolConfigurationSearchableFields().pipe(
                map((fields) => slice.actions.listIlmSigningProtocolConfigurationSearchableFieldsSuccess({ searchableFields: fields })),
                catchError((error) =>
                    of(
                        slice.actions.listIlmSigningProtocolConfigurationSearchableFieldsFailure({
                            error: extractError(error, 'Failed to get ILM Signing Protocol Configuration searchable fields'),
                        }),
                    ),
                ),
            ),
        ),
    );
};

const createIlmSigningProtocolConfiguration: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.createIlmSigningProtocolConfiguration.match),
        switchMap((action) =>
            deps.apiClients.ilmSigningProtocolConfigurations
                .createIlmSigningProtocolConfiguration({
                    ilmSigningProtocolConfigurationRequestDto: action.payload.ilmSigningProtocolConfigurationRequestDto,
                })
                .pipe(
                    mergeMap((created) =>
                        of(
                            slice.actions.createIlmSigningProtocolConfigurationSuccess({ ilmSigningProtocolConfiguration: created }),
                            appRedirectActions.redirect({ url: `../ilmsigningprotocolconfigurations/detail/${created.uuid}` }),
                        ),
                    ),
                    catchError((error) =>
                        of(
                            slice.actions.createIlmSigningProtocolConfigurationFailure({
                                error: extractError(error, 'Failed to create ILM Signing Protocol Configuration'),
                            }),
                            appRedirectActions.fetchError({ error, message: 'Failed to create ILM Signing Protocol Configuration' }),
                        ),
                    ),
                ),
        ),
    );
};

const updateIlmSigningProtocolConfiguration: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.updateIlmSigningProtocolConfiguration.match),
        switchMap((action) =>
            deps.apiClients.ilmSigningProtocolConfigurations
                .updateIlmSigningProtocolConfiguration({
                    uuid: action.payload.uuid,
                    ilmSigningProtocolConfigurationRequestDto: action.payload.ilmSigningProtocolConfigurationRequestDto,
                })
                .pipe(
                    mergeMap((updated) =>
                        of(
                            slice.actions.updateIlmSigningProtocolConfigurationSuccess({ ilmSigningProtocolConfiguration: updated }),
                            appRedirectActions.redirect({ url: `../../ilmsigningprotocolconfigurations/detail/${updated.uuid}` }),
                        ),
                    ),
                    catchError((error) =>
                        of(
                            slice.actions.updateIlmSigningProtocolConfigurationFailure({
                                error: extractError(error, 'Failed to update ILM Signing Protocol Configuration'),
                            }),
                            appRedirectActions.fetchError({ error, message: 'Failed to update ILM Signing Protocol Configuration' }),
                        ),
                    ),
                ),
        ),
    );
};

const deleteIlmSigningProtocolConfiguration: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteIlmSigningProtocolConfiguration.match),
        switchMap((action) =>
            deps.apiClients.ilmSigningProtocolConfigurations.deleteIlmSigningProtocolConfiguration({ uuid: action.payload.uuid }).pipe(
                mergeMap(() =>
                    of(
                        slice.actions.deleteIlmSigningProtocolConfigurationSuccess({ uuid: action.payload.uuid }),
                        appRedirectActions.redirect({ url: '../../ilmsigningprotocolconfigurations' }),
                    ),
                ),
                catchError((error) =>
                    of(
                        slice.actions.deleteIlmSigningProtocolConfigurationFailure({
                            error: extractError(error, 'Failed to delete ILM Signing Protocol Configuration'),
                        }),
                        appRedirectActions.fetchError({ error, message: 'Failed to delete ILM Signing Protocol Configuration' }),
                    ),
                ),
            ),
        ),
    );
};

const enableIlmSigningProtocolConfiguration: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.enableIlmSigningProtocolConfiguration.match),
        switchMap((action) =>
            deps.apiClients.ilmSigningProtocolConfigurations.enableIlmSigningProtocolConfiguration({ uuid: action.payload.uuid }).pipe(
                map(() => slice.actions.enableIlmSigningProtocolConfigurationSuccess({ uuid: action.payload.uuid })),
                catchError((error) =>
                    of(
                        slice.actions.enableIlmSigningProtocolConfigurationFailure({
                            error: extractError(error, 'Failed to enable ILM Signing Protocol Configuration'),
                        }),
                        appRedirectActions.fetchError({ error, message: 'Failed to enable ILM Signing Protocol Configuration' }),
                    ),
                ),
            ),
        ),
    );
};

const disableIlmSigningProtocolConfiguration: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.disableIlmSigningProtocolConfiguration.match),
        switchMap((action) =>
            deps.apiClients.ilmSigningProtocolConfigurations.disableIlmSigningProtocolConfiguration({ uuid: action.payload.uuid }).pipe(
                map(() => slice.actions.disableIlmSigningProtocolConfigurationSuccess({ uuid: action.payload.uuid })),
                catchError((error) =>
                    of(
                        slice.actions.disableIlmSigningProtocolConfigurationFailure({
                            error: extractError(error, 'Failed to disable ILM Signing Protocol Configuration'),
                        }),
                        appRedirectActions.fetchError({ error, message: 'Failed to disable ILM Signing Protocol Configuration' }),
                    ),
                ),
            ),
        ),
    );
};

const bulkDeleteIlmSigningProtocolConfigurations: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDeleteIlmSigningProtocolConfigurations.match),
        switchMap((action) =>
            deps.apiClients.ilmSigningProtocolConfigurations
                .bulkDeleteIlmSigningProtocolConfigurations({ requestBody: action.payload.uuids })
                .pipe(
                    mergeMap((errors) =>
                        of(
                            slice.actions.bulkDeleteIlmSigningProtocolConfigurationsSuccess({ uuids: action.payload.uuids, errors }),
                            alertActions.success('Selected ILM Signing Protocol Configurations successfully deleted.'),
                        ),
                    ),
                    catchError((error) =>
                        of(
                            slice.actions.bulkDeleteIlmSigningProtocolConfigurationsFailure({
                                error: extractError(error, 'Failed to delete ILM Signing Protocol Configurations'),
                            }),
                            appRedirectActions.fetchError({ error, message: 'Failed to delete ILM Signing Protocol Configurations' }),
                        ),
                    ),
                ),
        ),
    );
};

const bulkEnableIlmSigningProtocolConfigurations: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkEnableIlmSigningProtocolConfigurations.match),
        switchMap((action) =>
            deps.apiClients.ilmSigningProtocolConfigurations
                .bulkEnableIlmSigningProtocolConfigurations({ requestBody: action.payload.uuids })
                .pipe(
                    map(() => slice.actions.bulkEnableIlmSigningProtocolConfigurationsSuccess({ uuids: action.payload.uuids })),
                    catchError((error) =>
                        of(
                            slice.actions.bulkEnableIlmSigningProtocolConfigurationsFailure({
                                error: extractError(error, 'Failed to enable ILM Signing Protocol Configurations'),
                            }),
                            appRedirectActions.fetchError({ error, message: 'Failed to enable ILM Signing Protocol Configurations' }),
                        ),
                    ),
                ),
        ),
    );
};

const bulkDisableIlmSigningProtocolConfigurations: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.bulkDisableIlmSigningProtocolConfigurations.match),
        switchMap((action) =>
            deps.apiClients.ilmSigningProtocolConfigurations
                .bulkDisableIlmSigningProtocolConfigurations({ requestBody: action.payload.uuids })
                .pipe(
                    map(() => slice.actions.bulkDisableIlmSigningProtocolConfigurationsSuccess({ uuids: action.payload.uuids })),
                    catchError((error) =>
                        of(
                            slice.actions.bulkDisableIlmSigningProtocolConfigurationsFailure({
                                error: extractError(error, 'Failed to disable ILM Signing Protocol Configurations'),
                            }),
                            appRedirectActions.fetchError({ error, message: 'Failed to disable ILM Signing Protocol Configurations' }),
                        ),
                    ),
                ),
        ),
    );
};

const epics = [
    listIlmSigningProtocolConfigurations,
    getIlmSigningProtocolConfiguration,
    listIlmSigningProtocolConfigurationSearchableFields,
    createIlmSigningProtocolConfiguration,
    updateIlmSigningProtocolConfiguration,
    deleteIlmSigningProtocolConfiguration,
    enableIlmSigningProtocolConfiguration,
    disableIlmSigningProtocolConfiguration,
    bulkDeleteIlmSigningProtocolConfigurations,
    bulkEnableIlmSigningProtocolConfigurations,
    bulkDisableIlmSigningProtocolConfigurations,
];

export default epics;
