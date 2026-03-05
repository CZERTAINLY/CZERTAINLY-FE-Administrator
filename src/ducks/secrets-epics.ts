import { AppEpic } from 'ducks';
import { of } from 'rxjs';
import { catchError, filter, mergeMap, switchMap } from 'rxjs/operators';
import { LockWidgetNameEnum } from 'types/user-interface';
import { extractError } from 'utils/net';
import { actions as appRedirectActions } from './app-redirect';
import { slice } from './secrets';
import { actions as userInterfaceActions } from './user-interface';
import { actions as pagingActions } from './paging';
import { EntityType } from './filters';
import { transformSearchRequestModelToDto } from './transform/certificates';
import { store } from '../App';

const listSecrets: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.listSecrets.match),
        switchMap((action) => {
            store.dispatch(pagingActions.list(EntityType.SECRET));
            return deps.apiClients.secrets.listSecrets({ searchRequestDto: transformSearchRequestModelToDto(action.payload) }).pipe(
                mergeMap((response) =>
                    of(
                        slice.actions.listSecretsSuccess({ secrets: response.items }),
                        pagingActions.listSuccess({ entity: EntityType.SECRET, totalItems: response.totalItems }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ListOfSecrets),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.listSecretsFailure({
                            error: extractError(err, 'Failed to get Secret list'),
                        }),
                        pagingActions.listFailure(EntityType.SECRET),
                        userInterfaceActions.insertWidgetLock(err, LockWidgetNameEnum.ListOfSecrets),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to get Secret list' }),
                    ),
                ),
            );
        }),
    );
};

const deleteSecret: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.deleteSecret.match),
        mergeMap((action: ReturnType<typeof slice.actions.deleteSecret>) =>
            deps.apiClients.secrets.deleteSecret({ uuid: action.payload.uuid }).pipe(
                mergeMap(() =>
                    of(
                        slice.actions.deleteSecretSuccess({ uuid: action.payload.uuid }),
                        appRedirectActions.fetchError({ error: undefined as any, message: 'Secret deleted successfully' }),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.deleteSecretFailure({
                            error: extractError(err, 'Failed to delete Secret'),
                        }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to delete Secret' }),
                    ),
                ),
            ),
        ),
    );
};

const updateSecretObjects: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.updateSecretObjects.match),
        switchMap((action: ReturnType<typeof slice.actions.updateSecretObjects>) =>
            deps.apiClients.secrets
                .updateSecretObjects({
                    uuid: action.payload.uuid,
                    secretUpdateObjectsDto: action.payload.update as any,
                })
                .pipe(
                    mergeMap(() =>
                        of(
                            slice.actions.updateSecretObjectsSuccess({ uuid: action.payload.uuid }),
                            appRedirectActions.fetchError({ error: undefined as any, message: 'Secret updated successfully' }),
                        ),
                    ),
                    catchError((err) =>
                        of(
                            slice.actions.updateSecretObjectsFailure({
                                error: extractError(err, 'Failed to update Secret'),
                            }),
                            appRedirectActions.fetchError({ error: err, message: 'Failed to update Secret' }),
                        ),
                    ),
                ),
        ),
    );
};

const epics = [listSecrets, deleteSecret, updateSecretObjects];

export default epics;
