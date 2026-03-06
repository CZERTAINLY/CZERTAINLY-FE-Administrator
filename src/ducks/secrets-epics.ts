import { AppEpic } from 'ducks';
import { of } from 'rxjs';
import { catchError, filter, mergeMap, switchMap } from 'rxjs/operators';
import { LockWidgetNameEnum } from 'types/user-interface';
import { extractError } from 'utils/net';
import { actions as appRedirectActions } from './app-redirect';
import { actions as alertActions } from './alerts';
import { slice } from './secrets';
import { actions as userInterfaceActions } from './user-interface';
import { actions as pagingActions } from './paging';
import { EntityType } from './filters';
import { transformSearchRequestModelToDto } from './transform/certificates';
import { transformAttributeDescriptorDtoToModel } from './transform/attributes';
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

const getSecretDetail: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getSecretDetail.match),
        switchMap((action: ReturnType<typeof slice.actions.getSecretDetail>) =>
            deps.apiClients.secrets.getSecretDetails({ uuid: action.payload.uuid }).pipe(
                mergeMap((secret) =>
                    of(
                        slice.actions.getSecretDetailSuccess({ secret }),
                        userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.CertificateDetailsWidget),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.getSecretDetailFailure({
                            error: extractError(err, 'Failed to get Secret details'),
                        }),
                        userInterfaceActions.insertWidgetLock(err, LockWidgetNameEnum.CertificateDetailsWidget),
                    ),
                ),
            ),
        ),
    );
};

const getSecretVersions: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getSecretVersions.match),
        switchMap((action: ReturnType<typeof slice.actions.getSecretVersions>) =>
            deps.apiClients.secrets.getSecretVersions({ uuid: action.payload.uuid }).pipe(
                mergeMap((versions) =>
                    of(
                        slice.actions.getSecretVersionsSuccess({ versions }),
                        // no widget lock for versions list for now
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.getSecretVersionsFailure({
                            error: extractError(err, 'Failed to get Secret versions'),
                        }),
                    ),
                ),
            ),
        ),
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
                        appRedirectActions.redirect({ url: '/secrets' }),
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

const updateSecret: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.updateSecret.match),
        switchMap((action: ReturnType<typeof slice.actions.updateSecret>) =>
            deps.apiClients.secrets
                .updateSecret({
                    uuid: action.payload.uuid,
                    secretUpdateRequestDto: action.payload.update as any,
                })
                .pipe(
                    mergeMap((secret) =>
                        of(
                            slice.actions.updateSecretSuccess({ secret }),
                            appRedirectActions.fetchError({ error: undefined as any, message: 'Secret updated successfully' }),
                        ),
                    ),
                    catchError((err) =>
                        of(
                            slice.actions.updateSecretFailure({
                                error: extractError(err, 'Failed to update Secret'),
                            }),
                            appRedirectActions.fetchError({ error: err, message: 'Failed to update Secret' }),
                        ),
                    ),
                ),
        ),
    );
};

const enableSecret: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.enableSecret.match),
        mergeMap((action: ReturnType<typeof slice.actions.enableSecret>) =>
            deps.apiClients.secrets.enableSecret({ uuid: action.payload.uuid }).pipe(
                mergeMap(() =>
                    of(
                        slice.actions.enableSecretSuccess({ uuid: action.payload.uuid }),
                        slice.actions.getSecretDetail({ uuid: action.payload.uuid }),
                        alertActions.success('Secret enabled successfully.'),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.enableSecretFailure({
                            error: extractError(err, 'Failed to enable Secret'),
                        }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to enable Secret' }),
                    ),
                ),
            ),
        ),
    );
};

const disableSecret: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.disableSecret.match),
        mergeMap((action: ReturnType<typeof slice.actions.disableSecret>) =>
            deps.apiClients.secrets.disableSecret({ uuid: action.payload.uuid }).pipe(
                mergeMap(() =>
                    of(
                        slice.actions.disableSecretSuccess({ uuid: action.payload.uuid }),
                        slice.actions.getSecretDetail({ uuid: action.payload.uuid }),
                        alertActions.success('Secret disabled successfully.'),
                    ),
                ),
                catchError((err) =>
                    of(
                        slice.actions.disableSecretFailure({
                            error: extractError(err, 'Failed to disable Secret'),
                        }),
                        appRedirectActions.fetchError({ error: err, message: 'Failed to disable Secret' }),
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

const getSecretCreationAttributes: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.getSecretCreationAttributes.match),
        switchMap((action: ReturnType<typeof slice.actions.getSecretCreationAttributes>) =>
            deps.apiClients.vaultProfiles
                .getAttributesForCreatingSecret({
                    vaultUuid: action.payload.vaultUuid,
                    vaultProfileUuid: action.payload.vaultProfileUuid,
                    secretType: action.payload.secretType,
                })
                .pipe(
                    mergeMap((list: unknown) => {
                        const arr = Array.isArray(list) ? list : [];
                        return of(
                            slice.actions.getSecretCreationAttributesSuccess({
                                descriptors: arr.map((attr: unknown) =>
                                    transformAttributeDescriptorDtoToModel(attr as import('types/attributes').AttributeDescriptorDto),
                                ),
                            }),
                        );
                    }),
                    catchError(() => of(slice.actions.getSecretCreationAttributesFailure())),
                ),
        ),
    );
};

const createSecret: AppEpic = (action$, state$, deps) => {
    return action$.pipe(
        filter(slice.actions.createSecret.match),
        switchMap((action: ReturnType<typeof slice.actions.createSecret>) =>
            deps.apiClients.secrets
                .createSecret({
                    vaultUuid: action.payload.vaultUuid,
                    vaultProfileUuid: action.payload.vaultProfileUuid,
                    secretRequestDto: action.payload.request,
                })
                .pipe(
                    mergeMap((secret) =>
                        of(
                            slice.actions.createSecretSuccess({ secret }),
                            slice.actions.listSecrets({ pageNumber: 1, itemsPerPage: 10, filters: [] }),
                            appRedirectActions.redirect({ url: '/secrets' }),
                            alertActions.success('Secret created successfully.'),
                        ),
                    ),
                    catchError((err) =>
                        of(
                            slice.actions.createSecretFailure({
                                error: extractError(err, 'Failed to create Secret'),
                            }),
                            appRedirectActions.fetchError({ error: err, message: 'Failed to create Secret' }),
                        ),
                    ),
                ),
        ),
    );
};

const epics = [
    listSecrets,
    getSecretDetail,
    getSecretVersions,
    getSecretCreationAttributes,
    createSecret,
    deleteSecret,
    enableSecret,
    disableSecret,
    updateSecret,
    updateSecretObjects,
];

export default epics;
