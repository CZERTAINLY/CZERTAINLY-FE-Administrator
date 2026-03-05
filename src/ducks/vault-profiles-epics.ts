import { of } from 'rxjs';
import { catchError, filter, switchMap, mergeMap } from 'rxjs/operators';
import { extractError } from 'utils/net';
import { slice } from './vault-profiles';
import { actions as appRedirectActions } from './app-redirect';
import { actions as alertActions } from './alerts';
import { actions as pagingActions } from './paging';
import { EntityType } from './filters';
import { actions as userInterfaceActions } from './user-interface';
import { LockWidgetNameEnum } from 'types/user-interface';
import { transformSearchRequestModelToDto } from './transform/certificates';
import { store } from '../App';

type AppEpic = any;

const defaultSearch = { pageNumber: 1, itemsPerPage: 10, filters: [] };

const listVaultProfiles: AppEpic = (action$: any, state$: any, deps: any) => {
    return action$.pipe(
        filter(slice.actions.listVaultProfiles.match),
        switchMap((action: ReturnType<typeof slice.actions.listVaultProfiles>) => {
            const search = action.payload ?? defaultSearch;
            const searchRequestDto = transformSearchRequestModelToDto(search);
            store.dispatch(pagingActions.list(EntityType.VAULT));
            return deps.apiClients.vaultProfiles.listVaultProfiles({ searchRequestDto }).pipe(
                mergeMap((response: { items?: import('types/openapi').VaultProfileDto[]; totalItems?: number }) =>
                    of(
                        slice.actions.listVaultProfilesSuccess({
                            items: response.items ?? [],
                        }),
                        pagingActions.listSuccess({ entity: EntityType.VAULT, totalItems: response.totalItems ?? 0 }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ListOfVaults),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.listVaultProfilesFailure({
                            error: extractError(err, 'Failed to get Vault profiles'),
                        }),
                        pagingActions.listFailure(EntityType.VAULT),
                        userInterfaceActions.insertWidgetLock(err, LockWidgetNameEnum.ListOfVaults),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to get Vault profiles' }),
                    ),
                ),
            );
        }),
    );
};

const createVaultProfile: AppEpic = (action$: any, state$: any, deps: any) => {
    return action$.pipe(
        filter(slice.actions.createVaultProfile.match),
        switchMap((action: ReturnType<typeof slice.actions.createVaultProfile>) =>
            deps.apiClients.vaultProfiles
                .createVaultProfile({
                    vaultUuid: action.payload.vaultUuid,
                    vaultProfileRequestDto: action.payload.request,
                })
                .pipe(
                    mergeMap((profile: Parameters<typeof slice.actions.createVaultProfileSuccess>[0]['profile']) =>
                        of(
                            slice.actions.createVaultProfileSuccess({ profile }),
                            appRedirectActions.redirect({ url: `/${'vaultprofiles'}` }),
                        ),
                    ),
                    catchError((err) =>
                        of(
                            slice.actions.createVaultProfileFailure({
                                error: extractError(err, 'Failed to create Vault Profile'),
                            }),
                            appRedirectActions.fetchError({ error: err, message: 'Failed to create Vault Profile' }),
                        ),
                    ),
                ),
        ),
    );
};

const getVaultProfileDetail: AppEpic = (action$: any, state$: any, deps: any) => {
    return action$.pipe(
        filter(slice.actions.getVaultProfileDetail.match),
        switchMap((action: ReturnType<typeof slice.actions.getVaultProfileDetail>) =>
            deps.apiClients.vaultProfiles
                .getVaultProfileDetails({
                    vaultUuid: action.payload.vaultUuid,
                    vaultProfileUuid: action.payload.vaultProfileUuid,
                })
                .pipe(
                    mergeMap((profile: import('types/openapi').VaultProfileDetailDto) =>
                        of(slice.actions.getVaultProfileDetailSuccess({ profile })),
                    ),
                    catchError((err) =>
                        of(
                            slice.actions.getVaultProfileDetailFailure({
                                error: extractError(err, 'Failed to get Vault Profile details'),
                            }),
                            appRedirectActions.fetchError({
                                error: err,
                                message: 'Failed to get Vault Profile details',
                            }),
                        ),
                    ),
                ),
        ),
    );
};

const deleteVaultProfile: AppEpic = (action$: any, state$: any, deps: any) => {
    return action$.pipe(
        filter(slice.actions.deleteVaultProfile.match),
        mergeMap((action: ReturnType<typeof slice.actions.deleteVaultProfile>) =>
            deps.apiClients.vaultProfiles
                .deleteVaultProfile({
                    vaultUuid: action.payload.vaultUuid,
                    vaultProfileUuid: action.payload.vaultProfileUuid,
                })
                .pipe(
                    mergeMap(() =>
                        of(
                            slice.actions.deleteVaultProfileSuccess({ vaultProfileUuid: action.payload.vaultProfileUuid }),
                            appRedirectActions.redirect({ url: `/${'vaultprofiles'}` }),
                            alertActions.success('Vault Profile deleted successfully.'),
                        ),
                    ),
                    catchError((err) =>
                        of(
                            slice.actions.deleteVaultProfileFailure({
                                error: extractError(err, 'Failed to delete Vault Profile'),
                            }),
                            appRedirectActions.fetchError({ error: err, message: 'Failed to delete Vault Profile' }),
                        ),
                    ),
                ),
        ),
    );
};

const epics = [listVaultProfiles, getVaultProfileDetail, createVaultProfile, deleteVaultProfile];

export default epics;
